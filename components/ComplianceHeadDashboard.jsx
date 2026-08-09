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
  X,
  Calculator,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { 
  COMPLIANCE_KPI_METRICS, 
  STATUTORY_TIMELINE_ITEMS, 
  GITHUB_STYLE_AUDIT_FEED, 
  REGULATORY_RULES_FULL 
} from '../lib/mockData';
import { taskStore } from '../lib/taskStore';
import PenaltyCalculatorPanel from './PenaltyCalculatorPanel';

export default function ComplianceHeadDashboard({ onOpenNewProjectModal, onNavigateView }) {
  const [selectedTimelineItem, setSelectedTimelineItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
  const [penaltyModalItem, setPenaltyModalItem] = useState(null);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-sm border border-hairline">
        <div>
          <h1 className="font-serif text-xl font-semibold text-ink tracking-tight">
            Welcome back, Compliance Head
          </h1>
          <p className="text-sm text-muted mt-0.5 leading-relaxed">
            Single-pane Bento Box command center • Single source of statutory truth for Apex Technologies Pvt Ltd.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setPenaltyModalItem({ title: 'Form 26Q', dueDate: '2026-06-15', authority: 'Income Tax', citation: 'IT Act Sec 234E' });
              setIsPenaltyModalOpen(true);
            }}
            className="btn-accent px-3.5 py-2 rounded-sm text-white text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Risk & Penalty Panel</span>
          </button>

          <button
            onClick={() => onNavigateView('whatsapp_settings')}
            className="btn-secondary px-3.5 py-2 rounded-sm text-ink text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-700" />
            <span>WhatsApp Reminders</span>
          </button>
          
          <button
            onClick={onOpenNewProjectModal}
            className="px-4 py-2 rounded-sm bg-ink hover:bg-slate-800 text-white text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Top Row: Three Minimal Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* KPI 1: Overall Compliance Score */}
        <div className="ledger-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Overall Compliance Score</span>
            <span className="status-verified inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs border">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {COMPLIANCE_KPI_METRICS.scoreBadge}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-serif text-ink">{COMPLIANCE_KPI_METRICS.score}%</span>
            <span className="text-sm text-muted font-medium">5 of 8 Satisfied</span>
          </div>

          <div className="w-full bg-hairline-light h-2 rounded-full overflow-hidden">
            <div className="bg-verified h-full rounded-full" style={{ width: `${COMPLIANCE_KPI_METRICS.score}%` }} />
          </div>
        </div>

        {/* KPI 2: Upcoming Deadlines (Next 30 Days) */}
        <div className="ledger-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Upcoming Deadlines (Next 30 Days)</span>
            <span className="status-uploaded inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs border">
              <Clock className="w-3.5 h-3.5" />
              Attention Needed
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-serif text-ink">{COMPLIANCE_KPI_METRICS.upcomingDeadlinesCount}</span>
            <span className="text-sm text-muted font-medium">Active Filings</span>
          </div>

          <p className="text-sm text-muted">EPF ECR (Aug 15) & GSTR-3B (Aug 20) upcoming</p>
        </div>

        {/* KPI 3: Active Risk Alerts */}
        <div className="ledger-card p-5 space-y-3 border-l-4 border-l-overdue">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Active Risk Alerts</span>
            <span className="status-overdue inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs border">
              <AlertTriangle className="w-3.5 h-3.5" />
              Critical Gap
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-serif text-ink">{COMPLIANCE_KPI_METRICS.activeRiskAlertsCount}</span>
            <span className="text-sm text-muted font-medium">Overdue / Gap</span>
          </div>

          <p className="text-sm text-overdue font-medium">Form DIR-3 KYC Director 2 OTP pending</p>
        </div>

      </div>

      {/* Middle Row (Bento Split View): Left Timeline + Right Recent Activity Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Compliance Timeline List (7 cols) */}
        <div className="lg:col-span-7 ledger-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber" />
              <h2 className="font-serif text-sm font-semibold text-ink uppercase tracking-wider">
                Compliance Timeline (1-Year, 2-Year & Recurring Lifecycles)
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRiskScan}
                className="px-3 py-1.5 bg-overdue-light text-overdue border border-overdue rounded-sm text-xs font-bold cursor-pointer transition-colors"
              >
                Run Risk Scan
              </button>
              <span className="text-sm text-muted font-medium hidden sm:inline">Progressive Disclosure</span>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTimeline.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedTimelineItem(item)}
                className="p-3.5 rounded-sm border border-hairline hover:border-amber hover:bg-paper transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink group-hover:text-amber transition-colors">
                      {item.title}
                    </span>
                    <span className="text-xs text-muted font-medium px-2 py-0.5 rounded-sm bg-paper-warm border border-hairline">
                      {item.cycle}
                    </span>
                  </div>

                  {/* Semantic Status Badge */}
                  {item.status === 'Green' && (
                    <span className="status-verified px-2.5 py-0.5 rounded-full font-bold text-xs border">
                      {item.statusText}
                    </span>
                  )}
                  {item.status === 'Amber' && (
                    <span className="status-uploaded px-2.5 py-0.5 rounded-full font-bold text-xs border">
                      {item.statusText}
                    </span>
                  )}
                  {item.status === 'Red' && (
                    <span className="status-overdue px-2.5 py-0.5 rounded-full font-bold text-xs border">
                      {item.statusText}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Authority: <strong className="text-ink">{item.authority}</strong></span>
                  <span>Due Date: <strong className="font-mono text-ink">{item.dueDate}</strong></span>
                  <span className="text-amber font-medium group-hover:underline">Click for details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: GitHub-Style Audit Feed (5 cols) */}
        <div className="lg:col-span-5 ledger-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-ink" />
              <h2 className="font-serif text-sm font-semibold text-ink uppercase tracking-wider">
                Recent Activity & Audit Log Feed
              </h2>
            </div>
            <span className="text-sm text-muted font-medium">GitHub-Style Log</span>
          </div>

          <div className="space-y-0">
            {GITHUB_STYLE_AUDIT_FEED.map((act) => (
              <div key={act.id} className="log-row flex flex-col py-3 border-b border-hairline-light last:border-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-ink text-white font-bold text-xs flex items-center justify-center">
                      {act.avatar}
                    </span>
                    <span className="font-semibold text-sm text-ink">{act.actor}</span>
                  </div>
                  <span className="log-timestamp font-mono text-xs text-muted">{act.timestamp}</span>
                </div>

                <p className="text-ink-light text-sm pl-8">
                  {act.action} <span className="font-mono font-semibold text-ink">{act.target}</span>
                </p>

                <div className="pl-8 flex items-center justify-between font-mono">
                  <span className="text-xs text-muted">Hash: {act.hash}</span>
                  <span className="text-verified text-xs font-medium">• Recorded</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Progressive Disclosure Modal for Timeline Items */}
      {selectedTimelineItem && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="modal-panel bg-surface rounded-sm max-w-lg w-full p-6 border border-hairline space-y-4">
            
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber" />
                <h3 className="font-serif text-base font-semibold text-ink">Regulatory Rule & Task Disclosure</h3>
              </div>
              <button 
                onClick={() => setSelectedTimelineItem(null)}
                className="text-muted hover:text-ink-light text-sm font-bold p-1 hover:bg-paper-warm rounded-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs uppercase font-bold text-muted block">Obligation Title</span>
                <span className="text-sm font-bold text-ink">{selectedTimelineItem.title}</span>
              </div>

              <div className="p-3.5 rounded-sm bg-paper-warm border border-hairline space-y-1.5">
                <span className="text-xs uppercase font-bold text-muted block">Underlying Statutory Citation</span>
                <p className="font-serif italic text-sm text-ink-light">{selectedTimelineItem.citation}</p>
                <p className="text-ink-light text-sm pt-1">{selectedTimelineItem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-sm bg-paper-warm border border-hairline">
                  <span className="text-muted text-xs block">Assigned Role</span>
                  <span className="font-semibold text-sm text-ink">{selectedTimelineItem.assignedTo}</span>
                </div>
                <div className="p-2.5 rounded-sm bg-paper-warm border border-hairline">
                  <span className="text-muted text-xs block">Statutory Due Date</span>
                  <span className="font-mono font-semibold text-sm text-ink">{selectedTimelineItem.dueDate}</span>
                </div>
              </div>

              {selectedTimelineItem.evidenceFile && (
                <div>
                  <span className="text-xs uppercase font-bold text-muted block">Linked Evidence Document</span>
                  <span className="text-amber font-mono text-xs font-semibold hover:underline">📄 {selectedTimelineItem.evidenceFile}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-wrap justify-end gap-2.5">
              <button
                onClick={() => {
                  const item = selectedTimelineItem;
                  setSelectedTimelineItem(null);
                  setPenaltyModalItem(item);
                  setIsPenaltyModalOpen(true);
                }}
                className="btn-accent px-3.5 py-2 rounded-sm text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate Penalty</span>
              </button>

              <button
                onClick={handleAssignTask}
                className="btn-secondary px-3.5 py-2 rounded-sm text-ink text-xs font-semibold cursor-pointer"
              >
                Create Task from Obligation
              </button>
              <button
                onClick={() => setSelectedTimelineItem(null)}
                className="btn-ink px-3.5 py-2 rounded-sm text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Penalty Calculator Modal Overlay */}
      {isPenaltyModalOpen && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <PenaltyCalculatorPanel
            initialFilingType={penaltyModalItem?.title || 'Form 26Q'}
            initialDueDate={penaltyModalItem?.dueDate || '2026-06-15'}
            initialAuthority={penaltyModalItem?.authority || 'Income Tax Department'}
            initialCitation={penaltyModalItem?.citation || 'Income Tax Act Sec 234E'}
            initialSeverity={4}
            onClose={() => setIsPenaltyModalOpen(false)}
            isModal={true}
          />
        </div>
      )}

    </div>
  );
}
