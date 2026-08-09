"use client";

import React, { useState } from 'react';
import { Share2, Plus, CheckCircle2, Clock, GitCommit } from 'lucide-react';
import TaskCreateModal from './TaskCreateModal';
import { useTasks, useAuditLog, taskStore } from '../lib/taskStore';

export default function TasksView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tasks = useTasks();
  const auditLog = useAuditLog();

  const handleStatusChange = (task, newStatus) => {
    let action = '';
    let actor = '';
    let avatar = '';
    let target = task.title;

    if (newStatus === 'assigned') {
      action = 'assigned task to';
      target = `${task.assignee} - ${task.title}`;
      actor = 'Compliance Head';
      avatar = 'CH';
    } else if (newStatus === 'in_progress') {
      action = 'started work on';
      actor = task.assignee;
      avatar = task.assignee.substring(0, 2).toUpperCase();
    } else if (newStatus === 'completed') {
      action = 'uploaded evidence & verified';
      actor = 'Auto Engine';
      avatar = 'AI';
    }

    taskStore.updateTaskStatus(task.id, newStatus, actor, avatar, action, target);
  };

  const getPriorityBorderClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'border-l-4 border-l-overdue';
      case 'medium': return 'border-l-4 border-l-amber';
      default: return 'border-l-4 border-l-hairline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-xl font-semibold text-ink tracking-tight">Task Canvas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-sm bg-amber hover:bg-amber-hover text-white text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      <div className="ledger-card p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-hairline pb-3">
          <Share2 className="w-5 h-5 text-amber" />
          <h2 className="font-serif text-base font-semibold text-ink">Visual Scripting Pipeline</h2>
        </div>

        <p className="text-sm text-muted leading-relaxed">
          Visual-scripting style node graph for cross-department work allocation paired with an append-only audit trail log.
        </p>

        <div className="p-6 rounded-sm bg-paper-warm border border-hairline text-ink space-y-6 overflow-x-auto min-h-[300px]">
          {tasks.length === 0 ? (
            <div className="text-center text-muted text-sm py-10">No tasks active. Create one to start the pipeline.</div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`space-y-4 pb-6 border-b border-hairline last:border-0 last:pb-0 ledger-card-interactive p-4 ${getPriorityBorderClass(task.priority)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-ink">{task.title}</span>
                  <span className="text-sm font-mono px-2 py-1 bg-surface rounded-sm border border-hairline">Due: {task.deadline}</span>
                </div>
                <div className="min-w-[700px] flex items-center justify-between gap-4 text-sm font-mono">
                  
                  {/* Node 1: Creator */}
                  <div className="p-3.5 rounded-sm bg-surface border border-hairline space-y-2 text-center min-w-[160px] relative transition-all">
                    <span className="text-sm text-ink block font-semibold">Node 1: Creator</span>
                    <span className="font-semibold text-ink block">{task.creator}</span>
                    {task.status === 'open' ? (
                        <button 
                          onClick={() => handleStatusChange(task, 'assigned')}
                          className="w-full mt-2 py-1.5 rounded-sm btn-accent bg-amber hover:bg-amber-hover text-white text-sm font-semibold cursor-pointer"
                        >
                          Assign Task
                        </button>
                    ) : (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-verified"><CheckCircle2 className="w-4 h-4"/></div>
                    )}
                  </div>

                  <span className={`font-semibold ${task.status !== 'open' ? 'text-amber' : 'text-muted'}`}>--(Assign)→</span>

                  {/* Node 2: Assignee */}
                  <div className={`p-3.5 rounded-sm border space-y-2 text-center min-w-[160px] transition-all ${task.status === 'open' ? 'bg-surface/50 border-hairline/50 opacity-50' : 'bg-surface border-hairline'}`}>
                    <span className="text-sm text-ink block font-semibold">Node 2: Assignee</span>
                    <span className="font-semibold text-ink block">{task.assignee}</span>
                    {task.status === 'assigned' ? (
                        <button 
                          onClick={() => handleStatusChange(task, 'in_progress')}
                          className="w-full mt-2 py-1.5 rounded-sm btn-accent bg-amber hover:bg-amber-hover text-white text-sm font-semibold cursor-pointer"
                        >
                          Start Work
                        </button>
                    ) : task.status === 'in_progress' || task.status === 'completed' ? (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-verified"><CheckCircle2 className="w-4 h-4"/></div>
                    ) : (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-muted"><Clock className="w-4 h-4"/></div>
                    )}
                  </div>

                  <span className={`font-semibold ${task.status === 'in_progress' || task.status === 'completed' ? 'text-amber' : 'text-muted'}`}>--(Upload)→</span>

                  {/* Node 3: Auto Engine */}
                  <div className={`p-3.5 rounded-sm border space-y-2 text-center min-w-[160px] transition-all ${task.status !== 'in_progress' && task.status !== 'completed' ? 'bg-surface/50 border-hairline/50 opacity-50' : 'bg-surface border-hairline'}`}>
                    <span className="text-sm text-ink block font-semibold">Node 3: Auto Engine</span>
                    <span className="font-semibold text-ink block">AI Verification</span>
                    {task.status === 'in_progress' ? (
                        <button 
                          onClick={() => handleStatusChange(task, 'completed')}
                          className="w-full mt-2 py-1.5 rounded-sm btn-accent bg-amber hover:bg-amber-hover text-white text-sm font-semibold cursor-pointer"
                        >
                          Upload & Complete
                        </button>
                    ) : task.status === 'completed' ? (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-verified"><CheckCircle2 className="w-4 h-4"/></div>
                    ) : (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-muted"><Clock className="w-4 h-4"/></div>
                    )}
                  </div>

                  <span className={`font-semibold ${task.status === 'completed' ? 'text-verified' : 'text-muted'}`}>--(Close)→</span>

                  {/* Node 4: Audit DB */}
                  <div className={`p-3.5 rounded-sm border space-y-2 text-center min-w-[160px] transition-all ${task.status !== 'completed' ? 'bg-surface/50 border-hairline/50 opacity-50' : 'bg-surface border-verified'}`}>
                    <span className="text-sm text-verified block font-semibold">Node 4: Audit DB</span>
                    <span className="font-semibold text-ink block">Event Log</span>
                    {task.status === 'completed' ? (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-verified"><CheckCircle2 className="w-4 h-4"/></div>
                    ) : (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-muted"><Clock className="w-4 h-4"/></div>
                    )}
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="ledger-card p-6 space-y-4">
        <h2 className="font-serif text-sm font-semibold text-ink tracking-wider flex items-center gap-2">
          <GitCommit className="w-4 h-4" /> Live Audit Activity Feed
        </h2>
        <div className="space-y-0 text-sm max-h-[400px] overflow-y-auto">
          {auditLog.map((act) => (
            <div key={act.id} className="log-row p-4 bg-surface border-b border-hairline flex items-center justify-between transition-all last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-sm bg-paper-warm border border-hairline text-ink font-semibold text-sm flex items-center justify-center">
                  {act.avatar || 'SYS'}
                </span>
                <div>
                  <span className="font-semibold text-ink block">{act.actor}</span>
                  <span className="text-muted text-sm">{act.action}: <strong className="font-mono text-ink">{act.target}</strong></span>
                </div>
              </div>
              <div className="text-right font-mono text-sm text-muted">
                <span className="block log-timestamp">{act.timestamp}</span>
                <span>Hash: {act.hash}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskCreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
