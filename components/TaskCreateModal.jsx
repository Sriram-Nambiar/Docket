"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { REGULATORY_RULES_FULL } from '../lib/mockData';
import { taskStore } from '../lib/taskStore';

export default function TaskCreateModal({ isOpen, onClose, initialData = null }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [ruleId, setRuleId] = useState(initialData?.ruleId || '');
  const [assignee, setAssignee] = useState(initialData?.assignee || '');
  const [department, setDepartment] = useState(initialData?.department || 'Tax');
  const [deadline, setDeadline] = useState(initialData?.deadline || '');

  // Update state when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setRuleId(initialData.ruleId || '');
      setAssignee(initialData.assignee || '');
      setDepartment(initialData.department || 'Tax');
      setDeadline(initialData.deadline || '');
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    taskStore.createTask({
      title,
      ruleId,
      assignee,
      department,
      deadline,
      creator: 'Compliance Head'
    });
    // Reset form
    setTitle('');
    setRuleId('');
    setAssignee('');
    setDepartment('Tax');
    setDeadline('');
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="new-task-title">
      <div className="modal-panel max-w-md shadow-xl">
        <div className="flex items-center justify-between border-b border-hairline pb-4 mb-5">
          <div>
            <p className="label-caps mb-1">Task assignment</p>
            <h2 id="new-task-title" className="font-serif text-lg font-semibold text-ink">Create a task</h2>
          </div>
          <button type="button" onClick={onClose} className="text-muted hover:text-ink p-1 hover:bg-paper-warm rounded-sm" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Task title</label>
            <input 
              type="text" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="ledger-input" 
              placeholder="e.g. DIR-3 KYC Verification" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Linked rule</label>
            <select 
              required 
              value={ruleId}
              onChange={(e) => setRuleId(e.target.value)}
              className="ledger-input"
            >
              <option value="">Select a rule...</option>
              {REGULATORY_RULES_FULL.map(rule => (
                <option key={rule.id} value={rule.id}>{rule.title} ({rule.authority})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Assignee</label>
              <input 
                type="text" 
                required 
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="ledger-input" 
                placeholder="e.g. Tax Lead (Y)" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Department</label>
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="ledger-input"
              >
                <option value="Tax">Tax</option>
                <option value="Legal">Legal</option>
                <option value="HR">HR</option>
                <option value="Secretarial">Secretarial</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Deadline</label>
            <input 
              type="date" 
              required 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="ledger-input"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-accent"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
