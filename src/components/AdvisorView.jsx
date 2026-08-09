import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  ShieldAlert, 
  FileText, 
  ChevronRight,
  ArrowRight,
  Info,
  Award
} from 'lucide-react';
import { SUITABILITY_PROFILES_PRESETS } from '../data/mockData';

export default function AdvisorView() {
  const [sector, setSector] = useState('IT Services / SaaS');
  const [turnover, setTurnover] = useState('₹40L - ₹5Cr');
  const [employees, setEmployees] = useState('10 - 20');
  const [founders, setFounders] = useState('2');
  const [fdi, setFdi] = useState(false);
  const [activeRecommendation, setActiveRecommendation] = useState(SUITABILITY_PROFILES_PRESETS[0].recommendation);

  const handleEvaluate = (e) => {
    e.preventDefault();
    // Re-evaluate suitability based on inputs
    if (sector === 'Legal & Consulting Services' || turnover === '< ₹20L') {
      setActiveRecommendation(SUITABILITY_PROFILES_PRESETS[1].recommendation);
    } else {
      setActiveRecommendation(SUITABILITY_PROFILES_PRESETS[0].recommendation);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Entity Registration & Suitability Advisor</h2>
            <p className="text-xs text-slate-400">
              Deterministic Legal Reasoning Engine matching business activity to statutory structures & compliance lifecycles.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Guided Intake Form (4 cols) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Business Profile Intake</h3>
          </div>

          <form onSubmit={handleEvaluate} className="space-y-4 text-xs">
            
            {/* Sector */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Operating Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="IT Services / SaaS">IT Services / SaaS</option>
                <option value="Healthcare & Clinics">Healthcare & Clinics</option>
                <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                <option value="Legal & Consulting Services">Legal & Consulting Services</option>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
              </select>
            </div>

            {/* Turnover */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Projected Annual Turnover</label>
              <select
                value={turnover}
                onChange={(e) => setTurnover(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="< ₹20L">&lt; ₹20 Lakhs (Below GST Threshold)</option>
                <option value="₹20L - ₹40L">₹20 Lakhs - ₹40 Lakhs</option>
                <option value="₹40L - ₹5Cr">₹40 Lakhs - ₹5 Crores (Audit Band)</option>
                <option value="> ₹5Cr">&gt; ₹5 Crores (Large Corporate)</option>
              </select>
            </div>

            {/* Employees */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Team Size (Employees)</label>
              <select
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="1 - 5">1 - 5 Employees</option>
                <option value="6 - 10">6 - 10 (POSH & ESIC Threshold)</option>
                <option value="10 - 20">10 - 20 Employees</option>
                <option value="20+">20+ Employees (EPF Mandatory)</option>
              </select>
            </div>

            {/* Founders */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Founders / Directors Count</label>
              <select
                value={founders}
                onChange={(e) => setFounders(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="1">1 Person (Sole Proprietorship / OPC)</option>
                <option value="2">2 Founders (Standard Pvt Ltd / LLP)</option>
                <option value="3+">3+ Partners / Board Members</option>
              </select>
            </div>

            {/* Foreign Investment */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-slate-200 font-medium block text-xs">Foreign Investment (FDI)</span>
                <span className="text-[10px] text-slate-400 block">Requires FEMA & RBI FLA filings</span>
              </div>
              <input
                type="checkbox"
                checked={fdi}
                onChange={(e) => setFdi(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <span>Run AI Suitability Matcher</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* AI Recommendation Output (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Recommendation Box */}
          <div className="glass-panel rounded-2xl p-6 border border-emerald-500/40 glow-emerald space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="text-xs text-slate-400 uppercase font-bold">Recommended Legal Structure</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                {activeRecommendation.confidenceScore} Match Confidence
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                {activeRecommendation.bestMatch}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeRecommendation.rationale}
              </p>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Pros */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Advantages
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {activeRecommendation.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons / Considerations */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> Statutory Compliance Obligations
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {activeRecommendation.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          {/* Resulting Post-Incorporation Compliance Stack Lifecycle */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Resulting Post-Incorporation Compliance Stack & Lifecycles
                </h3>
              </div>
              <span className="text-[10px] text-cyan-300 font-mono">1yr, 2yr & Recurring Cycles</span>
            </div>

            <div className="relative border-l-2 border-indigo-500/40 ml-3 pl-6 space-y-6 text-xs">
              
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-950" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">1. GST Registration & PAN Allotment</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Within 30 Days of Threshold
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    State + Federal GST registration required under CGST Act Section 22 upon crossing ₹20L/₹40L threshold.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-950" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">2. Statutory Auditor Appointment (Form ADT-1)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      15 Days Post AGM (5-Yr Tenure)
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Mandatory appointment of First Auditor within 30 days of incorporation; Form ADT-1 filed for 5-year tenure.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-950" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">3. Annual Director KYC (Form DIR-3 KYC)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Annual Recurring (Sept 30)
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Every DIN holder must verify personal details & mobile OTP annually under MCA Rule 12A.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-950" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">4. Financial Statements (Form AOC-4) & Annual Return (Form MGT-7)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Annual Recurring (Oct - Nov)
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Annual filings of audited balance sheet and shareholder registers with ROC.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
