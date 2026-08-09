"use client";

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  GitCommit, 
  Calendar,
  X,
  Calculator
} from 'lucide-react';
import { 
  COMPLIANCE_KPI_METRICS, 
  STATUTORY_TIMELINE_ITEMS, 
  GITHUB_STYLE_AUDIT_FEED
} from '../lib/mockData';
import { taskStore } from '../lib/taskStore';
import PenaltyCalculatorPanel from './PenaltyCalculatorPanel';

export default function ComplianceHeadDashboard({ onNavigateView }) {
  const [selectedTimelineItem, setSelectedTimelineItem] = useState(null);
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
  const [penaltyModalItem, setPenaltyModalItem] = useState(null);

  const handleRiskScan = async () => {
    // Find all Amber and Red timeline items
    const riskyItems = STATUTORY_TIMELINE_ITEMS.filter(item => item.status === 'Amber' || item.status === 'Red');
    
    for (const item of riskyItems) {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'OBLIGATION_DUE_ALERT',
          title: `Risk scan: ${item.title}`,
          description: `Obligation is ${item.status === 'Red' ? 'overdue or critical' : 'approaching its deadline'}.`,
          entityName: 'Apex Technologies Pvt Ltd',
          metadata: {
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <p className="label-caps mb-2">Apex Technologies Pvt Ltd</p>
          <h1 className="font-serif text-2xl font-semibold text-ink tracking-tight">Compliance overview</h1>
          <p className="hidden">
            Single-pane Bento Box command center • Single source of statutory truth for Apex Technologies Pvt Ltd.
          </p>
          <p className="text-sm text-muted mt-1 leading-relaxed">Prioritize what needs attention, then move it into an accountable task.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateView('tasks')}
            className="btn-secondary"
          >
            <span>Open tasks</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setPenaltyModalItem({ title: 'Form 26Q', dueDate: '2026-06-15', authority: 'Income Tax', citation: 'IT Act Sec 234E' });
              setIsPenaltyModalOpen(true);
            }}
            className="btn-accent"
          >
            <Calculator className="w-4 h-4" />
            <span>Assess risk</span>
          </button>
        </div>
      </div>

      {/* Top Row: Three Minimal Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
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
            <span className="text-sm font-semibold text-muted">Due in the next 30 days</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Side: Compliance Timeline List (7 cols) */}
        <div className="lg:col-span-7 ledger-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber" />
              <h2 className="font-serif text-sm font-semibold text-ink uppercase tracking-wider">
                Upcoming obligations
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRiskScan}
                className="px-3 py-1.5 bg-overdue-light text-overdue border border-overdue rounded-sm text-xs font-bold cursor-pointer transition-colors"
              >
                Run Risk Scan
              </button>
              <span className="text-sm text-muted font-medium hidden sm:inline">Select an item to review</span>
            </div>
          </div>

          <div className="space-y-3">
            {STATUTORY_TIMELINE_ITEMS.map((item) => (
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
                Recent activity
              </h2>
            </div>
            <span className="text-sm text-muted font-medium">Audit trail</span>
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
