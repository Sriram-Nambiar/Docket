"use client";

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  FileText, 
  ChevronRight, 
  ExternalLink, 
  Search, 
  Filter, 
  GitCommit, 
  UserCheck, 
  Calendar,
  Lock,
  X
} from 'lucide-react';
import { 
  COMPLIANCE_KPI_METRICS, 
  STATUTORY_TIMELINE_ITEMS, 
  GITHUB_STYLE_AUDIT_FEED, 
  REGULATORY_RULES_FULL 
} from '../lib/mockData';
import { taskStore } from '../lib/taskStore';

export default function ComplianceHeadDashboard({ onOpenNewProjectModal, onNavigateView }) {
  const [selectedTimelineItem, setSelectedTimelineItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter rules
  const filteredTimeline = STATUTORY_TIMELINE_ITEMS.filter(item => {
    const matchesCategory = filterCategory === 'All' || item.type.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.authority.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleScanCirculars = async () => {
    // Simulate scraper finding a new MCA circular
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'RULE_UPDATE_NOTIF',
        id: `rule-${Date.now()}`,
        payload: {
          authority: 'Ministry of Corporate Affairs (MCA)',
          circularNo: 'Circular 14/2023',
          message: 'New MCA Circular detected regarding AOC-4 XBRL mandates.',
          urgency: 'Normal'
        }
      })
    });
  };

  const handleRiskScan = async () => {
    // Find all Amber and Red timeline items
    const riskyItems = STATUTORY_TIMELINE_ITEMS.filter(item => item.status === 'Amber' || item.status === 'Red');
    
    for (const item of riskyItems) {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'OBLIGATION_DUE_ALERT',
          id: `risk-${item.id}-${Date.now()}`,
          payload: {
            title: item.title,
            dueDate: item.dueDate,
            assignedTo: item.assignedTo,
            status: item.status,
            urgency: item.status === 'Red' ? 'Urgent' : 'Normal',
            message: `Obligation "${item.title}" is ${item.status === 'Red' ? 'overdue/critical' : 'approaching deadline'}.`
          }
        })
      });
    }
  };

  const handleAssignTask = () => {
    if (!selectedTimelineItem) return;
    
    taskStore.createTask({
      title: selectedTimelineItem.title,
      ruleId: selectedTimelineItem.id || 'IN-GST-GSTR3B-004',
      assignee: selectedTimelineItem.assignedTo,
      department: 'Tax', // Generic fallback
      deadline: selectedTimelineItem.dueDate,
      creator: 'Compliance Head'
    });
    
    setSelectedTimelineItem(null);
    onNavigateView('tasks');
  };

  return (
    <div className="space-y-6">
      
      {/* Main Content Header: Welcome Back + Global New Project Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, Compliance Head
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Single-pane Bento Box command center • Single source of statutory truth for Apex Technologies Pvt Ltd.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleScanCirculars}
            className="px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Scan Circulars</span>
          </button>
          
          <button
            onClick={() => onNavigateView('intake')}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            Switch to Intake View
          </button>
          
          <button
            onClick={onOpenNewProjectModal}
            className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Top Row: Three Minimal Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* KPI 1: Overall Compliance Score */}
        <div className="enterprise-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Overall Compliance Score</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {COMPLIANCE_KPI_METRICS.scoreBadge}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{COMPLIANCE_KPI_METRICS.score}%</span>
            <span className="text-xs text-slate-500 font-medium">5 of 8 Satisfied</span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${COMPLIANCE_KPI_METRICS.score}%` }} />
          </div>
        </div>

        {/* KPI 2: Upcoming Deadlines (Next 30 Days) */}
        <div className="enterprise-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Upcoming Deadlines (Next 30 Days)</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Attention Needed
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{COMPLIANCE_KPI_METRICS.upcomingDeadlinesCount}</span>
            <span className="text-xs text-slate-500 font-medium">Active Filings</span>
          </div>

          <p className="text-[11px] text-slate-500">EPF ECR (Aug 15) & GSTR-3B (Aug 20) upcoming</p>
        </div>

        {/* KPI 3: Active Risk Alerts */}
        <div className="enterprise-card p-5 space-y-3 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Risk Alerts</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              Critical Gap
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{COMPLIANCE_KPI_METRICS.activeRiskAlertsCount}</span>
            <span className="text-xs text-slate-500 font-medium">Overdue / Gap</span>
          </div>

          <p className="text-[11px] text-rose-700 font-medium">Form DIR-3 KYC Director 2 OTP pending</p>
        </div>

      </div>

      {/* Middle Row (Bento Split View): Left Timeline + Right Recent Activity Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Compliance Timeline List (7 cols) */}
        <div className="lg:col-span-7 enterprise-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Compliance Timeline (1-Year, 2-Year & Recurring Lifecycles)
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRiskScan}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-md text-[10px] font-bold border border-rose-200 hover:bg-rose-100 cursor-pointer shadow-sm transition-colors"
              >
                Run Risk Scan
              </button>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Progressive Disclosure</span>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTimeline.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedTimelineItem(item)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-slate-50/50 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {item.cycle}
                    </span>
                  </div>

                  {/* Semantic Status Badge */}
                  {item.status === 'Green' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      {item.statusText}
                    </span>
                  )}
                  {item.status === 'Amber' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
                      {item.statusText}
                    </span>
                  )}
                  {item.status === 'Red' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200 animate-pulse">
                      {item.statusText}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Authority: <strong className="text-slate-800">{item.authority}</strong></span>
                  <span>Due Date: <strong className="font-mono text-slate-800">{item.dueDate}</strong></span>
                  <span className="text-blue-700 font-medium group-hover:underline">Click for details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: GitHub-Style Audit Feed (5 cols) */}
        <div className="lg:col-span-5 enterprise-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-slate-800" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Activity & Audit Log Feed
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">GitHub-Style Log</span>
          </div>

          <div className="space-y-3">
            {GITHUB_STYLE_AUDIT_FEED.map((act) => (
              <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                      {act.avatar}
                    </span>
                    <span className="font-semibold text-slate-900">{act.actor}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                </div>

                <p className="text-slate-600 text-[11px] pl-8">
                  {act.action} <span className="font-mono font-semibold text-slate-800">{act.target}</span>
                </p>

                <div className="pl-8 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Hash: {act.hash}</span>
                  <span className="text-emerald-700 font-medium">• Recorded</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Progressive Disclosure Modal for Timeline Items */}
      {selectedTimelineItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">Regulatory Rule & Task Disclosure</h3>
              </div>
              <button 
                onClick={() => setSelectedTimelineItem(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 hover:bg-slate-100 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Obligation Title</span>
                <span className="text-sm font-bold text-slate-900">{selectedTimelineItem.title}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Underlying Statutory Citation</span>
                <p className="text-slate-800 font-serif italic text-xs">{selectedTimelineItem.citation}</p>
                <p className="text-slate-600 text-[11px] pt-1">{selectedTimelineItem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Assigned Role</span>
                  <span className="font-semibold text-slate-800">{selectedTimelineItem.assignedTo}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Statutory Due Date</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedTimelineItem.dueDate}</span>
                </div>
              </div>

              {selectedTimelineItem.evidenceFile && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Linked Evidence Document</span>
                  <span className="text-blue-700 font-mono text-xs font-semibold hover:underline">📄 {selectedTimelineItem.evidenceFile}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={handleAssignTask}
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Create Task from Obligation
              </button>
              <button
                onClick={() => setSelectedTimelineItem(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Close Disclosure
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
