"use client";

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Calculator, 
  Sparkles, 
  Clock, 
  Calendar, 
  FileText, 
  X, 
  MessageCircle, 
  Check, 
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { PENALTY_RULES_MAP } from '../lib/mockData';
import { taskStore } from '../lib/taskStore';

export default function PenaltyCalculatorPanel({
  initialFilingType = 'Form 26Q',
  initialDueDate = '2026-06-15',
  initialAuthority = 'Income Tax Department',
  initialCitation = 'Income Tax Act 1961 Sec 234E',
  initialSeverity = 4,
  onClose,
  isModal = false
}) {
  const [filingType, setFilingType] = useState(initialFilingType);
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [currentDate, setCurrentDate] = useState('2026-08-09');
  const [customStatuteText, setCustomStatuteText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [penaltyData, setPenaltyData] = useState(null);
  const [aiAnalysisSource, setAiAnalysisSource] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98765 43210');
  const [reminderSent, setReminderSent] = useState(false);

  // Available filing options
  const filingOptions = [
    { label: 'Form 26Q (TDS Quarterly)', value: 'Form 26Q', authority: 'Income Tax Department', citation: 'Income Tax Act 1961 Sec 234E' },
    { label: 'GSTR-3B (GST Monthly)', value: 'GSTR-3B', authority: 'CBIC / GSTN', citation: 'CGST Act 2017 Sec 47 & Rule 61(5)' },
    { label: 'Form DIR-3 KYC (Director Annual)', value: 'DIR-3 KYC', authority: 'MCA', citation: 'Companies Director Rules 2014 Rule 12A' },
    { label: 'Form AOC-4 (Financials)', value: 'Form AOC-4', authority: 'MCA', citation: 'Companies Act 2013 Sec 137' },
    { label: 'GSTR-1 (Outward Supplies)', value: 'GSTR-1', authority: 'CBIC / GSTN', citation: 'CGST Act 2017 Sec 37 & 47' },
    { label: 'Form MGT-7 (Annual Return)', value: 'Form MGT-7', authority: 'MCA', citation: 'Companies Act 2013 Sec 92' },
    { label: 'EPF ECR (Monthly PF)', value: 'EPF ECR', authority: 'EPFO', citation: 'EPF & MP Act 1952 Para 14B' },
    { label: 'ITR-6 (Income Tax Return)', value: 'ITR-6', authority: 'Income Tax Department', citation: 'Income Tax Act 1961 Sec 234F' },
  ];

  // Calculate penalties locally or via API
  const calculatePenalty = async (statuteTextOverride = null) => {
    setIsAiLoading(true);
    
    // Find matching rule
    const selectedRule = PENALTY_RULES_MAP[filingType] || PENALTY_RULES_MAP['Form 26Q'];
    const statuteTextToUse = statuteTextOverride !== null ? statuteTextOverride : (customStatuteText || selectedRule.statuteText);

    try {
      const response = await fetch('/api/penalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filingType,
          authority: selectedRule.authority || initialAuthority,
          dueDate,
          currentDate,
          penaltySeverity: initialSeverity,
          citation: selectedRule.citation || initialCitation,
          statuteText: statuteTextToUse,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        setPenaltyData(res.penalty);
        setAiAnalysisSource(res.source);
      } else {
        // Fallback local calc
        computeLocalFallback(selectedRule);
      }
    } catch (e) {
      computeLocalFallback(selectedRule);
    } finally {
      setIsAiLoading(false);
    }
  };

  const computeLocalFallback = (selectedRule) => {
    const due = new Date(dueDate);
    const curr = new Date(currentDate);
    const daysLate = Math.max(0, Math.ceil((curr - due) / (1000 * 60 * 60 * 24)));
    const dailyRate = selectedRule.dailyRate || 0;
    let totalAccrued = selectedRule.fixedFee || (dailyRate * daysLate);
    if (selectedRule.maxCap && totalAccrued > selectedRule.maxCap) {
      totalAccrued = selectedRule.maxCap;
    }
    const daysUntilEscalation = Math.max(0, (selectedRule.escalationDays || 90) - daysLate);

    let summaryText = `₹${dailyRate}/day late fee, ₹${totalAccrued.toLocaleString('en-IN')} accrued, escalates to ${selectedRule.escalationType || 'prosecution risk'} in ${daysUntilEscalation} days`;
    if (daysLate === 0) {
      summaryText = `Filing is current. If missed: ₹${dailyRate || selectedRule.fixedFee}/day late fee starting post-deadline.`;
    }

    setPenaltyData({
      dailyPenaltyRate: dailyRate,
      totalAccrued,
      daysLate,
      nextEscalationDays: daysUntilEscalation,
      escalationType: selectedRule.escalationType || 'Prosecution & enforcement proceedings',
      plainEnglishSummary: summaryText,
      severityLevel: daysLate > 30 ? 'critical' : (daysLate > 0 ? 'warning' : 'safe'),
      statute: selectedRule.citation || initialCitation,
      maxCap: selectedRule.maxCap,
    });
    setAiAnalysisSource('local_computation');
  };

  // Run calculation whenever inputs change
  useEffect(() => {
    calculatePenalty();
  }, [filingType, dueDate, currentDate]);

  const handleFilingChange = (e) => {
    const newType = e.target.value;
    setFilingType(newType);
    const rule = PENALTY_RULES_MAP[newType];
    if (rule) {
      setCustomStatuteText(rule.statuteText);
    }
  };

  const handleTriggerWhatsApp = () => {
    if (!penaltyData) return;
    
    // Log to taskStore and audit feed
    taskStore.appendAudit({
      actor: 'WhatsApp Reminder Bot',
      avatar: 'WA',
      action: 'sent automated SMS/WhatsApp alert for',
      target: `${filingType} — ${penaltyData.plainEnglishSummary}`,
      status: penaltyData.severityLevel === 'critical' ? 'Red' : 'Amber'
    });

    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  };

  const containerClasses = isModal 
    ? "modal-panel max-w-2xl" 
    : "ledger-card p-6 border-l-4 border-l-amber space-y-5 bg-surface";

  return (
    <div className={containerClasses}>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-amber-light text-amber flex items-center justify-center border border-amber">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="heading-serif text-lg font-semibold text-ink flex items-center gap-2">
              Risk & Statutory Penalty Calculator
              <span className="tier-badge tier-badge-active text-[10px]">DEMO FEATURE</span>
            </h2>
            <p className="text-xs text-muted">
              Real-time penalty accrual tracker & NVIDIA NIM statute parsing
            </p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose} 
            className="p-1 text-muted hover:text-ink hover:bg-paper-warm rounded-sm cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        
        {/* Filing Type Selector */}
        <div>
          <label className="label-caps block mb-1">Filing / Obligation Type</label>
          <select 
            value={filingType} 
            onChange={handleFilingChange}
            className="ledger-input text-xs"
          >
            {filingOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="label-caps block mb-1">Statutory Due Date</label>
          <div className="relative">
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
              className="ledger-input text-xs font-mono"
            />
          </div>
        </div>

        {/* Assessment Date */}
        <div>
          <label className="label-caps block mb-1">Current Assessment Date</label>
          <input 
            type="date" 
            value={currentDate} 
            onChange={(e) => setCurrentDate(e.target.value)}
            className="ledger-input text-xs font-mono"
          />
        </div>
      </div>

      {/* Hero Output Warning Panel */}
      {penaltyData && (
        <div className={`p-4 rounded-sm border-l-4 ${
          penaltyData.severityLevel === 'critical' || penaltyData.daysLate > 30
            ? 'bg-overdue-light border-l-overdue border border-overdue/30' 
            : penaltyData.daysLate > 0 
            ? 'bg-amber-light border-l-amber border border-amber/30'
            : 'bg-paper-warm border-l-verified border border-hairline'
        } space-y-3`}>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-4 h-4 ${
                penaltyData.daysLate > 0 ? 'text-overdue' : 'text-verified'
              }`} />
              <span className="label-caps text-ink font-bold">
                {penaltyData.daysLate > 0 ? `PENALTY ACCRUING — ${penaltyData.daysLate} DAYS LATE` : 'FILING ON SCHEDULE'}
              </span>
            </div>

            {aiAnalysisSource === 'nvidia_nim' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-amber text-white font-mono text-[10px] font-semibold">
                <Sparkles className="w-3 h-3" />
                NVIDIA NIM Parsed
              </span>
            )}
          </div>

          {/* Key Metrics Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2 border-y border-hairline/60">
            <div>
              <span className="text-[11px] text-muted block uppercase font-mono">Total Accrued Penalty</span>
              <span className="font-mono text-2xl font-bold text-ink">
                ₹{penaltyData.totalAccrued ? penaltyData.totalAccrued.toLocaleString('en-IN') : '0'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-muted block uppercase font-mono">Daily Accrual Rate</span>
              <span className="font-mono text-xl font-bold text-ink">
                {penaltyData.dailyPenaltyRate > 0 ? `₹${penaltyData.dailyPenaltyRate}/day` : 'Fixed / Statutory Fee'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-muted block uppercase font-mono">Next Escalation Tier</span>
              <span className="font-mono text-sm font-bold text-overdue">
                {penaltyData.nextEscalationDays > 0 
                  ? `In ${penaltyData.nextEscalationDays} Days` 
                  : 'Escalation Active'}
              </span>
            </div>
          </div>

          {/* Plain-English Breakdown Callout (The Pitch Line!) */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-ink uppercase tracking-wider block font-mono">
              Statutory Risk Summary:
            </span>
            <p className="font-mono text-xs text-ink font-medium leading-relaxed bg-surface p-2.5 rounded-sm border border-hairline">
              "{penaltyData.plainEnglishSummary}"
            </p>
          </div>

          {penaltyData.escalationType && (
            <p className="text-[11px] text-muted italic">
              <strong>Statutory Consequence:</strong> {penaltyData.escalationType}
            </p>
          )}
        </div>
      )}

      {/* NVIDIA NIM Live Statute Parsing Section */}
      <div className="ledger-card p-3.5 bg-paper-warm space-y-2.5 border border-hairline">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber" />
            <span className="text-xs font-semibold text-ink">NVIDIA NIM Live Statute Parser</span>
          </div>
          <span className="text-[10px] font-mono text-muted">Model: meta/llama-3.1-70b-instruct</span>
        </div>

        <p className="text-xs text-muted">
          Paste any raw statute penalty text below to test AI extraction:
        </p>

        <textarea
          rows={2}
          value={customStatuteText}
          onChange={(e) => setCustomStatuteText(e.target.value)}
          placeholder="Paste statutory clause e.g. 'Late fee under Section 47 shall be ₹50 per day subject to maximum ₹5,000...'"
          className="ledger-input text-xs font-mono"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => calculatePenalty(customStatuteText)}
            disabled={isAiLoading}
            className="btn-accent text-xs cursor-pointer"
          >
            {isAiLoading ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Parsing with NIM AI...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Analyze Statute with AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Footer: WhatsApp Trigger Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-hairline">
        <div className="flex items-center gap-2 text-xs text-muted">
          <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>WhatsApp Reminders set to send at 30 / 15 / 7 / 1 days</span>
        </div>

        <button
          onClick={handleTriggerWhatsApp}
          className={`btn-secondary text-xs cursor-pointer flex items-center gap-1.5 ${
            reminderSent ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : ''
          }`}
        >
          {reminderSent ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Reminder Sent to Feed & WhatsApp!</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Trigger Test WhatsApp Reminder</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
