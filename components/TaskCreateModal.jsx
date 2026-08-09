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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h2 className="text-lg font-bold text-slate-900">Create New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
            <input 
              type="text" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
              placeholder="e.g. DIR-3 KYC Verification" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Linked Rule</label>
            <select 
              required 
              value={ruleId}
              onChange={(e) => setRuleId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Select a rule...</option>
              {REGULATORY_RULES_FULL.map(rule => (
                <option key={rule.id} value={rule.id}>{rule.title} ({rule.authority})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assignee Name</label>
              <input 
                type="text" 
                required 
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
                placeholder="e.g. Tax Lead (Y)" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline</label>
            <input 
              type="date" 
              required 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 shadow-sm"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
