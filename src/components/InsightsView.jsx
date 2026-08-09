import React from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  DollarSign, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  KeyRound,
  FileCheck2
} from 'lucide-react';

export default function InsightsView() {
  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="glass-panel rounded-2xl p-6 border border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Risk, Gap, Cost & Security Scorecards</h2>
            <p className="text-xs text-slate-400">
              Enterprise-grade risk scorecards, statutory penalty heatmaps, and classification-level security models.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk & Penalty Heatmap (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Statutory Financial Penalty & Risk Exposure Heatmap
              </h3>
            </div>
            <span className="text-[10px] text-rose-300 font-mono">Immediate Remediation Queue</span>
          </div>

          <div className="space-y-3 text-xs">
            
            {/* Risk Item 1: High */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span className="font-bold text-white">Form DIR-3 KYC Director 2 (DIN 08765432)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px] uppercase border border-rose-500/30">
                  HIGH RISK (58 Days Left)
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Pending mobile OTP verification for Director 2. Failure to file by Sept 30 results in statutory deactivation of DIN and mandatory ₹5,000 penalty per director.
              </p>
              <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between text-[10px]">
                <span className="text-rose-300">Financial Exposure: ₹5,000 + Board Ineligibility</span>
                <span className="text-slate-400">Authority: MCA (Companies Act)</span>
              </div>
            </div>

            {/* Risk Item 2: Moderate */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">GSTR-3B Summary Filing (July 2026)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase border border-amber-500/30">
                  MODERATE RISK (Due Aug 20)
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                GSTR-3B tax payment draft prepared. Requires final approval from Compliance Head to execute bank deposit before deadline.
              </p>
              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[10px]">
                <span className="text-amber-300">Penalty Rate: ₹50/day late fee + 18% p.a. interest</span>
                <span className="text-slate-400">Authority: CBIC / GSTN</span>
              </div>
            </div>

            {/* Risk Item 3: Low / Satisfied */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">Form AOC-4 Financial Statements Filing</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-500/30">
                  ZERO RISK (Satisfied)
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Successfully filed for FY 2024-25. SRN Z98765432 verified against MCA portal. Next filing due Oct 2026.
              </p>
            </div>

          </div>
        </div>

        {/* Cost & Security Model (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Compliance Budget & Cost Optimization */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Compliance Budget & Cost Optimization
                </h3>
              </div>
              <span className="text-[10px] text-indigo-300 font-mono">FY 2026-27</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Annual Compliance Outlay</span>
                  <span className="text-xl font-extrabold text-white">₹1,45,000</span>
                </div>
                <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                <span className="text-emerald-400 font-bold block text-xs">₹45,000 Projected Penalty Savings</span>
                <p className="text-slate-300 text-[11px]">
                  Proactive AI monitoring prevents late fee accruals on AOC-4 (₹100/day uncapped) and GSTR-3B returns.
                </p>
              </div>
            </div>
          </div>

          {/* Security Clearance Model */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Role-Based Security & Clearance Levels
                </h3>
              </div>
              <span className="text-[10px] text-amber-300 font-mono">RBAC Entry Points</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">Compliance Head (X)</span>
                  <span className="text-[10px] text-slate-400">Full System & Clearance Level 4 (Restricted)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">ALL PERMISSIONS</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">Tax & HR Department Leads</span>
                  <span className="text-[10px] text-slate-400">Assigned Tasks & Clearance Level 2 (Confidential)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">DEPT BOUNDED</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">External Auditor</span>
                  <span className="text-[10px] text-slate-400">Read-only Access to Verified Evidence Repository</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">READ ONLY</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
