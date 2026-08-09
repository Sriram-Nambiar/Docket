"use client";

import { useSyncExternalStore } from 'react';
import { GITHUB_STYLE_AUDIT_FEED, REGULATORY_RULES_FULL } from './mockData';

let tasks = [
  {
    id: 't-1',
    title: 'DIR-3 KYC Verification',
    ruleId: 'IN-MCA-DIR3KYC-003',
    creator: 'Compliance Head (X)',
    assignee: 'Tax Lead (Y)',
    department: 'Tax',
    status: 'open',
    deadline: '2026-09-30',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    evidence: null
  }
];

let auditLog = [...GITHUB_STYLE_AUDIT_FEED];

const listeners = new Set();

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

// Async helper to publish notification to Redis + Fanout API
async function triggerNotificationEvent(eventType, title, description, metadata) {
  try {
    if (typeof window !== 'undefined') {
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          title,
          description,
          entityName: 'Apex Technologies Pvt Ltd',
          metadata,
        }),
      }).catch(err => console.warn('Notification trigger error:', err));
    }
  } catch (e) {
    // Ignore client fetch errors
  }
}

export const taskStore = {
  getTasks: () => tasks,
  getAuditLog: () => auditLog,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  createTask: (taskData) => {
    const newTask = {
      id: `t-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      evidence: null,
      ...taskData,
    };
    tasks = [newTask, ...tasks];
    
    taskStore.appendAudit({
      actor: taskData.creator || 'Compliance Head',
      avatar: 'CH',
      action: 'created task node',
      target: taskData.title,
      status: 'Amber'
    });

    // Fire Redis Fanout Event
    triggerNotificationEvent(
      'TASK_CREATED',
      `New Task Assigned: ${taskData.title}`,
      `Compliance task assigned to ${taskData.assignee || 'Department Lead'} for ${taskData.title}`,
      { dueDate: taskData.deadline, statusColor: 'Amber' }
    );

    emitChange();
  },
  updateTaskStatus: (taskId, newStatus, actor, avatar, action, target) => {
    tasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t);
    
    taskStore.appendAudit({
      actor,
      avatar,
      action,
      target,
      status: newStatus === 'completed' ? 'Green' : 'Amber'
    });

    // Fire Redis Fanout Event
    triggerNotificationEvent(
      'TASK_STATE_CHANGE',
      `Task Transition: ${target} [${newStatus.toUpperCase()}]`,
      `${actor} updated task status to "${newStatus}"`,
      { taskId, statusColor: newStatus === 'completed' ? 'Green' : 'Amber' }
    );

    emitChange();
  },
  appendAudit: (entry) => {
    const newEntry = {
      id: `act-${Date.now()}`,
      timestamp: 'just now',
      hash: `0x${Math.random().toString(16).substr(2, 6)}...${Math.random().toString(16).substr(2, 4)}`,
      ...entry,
    };
    auditLog = [newEntry, ...auditLog];
    emitChange();
  },
  logWhatsAppReminder: (obligationTitle, daysLeft, penaltyInfo, phoneNumber = '+91 98765 43210') => {
    taskStore.appendAudit({
      actor: 'WhatsApp Reminder Bot',
      avatar: 'WA',
      action: `sent WhatsApp reminder to ${phoneNumber} for`,
      target: `${obligationTitle} — ${daysLeft} days left (${penaltyInfo || 'penalties accruing'})`,
      status: daysLeft <= 7 ? 'Red' : 'Amber'
    });

    triggerNotificationEvent(
      'WHATSAPP_REMINDER_SENT',
      `WhatsApp Alert Sent: ${obligationTitle}`,
      `Automated deadline digest delivered to founder phone (${phoneNumber})`,
      { recipient: phoneNumber, daysLeft }
    );

    emitChange();
  }
};

const EMPTY_TASKS = [];
export function useTasks() {
  return useSyncExternalStore(taskStore.subscribe, taskStore.getTasks, () => EMPTY_TASKS);
}

const EMPTY_AUDIT = [];
export function useAuditLog() {
  return useSyncExternalStore(taskStore.subscribe, taskStore.getAuditLog, () => EMPTY_AUDIT);
}
