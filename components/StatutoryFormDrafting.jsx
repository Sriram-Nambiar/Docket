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
  FileCheck,
  X,
  Download,
  ExternalLink,
  Printer,
  QrCode,
  FileSearch,
  Lock
} from 'lucide-react';

export default function StatutoryFormDrafting() {
  const [selectedForm, setSelectedForm] = useState('AOC4');
  const [activePdfModal, setActivePdfModal] = useState(null);
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

  const pdfDatabase = {
    "Director_PAN_Card.pdf": {
      fileName: "Director_PAN_Card.pdf",
      title: "Permanent Account Number (PAN) Card Scan",
      authority: "Income Tax Department • Government of India",
      docType: "Identity & Verification Proof",
      fileSize: "1.4 MB",
      hash: "0x8f4a9b...7c1d",
      verifiedAt: "2026-08-01 10:32 AM",
      vlmConfidence: "99.8%",
      extractedData: [
        { label: "Full Name", value: "SANJAY SHARMA" },
        { label: "Father's Name", value: "RAMESH SHARMA" },
        { label: "Date of Birth", value: "14/08/1984" },
        { label: "PAN Number", value: "ABCPS1234K" },
        { label: "Director DIN", value: "08912345" },
        { label: "Verification Status", value: "Verified via NSDL API" },
      ],
      pdfTextSnippet: `INCOME TAX DEPARTMENT - GOVT. OF INDIA
Permanent Account Number Card
Name: SANJAY SHARMA
Father's Name: RAMESH SHARMA
Date of Birth: 14/08/1984
PAN: ABCPS1234K
Signature Verified: YES
[QR Code Authenticated]`
    },
    "Passport_Scan_Director2.pdf": {
      fileName: "Passport_Scan_Director2.pdf",
      title: "Republic of India Passport — Director Identity Scan",
      authority: "Ministry of External Affairs • Regional Passport Office Mumbai",
      docType: "Proof of Address & Identity",
      fileSize: "2.1 MB",
      hash: "0x3e12c9...b50a",
      verifiedAt: "2026-08-01 11:05 AM",
      vlmConfidence: "99.4%",
      extractedData: [
        { label: "Passport Number", value: "Z9876543" },
        { label: "Given Name", value: "SANJAY" },
        { label: "Surname", value: "SHARMA" },
        { label: "Nationality", value: "INDIAN" },
        { label: "Place of Issue", value: "MUMBAI" },
        { label: "Expiry Date", value: "12/10/2031" },
      ],
      pdfTextSnippet: `PASSPORT / PASSEPORT - REPUBLIC OF INDIA
Type: P  Country Code: IND  Passport No: Z9876543
Surname: SHARMA
Given Name(s): SANJAY
Nationality: INDIAN  Sex: M  Date of Birth: 14/08/1984
Place of Birth: MUMBAI, MAHARASHTRA
Date of Issue: 13/10/2021  Date of Expiry: 12/10/2031
P<INDSHARMA<<SANJAY<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
Z9876543<8IND8408144M3110124<<<<<<<<<<<<<<<02`
    },
    "Audited_Balance_Sheet_2025_26.pdf": {
      fileName: "Audited_Balance_Sheet_2025_26.pdf",
      title: "Independent Auditor's Report & Audited Financial Statements",
      authority: "K. R. Mehta & Associates (FRN: 105432W)",
      docType: "Financial Dossier & Audit Report",
      fileSize: "4.8 MB",
      hash: "0x77c211...99e4",
      verifiedAt: "2026-07-28 04:15 PM",
      vlmConfidence: "98.5%",
      extractedData: [
        { label: "Company Name", value: "Apex Technologies Pvt Ltd" },
        { label: "Corporate Identification (CIN)", value: "U72900MH2024PTC412345" },
        { label: "Total Annual Revenue", value: "₹1,25,00,000" },
        { label: "Net Profit After Tax", value: "₹24,50,000" },
        { label: "Paid-up Share Capital", value: "₹10,00,000" },
        { label: "Auditor Opinion", value: "Unmodified Clean Opinion" },
      ],
      pdfTextSnippet: `INDEPENDENT AUDITOR'S REPORT
To the Members of Apex Technologies Private Limited
Opinion: We have audited the accompanying financial statements of Apex Technologies Pvt Ltd (CIN: U72900MH2024PTC412345), which comprise the Balance Sheet as at March 31, 2026, the Statement of Profit and Loss for the year then ended.
Key Audit Highlights:
- Revenue from Operations: ₹1,25,00,000
- Profit After Tax: ₹24,50,000
Signed: CA K. R. Mehta (Partner, M.No. 045123)`
    },
    "Board_Resolution_AOC4.pdf": {
      fileName: "Board_Resolution_AOC4.pdf",
      title: "Certified Extract of Board Resolution — Financial Approval",
      authority: "Board of Directors • Apex Technologies Pvt Ltd",
      docType: "Corporate Governance Record",
      fileSize: "850 KB",
      hash: "0x12a88f...ef33",
      verifiedAt: "2026-07-29 02:40 PM",
      vlmConfidence: "99.0%",
      extractedData: [
        { label: "Resolution Date", value: "18/07/2026" },
        { label: "Resolution Ref No.", value: "BR/2026-27/04" },
        { label: "Chairperson", value: "Ankit Sharma (Director)" },
        { label: "Quorum Present", value: "3 Directors (Unanimous Approval)" },
        { label: "Form Filing Authorized", value: "Form AOC-4 & MGT-7 Filing" },
      ],
      pdfTextSnippet: `CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE BOARD MEETING OF APEX TECHNOLOGIES PRIVATE LIMITED HELD ON JULY 18, 2026 AT REGISTERED OFFICE.
"RESOLVED THAT the Audited Balance Sheet as of March 31, 2026 and Profit & Loss statement be and are hereby approved and adopted."
"FURTHER RESOLVED THAT Ankit Sharma, Director, be authorized to sign and file Form AOC-4 with ROC."`
    },
    "Shareholders_Register_2026.pdf": {
      fileName: "Shareholders_Register_2026.pdf",
      title: "Statutory Register of Members & Shareholdings (Form MGT-1)",
      authority: "Ministry of Corporate Affairs • Companies Act 2013",
      docType: "Statutory Secretarial Book",
      fileSize: "1.9 MB",
      hash: "0x99b11c...44a1",
      verifiedAt: "2026-07-25 09:20 AM",
      vlmConfidence: "97.5%",
      extractedData: [
        { label: "Total Members", value: "4 Equity Shareholders" },
        { label: "Total Issued Shares", value: "1,00,000 Shares @ ₹10 each" },
        { label: "Paid-up Equity Capital", value: "₹10,00,000" },
        { label: "Promoter Holding", value: "85.0% Equity Shareholding" },
      ],
      pdfTextSnippet: `FORM MGT-1: REGISTER OF MEMBERS
[Pursuant to section 88(1)(a) of Companies Act, 2013]
Company: Apex Technologies Private Limited
Member #1: Ankit Sharma — 50,000 Equity Shares (50%)
Member #2: Sanjay Sharma — 35,000 Equity Shares (35%)
Member #3: ESOP Trust — 15,000 Equity Shares (15%)`
    },
    "Board_Minutes_Master.pdf": {
      fileName: "Board_Minutes_Master.pdf",
      title: "Master Minutes Book of Board Meetings (FY 2025-26)",
      authority: "Company Secretarial Department",
      docType: "Secretarial Minutes Book",
      fileSize: "3.4 MB",
      hash: "0xaa44bc...11e9",
      verifiedAt: "2026-07-26 03:10 PM",
      vlmConfidence: "96.8%",
      extractedData: [
        { label: "Board Meetings Held", value: "5 Meetings (Q1, Q2, Q3, Q4 + Special)" },
        { label: "Max Gap Between Meetings", value: "84 Days (Compliant < 120 Days)" },
        { label: "Key Attendees", value: "Ankit Sharma, Sanjay Sharma, CS Priyanka Nair" },
      ],
      pdfTextSnippet: `MINUTES BOOK — BOARD OF DIRECTORS MEETINGS
Apex Technologies Private Limited
Meeting 1: Q1 BM held on May 15, 2025
Meeting 2: Q2 BM held on August 10, 2025
Meeting 3: Q3 BM held on November 12, 2025
Meeting 4: Q4 BM held on February 20, 2026
Meeting 5: Year-end Approval BM held on March 28, 2026
All meetings met statutory quorum standards.`
    },
    "GSTR1_July2026_Extracted.pdf": {
      fileName: "GSTR1_July2026_Extracted.pdf",
      title: "GSTR-1 Outward Supplies Summary Statement (July 2026)",
      authority: "Goods and Services Tax Network (GSTN)",
      docType: "Tax Return Filing Acknowledgment",
      fileSize: "1.2 MB",
      hash: "0xbb55dd...22a8",
      verifiedAt: "2026-08-05 06:40 PM",
      vlmConfidence: "99.6%",
      extractedData: [
        { label: "GSTIN", value: "27AAACA1234B1Z5" },
        { label: "Filing ARN", value: "AA270726019842C" },
        { label: "Tax Period", value: "July 2026" },
        { label: "Total Outward Supplies", value: "₹14,50,000" },
        { label: "IGST / CGST / SGST", value: "₹2,61,000 Total Tax" },
      ],
      pdfTextSnippet: `GOODS AND SERVICES TAX NETWORK — GSTR-1 ACKNOWLEDGMENT
GSTIN: 27AAACA1234B1Z5
Legal Name: APEX TECHNOLOGIES PRIVATE LIMITED
ARN: AA270726019842C  Date of Filing: 05-Aug-2026
Total Taxable Turnover: ₹14,50,000
Status: FILED & VERIFIED ON GST PORTAL`
    },
    "Purchase_Register_July.xlsx": {
      fileName: "Purchase_Register_July.xlsx",
      title: "Input Tax Credit (ITC) Purchase Register (July 2026)",
      authority: "Internal Finance & Tax Department",
      docType: "Tax Credit Reconciliation Book",
      fileSize: "940 KB",
      hash: "0xcc66ee...33b7",
      verifiedAt: "2026-08-06 11:15 AM",
      vlmConfidence: "99.1%",
      extractedData: [
        { label: "Total Invoices Matched", value: "48 Vendor Invoices" },
        { label: "GSTR-2B Reconciled", value: "100% Reconciled" },
        { label: "Eligible ITC Claim", value: "₹1,85,00,000 (CGST+SGST)" },
      ],
      pdfTextSnippet: `PURCHASE REGISTER & GSTR-2B MATCHING SHEET - JULY 2026
Vendor Count: 14 Vendors  Total Line Items: 48 Invoices
Reconciled ITC (Eligible): ₹1,85,00,000
Ineligible ITC: ₹0
Status: Ready for GSTR-3B Table 4 Auto-Population`
    }
  };

  // Map file names to their actual PDF URLs in /public/documents/
  const pdfUrlMap = {
    "Audited_Balance_Sheet_2025_26.pdf": "/documents/Audited_Balance_Sheet_2025_26.pdf",
    "Board_Resolution_AOC4.pdf": "/documents/Board_Resolution_AOC4.pdf",
    "Director_PAN_Card.pdf": "/documents/Director_PAN_Card.pdf",
    "Passport_Scan_Director2.pdf": "/documents/Passport_Scan_Director2.pdf",
    "Shareholders_Register_2026.pdf": "/documents/Shareholders_Register_2026.pdf",
    "Board_Minutes_Master.pdf": "/documents/Board_Minutes_Master.pdf",
    "GSTR1_July2026_Extracted.pdf": "/documents/GSTR1_July2026_Extracted.pdf",
    "Purchase_Register_July.xlsx": "/documents/Purchase_Register_July.pdf",
  };

  const currentForm = formDataMock[selectedForm];

  const handleApprove = (formId) => {
    setReviewStatus(prev => ({ ...prev, [formId]: 'Approved for Submission' }));
  };

  const openPdfViewer = (fileName) => {
    const docData = pdfDatabase[fileName] || {
      fileName,
      title: fileName.replace(/_/g, ' ').replace('.pdf', '').replace('.xlsx', ''),
      authority: "Government / Internal Statutory Authority",
      docType: "Regulatory Evidence Document",
      fileSize: "1.5 MB",
      hash: "0x" + Math.random().toString(16).substr(2, 8) + "...",
      verifiedAt: new Date().toLocaleDateString() + " 10:00 AM",
      vlmConfidence: "98.9%",
      extractedData: [
        { label: "Document Name", value: fileName },
        { label: "Entity Match", value: "Apex Technologies Pvt Ltd" },
        { label: "VLM Parsing", value: "Verified & Matched" },
      ],
      pdfTextSnippet: `[STATUTORY COMPLIANCE DOCUMENT]\nDocument File: ${fileName}\nStatus: Verified via Docket VLM OCR Pipeline.`
    };
    setActivePdfModal({ ...docData, pdfUrl: pdfUrlMap[fileName] || null });
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
            Automated drafting assistant leveraging organization profile & extracted document evidence. Click any source PDF below to view the original file & OCR lineage.
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
          <div className="enterprise-card p-6 space-y-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            
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

            {/* Evidence Lineage & Audit Source - CLICKABLE PDF CHIPS */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  Data Provenance & Source Evidence
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Click any PDF to preview document
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {currentForm.extractedFrom.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => openPdfViewer(src)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-indigo-300 text-indigo-950 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 font-mono text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer group"
                    title={`Click to preview ${src}`}
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white" />
                    <span>{src}</span>
                    <Eye className="w-3 h-3 text-indigo-400 group-hover:text-white opacity-80" />
                  </button>
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

      {/* Interactive PDF Document Viewer Modal */}
      {activePdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 text-slate-100 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            
            {/* Modal Header Bar */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-sm font-bold text-white">{activePdfModal.fileName}</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> VLM Verified ({activePdfModal.vlmConfidence})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{activePdfModal.title} • {activePdfModal.fileSize}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activePdfModal.pdfUrl && (
                  <a
                    href={activePdfModal.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold px-3"
                    title="Open PDF in New Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open in New Tab
                  </a>
                )}
                {activePdfModal.pdfUrl && (
                  <a
                    href={activePdfModal.pdfUrl}
                    download={activePdfModal.fileName}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                <button 
                  onClick={() => setActivePdfModal(null)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content Grid */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Top Meta Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Authority</span>
                  <span className="text-slate-200 font-semibold">{activePdfModal.authority}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Document Category</span>
                  <span className="text-indigo-400 font-semibold">{activePdfModal.docType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Verified At</span>
                  <span className="text-slate-200">{activePdfModal.verifiedAt}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Audit Hash</span>
                  <span className="text-amber-400 font-bold truncate block">{activePdfModal.hash}</span>
                </div>
              </div>

              {/* Extracted Key Attributes Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileSearch className="w-4 h-4 text-indigo-400" />
                  Extracted VLM Entity Metadata
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activePdfModal.extractedData.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{item.label}</span>
                      <span className="text-xs font-mono font-bold text-white bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Embedded Real PDF Viewer */}
              {activePdfModal.pdfUrl && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    Document Preview — Embedded PDF Viewer
                  </span>
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-white">
                    <iframe
                      src={activePdfModal.pdfUrl}
                      className="w-full border-0"
                      style={{ height: '500px' }}
                      title={`PDF Preview: ${activePdfModal.fileName}`}
                    />
                  </div>
                </div>
              )}

              {/* OCR Text Content Extract (shown below the PDF) */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileSearch className="w-4 h-4 text-indigo-400" />
                  VLM OCR Extracted Text & Seal Lineage
                </span>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      ★ Official Government / Statutory Document Record
                    </span>
                    <span className="text-[10px] text-slate-500">Document Security Level: HIGH</span>
                  </div>

                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-200 bg-slate-900/80 p-4 rounded-lg border border-slate-800">
                    {activePdfModal.pdfTextSnippet}
                  </pre>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Lock className="w-3 h-3 text-emerald-400" /> Tamper-Evident SHA-256 Verified
                    </span>
                    <span className="text-slate-400 font-mono">DOCKET_SYS_DOC_ID_#2026</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                VLM OCR parsed & matched against SME regulatory rules
              </span>
              <button
                onClick={() => setActivePdfModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
