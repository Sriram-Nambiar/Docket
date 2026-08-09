"use client";

import React, { useState } from 'react';
import { 
  CheckSquare, 
  LayoutDashboard, 
  Info, 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Building2, 
  ShieldCheck, 
  HelpCircle,
  FileCheck,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

export default function ChecklistEngineWorkbook() {
  const [activeTab, setActiveTab] = useState('live_checklist');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Pre-loaded working dataset from the workbook plan
  const [obligations, setObligations] = useState([
    {
      id: "INC-001",
      title: "Certificate of Incorporation",
      category: "Incorporation",
      authority: "MCA",
      frequency: "One-time",
      applicability: "All Pvt Ltd companies",
      evidenceRequired: "Certificate of Incorporation (COI)",
      evidenceUploaded: true,
      smeVerified: true,
      nextDueDate: "2025-07-04",
      penaltySeverity: 5,
      lastVerifiedDate: "2025-07-09",
      citation: "Companies Act 2013, Sec 7"
    },
    {
      id: "INC-002",
      title: "PAN & TAN Allotment",
      category: "Incorporation",
      authority: "CBDT",
      frequency: "One-time",
      applicability: "All companies",
      evidenceRequired: "PAN card, TAN letter",
      evidenceUploaded: true,
      smeVerified: true,
      nextDueDate: "2025-07-09",
      penaltySeverity: 4,
      lastVerifiedDate: "2025-07-14",
      citation: "Income Tax Act, Sec 139A/203A"
    },
    {
      id: "GST-001",
      title: "GST Registration",
      category: "GST",
      authority: "GSTN / CBIC",
      frequency: "One-time",
      applicability: "Turnover > Rs 40 lakh",
      evidenceRequired: "GSTIN certificate",
      evidenceUploaded: true,
      smeVerified: true,
      nextDueDate: "2025-07-24",
      penaltySeverity: 4,
      lastVerifiedDate: "2025-07-29",
      citation: "CGST Act 2017, Sec 22"
    },
    {
      id: "GST-002",
      title: "GSTR-3B — Monthly Return",
      category: "GST",
      authority: "GSTN",
      frequency: "Monthly",
      applicability: "All GST-registered entities",
      evidenceRequired: "Filed GSTR-3B acknowledgement",
      evidenceUploaded: true,
      smeVerified: false,
      nextDueDate: "2026-08-05",
      penaltySeverity: 3,
      lastVerifiedDate: "",
      citation: "CGST Act 2017, Sec 39"
    },
    {
      id: "GST-003",
      title: "GSTR-1 — Monthly Return",
      category: "GST",
      authority: "GSTN",
      frequency: "Monthly",
      applicability: "All GST-registered entities",
      evidenceRequired: "Filed GSTR-1 acknowledgement",
      evidenceUploaded: false,
      smeVerified: false,
      nextDueDate: "2026-08-14",
      penaltySeverity: 3,
      lastVerifiedDate: "",
      citation: "CGST Act 2017, Sec 37"
    },
    {
      id: "GST-004",
      title: "GSTR-9 — Annual Return",
      category: "GST",
      authority: "GSTN",
      frequency: "Annual",
      applicability: "Turnover > Rs 2 crore",
      evidenceRequired: "Filed GSTR-9 acknowledgement",
      evidenceUploaded: false,
      smeVerified: false,
      nextDueDate: "2026-10-17",
      penaltySeverity: 3,
      lastVerifiedDate: "",
      citation: "CGST Act 2017, Sec 44"
    },
    {
      id: "IT-001",
      title: "Income Tax Return (ITR-6)",
      category: "Income Tax",
      authority: "CBDT",
      frequency: "Annual",
      applicability: "All companies",
      evidenceRequired: "Filed ITR-6 acknowledgement",
      evidenceUploaded: false,
      smeVerified: false,
      nextDueDate: "2026-09-22",
      penaltySeverity: 5,
      lastVerifiedDate: "",
      citation: "Income Tax Act, Sec 139"
    },
    {
      id: "IT-002",
      title: "TDS Return — Form 26Q",
      category: "Income Tax",
      authority: "CBDT",
      frequency: "Quarterly",
      applicability: "Entities deducting TDS",
      evidenceRequired: "Filed Form 26Q acknowledgement",
      evidenceUploaded: true,
      smeVerified: false,
      nextDueDate: "2026-07-29",
      penaltySeverity: 3,
      lastVerifiedDate: "",
      citation: "Income Tax Act, Sec 200(3)"
    },
    {
      id: "IT-003",
      title: "Advance Tax Payment",
      category: "Income Tax",
      authority: "CBDT",
      frequency: "Quarterly",
      applicability: "Estimated tax liability > Rs 10,000",
      evidenceRequired: "Challan / payment receipt",
      evidenceUploaded: false,
      smeVerified: false,
      nextDueDate: "2026-08-28",
      penaltySeverity: 4,
      lastVerifiedDate: "",
      citation: "Income Tax Act, Sec 208"
    },
    {
      id: "ROC-001",
      title: "Annual Financial Statements (AOC-4)",
      category: "ROC",
      authority: "MCA",
      frequency: "Annual",
      applicability: "All companies",
      evidenceRequired: "Filed AOC-4 acknowledgement",
      evidenceUploaded: false,
      smeVerified: false,
      nextDueDate: "2026-09-02",
      penaltySeverity: 4,
      lastVerifiedDate: "",
      citation: "Companies Act 2013, Sec 137"
    },
    {
      id: "ROC-002",
      title: "Annual Return (MGT-7)",
      category: "ROC",
      authority: "MCA",
      frequency: "Annual",
      applicability: "All companies",
      evidenceRequired: "Filed MGT-7 acknowledgement",
      evidenceUploaded: false,
      smeVerified: false,
      nextDueDate: "2026-09-02",
      penaltySeverity: 4,
      lastVerifiedDate: "",
      citation: "Companies Act 2013, Sec 92"
    },
    {
      id: "ROC-003",
      title: "Statutory Audit Report",
      category: "ROC",
      authority: "ICAI / MCA",
      frequency: "Annual",
      applicability: "All companies",
      evidenceRequired: "Signed audit report",
      evidenceUploaded: true,
      smeVerified: true,
      nextDueDate: "2026-09-02",
      penaltySeverity: 5,
      lastVerifiedDate: "2026-08-03",
      citation: "Companies Act 2013, Sec 139"
    },
    {
      id: "ROC-004",
      title: "Director KYC (DIR-3 KYC)",
      category: "ROC",
      authority: "MCA",
      frequency: "Annual",
      applicability: "All directors with DIN",
      evidenceRequired: "Filed DIR-3 KYC acknowledgement",
      evidenceUploaded: false,
      smeVerified: false,
      nextDueDate: "2026-07-24",
      penaltySeverity: 2,
      lastVerifiedDate: "",
      citation: "Companies Act 2013, Rule 12A"
    },
    {
      id: "LAB-001",
      title: "Professional Tax Registration & Returns",
      category: "Labour",
      authority: "State Govt (KA)",
      frequency: "Annual",
      applicability: "All employers in Karnataka",
      evidenceRequired: "PT registration certificate + return",
      evidenceUploaded: true,
      smeVerified: false,
      nextDueDate: "2026-09-27",
      penaltySeverity: 2,
      lastVerifiedDate: "",
      citation: "Karnataka Tax on Professions Act"
    },
    {
      id: "LAB-002",
      title: "Shops & Establishment Registration",
      category: "Labour",
      authority: "State Govt (KA)",
      frequency: "One-time",
      applicability: "All commercial establishments",
      evidenceRequired: "S&E registration certificate",
      evidenceUploaded: true,
      smeVerified: true,
      nextDueDate: "2025-07-14",
      penaltySeverity: 2,
      lastVerifiedDate: "2025-07-19",
      citation: "Karnataka Shops & Commercial Establishments Act"
    },
    {
      id: "LAB-003",
      title: "EPF/ESI Registration & Monthly Return",
      category: "Labour",
      authority: "EPFO / ESIC",
      frequency: "Monthly",
      applicability: "Employee count > 20 (EPF) / > 10 (ESI)",
      evidenceRequired: "EPF/ESI challan + return",
      evidenceUploaded: false,
      smeVerified: false,
      nextDueDate: "2026-08-20",
      penaltySeverity: 3,
      lastVerifiedDate: "",
      citation: "EPF Act 1952 / ESI Act 1948"
    }
  ]);

  // Helper functions to compute formula columns
  const getDaysUntilDue = (dueDateStr) => {
    if (!dueDateStr) return 0;
    const today = new Date("2026-08-08"); // Current platform baseline date
    const due = new Date(dueDateStr);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatus = (item) => {
    const days = getDaysUntilDue(item.nextDueDate);
    
    if (item.evidenceUploaded && item.smeVerified) {
      return "Filed & Verified";
    }
    if (!item.smeVerified && days < 0) {
      return "Overdue";
    }
    if (item.evidenceUploaded && !item.smeVerified) {
      return "Evidence Uploaded - Unverified";
    }
    return "Not Started";
  };

  const getUrgencyFactor = (status, days) => {
    if (status === "Overdue") return 3.0;
    if (days <= 30) return 2.0;
    if (days <= 90) return 1.5;
    return 1.0;
  };

  const getRiskScore = (item) => {
    const status = getStatus(item);
    if (status === "Filed & Verified") return 0;

    const days = getDaysUntilDue(item.nextDueDate);
    const urgency = getUrgencyFactor(status, days);
    return Number((item.penaltySeverity * urgency).toFixed(1));
  };

  // State handlers for yellow editable cells
  const handleCellChange = (id, field, value) => {
    setObligations(prev => prev.map(ob => {
      if (ob.id === id) {
        return { ...ob, [field]: value };
      }
      return ob;
    }));
  };

  // Roll-up statistics for Dashboard Tab
  const computedObligations = obligations.map(ob => ({
    ...ob,
    daysUntilDue: getDaysUntilDue(ob.nextDueDate),
    status: getStatus(ob),
    riskScore: getRiskScore(ob)
  }));

  const filteredObligations = computedObligations.filter(ob => {
    const matchesCategory = categoryFilter === 'All' || ob.category === categoryFilter;
    const matchesSearch = ob.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ob.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ob.citation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Roll-up Status Summary
  const statusCounts = {
    "Not Started": computedObligations.filter(o => o.status === "Not Started"),
    "Evidence Uploaded - Unverified": computedObligations.filter(o => o.status === "Evidence Uploaded - Unverified"),
    "Filed & Verified": computedObligations.filter(o => o.status === "Filed & Verified"),
    "Overdue": computedObligations.filter(o => o.status === "Overdue")
  };

  const totalRiskSum = computedObligations.reduce((acc, curr) => acc + curr.riskScore, 0);
  const itemsNeedingAttention = computedObligations.filter(o => o.riskScore > 10);

  // Roll-up Risk by Category
  const categoriesList = ['Incorporation', 'GST', 'Income Tax', 'ROC', 'Labour'];
  const categoryRollup = categoriesList.map(cat => {
    const catItems = computedObligations.filter(o => o.category === cat);
    const openItems = catItems.filter(o => o.status !== "Filed & Verified").length;
    const totalRisk = catItems.reduce((acc, curr) => acc + curr.riskScore, 0);
    return { category: cat, openItems, totalRisk: Number(totalRisk.toFixed(1)) };
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-900 text-white">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Checklist Engine — Regulatory Intelligence Platform</h1>
              <span className="text-xs text-slate-500 font-medium">Official Companion Workbook (Section 22 Product Plan Engine)</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Compliance data goes in, and this engine tells you what&apos;s done, what&apos;s left, and what&apos;s at risk — with honest, checkable 4-state statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold">
            Yellow Cells = Your Input • Grey = Formula
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('live_checklist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'live_checklist'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <span>Tab 1: Live Obligations Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
          <span>Tab 2: Roll-Up Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('status_definitions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'status_definitions'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Info className="w-4 h-4 text-amber-400" />
          <span>Tab 3: Status Definitions</span>
        </button>

        <button
          onClick={() => setActiveTab('risk_scoring_formula')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'risk_scoring_formula'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4 text-cyan-400" />
          <span>Tab 4: Risk Scoring Formula</span>
        </button>
      </div>

      {/* TAB 1: LIVE CHECKLIST TRACKER */}
      {activeTab === 'live_checklist' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search obligation, ID, or citation..."
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold"
              >
                <option value="All">All Categories</option>
                <option value="Incorporation">Incorporation</option>
                <option value="GST">GST</option>
                <option value="Income Tax">Income Tax</option>
                <option value="ROC">ROC</option>
                <option value="Labour">Labour</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Showing {filteredObligations.length} of {obligations.length} Obligations</span>
            </div>
          </div>

          {/* Interactive Checklist Table */}
          <div className="enterprise-card overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead className="sticky top-0 bg-slate-900 text-white font-mono text-[11px] z-10 shadow-xs">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Title & Category</th>
                    <th className="p-3">Authority / Freq</th>
                    <th className="p-3">Evidence Required</th>
                    <th className="p-3 bg-amber-500/20 text-amber-200 border-x border-amber-500/30 text-center">
                      Evidence Uploaded (Y/N)
                    </th>
                    <th className="p-3 bg-amber-500/20 text-amber-200 border-r border-amber-500/30 text-center">
                      SME Verified (Y/N)
                    </th>
                    <th className="p-3 bg-amber-500/20 text-amber-200 border-r border-amber-500/30">
                      Next Due Date
                    </th>
                    <th className="p-3 bg-slate-800 text-slate-300">Days Due</th>
                    <th className="p-3 bg-amber-500/20 text-amber-200 border-x border-amber-500/30 text-center">
                      Penalty Sev (1-5)
                    </th>
                    <th className="p-3 bg-slate-800 text-slate-300">Honest Status</th>
                    <th className="p-3 bg-slate-800 text-slate-300">Risk Score</th>
                    <th className="p-3 bg-amber-500/20 text-amber-200 border-l border-amber-500/30">
                      Last Verified
                    </th>
                    <th className="p-3">Citation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredObligations.map(item => {
                    const isHighRisk = item.riskScore > 10;

                    return (
                      <tr 
                        key={item.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isHighRisk ? 'bg-rose-50/50' : ''
                        }`}
                      >
                        <td className="p-3 font-mono font-bold text-slate-900">{item.id}</td>
                        <td className="p-3 font-bold text-slate-900">
                          <div>{item.title}</div>
                          <span className="text-[10px] text-slate-500 font-normal">{item.category} • {item.applicability}</span>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">
                          <div>{item.authority}</div>
                          <span className="text-[10px] text-slate-500 font-normal">{item.frequency}</span>
                        </td>
                        <td className="p-3 text-slate-600 text-[11px]">{item.evidenceRequired}</td>

                        {/* Yellow Editable Input Cell: Evidence Uploaded */}
                        <td className="p-2 bg-amber-50/80 border-x border-amber-100 text-center">
                          <button
                            onClick={() => handleCellChange(item.id, 'evidenceUploaded', !item.evidenceUploaded)}
                            className={`px-2.5 py-1 rounded text-xs font-mono font-bold cursor-pointer transition-all ${
                              item.evidenceUploaded ? 'bg-amber-400 text-amber-950 shadow-xs' : 'bg-amber-100/80 text-amber-700 hover:bg-amber-200'
                            }`}
                          >
                            {item.evidenceUploaded ? 'Y' : 'N'}
                          </button>
                        </td>

                        {/* Yellow Editable Input Cell: SME Verified */}
                        <td className="p-2 bg-amber-50/80 border-r border-amber-100 text-center">
                          <button
                            onClick={() => handleCellChange(item.id, 'smeVerified', !item.smeVerified)}
                            className={`px-2.5 py-1 rounded text-xs font-mono font-bold cursor-pointer transition-all ${
                              item.smeVerified ? 'bg-amber-400 text-amber-950 shadow-xs' : 'bg-amber-100/80 text-amber-700 hover:bg-amber-200'
                            }`}
                          >
                            {item.smeVerified ? 'Y' : 'N'}
                          </button>
                        </td>

                        {/* Yellow Editable Input Cell: Next Due Date */}
                        <td className="p-2 bg-amber-50/80 border-r border-amber-100">
                          <input
                            type="date"
                            value={item.nextDueDate}
                            onChange={(e) => handleCellChange(item.id, 'nextDueDate', e.target.value)}
                            className="w-full px-2 py-1 bg-amber-100/80 rounded font-mono text-[11px] font-bold text-slate-900 focus:bg-white"
                          />
                        </td>

                        {/* Grey Formula Cell: Days Until Due */}
                        <td className="p-3 bg-slate-100/80 font-mono text-center font-bold text-slate-700">
                          {item.daysUntilDue}
                        </td>

                        {/* Yellow Editable Input Cell: Penalty Severity */}
                        <td className="p-2 bg-amber-50/80 border-x border-amber-100 text-center">
                          <select
                            value={item.penaltySeverity}
                            onChange={(e) => handleCellChange(item.id, 'penaltySeverity', Number(e.target.value))}
                            className="px-2 py-1 bg-amber-100/80 rounded font-mono text-xs font-bold text-slate-900 focus:bg-white cursor-pointer"
                          >
                            <option value={1}>1 (Minor)</option>
                            <option value={2}>2 (Low)</option>
                            <option value={3}>3 (Moderate)</option>
                            <option value={4}>4 (High)</option>
                            <option value={5}>5 (Severe)</option>
                          </select>
                        </td>

                        {/* Grey Formula Cell: Honest Status */}
                        <td className="p-3 bg-slate-100/80 font-semibold text-[11px]">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold block text-center ${
                            item.status === 'Filed & Verified' ? 'bg-emerald-600 text-white' :
                            item.status === 'Evidence Uploaded - Unverified' ? 'bg-amber-500 text-white' :
                            item.status === 'Overdue' ? 'bg-rose-600 text-white' : 'bg-slate-300 text-slate-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Grey Formula Cell: Risk Score */}
                        <td className={`p-3 bg-slate-100/80 font-mono text-center font-extrabold ${
                          isHighRisk ? 'text-rose-700 text-sm bg-rose-100/80' : 'text-slate-800'
                        }`}>
                          {item.riskScore}
                        </td>

                        {/* Yellow Editable Input Cell: Last Verified Date */}
                        <td className="p-2 bg-amber-50/80 border-l border-amber-100">
                          <input
                            type="text"
                            value={item.lastVerifiedDate}
                            onChange={(e) => handleCellChange(item.id, 'lastVerifiedDate', e.target.value)}
                            placeholder="YYYY-MM-DD"
                            className="w-full px-2 py-1 bg-amber-100/80 rounded font-mono text-[11px] text-slate-900 focus:bg-white"
                          />
                        </td>

                        <td className="p-3 text-slate-500 font-mono text-[10px]">{item.citation}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLL-UP DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Top Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="enterprise-card p-5 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Total Regulatory Obligations
              </span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {computedObligations.length}
              </div>
              <span className="text-[11px] text-slate-500 block">Active monitored statutory rules</span>
            </div>

            <div className="enterprise-card p-5 space-y-2 border-l-4 border-l-rose-500">
              <span className="text-[10px] font-extrabold uppercase text-rose-500 tracking-wider block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Total Risk Score Exposure
              </span>
              <div className="text-2xl font-extrabold text-rose-700 font-mono">
                {totalRiskSum.toFixed(1)}
              </div>
              <span className="text-[11px] text-rose-600 font-semibold block">Sum of Penalty × Urgency Factor</span>
            </div>

            <div className="enterprise-card p-5 space-y-2 border-l-4 border-l-amber-500 bg-amber-50/40">
              <span className="text-[10px] font-extrabold uppercase text-amber-700 tracking-wider block">
                Items Needing Attention Now (Risk &gt; 10)
              </span>
              <div className="text-2xl font-extrabold text-amber-900 font-mono">
                {itemsNeedingAttention.length}
              </div>
              <span className="text-[11px] text-amber-800 font-semibold block">High severity or overdue obligations</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Status Roll-Up Table */}
            <div className="enterprise-card p-6 space-y-4">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Compliance Status Roll-Up Overview
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] bg-slate-50">
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Count</th>
                      <th className="p-3 text-right">Total Risk Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {Object.keys(statusCounts).map(st => {
                      const count = statusCounts[st].length;
                      const riskSum = statusCounts[st].reduce((acc, curr) => acc + curr.riskScore, 0);

                      return (
                        <tr key={st} className="hover:bg-slate-50/80">
                          <td className="p-3 font-sans font-bold text-slate-900">{st}</td>
                          <td className="p-3 text-center font-bold text-slate-800">{count}</td>
                          <td className="p-3 text-right font-bold text-slate-900">{riskSum.toFixed(1)}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-slate-900 text-white font-bold">
                      <td className="p-3 font-sans">TOTAL</td>
                      <td className="p-3 text-center">{computedObligations.length}</td>
                      <td className="p-3 text-right text-emerald-400 font-mono">{totalRiskSum.toFixed(1)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Roll-Up Table */}
            <div className="enterprise-card p-6 space-y-4">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Risk Exposure by Statutory Category
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] bg-slate-50">
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Open Items</th>
                      <th className="p-3 text-right">Total Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {categoryRollup.map(cat => (
                      <tr key={cat.category} className="hover:bg-slate-50/80">
                        <td className="p-3 font-sans font-bold text-slate-900">{cat.category}</td>
                        <td className="p-3 text-center font-bold text-slate-800">{cat.openItems}</td>
                        <td className="p-3 text-right font-bold text-slate-900">{cat.totalRisk.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: STATUS DEFINITIONS */}
      {activeTab === 'status_definitions' && (
        <div className="space-y-6">
          <div className="enterprise-card p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              The Four Honest Status States (Section 22 Product Plan)
            </h2>
            <p className="text-xs text-slate-600">
              This engine deliberately does not use a single green checkmark. &ldquo;A document was uploaded&rdquo; is not the same claim as &ldquo;this obligation is actually satisfied&rdquo;. Collapsing the two is the single highest-liability mistake a compliance tool can make.
            </p>

            <div className="space-y-3 pt-2">
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-xs text-slate-900">
                  <span>⚪ 1. Not Started</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px]">Compliant: NO</span>
                </div>
                <p className="text-xs text-slate-600">
                  No evidence has been uploaded, and the due date has not passed yet.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-xs text-amber-950">
                  <span>🟡 2. Evidence Uploaded — Unverified</span>
                  <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px]">Compliant: NO (Incomplete for Legal)</span>
                </div>
                <p className="text-xs text-amber-900">
                  A document has been uploaded, but has not been checked (by an SME or a deterministic rule match) against the actual statutory requirement. Treat this as &lsquo;not done yet&rsquo; for any legal purpose.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-xs text-emerald-950">
                  <span>🟢 3. Filed & Verified</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px]">Compliant: YES</span>
                </div>
                <p className="text-xs text-emerald-900">
                  Evidence is on file AND has been checked against the approved rule (by an SME or a deterministic rule match). This is the only state safe to present to an end user as &ldquo;complete&rdquo;.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-xs text-rose-950">
                  <span>🔴 4. Overdue</span>
                  <span className="px-2 py-0.5 rounded bg-rose-700 text-white text-[10px]">Compliant: NO (Highest Urgency)</span>
                </div>
                <p className="text-xs text-rose-900">
                  No verified evidence, and the due date has passed. Always carries the highest urgency multiplier (3.0×) in the Risk Score.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RISK SCORING FORMULA */}
      {activeTab === 'risk_scoring_formula' && (
        <div className="space-y-6">
          <div className="enterprise-card p-6 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Risk Score Calculation Formula
              </h2>
              <div className="mt-2 p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-sm font-bold">
                Risk Score = IF(Status = &ldquo;Filed & Verified&rdquo;, 0, Penalty Severity × Urgency Factor)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Urgency Factor Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Urgency Factor Lookup Table
                </h3>
                <table className="w-full text-left text-xs font-sans border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Condition</th>
                      <th className="p-2.5 text-right">Urgency Factor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr><td className="p-2.5 font-sans font-semibold text-rose-700">Status = Overdue</td><td className="p-2.5 text-right font-bold">3.0</td></tr>
                    <tr><td className="p-2.5 font-sans">Days Until Due ≤ 30</td><td className="p-2.5 text-right font-bold">2.0</td></tr>
                    <tr><td className="p-2.5 font-sans">Days Until Due ≤ 90</td><td className="p-2.5 text-right font-bold">1.5</td></tr>
                    <tr><td className="p-2.5 font-sans">Days Until Due &gt; 90</td><td className="p-2.5 text-right font-bold">1.0</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Penalty Severity Scale */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Penalty Severity Scale (1 to 5)
                </h3>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200"><strong>1 Minor</strong> — small fixed fee, no operational impact</div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200"><strong>2 Low</strong> — modest fine</div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200"><strong>3 Moderate</strong> — meaningful fine or interest accrual</div>
                  <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-950"><strong>4 High</strong> — large fine, or registration/license at risk</div>
                  <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-950"><strong>5 Severe</strong> — prosecution risk, registration cancellation, or director liability</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
