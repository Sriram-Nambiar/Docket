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
  Filter,
  MessageCircle,
  ShieldAlert,
  Send,
  BellRing
} from 'lucide-react';
import PenaltyCalculatorPanel from './PenaltyCalculatorPanel';
import { taskStore } from '../lib/taskStore';
import { PENALTY_RULES_MAP } from '../lib/mockData';

export default function ChecklistEngineWorkbook() {
  const [activeTab, setActiveTab] = useState('live_checklist');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedPenaltyItem, setSelectedPenaltyItem] = useState(null);
  const [whatsappActiveMap, setWhatsappActiveMap] = useState({
    'INC-001': true,
    'GST-002': true,
    'ROC-004': true
  });

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

  const getDaysUntilDue = (dueDateStr) => {
    if (!dueDateStr) return 0;
    const today = new Date("2026-08-08");
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

  const handleCellChange = (id, field, value) => {
    setObligations(prev => prev.map(ob => {
      if (ob.id === id) {
        return { ...ob, [field]: value };
      }
      return ob;
    }));
  };

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

  const statusCounts = {
    "Not Started": computedObligations.filter(o => o.status === "Not Started"),
    "Evidence Uploaded - Unverified": computedObligations.filter(o => o.status === "Evidence Uploaded - Unverified"),
    "Filed & Verified": computedObligations.filter(o => o.status === "Filed & Verified"),
    "Overdue": computedObligations.filter(o => o.status === "Overdue")
  };

  const totalRiskSum = computedObligations.reduce((acc, curr) => acc + curr.riskScore, 0);
  const itemsNeedingAttention = computedObligations.filter(o => o.riskScore > 10);

  const categoriesList = ['Incorporation', 'GST', 'Income Tax', 'ROC', 'Labour'];
  const categoryRollup = categoriesList.map(cat => {
    const catItems = computedObligations.filter(o => o.category === cat);
    const openItems = catItems.filter(o => o.status !== "Filed & Verified").length;
    const totalRisk = catItems.reduce((acc, curr) => acc + curr.riskScore, 0);
    return { category: cat, openItems, totalRisk: Number(totalRisk.toFixed(1)) };
  });

  const toggleWhatsApp = (id, title, daysLeft) => {
    const isNowActive = !whatsappActiveMap[id];
    setWhatsappActiveMap(prev => ({ ...prev, [id]: isNowActive }));
    
    if (isNowActive) {
      taskStore.logWhatsAppReminder(title, daysLeft, '₹50/day late fee');
    }
  };

  const getAccruedPenalty = (item) => {
    if (item.status === 'Filed & Verified') return 0;
    const rule = PENALTY_RULES_MAP[item.title] || PENALTY_RULES_MAP['GSTR-3B'];
    const daysLate = item.daysUntilDue < 0 ? Math.abs(item.daysUntilDue) : 0;
    if (daysLate === 0) return 0;
    const rate = rule ? (rule.dailyRate || 50) : 50;
    const total = daysLate * rate;
    return (rule && rule.maxCap && total > rule.maxCap) ? rule.maxCap : total;
  };

  return (
    <div className="space-y-6 leading-relaxed">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-sm bg-paper-warm text-ink">
              <CheckSquare className="w-5 h-5 text-amber" />
            </span>
            <div>
              <h1 className="text-xl font-serif font-extrabold text-ink tracking-tight">Checklist Engine — Regulatory Intelligence Platform</h1>
              <span className="text-sm text-muted font-medium">Official Companion Workbook (Section 22 Product Plan Engine)</span>
            </div>
          </div>
          <p className="text-sm text-muted mt-1">
            Compliance data goes in, and this engine tells you what's done, what's left, and what's at risk — with honest, checkable 4-state statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-sm bg-amber-light border border-hairline text-ink text-sm font-mono font-bold">
            Yellow Cells = Your Input • Grey = Formula
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-hairline bg-paper pb-2">
        <button
          onClick={() => setActiveTab('live_checklist')}
          className={`px-4 py-2 text-sm transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'live_checklist'
              ? 'border-b-2 border-amber text-amber font-semibold'
              : 'text-muted hover:text-ink'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Tab 1: Live Obligations Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 text-sm transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'border-b-2 border-amber text-amber font-semibold'
              : 'text-muted hover:text-ink'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Tab 2: Roll-Up Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('status_definitions')}
          className={`px-4 py-2 text-sm transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'status_definitions'
              ? 'border-b-2 border-amber text-amber font-semibold'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Tab 3: Status Definitions</span>
        </button>

        <button
          onClick={() => setActiveTab('risk_scoring_formula')}
          className={`px-4 py-2 text-sm transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'risk_scoring_formula'
              ? 'border-b-2 border-amber text-amber font-semibold'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Tab 4: Risk Scoring Formula</span>
        </button>
      </div>

      {/* TAB 1: LIVE CHECKLIST TRACKER */}
      {activeTab === 'live_checklist' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface p-4 rounded-sm border border-hairline">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search obligation, ID, or citation..."
                  className="w-full pl-9 pr-3 py-1.5 border border-hairline rounded-sm text-sm bg-surface text-ink focus:border-amber focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {['All', 'Incorporation', 'GST', 'Income Tax', 'ROC', 'Labour'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-sm border text-sm font-semibold transition-all ${
                      categoryFilter === cat 
                        ? 'bg-amber-light border-amber text-amber' 
                        : 'border-hairline text-muted hover:border-amber hover:text-ink'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-muted">
              <button
                onClick={() => setSelectedPenaltyItem({ title: 'GSTR-3B', dueDate: '2026-08-20', authority: 'CBIC / GSTN', citation: 'CGST Act 2017 Sec 47' })}
                className="btn-accent px-3 py-1.5 rounded-sm text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Open Risk & Penalty Panel</span>
              </button>
              <span>Showing {filteredObligations.length} of {obligations.length} Obligations</span>
            </div>
          </div>

          {/* Interactive Checklist Table */}
          <div className="ledger-card overflow-hidden border border-hairline">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-sm font-sans border-collapse">
                <thead className="sticky top-0 bg-paper-warm border-b-2 border-hairline text-ink font-semibold font-mono text-xs uppercase tracking-wider z-10">
                  <tr>
                    <th className="p-3 border-b-2 border-hairline">ID</th>
                    <th className="p-3 border-b-2 border-hairline">Title & Category</th>
                    <th className="p-3 border-b-2 border-hairline">Authority / Freq</th>
                    <th className="p-3 border-b-2 border-hairline">Evidence Required</th>
                    <th className="p-3 border-b-2 border-hairline border-x text-center">
                      Evidence Uploaded (Y/N)
                    </th>
                    <th className="p-3 border-b-2 border-hairline border-r text-center">
                      SME Verified (Y/N)
                    </th>
                    <th className="p-3 border-b-2 border-hairline border-r">
                      Next Due Date
                    </th>
                    <th className="p-3 border-b-2 border-hairline border-r text-center">
                      WhatsApp Alert
                    </th>
                    <th className="p-3 border-b-2 border-hairline">Days Due</th>
                    <th className="p-3 border-b-2 border-hairline border-x text-center">
                      Penalty Sev (1-5)
                    </th>
                    <th className="p-3 border-b-2 border-hairline">Honest Status</th>
                    <th className="p-3 border-b-2 border-hairline">Accrued Penalty</th>
                    <th className="p-3 border-b-2 border-hairline">Risk Score</th>
                    <th className="p-3 border-b-2 border-hairline border-l">
                      Last Verified
                    </th>
                    <th className="p-3 border-b-2 border-hairline">Citation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-light">
                  {filteredObligations.map(item => {
                    const isHighRisk = item.riskScore > 10;
                    const isWhatsAppActive = !!whatsappActiveMap[item.id];
                    const accruedPenalty = getAccruedPenalty(item);
                    
                    const statusClass = item.status === 'Filed & Verified' ? 'status-verified' :
                                        item.status === 'Evidence Uploaded - Unverified' ? 'status-uploaded' :
                                        item.status === 'Overdue' ? 'status-overdue' : 'status-not-started';

                    return (
                      <tr 
                        key={item.id}
                        className={`even:bg-paper-warm hover:bg-paper transition-colors ${
                          isHighRisk ? 'bg-overdue-light' : ''
                        }`}
                      >
                        <td className="p-3 font-mono font-semibold text-ink">{item.id}</td>
                        <td className="p-3 font-semibold text-ink">
                          <div>{item.title}</div>
                          <span className="text-sm text-muted font-normal">{item.category} • {item.applicability}</span>
                        </td>
                        <td className="p-3 text-ink-light font-medium">
                          <div>{item.authority}</div>
                          <span className="text-sm text-muted font-normal">{item.frequency}</span>
                        </td>
                        <td className="p-3 text-muted text-sm">{item.evidenceRequired}</td>

                        {/* Yellow Editable Input Cell: Evidence Uploaded */}
                        <td className="p-2 bg-amber-light border border-hairline focus-within:border-amber text-center">
                          <button
                            onClick={() => handleCellChange(item.id, 'evidenceUploaded', !item.evidenceUploaded)}
                            className={`px-2.5 py-1 rounded text-sm font-mono font-semibold cursor-pointer transition-all border-none focus:outline-none ${
                              item.evidenceUploaded ? 'bg-amber text-white' : 'bg-transparent text-ink hover:text-amber'
                            }`}
                          >
                            {item.evidenceUploaded ? 'Y' : 'N'}
                          </button>
                        </td>

                        {/* Yellow Editable Input Cell: SME Verified */}
                        <td className="p-2 bg-amber-light border border-hairline focus-within:border-amber text-center">
                          <button
                            onClick={() => handleCellChange(item.id, 'smeVerified', !item.smeVerified)}
                            className={`px-2.5 py-1 rounded text-sm font-mono font-semibold cursor-pointer transition-all border-none focus:outline-none ${
                              item.smeVerified ? 'bg-amber text-white' : 'bg-transparent text-ink hover:text-amber'
                            }`}
                          >
                            {item.smeVerified ? 'Y' : 'N'}
                          </button>
                        </td>

                        {/* Yellow Editable Input Cell: Next Due Date */}
                        <td className="p-2 bg-amber-light border border-hairline focus-within:border-amber">
                          <input
                            type="date"
                            value={item.nextDueDate}
                            onChange={(e) => handleCellChange(item.id, 'nextDueDate', e.target.value)}
                            className="w-full px-2 py-1 bg-transparent border-none text-ink text-sm font-mono focus:outline-none"
                          />
                        </td>

                        {/* WhatsApp Toggle Cell */}
                        <td className="p-2 bg-paper-warm border border-hairline text-center">
                          <button
                            onClick={() => toggleWhatsApp(item.id, item.title, item.daysUntilDue)}
                            title={isWhatsAppActive ? "WhatsApp Reminder Active — Click to Toggle" : "Click to Enable WhatsApp Reminder"}
                            className={`px-2 py-1 rounded-sm text-xs font-mono font-semibold cursor-pointer transition-all inline-flex items-center gap-1 border ${
                              isWhatsAppActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold'
                                : 'bg-surface text-muted border-hairline hover:border-amber hover:text-ink'
                            }`}
                          >
                            <MessageCircle className={`w-3.5 h-3.5 ${isWhatsAppActive ? 'text-emerald-600' : 'text-muted'}`} />
                            <span>{isWhatsAppActive ? 'ON' : 'OFF'}</span>
                          </button>
                        </td>

                        {/* Grey Formula Cell: Days Until Due */}
                        <td className="p-3 bg-paper-warm text-muted font-mono text-sm italic text-center font-semibold">
                          {item.daysUntilDue}
                        </td>

                        {/* Yellow Editable Input Cell: Penalty Severity */}
                        <td className="p-2 bg-amber-light border border-hairline focus-within:border-amber text-center">
                          <select
                            value={item.penaltySeverity}
                            onChange={(e) => handleCellChange(item.id, 'penaltySeverity', Number(e.target.value))}
                            className="w-full px-2 py-1 bg-transparent border-none text-ink text-sm font-mono focus:outline-none cursor-pointer"
                          >
                            <option value={1}>1 (Minor)</option>
                            <option value={2}>2 (Low)</option>
                            <option value={3}>3 (Moderate)</option>
                            <option value={4}>4 (High)</option>
                            <option value={5}>5 (Severe)</option>
                          </select>
                        </td>

                        {/* Grey Formula Cell: Honest Status */}
                        <td className="p-3 bg-paper-warm text-muted font-mono text-sm italic font-semibold">
                          <span className={`px-2 py-1 rounded-sm text-sm font-semibold block text-center ${statusClass}`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Accrued Rupee Penalty Cell */}
                        <td className="p-2 bg-paper-warm text-center font-mono">
                          <button
                            onClick={() => setSelectedPenaltyItem(item)}
                            title="Click to calculate exact statutory penalty & escalation timeline"
                            className={`px-2 py-1 rounded-sm text-xs font-bold font-mono transition-all cursor-pointer inline-flex items-center gap-1 ${
                              accruedPenalty > 0 
                                ? 'bg-overdue-light text-overdue border border-overdue hover:bg-overdue hover:text-white' 
                                : 'bg-surface text-muted border border-hairline hover:border-amber hover:text-ink'
                            }`}
                          >
                            <Calculator className="w-3 h-3" />
                            <span>{accruedPenalty > 0 ? `₹${accruedPenalty.toLocaleString('en-IN')}` : '₹0'}</span>
                          </button>
                        </td>

                        {/* Grey Formula Cell: Risk Score */}
                        <td className={`p-3 bg-paper-warm font-mono text-sm italic text-center font-bold ${
                          isHighRisk ? 'text-overdue bg-overdue-light' : 'text-muted'
                        }`}>
                          {item.riskScore}
                        </td>

                        {/* Yellow Editable Input Cell: Last Verified Date */}
                        <td className="p-2 bg-amber-light border border-hairline focus-within:border-amber">
                          <input
                            type="text"
                            value={item.lastVerifiedDate}
                            onChange={(e) => handleCellChange(item.id, 'lastVerifiedDate', e.target.value)}
                            placeholder="YYYY-MM-DD"
                            className="w-full px-2 py-1 bg-transparent border-none text-ink text-sm font-mono focus:outline-none"
                          />
                        </td>

                        <td className="p-3 text-muted font-mono text-sm">{item.citation}</td>
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
            <div className="ledger-card p-4 space-y-2 border border-hairline">
              <span className="text-sm font-semibold text-muted uppercase tracking-wider block">
                Total Regulatory Obligations
              </span>
              <div className="text-2xl font-serif font-semibold text-ink">
                {computedObligations.length}
              </div>
              <span className="text-sm text-muted block">Active monitored statutory rules</span>
            </div>

            <div className="ledger-card p-4 space-y-2 border border-hairline border-l-4 border-l-overdue">
              <span className="text-sm font-semibold uppercase text-overdue tracking-wider block flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Total Risk Score Exposure
              </span>
              <div className="text-2xl font-serif font-semibold text-overdue">
                {totalRiskSum.toFixed(1)}
              </div>
              <span className="text-sm text-overdue font-semibold block">Sum of Penalty × Urgency Factor</span>
            </div>

            <div className="ledger-card p-4 space-y-2 border border-hairline border-l-4 border-l-amber bg-amber-light">
              <span className="text-sm font-semibold uppercase text-amber tracking-wider block">
                Items Needing Attention Now (Risk &gt; 10)
              </span>
              <div className="text-2xl font-serif font-semibold text-ink">
                {itemsNeedingAttention.length}
              </div>
              <span className="text-sm text-ink-light font-semibold block">High severity or overdue obligations</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Status Roll-Up Table */}
            <div className="ledger-card p-4 space-y-4 border border-hairline">
              <h2 className="text-sm font-serif font-semibold text-ink uppercase tracking-wider">
                Compliance Status Roll-Up Overview
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-sans border-collapse">
                  <thead>
                    <tr className="border-b border-hairline-light text-muted font-semibold uppercase bg-paper-warm">
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Count</th>
                      <th className="p-3 text-right">Total Risk Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-light font-mono">
                    {Object.keys(statusCounts).map(st => {
                      const count = statusCounts[st].length;
                      const riskSum = statusCounts[st].reduce((acc, curr) => acc + curr.riskScore, 0);

                      return (
                        <tr key={st} className="even:bg-paper-warm hover:bg-paper">
                          <td className="p-3 font-sans font-semibold text-ink">{st}</td>
                          <td className="p-3 text-center font-semibold text-ink-light">{count}</td>
                          <td className="p-3 text-right font-semibold text-ink">{riskSum.toFixed(1)}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-paper text-ink font-semibold">
                      <td className="p-3 font-sans">TOTAL</td>
                      <td className="p-3 text-center">{computedObligations.length}</td>
                      <td className="p-3 text-right text-verified font-mono">{totalRiskSum.toFixed(1)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Roll-Up Table */}
            <div className="ledger-card p-4 space-y-4 border border-hairline">
              <h2 className="text-sm font-serif font-semibold text-ink uppercase tracking-wider">
                Risk Exposure by Statutory Category
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-sans border-collapse">
                  <thead>
                    <tr className="border-b border-hairline-light text-muted font-semibold uppercase bg-paper-warm">
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Open Items</th>
                      <th className="p-3 text-right">Total Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-light font-mono">
                    {categoryRollup.map(cat => (
                      <tr key={cat.category} className="even:bg-paper-warm hover:bg-paper">
                        <td className="p-3 font-sans font-semibold text-ink">{cat.category}</td>
                        <td className="p-3 text-center font-semibold text-ink-light">{cat.openItems}</td>
                        <td className="p-3 text-right font-semibold text-ink">{cat.totalRisk.toFixed(1)}</td>
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
          <div className="ledger-card p-4 space-y-4 border border-hairline">
            <h2 className="text-sm font-serif font-semibold text-ink uppercase tracking-wider">
              The Four Honest Status States (Section 22 Product Plan)
            </h2>
            <p className="text-sm text-muted">
              This engine deliberately does not use a single green checkmark. "A document was uploaded" is not the same claim as "this obligation is actually satisfied". Collapsing the two is the single highest-liability mistake a compliance tool can make.
            </p>

            <div className="space-y-3 pt-2">
              
              <div className="p-4 rounded-sm bg-paper border border-hairline space-y-1">
                <div className="flex items-center justify-between font-semibold text-sm text-ink">
                  <span>⚪ 1. Not Started</span>
                  <span className="px-2 py-0.5 rounded-sm status-not-started text-sm">Compliant: NO</span>
                </div>
                <p className="text-sm text-muted">
                  No evidence has been uploaded, and the due date has not passed yet.
                </p>
              </div>

              <div className="p-4 rounded-sm bg-amber-light border border-hairline space-y-1">
                <div className="flex items-center justify-between font-semibold text-sm text-ink">
                  <span>🟡 2. Evidence Uploaded — Unverified</span>
                  <span className="px-2 py-0.5 rounded-sm status-uploaded text-sm">Compliant: NO (Incomplete for Legal)</span>
                </div>
                <p className="text-sm text-ink-light">
                  A document has been uploaded, but has not been checked (by an SME or a deterministic rule match) against the actual statutory requirement. Treat this as 'not done yet' for any legal purpose.
                </p>
              </div>

              <div className="p-4 rounded-sm bg-verified-light border border-hairline space-y-1">
                <div className="flex items-center justify-between font-semibold text-sm text-ink">
                  <span>🟢 3. Filed & Verified</span>
                  <span className="px-2 py-0.5 rounded-sm status-verified text-sm text-white">Compliant: YES</span>
                </div>
                <p className="text-sm text-ink-light">
                  Evidence is on file AND has been checked against the approved rule (by an SME or a deterministic rule match). This is the only state safe to present to an end user as "complete".
                </p>
              </div>

              <div className="p-4 rounded-sm bg-overdue-light border border-hairline space-y-1">
                <div className="flex items-center justify-between font-semibold text-sm text-ink">
                  <span>🔴 4. Overdue</span>
                  <span className="px-2 py-0.5 rounded-sm status-overdue text-sm text-white">Compliant: NO (Highest Urgency)</span>
                </div>
                <p className="text-sm text-ink-light">
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
          <div className="ledger-card p-4 space-y-5 border border-hairline">
            <div>
              <h2 className="text-sm font-serif font-semibold text-ink uppercase tracking-wider">
                Risk Score Calculation Formula
              </h2>
              <div className="mt-2 p-4 rounded-sm bg-paper-warm border border-hairline text-ink font-mono text-sm font-semibold">
                Risk Score = IF(Status = "Filed & Verified", 0, Penalty Severity × Urgency Factor)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Urgency Factor Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-serif font-semibold text-ink uppercase tracking-wider">
                  Urgency Factor Lookup Table
                </h3>
                <table className="w-full text-left text-sm font-sans border border-hairline rounded-sm overflow-hidden border-collapse">
                  <thead className="bg-paper-warm font-semibold uppercase border-b border-hairline">
                    <tr>
                      <th className="p-2.5">Condition</th>
                      <th className="p-2.5 text-right">Urgency Factor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-light font-mono">
                    <tr><td className="p-2.5 font-sans font-semibold text-overdue">Status = Overdue</td><td className="p-2.5 text-right font-semibold">3.0</td></tr>
                    <tr><td className="p-2.5 font-sans">Days Until Due ≤ 30</td><td className="p-2.5 text-right font-semibold">2.0</td></tr>
                    <tr><td className="p-2.5 font-sans">Days Until Due ≤ 90</td><td className="p-2.5 text-right font-semibold">1.5</td></tr>
                    <tr><td className="p-2.5 font-sans">Days Until Due &gt; 90</td><td className="p-2.5 text-right font-semibold">1.0</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Penalty Severity Scale */}
              <div className="space-y-3">
                <h3 className="text-sm font-serif font-semibold text-ink uppercase tracking-wider">
                  Penalty Severity Scale (1 to 5)
                </h3>
                <div className="space-y-1.5 text-sm font-mono">
                  <div className="p-2 rounded-sm bg-paper border border-hairline text-ink"><strong>1 Minor</strong> — small fixed fee, no operational impact</div>
                  <div className="p-2 rounded-sm bg-paper border border-hairline text-ink"><strong>2 Low</strong> — modest fine</div>
                  <div className="p-2 rounded-sm bg-paper border border-hairline text-ink"><strong>3 Moderate</strong> — meaningful fine or interest accrual</div>
                  <div className="p-2 rounded-sm bg-amber-light border border-amber text-ink"><strong>4 High</strong> — large fine, or registration/license at risk</div>
                  <div className="p-2 rounded-sm bg-overdue-light border border-overdue text-overdue"><strong>5 Severe</strong> — prosecution risk, registration cancellation, or director liability</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Penalty Calculator Modal Overlay */}
      {selectedPenaltyItem && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <PenaltyCalculatorPanel
            initialFilingType={selectedPenaltyItem.title || 'Form 26Q'}
            initialDueDate={selectedPenaltyItem.nextDueDate || '2026-06-15'}
            initialAuthority={selectedPenaltyItem.authority || 'Income Tax Department'}
            initialCitation={selectedPenaltyItem.citation || 'Income Tax Act Sec 234E'}
            initialSeverity={selectedPenaltyItem.penaltySeverity || 4}
            onClose={() => setSelectedPenaltyItem(null)}
            isModal={true}
          />
        </div>
      )}

    </div>
  );
}
