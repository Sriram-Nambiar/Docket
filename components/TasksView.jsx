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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Task Canvas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      <div className="enterprise-card p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Share2 className="w-5 h-5 text-blue-700" />
          <h2 className="text-base font-bold text-slate-900">Visual Scripting Pipeline</h2>
        </div>

        <p className="text-xs text-slate-600">
          Visual-scripting style node graph for cross-department work allocation paired with an append-only audit trail log.
        </p>

        <div className="p-6 rounded-xl bg-slate-900 text-white space-y-6 overflow-x-auto min-h-[300px]">
          {tasks.length === 0 ? (
            <div className="text-center text-slate-400 text-sm py-10">No tasks active. Create one to start the pipeline.</div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="space-y-4 pb-6 border-b border-slate-800 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-200">{task.title}</span>
                  <span className="text-xs font-mono px-2 py-1 bg-slate-800 rounded border border-slate-700">Due: {task.deadline}</span>
                </div>
                <div className="min-w-[700px] flex items-center justify-between gap-4 text-xs font-mono">
                  
                  {/* Node 1: Creator */}
                  <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-2 text-center min-w-[160px] relative transition-all">
                    <span className="text-[10px] text-blue-400 block font-bold">Node 1: Creator</span>
                    <span className="font-bold text-white block">{task.creator}</span>
                    {task.status === 'open' ? (
                        <button 
                          onClick={() => handleStatusChange(task, 'assigned')}
                          className="w-full mt-2 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold cursor-pointer"
                        >
                          Assign Task
                        </button>
                    ) : (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-emerald-400"><CheckCircle2 className="w-4 h-4"/></div>
                    )}
                  </div>

                  <span className={`font-bold ${task.status !== 'open' ? 'text-blue-400' : 'text-slate-600'}`}>--(Assign)→</span>

                  {/* Node 2: Assignee */}
                  <div className={`p-3.5 rounded-xl border space-y-2 text-center min-w-[160px] transition-all ${task.status === 'open' ? 'bg-slate-800/50 border-slate-700/50 opacity-50' : 'bg-slate-800 border-slate-700'}`}>
                    <span className="text-[10px] text-indigo-400 block font-bold">Node 2: Assignee</span>
                    <span className="font-bold text-white block">{task.assignee}</span>
                    {task.status === 'assigned' ? (
                        <button 
                          onClick={() => handleStatusChange(task, 'in_progress')}
                          className="w-full mt-2 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold cursor-pointer"
                        >
                          Start Work
                        </button>
                    ) : task.status === 'in_progress' || task.status === 'completed' ? (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-emerald-400"><CheckCircle2 className="w-4 h-4"/></div>
                    ) : (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-slate-500"><Clock className="w-4 h-4"/></div>
                    )}
                  </div>

                  <span className={`font-bold ${task.status === 'in_progress' || task.status === 'completed' ? 'text-cyan-400' : 'text-slate-600'}`}>--(Upload)→</span>

                  {/* Node 3: Auto Engine */}
                  <div className={`p-3.5 rounded-xl border space-y-2 text-center min-w-[160px] transition-all ${task.status !== 'in_progress' && task.status !== 'completed' ? 'bg-slate-800/50 border-slate-700/50 opacity-50' : 'bg-slate-800 border-slate-700'}`}>
                    <span className="text-[10px] text-cyan-400 block font-bold">Node 3: Auto Engine</span>
                    <span className="font-bold text-white block">AI Verification</span>
                    {task.status === 'in_progress' ? (
                        <button 
                          onClick={() => handleStatusChange(task, 'completed')}
                          className="w-full mt-2 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold cursor-pointer"
                        >
                          Upload & Complete
                        </button>
                    ) : task.status === 'completed' ? (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-emerald-400"><CheckCircle2 className="w-4 h-4"/></div>
                    ) : (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-slate-500"><Clock className="w-4 h-4"/></div>
                    )}
                  </div>

                  <span className={`font-bold ${task.status === 'completed' ? 'text-emerald-400' : 'text-slate-600'}`}>--(Close)→</span>

                  {/* Node 4: Audit DB */}
                  <div className={`p-3.5 rounded-xl border space-y-2 text-center min-w-[160px] transition-all ${task.status !== 'completed' ? 'bg-slate-800/50 border-slate-700/50 opacity-50' : 'bg-slate-800 border-emerald-700'}`}>
                    <span className="text-[10px] text-emerald-400 block font-bold">Node 4: Audit DB</span>
                    <span className="font-bold text-white block">Event Log</span>
                    {task.status === 'completed' ? (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-emerald-400"><CheckCircle2 className="w-4 h-4"/></div>
                    ) : (
                        <div className="w-full mt-2 py-1.5 flex justify-center text-slate-500"><Clock className="w-4 h-4"/></div>
                    )}
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="enterprise-card p-6 space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <GitCommit className="w-4 h-4" /> Live Audit Activity Feed
        </h2>
        <div className="space-y-3 text-xs max-h-[400px] overflow-y-auto pr-2">
          {auditLog.map((act) => (
            <div key={act.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between transition-all">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  {act.avatar || 'SYS'}
                </span>
                <div>
                  <span className="font-bold text-slate-900 block">{act.actor}</span>
                  <span className="text-slate-600 text-[11px]">{act.action}: <strong className="font-mono text-slate-800">{act.target}</strong></span>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-slate-500">
                <span className="block text-slate-700">{act.timestamp}</span>
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
