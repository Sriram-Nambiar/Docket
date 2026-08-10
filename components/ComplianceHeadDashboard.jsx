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
  Calculator,
  Play,
  Loader2,
  Building2,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useCompany } from '../lib/CompanyContext';
import { taskStore } from '../lib/taskStore';
import PenaltyCalculatorPanel from './PenaltyCalculatorPanel';

export default function ComplianceHeadDashboard({ onNavigateView }) {
  const { 
    activeCompany, 
    companies, 
    changeActiveCompany, 
    runAutomationForCompany, 
    automationStatus,
    updateObligationStatus
  } = useCompany();

  const [selectedTimelineItem, setSelectedTimelineItem] = useState(null);
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
  const [penaltyModalItem, setPenaltyModalItem] = useState(null);

  const handleRiskScan = async () => {
    // Run risk scan & send alerts for active company's obligations
    const riskyItems = activeCompany.obligations.filter(item => item.status === 'Amber' || item.status === 'Red');
    
    for (const item of riskyItems) {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'OBLIGATION_DUE_ALERT',
          title: `Risk scan: ${item.title}`,
          description: `Obligation is ${item.status === 'Red' ? 'overdue or critical' : 'approaching deadline'}.`,
          entityName: activeCompany.name,
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
      department: 'Tax',
      deadline: selectedTimelineItem.dueDate,
      creator: 'Compliance Head'
    });
    
    setSelectedTimelineItem(null);
    onNavigateView('tasks');
  };

  const handleMarkSatisfied = (item) => {
    updateObligationStatus(activeCompany.id, item.id, 'Green', 'Satisfied');
    setSelectedTimelineItem(null);
  };

  const isAutomating = activeCompany.isAutomating || automationStatus.isRunning;

  return (
    <div className="space-y-6">
      
      {/* Real-time Automation Active Banner */}
      {isAutomating && (
        <div className="bg-amber-light border border-amber/40 border-l-4 border-l-amber p-4 rounded-sm shadow-sm flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-amber animate-spin" />
            <div>
              <span className="text-xs uppercase font-bold text-amber block">Real-time Agentic Engine Running</span>
              <p className="text-sm font-semibold text-ink">{automationStatus.logMessage || `Automating compliance stack for ${activeCompany.name}...`}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber text-white font-mono text-xs font-bold rounded-sm">
            Step {automationStatus.currentStep || 1} / 5
          </span>
        </div>
      )}

      {/* Main Content Header: Welcome Back + Company Selector + Automate Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Building2 className="w-4 h-4 text-amber" />
            <select
              aria-label="Switch active company workspace"
              value={activeCompany.id}
              onChange={(e) => changeActiveCompany(e.target.value)}
              className="bg-paper-warm border border-hairline hover:border-amber rounded px-2.5 py-1 text-xs font-bold text-ink cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.sector})</option>
              ))}
            </select>
            <span className="text-xs text-muted font-mono px-2 py-0.5 rounded bg-paper-warm border border-hairline hidden sm:inline">
              CIN: {activeCompany.cin}
            </span>
          </div>

          <h1 className="font-serif text-2xl font-semibold text-ink tracking-tight flex items-center gap-2">
            Compliance overview
            {isAutomating && (
              <span className="text-xs font-sans font-bold text-amber px-2 py-0.5 rounded bg-amber/20 border border-amber flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Live Syncing
              </span>
            )}
          </h1>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            Real-time compliance ledger for <strong className="text-ink">{activeCompany.name}</strong> • {activeCompany.employeeCount} headcount • {activeCompany.annualTurnover} turnover
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Prominent Automate Company Button */}
          <button
            onClick={() => runAutomationForCompany(activeCompany.id)}
            disabled={isAutomating}
            className={`btn-accent px-4 py-2 rounded-sm text-sm font-semibold flex items-center gap-2 transition-all ${
              isAutomating ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] shadow-sm'
            }`}
          >
            {isAutomating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Automating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Automate {activeCompany.name.split(' ')[0]}</span>
              </>
            )}
          </button>

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
            className="btn-secondary"
          >
            <Calculator className="w-4 h-4" />
            <span>Assess risk</span>
          </button>
        </div>
      </div>

      {/* Top Row: Three Minimal Metric KPI Cards (Dynamic to Active Company) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* KPI 1: Overall Compliance Score */}
        <div className="ledger-card p-5 space-y-3 relative overflow-hidden">
          {isAutomating && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber animate-pulse"></div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Overall Compliance Score</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs border ${
              activeCompany.score >= 85 ? 'status-verified border-verified' : 'status-uploaded border-amber'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeCompany.scoreBadge}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-serif text-ink transition-all">{activeCompany.score}%</span>
            <span className="text-sm text-muted font-medium">
              {activeCompany.obligations.filter(o => o.status === 'Green').length} of {activeCompany.obligations.length} Satisfied
            </span>
          </div>

          <div className="w-full bg-hairline-light h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                activeCompany.score >= 85 ? 'bg-verified' : 'bg-amber'
              }`} 
              style={{ width: `${activeCompany.score}%` }} 
            />
          </div>
        </div>

        {/* KPI 2: Upcoming Deadlines (Next 30 Days) */}
        <div className="ledger-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Due in next 30 days</span>
            <span className="status-uploaded inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs border">
              <Clock className="w-3.5 h-3.5" />
              Attention Needed
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-serif text-ink">{activeCompany.upcomingDeadlinesCount}</span>
            <span className="text-sm text-muted font-medium">Active Filings</span>
          </div>

          <p className="text-sm text-muted truncate">
            {activeCompany.obligations.find(o => o.status === 'Amber')?.title || 'No imminent deadlines'}
          </p>
        </div>

        {/* KPI 3: Active Risk Alerts */}
        <div className={`ledger-card p-5 space-y-3 border-l-4 ${
          activeCompany.activeRiskAlertsCount > 0 ? 'border-l-overdue' : 'border-l-verified'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Active Risk Alerts</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs border ${
              activeCompany.activeRiskAlertsCount > 0 ? 'status-overdue' : 'status-verified'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              {activeCompany.activeRiskAlertsCount > 0 ? 'Critical Gap' : 'Clear Ledger'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-serif text-ink">{activeCompany.activeRiskAlertsCount}</span>
            <span className="text-sm text-muted font-medium">Overdue / Gap</span>
          </div>

          <p className={`text-sm font-medium truncate ${
            activeCompany.activeRiskAlertsCount > 0 ? 'text-overdue' : 'text-verified'
          }`}>
            {activeCompany.riskAlertMessage || 'Zero compliance gaps detected'}
          </p>
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
                className="px-3 py-1.5 bg-overdue-light text-overdue border border-overdue rounded-sm text-xs font-bold cursor-pointer hover:bg-overdue/10 transition-colors"
              >
                Run Risk Scan
              </button>
              <span className="text-sm text-muted font-medium hidden sm:inline">Select item to review</span>
            </div>
          </div>

          <div className="space-y-3">
            {activeCompany.obligations.map((item) => (
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

        {/* Right Side: Real-Time GitHub-Style Audit Feed (5 cols) */}
        <div className="lg:col-span-5 ledger-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-ink" />
              <h2 className="font-serif text-sm font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
                Recent activity
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </h2>
            </div>
            <span className="text-xs font-mono text-muted font-medium">Real-time audit log</span>
          </div>

          <div className="space-y-0 max-h-[460px] overflow-y-auto pr-1">
            {activeCompany.auditLogs.map((act) => (
              <div key={act.id} className="log-row flex flex-col py-3 border-b border-hairline-light last:border-0 space-y-1.5 transition-all hover:bg-paper-warm/50 px-1 rounded-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center text-white ${
                      act.avatar === 'AI' ? 'bg-amber' : 'bg-ink'
                    }`}>
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
                  <span className="text-xs text-muted truncate max-w-[180px]">Hash: {act.hash}</span>
                  <span className={`text-xs font-medium ${act.status === 'Red' ? 'text-overdue' : 'text-verified'}`}>
                    • {act.status === 'Red' ? 'Flagged' : 'Recorded'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Progressive Disclosure Modal for Timeline Items */}
      {selectedTimelineItem && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="modal-panel bg-surface rounded-sm max-w-lg w-full p-6 border border-hairline space-y-4 shadow-xl">
            
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

            <div className="pt-2 flex flex-wrap justify-end gap-2">
              {selectedTimelineItem.status !== 'Green' && (
                <button
                  onClick={() => handleMarkSatisfied(selectedTimelineItem)}
                  className="px-3.5 py-2 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Satisfied</span>
                </button>
              )}

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
                Create Task
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
