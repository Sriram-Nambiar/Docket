"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  Send, 
  Edit3, 
  Eye, 
  ShieldCheck,
  Building2,
  FileCheck
} from 'lucide-react';

export default function StatutoryFormDrafting() {
  const [selectedForm, setSelectedForm] = useState('AOC4');
  const [reviewStatus, setReviewStatus] = useState({
    AOC4: 'Pending Review',
    MGT7: 'Drafting In Progress',
    DIR3: 'Needs Correction',
    GSTR3B: 'Approved for Submission'
  });

  const formsList = [
    { id: 'AOC4', title: 'MCA Form AOC-4', category: 'Financials & Balance Sheet', authority: 'ROC / MCA', status: reviewStatus.AOC4 },
    { id: 'MGT7', title: 'MCA Form MGT-7', category: 'Annual Corporate Return', authority: 'ROC / MCA', status: reviewStatus.MGT7 },
    { id: 'DIR3', title: 'Form DIR-3 KYC', category: 'Director Annual Verification', authority: 'MCA', status: reviewStatus.DIR3 },
    { id: 'GSTR3B', title: 'GST Form GSTR-3B', category: 'Monthly Tax Return', authority: 'CBIC / GSTN', status: reviewStatus.GSTR3B },
  ];

  const formDataMock = {
    AOC4: {
      formName: "Form AOC-4 (Financial Statements Filing)",
      section: "Section 137 of Companies Act, 2013",
      cin: "U72900MH2024PTC412345",
      companyName: "Apex Technologies Pvt Ltd",
      financialYear: "FY 2025-26",
      auditorName: "K. R. Mehta & Associates (FRN: 105432W)",
      turnover: "₹1,25,00,000",
      netProfit: "₹24,50,000",
      extractedFrom: ["Audited_Balance_Sheet_2025_26.pdf", "Board_Resolution_AOC4.pdf"],
      humanApprover: "Compliance Head (Rajesh Sharma)",
      autoFilledFieldsCount: 24,
      confidenceScore: "98.5%"
    },
    MGT7: {
      formName: "Form MGT-7 (Annual Return)",
      section: "Section 92(4) of Companies Act, 2013",
      cin: "U72900MH2024PTC412345",
      companyName: "Apex Technologies Pvt Ltd",
      financialYear: "FY 2025-26",
      totalShareholders: "4",
      paidUpCapital: "₹10,00,000",
      boardMeetingsHeld: "5",
      extractedFrom: ["Shareholders_Register_2026.pdf", "Board_Minutes_Master.pdf"],
      humanApprover: "Company Secretary (CS Priyanka Nair)",
      autoFilledFieldsCount: 32,
      confidenceScore: "96.8%"
    },
    DIR3: {
      formName: "Form DIR-3 KYC (Director Identification Verification)",
      section: "Rule 12A of Companies Director Rules",
      cin: "U72900MH2024PTC412345",
      directorName: "Sanjay Sharma",
      din: "08912345",
      mobileOtpStatus: "Pending Director Verification",
      emailVerified: "Yes (sanjay@apextech.in)",
      extractedFrom: ["Director_PAN_Card.pdf", "Passport_Scan_Director2.pdf"],
      humanApprover: "Compliance Head (Rajesh Sharma)",
      autoFilledFieldsCount: 14,
      confidenceScore: "99.1%"
    },
    GSTR3B: {
      formName: "Form GSTR-3B (Monthly Summary Tax Return)",
      section: "Section 39 of CGST Act, 2017",
      gstin: "27AAACA1234B1Z5",
      companyName: "Apex Technologies Pvt Ltd",
      taxPeriod: "July 2026",
      taxableOutwardSupplies: "₹14,50,000",
      itcAvailable: "₹1,85,00,000 (CGST+SGST)",
      netTaxLiability: "₹76,00,000",
      extractedFrom: ["GSTR1_July2026_Extracted.pdf", "Purchase_Register_July.xlsx"],
      humanApprover: "Tax Manager (Swathi Solo)",
      autoFilledFieldsCount: 18,
      confidenceScore: "99.4%"
    }
  };

  const currentForm = formDataMock[selectedForm];

  const handleApprove = (formId) => {
    setReviewStatus(prev => ({ ...prev, [formId]: 'Approved for Submission' }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Edit3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Statutory Form Drafting & Auto-Fill Agent</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Automated drafting assistant leveraging organization profile & extracted document evidence. All forms queue for mandatory human approval.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            Human Review Mandate Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Selector Queue */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Auto-Filled Forms Queue (4)
          </h2>
          
          {formsList.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedForm(item.id)}
              className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer ${
                selectedForm === item.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold">{item.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  item.status === 'Approved for Submission' ? 'bg-emerald-500 text-white' :
                  item.status === 'Needs Correction' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className={`text-[11px] ${selectedForm === item.id ? 'text-slate-300' : 'text-slate-500'}`}>
                {item.category} • {item.authority}
              </p>
            </button>
          ))}
        </div>

        {/* Right 2 Columns: Selected Form Details & Pre-Filled Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="enterprise-card p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase font-mono tracking-wider">
                  {currentForm.section}
                </span>
                <h3 className="text-base font-bold text-slate-900">{currentForm.formName}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md block">
                  AI Auto-Fill: {currentForm.confidenceScore} Match
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {currentForm.autoFilledFieldsCount} Fields Pre-Populated
                </span>
              </div>
            </div>

            {/* Extracted Data Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Company / Entity</span>
                <span className="font-bold text-slate-900">{currentForm.companyName || currentForm.directorName}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono">
                <span className="text-[10px] text-slate-500 block font-semibold font-sans">Identifier (CIN / GSTIN / DIN)</span>
                <span className="font-bold text-slate-900">{currentForm.cin || currentForm.gstin || currentForm.din}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Period / FY</span>
                <span className="font-bold text-slate-900">{currentForm.financialYear || currentForm.taxPeriod || 'Annual 2026'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Key Financial Metric</span>
                <span className="font-bold text-slate-900">{currentForm.turnover || currentForm.taxableOutwardSupplies || currentForm.emailVerified}</span>
              </div>
            </div>

            {/* Evidence Lineage & Audit Source */}
            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-1.5">
              <span className="font-bold text-indigo-950 block flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                Data Provenance & Source Evidence
              </span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {currentForm.extractedFrom.map((src, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-white border border-indigo-200 text-indigo-900 font-mono font-medium">
                    📄 {src}
                  </span>
                ))}
              </div>
            </div>

            {/* Mandatory Human Review Approval Box */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400 block tracking-wider">
                  Mandatory Human Sign-off
                </span>
                <p className="text-xs text-slate-300">
                  Assigned Approver: <strong className="text-white font-bold">{currentForm.humanApprover}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApprove(selectedForm)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Sign Filing</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
