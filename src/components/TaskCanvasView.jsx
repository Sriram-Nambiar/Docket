import React, { useState } from 'react';
import { 
  Share2, 
  Plus, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ShieldCheck, 
  ArrowRight,
  GitCommit,
  Layers,
  History,
  Bot
} from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '../data/mockData';

export default function TaskCanvasView({ selectedRuleForTask }) {
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState(selectedRuleForTask ? `Complete ${selectedRuleForTask.title}` : 'File Director 2 DIR-3 KYC Verification');
  const [assignee, setAssignee] = useState('Tax Lead (Y)');
  const [deadline, setDeadline] = useState('2026-09-30');
  const [clearance, setClearance] = useState('Confidential');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newLog = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: "Compliance Head (X)",
      action: "TASK_CREATED",
      details: `Created task node: '${taskTitle}'`,
      targetNode: assignee,
      hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      statusTag: "CREATED",
    };

    setAuditLogs([newLog, ...auditLogs]);
    setIsCreatingTask(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Visual Scripting & GitHub-Style Task Collaboration Canvas</h2>
              <p className="text-xs text-slate-400">
                Visual node graph for cross-department handoffs paired with an append-only immutable audit trail.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreatingTask(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task Node</span>
          </button>
        </div>
      </div>

      {/* Visual Scripting Node Canvas */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Visual Scripting Node Graph (Task Pipeline)
            </h3>
          </div>
          <span className="text-[10px] text-purple-300 font-mono">React Flow Graph Simulation</span>
        </div>

        {/* Node Graph Container */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-x-auto">
          <div className="min-w-[800px] flex items-center justify-between gap-4">
            
            {/* Node 1 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/50 glow-indigo text-center space-y-2 w-48 shrink-0">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block">Node 1: Creator</span>
              <div className="flex justify-center">
                <UserCheck className="w-6 h-6 text-indigo-300" />
              </div>
              <span className="text-xs font-bold text-white block">Compliance Head (X)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 inline-block border border-indigo-500/30">
                Created Task
              </span>
            </div>

            {/* Edge 1 */}
            <div className="flex flex-col items-center gap-1 text-slate-500 shrink-0">
              <span className="text-[10px] font-mono text-purple-400">Assign Node</span>
              <ArrowRight className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>

            {/* Node 2 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/50 text-center space-y-2 w-48 shrink-0">
              <span className="text-[10px] uppercase font-bold text-purple-400 block">Node 2: Assignee</span>
              <div className="flex justify-center">
                <UserCheck className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-xs font-bold text-white block">Tax Lead (Y)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 inline-block border border-purple-500/30">
                Pending File Upload
              </span>
            </div>

            {/* Edge 2 */}
            <div className="flex flex-col items-center gap-1 text-slate-500 shrink-0">
              <span className="text-[10px] font-mono text-cyan-400">Upload Doc</span>
              <ArrowRight className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>

            {/* Node 3 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/50 text-center space-y-2 w-48 shrink-0">
              <span className="text-[10px] uppercase font-bold text-cyan-400 block">Node 3: Auto Validation</span>
              <div className="flex justify-center">
                <Bot className="w-6 h-6 text-cyan-300" />
              </div>
              <span className="text-xs font-bold text-white block">AI Extraction Agent</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 inline-block border border-cyan-500/30">
                Rule Matched
              </span>
            </div>

            {/* Edge 3 */}
            <div className="flex flex-col items-center gap-1 text-slate-500 shrink-0">
              <span className="text-[10px] font-mono text-emerald-400">Close Audit</span>
              <ArrowRight className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>

            {/* Node 4 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/50 glow-emerald text-center space-y-2 w-48 shrink-0">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Node 4: Audit Log</span>
              <div className="flex justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
              </div>
              <span className="text-xs font-bold text-white block">ComplianceEvent DB</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 inline-block border border-emerald-500/30">
                Immutable Event
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* GitHub-Style Issue & Event Audit Log Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Immutable ComplianceEvent Audit Trail ({auditLogs.length} Events)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Append-Only Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Event ID & Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Event Action</th>
                <th className="py-3 px-4">Details & Target Node</th>
                <th className="py-3 px-4">SHA256 Event Hash</th>
                <th className="py-3 px-4 text-right">Status Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                  
                  {/* Event ID */}
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-purple-400 font-bold block">{log.id}</span>
                    <span className="text-[10px] text-slate-500 block">{log.timestamp}</span>
                  </td>

                  {/* Actor */}
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {log.actor}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-indigo-300 border border-slate-700">
                      {log.action}
                    </span>
                  </td>

                  {/* Details */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="text-slate-200 block">{log.details}</span>
                      <span className="text-[10px] text-slate-400 block">Target: {log.targetNode}</span>
                    </div>
                  </td>

                  {/* SHA256 Hash */}
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                    {log.hash}
                  </td>

                  {/* Status Tag */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px]">
                      {log.statusTag}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      {isCreatingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-purple-500/40 glow-indigo space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Create New Task Node</h3>
              </div>
              <button 
                onClick={() => setIsCreatingTask(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium block">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium block">Assignee Role / Person</label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="Tax Lead (Y)">Tax Lead (Y)</option>
                  <option value="Secretarial Assistant">Secretarial Assistant</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="External CA Auditor">External CA Auditor</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium block">Statutory Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium block">Clearance Classification</label>
                <select
                  value={clearance}
                  onChange={(e) => setClearance(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="Confidential">Confidential (Tier 2)</option>
                  <option value="Internal">Internal (Tier 1)</option>
                  <option value="Restricted">Restricted (Board Level)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingTask(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20"
                >
                  Spawn Task Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
