const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'documents');

function hr(doc, y) {
  doc.moveTo(50, y).lineTo(545, y).strokeColor('#cccccc').lineWidth(0.5).stroke();
}

function header(doc, title, subtitle) {
  doc.rect(0, 0, 612, 80).fill('#1e293b');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold').text(title, 50, 25, { width: 500 });
  doc.fontSize(9).fillColor('#94a3b8').font('Helvetica').text(subtitle, 50, 50, { width: 500 });
}

function field(doc, label, value, x, y, w) {
  doc.fontSize(7).fillColor('#64748b').font('Helvetica').text(label.toUpperCase(), x, y, { width: w });
  doc.fontSize(10).fillColor('#0f172a').font('Helvetica-Bold').text(value, x, y + 10, { width: w });
}

function stamp(doc, y, text) {
  doc.rect(50, y, 495, 28).fill('#f0fdf4').strokeColor('#bbf7d0').lineWidth(1).stroke();
  doc.fontSize(8).fillColor('#166534').font('Helvetica-Bold').text('✓ ' + text, 60, y + 8, { width: 480 });
}

// ──────── 1. Audited Balance Sheet ────────
function genBalanceSheet() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const out = fs.createWriteStream(path.join(outDir, 'Audited_Balance_Sheet_2025_26.pdf'));
  doc.pipe(out);

  header(doc, 'INDEPENDENT AUDITOR\'S REPORT', 'K. R. Mehta & Associates, Chartered Accountants (FRN: 105432W)');

  let y = 100;
  doc.fontSize(11).fillColor('#0f172a').font('Helvetica-Bold').text('To the Members of Apex Technologies Private Limited', 50, y);
  y += 25;
  doc.fontSize(9).fillColor('#334155').font('Helvetica').text('We have audited the accompanying financial statements of Apex Technologies Private Limited (CIN: U72900MH2024PTC412345), which comprise the Balance Sheet as at March 31, 2026, the Statement of Profit and Loss, the Cash Flow Statement, and the Statement of Changes in Equity for the year then ended, and a summary of the significant accounting policies and other explanatory information.', 50, y, { width: 495, lineGap: 3 });

  y += 70;
  doc.fontSize(12).fillColor('#1e40af').font('Helvetica-Bold').text('Opinion', 50, y);
  y += 18;
  doc.fontSize(9).fillColor('#334155').font('Helvetica').text('In our opinion and to the best of our information and according to the explanations given to us, the aforesaid financial statements give a true and fair view in conformity with the Indian Accounting Standards prescribed under Section 133 of the Companies Act, 2013.', 50, y, { width: 495, lineGap: 3 });

  y += 60;
  hr(doc, y); y += 12;
  doc.fontSize(12).fillColor('#1e40af').font('Helvetica-Bold').text('Statement of Profit & Loss (FY 2025-26)', 50, y);
  y += 25;

  // Table header
  doc.rect(50, y, 495, 22).fill('#f1f5f9');
  doc.fontSize(8).fillColor('#475569').font('Helvetica-Bold');
  doc.text('PARTICULARS', 60, y + 6, { width: 300 });
  doc.text('AMOUNT (₹)', 400, y + 6, { width: 140, align: 'right' });
  y += 28;

  const rows = [
    ['Revenue from Operations', '₹1,25,00,000'],
    ['Other Income', '₹3,20,000'],
    ['Total Revenue', '₹1,28,20,000'],
    ['Cost of Materials & Services', '₹42,50,000'],
    ['Employee Benefit Expenses', '₹38,80,000'],
    ['Depreciation & Amortisation', '₹4,20,000'],
    ['Other Expenses', '₹14,70,000'],
    ['Total Expenses', '₹1,00,20,000'],
    ['Profit Before Tax', '₹28,00,000'],
    ['Tax Expense (Current + Deferred)', '₹3,50,000'],
    ['Net Profit After Tax', '₹24,50,000'],
  ];

  rows.forEach(([label, amount], i) => {
    const isBold = label.startsWith('Total') || label.startsWith('Net') || label.startsWith('Profit Before');
    if (isBold) doc.rect(50, y - 2, 495, 18).fill('#eff6ff');
    doc.fontSize(9).fillColor('#0f172a').font(isBold ? 'Helvetica-Bold' : 'Helvetica');
    doc.text(label, 60, y + 2, { width: 300 });
    doc.text(amount, 400, y + 2, { width: 140, align: 'right' });
    y += 20;
  });

  y += 15;
  hr(doc, y); y += 15;
  doc.fontSize(12).fillColor('#1e40af').font('Helvetica-Bold').text('Balance Sheet Summary (as at March 31, 2026)', 50, y);
  y += 25;

  doc.rect(50, y, 495, 22).fill('#f1f5f9');
  doc.fontSize(8).fillColor('#475569').font('Helvetica-Bold');
  doc.text('ITEM', 60, y + 6, { width: 300 });
  doc.text('AMOUNT (₹)', 400, y + 6, { width: 140, align: 'right' });
  y += 28;

  const bsRows = [
    ['Share Capital (Paid-up)', '₹10,00,000'],
    ['Reserves & Surplus', '₹54,50,000'],
    ['Total Equity', '₹64,50,000'],
    ['Non-Current Liabilities', '₹12,00,000'],
    ['Current Liabilities', '₹18,70,000'],
    ['Total Fixed Assets (Net)', '₹28,40,000'],
    ['Current Assets', '₹66,80,000'],
    ['Total Assets', '₹95,20,000'],
  ];

  bsRows.forEach(([label, amount]) => {
    const isBold = label.startsWith('Total');
    if (isBold) doc.rect(50, y - 2, 495, 18).fill('#eff6ff');
    doc.fontSize(9).fillColor('#0f172a').font(isBold ? 'Helvetica-Bold' : 'Helvetica');
    doc.text(label, 60, y + 2, { width: 300 });
    doc.text(amount, 400, y + 2, { width: 140, align: 'right' });
    y += 20;
  });

  y += 20;
  stamp(doc, y, 'Audited and certified. Signed digitally by CA K. R. Mehta (Partner, M.No. 045123) on 28-Jul-2026.');

  y += 45;
  doc.fontSize(7).fillColor('#94a3b8').font('Helvetica').text('This document is system-generated by Docket AI Compliance Platform. Hash: 0x77c211...99e4', 50, y);
  
  doc.end();
}

// ──────── 2. Board Resolution ────────
function genBoardResolution() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const out = fs.createWriteStream(path.join(outDir, 'Board_Resolution_AOC4.pdf'));
  doc.pipe(out);

  header(doc, 'CERTIFIED TRUE COPY — BOARD RESOLUTION', 'Apex Technologies Private Limited • CIN: U72900MH2024PTC412345');

  let y = 100;
  doc.fontSize(10).fillColor('#0f172a').font('Helvetica-Bold').text('EXTRACT OF MINUTES OF THE MEETING OF THE BOARD OF DIRECTORS', 50, y, { align: 'center', width: 495 });
  y += 25;
  
  field(doc, 'Date of Meeting', 'July 18, 2026', 50, y, 200);
  field(doc, 'Venue', 'Registered Office, Mumbai', 300, y, 240);
  y += 40;
  field(doc, 'Resolution Reference', 'BR/2026-27/04', 50, y, 200);
  field(doc, 'Quorum', '3 Directors Present (Unanimous)', 300, y, 240);
  y += 40;

  hr(doc, y); y += 15;

  doc.fontSize(10).fillColor('#0f172a').font('Helvetica-Bold').text('DIRECTORS PRESENT:', 50, y); y += 18;
  const directors = [
    'Mr. Ankit Sharma — Director & Chairperson (DIN: 08912344)',
    'Mr. Sanjay Sharma — Director (DIN: 08912345)',
    'CS Priyanka Nair — Company Secretary (PCS Membership: A-67890)',
  ];
  directors.forEach(d => {
    doc.fontSize(9).fillColor('#334155').font('Helvetica').text('•  ' + d, 65, y, { width: 480 });
    y += 16;
  });

  y += 10; hr(doc, y); y += 15;

  doc.fontSize(10).fillColor('#1e40af').font('Helvetica-Bold').text('RESOLUTION 1 — ADOPTION OF FINANCIAL STATEMENTS', 50, y); y += 20;
  doc.fontSize(9).fillColor('#334155').font('Helvetica').text('"RESOLVED THAT pursuant to Section 134(3) of the Companies Act, 2013, the Board of Directors hereby considers and approves the Audited Balance Sheet as at March 31, 2026 and the Statement of Profit & Loss for the financial year ended March 31, 2026, as audited by M/s. K. R. Mehta & Associates, Chartered Accountants (FRN: 105432W), and that the same be adopted and placed before the members at the ensuing Annual General Meeting."', 50, y, { width: 495, lineGap: 3 });

  y += 80;
  doc.fontSize(10).fillColor('#1e40af').font('Helvetica-Bold').text('RESOLUTION 2 — AUTHORIZATION FOR E-FILING', 50, y); y += 20;
  doc.fontSize(9).fillColor('#334155').font('Helvetica').text('"FURTHER RESOLVED THAT Mr. Ankit Sharma, Director of the Company, be and is hereby authorized to digitally sign and file Form AOC-4 (Financial Statements) and Form MGT-7 (Annual Return) with the Registrar of Companies, Mumbai, and to take all necessary steps in this regard."', 50, y, { width: 495, lineGap: 3 });

  y += 70;
  doc.fontSize(10).fillColor('#1e40af').font('Helvetica-Bold').text('RESOLUTION 3 — DIVIDEND DECLARATION', 50, y); y += 20;
  doc.fontSize(9).fillColor('#334155').font('Helvetica').text('"RESOLVED THAT the Board recommends a final dividend of ₹2 per equity share (20% on face value of ₹10 each) for the financial year 2025-26, subject to approval of the shareholders at the AGM."', 50, y, { width: 495, lineGap: 3 });

  y += 55;
  stamp(doc, y, 'Board Resolution certified as true copy by CS Priyanka Nair, Company Secretary (PCS: A-67890). Date: 18-Jul-2026.');

  y += 45;
  hr(doc, y); y += 12;
  doc.fontSize(8).fillColor('#64748b').font('Helvetica').text('For and on behalf of the Board of Directors', 350, y, { width: 200, align: 'right' });
  y += 30;
  doc.fontSize(9).fillColor('#0f172a').font('Helvetica-Bold').text('Ankit Sharma', 400, y, { width: 150, align: 'right' });
  y += 12;
  doc.fontSize(8).fillColor('#64748b').font('Helvetica').text('Director & Chairperson (DIN: 08912344)', 350, y, { width: 200, align: 'right' });

  doc.end();
}

// ──────── 3. PAN Card ────────
function genPanCard() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const out = fs.createWriteStream(path.join(outDir, 'Director_PAN_Card.pdf'));
  doc.pipe(out);

  header(doc, 'INCOME TAX DEPARTMENT — GOVERNMENT OF INDIA', 'Permanent Account Number (PAN) Card — Identity Verification Document');

  let y = 110;
  doc.rect(50, y, 495, 200).fill('#fffbeb').strokeColor('#fbbf24').lineWidth(2).stroke();
  
  y += 15;
  doc.fontSize(14).fillColor('#92400e').font('Helvetica-Bold').text('PERMANENT ACCOUNT NUMBER CARD', 70, y, { align: 'center', width: 455 });
  y += 22;
  doc.fontSize(9).fillColor('#92400e').font('Helvetica').text('INCOME TAX DEPARTMENT • GOVT. OF INDIA', 70, y, { align: 'center', width: 455 });
  
  y += 30;
  field(doc, 'Name', 'SANJAY SHARMA', 70, y, 220);
  field(doc, 'PAN Number', 'ABCPS1234K', 320, y, 200);
  y += 35;
  field(doc, 'Father\'s Name', 'RAMESH SHARMA', 70, y, 220);
  field(doc, 'Date of Birth', '14/08/1984', 320, y, 200);
  y += 35;
  field(doc, 'PAN Category', 'Individual (Person)', 70, y, 220);
  field(doc, 'Issue Date', '12/03/2010', 320, y, 200);

  y += 55;
  hr(doc, y); y += 15;
  doc.fontSize(11).fillColor('#1e40af').font('Helvetica-Bold').text('DOCKET VLM VERIFICATION REPORT', 50, y); y += 20;

  const checks = [
    ['NSDL PAN Validation', 'VALID — Active PAN confirmed via TIN-NSDL API'],
    ['Name Match (OCR vs. MCA)', 'MATCH — "SANJAY SHARMA" matches DIN 08912345 record'],
    ['Date of Birth Match', 'MATCH — 14/08/1984 consistent across all submitted documents'],
    ['Aadhaar-PAN Link Status', 'LINKED — PAN ABCPS1234K linked to Aadhaar (last 4: XXXX6789)'],
    ['Document Tampering Check', 'CLEAR — No pixel-level anomalies detected by VLM'],
    ['Cross-Reference: Passport', 'CONSISTENT — Name and DOB match Passport Z9876543'],
  ];
  checks.forEach(([label, result]) => {
    doc.fontSize(8).fillColor('#475569').font('Helvetica-Bold').text(label + ':', 60, y, { width: 180 });
    doc.fontSize(8).fillColor('#166534').font('Helvetica').text(result, 240, y, { width: 300 });
    y += 16;
  });

  y += 15;
  stamp(doc, y, 'PAN Card verified via NSDL API & Docket VLM OCR Pipeline. Confidence: 99.8%. Hash: 0x8f4a9b...7c1d');

  doc.end();
}

// ──────── 4. Passport ────────
function genPassport() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const out = fs.createWriteStream(path.join(outDir, 'Passport_Scan_Director2.pdf'));
  doc.pipe(out);

  header(doc, 'REPUBLIC OF INDIA — PASSPORT', 'Ministry of External Affairs • Regional Passport Office, Mumbai');

  let y = 110;
  doc.rect(50, y, 495, 220).fill('#eff6ff').strokeColor('#3b82f6').lineWidth(2).stroke();

  y += 15;
  doc.fontSize(14).fillColor('#1e3a8a').font('Helvetica-Bold').text('PASSPORT / PASSEPORT', 70, y, { align: 'center', width: 455 });
  y += 20;
  doc.fontSize(9).fillColor('#1e3a8a').font('Helvetica').text('REPUBLIC OF INDIA', 70, y, { align: 'center', width: 455 });

  y += 30;
  field(doc, 'Type', 'P', 70, y, 100);
  field(doc, 'Country Code', 'IND', 180, y, 100);
  field(doc, 'Passport No.', 'Z9876543', 320, y, 200);
  y += 35;
  field(doc, 'Surname', 'SHARMA', 70, y, 200);
  field(doc, 'Given Name(s)', 'SANJAY', 320, y, 200);
  y += 35;
  field(doc, 'Nationality', 'INDIAN', 70, y, 130);
  field(doc, 'Sex', 'M', 210, y, 50);
  field(doc, 'Date of Birth', '14/08/1984', 320, y, 200);
  y += 35;
  field(doc, 'Place of Birth', 'MUMBAI, MAHARASHTRA', 70, y, 200);
  field(doc, 'Date of Expiry', '12/10/2031', 320, y, 200);

  y += 50;
  doc.fontSize(8).fillColor('#475569').font('Courier').text('P<INDSHARMA<<SANJAY<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', 60, y, { width: 480 });
  y += 12;
  doc.text('Z9876543<8IND8408144M3110124<<<<<<<<<<<<<<<02', 60, y, { width: 480 });

  y += 25;
  hr(doc, y); y += 15;
  doc.fontSize(11).fillColor('#1e40af').font('Helvetica-Bold').text('DOCKET VLM VERIFICATION REPORT', 50, y); y += 20;

  const checks = [
    ['MRZ Code Parse', 'VALID — Machine Readable Zone successfully decoded'],
    ['Name vs. PAN Card', 'MATCH — "SANJAY SHARMA" consistent with PAN ABCPS1234K'],
    ['Passport Expiry', 'VALID — Expires 12/10/2031 (5+ years remaining)'],
    ['Issuing Authority', 'Regional Passport Office, Mumbai'],
    ['Address Proof Status', 'ACCEPTED — Valid proof of identity and address for DIR-3 KYC'],
    ['Document Integrity', 'CLEAR — No signs of digital alteration detected'],
  ];
  checks.forEach(([label, result]) => {
    doc.fontSize(8).fillColor('#475569').font('Helvetica-Bold').text(label + ':', 60, y, { width: 180 });
    doc.fontSize(8).fillColor('#166534').font('Helvetica').text(result, 240, y, { width: 300 });
    y += 16;
  });

  y += 15;
  stamp(doc, y, 'Passport verified via Docket VLM OCR Pipeline. Confidence: 99.4%. Hash: 0x3e12c9...b50a');

  doc.end();
}

// ──────── 5. Shareholders Register ────────
function genShareholdersRegister() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const out = fs.createWriteStream(path.join(outDir, 'Shareholders_Register_2026.pdf'));
  doc.pipe(out);

  header(doc, 'FORM MGT-1: REGISTER OF MEMBERS', 'Pursuant to Section 88(1)(a) of Companies Act, 2013 read with Rule 3 of Companies (Management and Administration) Rules, 2014');

  let y = 100;
  field(doc, 'Company Name', 'Apex Technologies Private Limited', 50, y, 250);
  field(doc, 'CIN', 'U72900MH2024PTC412345', 350, y, 200);
  y += 40;
  field(doc, 'Authorized Capital', '₹25,00,000 (2,50,000 shares @ ₹10 each)', 50, y, 250);
  field(doc, 'Paid-up Capital', '₹10,00,000 (1,00,000 shares @ ₹10 each)', 350, y, 200);

  y += 50;
  hr(doc, y); y += 12;
  doc.fontSize(12).fillColor('#1e40af').font('Helvetica-Bold').text('Register of Members — Equity Shareholders', 50, y); y += 25;

  doc.rect(50, y, 495, 22).fill('#1e293b');
  doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold');
  doc.text('SL.', 55, y + 6, { width: 30 });
  doc.text('MEMBER NAME', 90, y + 6, { width: 160 });
  doc.text('FOLIO / DP-ID', 255, y + 6, { width: 90 });
  doc.text('SHARES', 350, y + 6, { width: 60 });
  doc.text('% HOLDING', 415, y + 6, { width: 60 });
  doc.text('CATEGORY', 480, y + 6, { width: 65 });
  y += 28;

  const members = [
    ['1', 'Mr. Ankit Sharma', 'IN303237-001', '50,000', '50.00%', 'Promoter'],
    ['2', 'Mr. Sanjay Sharma', 'IN303237-002', '35,000', '35.00%', 'Promoter'],
    ['3', 'ESOP Trust (Apex)', 'IN303237-003', '10,000', '10.00%', 'Trust'],
    ['4', 'Ms. Riya Mehta', 'IN303237-004', '5,000', '5.00%', 'Investor'],
  ];

  members.forEach(([sl, name, folio, shares, pct, cat], i) => {
    if (i % 2 === 0) doc.rect(50, y - 2, 495, 20).fill('#f8fafc');
    doc.fontSize(9).fillColor('#0f172a').font('Helvetica');
    doc.text(sl, 55, y + 2, { width: 30 });
    doc.font('Helvetica-Bold').text(name, 90, y + 2, { width: 160 });
    doc.font('Courier').fontSize(8).text(folio, 255, y + 2, { width: 90 });
    doc.font('Helvetica').fontSize(9).text(shares, 350, y + 2, { width: 60 });
    doc.text(pct, 415, y + 2, { width: 60 });
    doc.text(cat, 480, y + 2, { width: 65 });
    y += 22;
  });

  // Totals
  y += 5;
  doc.rect(50, y, 495, 22).fill('#eff6ff');
  doc.fontSize(9).fillColor('#0f172a').font('Helvetica-Bold');
  doc.text('TOTAL', 90, y + 5, { width: 160 });
  doc.text('1,00,000', 350, y + 5, { width: 60 });
  doc.text('100.00%', 415, y + 5, { width: 60 });

  y += 40;
  stamp(doc, y, 'Register of Members maintained as per Section 88 of Companies Act, 2013. Certified by CS Priyanka Nair.');

  doc.end();
}

// ──────── 6. Board Minutes Master ────────
function genBoardMinutes() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const out = fs.createWriteStream(path.join(outDir, 'Board_Minutes_Master.pdf'));
  doc.pipe(out);

  header(doc, 'MINUTES BOOK — BOARD OF DIRECTORS MEETINGS', 'Apex Technologies Private Limited • FY 2025-26 • Maintained as per Section 118 of Companies Act, 2013');

  let y = 100;
  field(doc, 'Company', 'Apex Technologies Private Limited', 50, y, 250);
  field(doc, 'CIN', 'U72900MH2024PTC412345', 350, y, 200);
  y += 35;
  field(doc, 'Financial Year', 'April 2025 — March 2026', 50, y, 250);
  field(doc, 'Total Board Meetings Held', '5 Meetings', 350, y, 200);

  y += 45;
  doc.fontSize(12).fillColor('#1e40af').font('Helvetica-Bold').text('Meeting Schedule & Compliance Check', 50, y); y += 22;

  doc.rect(50, y, 495, 22).fill('#1e293b');
  doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold');
  doc.text('#', 55, y + 6, { width: 25 });
  doc.text('MEETING', 85, y + 6, { width: 130 });
  doc.text('DATE', 220, y + 6, { width: 90 });
  doc.text('DIRECTORS', 315, y + 6, { width: 55 });
  doc.text('GAP (DAYS)', 375, y + 6, { width: 65 });
  doc.text('STATUS', 445, y + 6, { width: 100 });
  y += 28;

  const meetings = [
    ['1', 'Q1 Board Meeting', '15-May-2025', '3/3', '—', '✓ Compliant'],
    ['2', 'Q2 Board Meeting', '10-Aug-2025', '3/3', '87 days', '✓ Compliant'],
    ['3', 'Q3 Board Meeting', '12-Nov-2025', '3/3', '94 days', '✓ Compliant'],
    ['4', 'Q4 Board Meeting', '20-Feb-2026', '3/3', '100 days', '✓ Compliant'],
    ['5', 'Year-End Approval', '28-Mar-2026', '3/3', '36 days', '✓ Compliant'],
  ];

  meetings.forEach(([num, name, date, dirs, gap, status], i) => {
    if (i % 2 === 0) doc.rect(50, y - 2, 495, 20).fill('#f8fafc');
    doc.fontSize(9).fillColor('#0f172a').font('Helvetica');
    doc.text(num, 55, y + 2, { width: 25 });
    doc.font('Helvetica-Bold').text(name, 85, y + 2, { width: 130 });
    doc.font('Helvetica').text(date, 220, y + 2, { width: 90 });
    doc.text(dirs, 315, y + 2, { width: 55 });
    doc.text(gap, 375, y + 2, { width: 65 });
    doc.fontSize(8).fillColor('#166534').font('Helvetica-Bold').text(status, 445, y + 2, { width: 100 });
    y += 22;
  });

  y += 20;
  doc.rect(50, y, 495, 50).fill('#f0fdf4').strokeColor('#bbf7d0').lineWidth(1).stroke();
  doc.fontSize(9).fillColor('#166534').font('Helvetica-Bold').text('COMPLIANCE SUMMARY', 60, y + 8);
  doc.fontSize(8).fillColor('#334155').font('Helvetica').text('Maximum gap between two consecutive Board Meetings: 100 days (within statutory limit of 120 days as per Section 173 of Companies Act, 2013). All meetings achieved minimum quorum as prescribed under Section 174.', 60, y + 22, { width: 475, lineGap: 2 });

  y += 70;
  stamp(doc, y, 'Minutes Book maintained and certified by CS Priyanka Nair, Company Secretary (PCS: A-67890). Verified on 26-Jul-2026.');

  doc.end();
}

// ──────── 7. GSTR-1 Extracted ────────
function genGSTR1() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const out = fs.createWriteStream(path.join(outDir, 'GSTR1_July2026_Extracted.pdf'));
  doc.pipe(out);

  header(doc, 'GSTR-1 — OUTWARD SUPPLIES RETURN', 'Goods and Services Tax Network (GSTN) • Government of India');

  let y = 100;
  doc.rect(50, y, 495, 30).fill('#dbeafe').strokeColor('#3b82f6').lineWidth(1).stroke();
  doc.fontSize(9).fillColor('#1e3a8a').font('Helvetica-Bold').text('FILING ACKNOWLEDGMENT RECEIPT — ARN: AA270726019842C', 60, y + 9, { width: 475, align: 'center' });

  y += 45;
  field(doc, 'GSTIN', '27AAACA1234B1Z5', 50, y, 200);
  field(doc, 'Legal Name', 'APEX TECHNOLOGIES PVT LTD', 300, y, 245);
  y += 35;
  field(doc, 'Tax Period', 'July 2026', 50, y, 200);
  field(doc, 'Date of Filing', '05-Aug-2026', 300, y, 245);
  y += 35;
  field(doc, 'ARN Number', 'AA270726019842C', 50, y, 200);
  field(doc, 'Filing Status', 'FILED & VERIFIED', 300, y, 245);

  y += 45;
  doc.fontSize(12).fillColor('#1e40af').font('Helvetica-Bold').text('Summary of Outward Supplies', 50, y); y += 22;

  doc.rect(50, y, 495, 22).fill('#1e293b');
  doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold');
  doc.text('DESCRIPTION', 60, y + 6, { width: 250 });
  doc.text('TAXABLE VALUE (₹)', 320, y + 6, { width: 100, align: 'right' });
  doc.text('TAX (₹)', 430, y + 6, { width: 100, align: 'right' });
  y += 28;

  const supplies = [
    ['B2B Supplies (Table 4A)', '₹10,50,000', '₹1,89,000'],
    ['B2C Large (Table 5A)', '₹2,00,000', '₹36,000'],
    ['B2C Small (Table 7)', '₹1,50,000', '₹27,000'],
    ['Exports (Table 6A)', '₹50,000', '₹9,000'],
    ['TOTAL OUTWARD SUPPLIES', '₹14,50,000', '₹2,61,000'],
  ];

  supplies.forEach(([desc, taxable, tax], i) => {
    const isTotal = i === supplies.length - 1;
    if (isTotal) doc.rect(50, y - 2, 495, 20).fill('#eff6ff');
    else if (i % 2 === 0) doc.rect(50, y - 2, 495, 20).fill('#f8fafc');
    doc.fontSize(9).fillColor('#0f172a').font(isTotal ? 'Helvetica-Bold' : 'Helvetica');
    doc.text(desc, 60, y + 2, { width: 250 });
    doc.text(taxable, 320, y + 2, { width: 100, align: 'right' });
    doc.text(tax, 430, y + 2, { width: 100, align: 'right' });
    y += 22;
  });

  y += 20;
  stamp(doc, y, 'GSTR-1 filed successfully on GST Portal. Status: FILED & VERIFIED. ARN: AA270726019842C.');

  doc.end();
}

// ──────── 8. Purchase Register ────────
function genPurchaseRegister() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const out = fs.createWriteStream(path.join(outDir, 'Purchase_Register_July.xlsx.pdf'));
  doc.pipe(out);

  header(doc, 'INPUT TAX CREDIT — PURCHASE REGISTER', 'Apex Technologies Pvt Ltd • Internal Finance & Tax Department • July 2026');

  let y = 100;
  field(doc, 'GSTIN', '27AAACA1234B1Z5', 50, y, 200);
  field(doc, 'Period', 'July 2026', 300, y, 200);
  y += 35;
  field(doc, 'Total Vendor Invoices', '48 Invoices from 14 Vendors', 50, y, 250);
  field(doc, 'GSTR-2B Reconciliation', '100% Reconciled', 350, y, 200);

  y += 45;
  doc.fontSize(12).fillColor('#1e40af').font('Helvetica-Bold').text('ITC Summary — GSTR-3B Table 4 Auto-Population', 50, y); y += 22;

  doc.rect(50, y, 495, 22).fill('#1e293b');
  doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold');
  doc.text('CATEGORY', 60, y + 6, { width: 200 });
  doc.text('CGST (₹)', 270, y + 6, { width: 90, align: 'right' });
  doc.text('SGST (₹)', 370, y + 6, { width: 80, align: 'right' });
  doc.text('TOTAL (₹)', 455, y + 6, { width: 85, align: 'right' });
  y += 28;

  const itcRows = [
    ['ITC from registered persons (B2B)', '68,50,000', '68,50,000', '1,37,00,000'],
    ['ITC from imports (IGST)', '24,00,000', '—', '24,00,000'],
    ['ITC from reverse charge', '12,00,000', '12,00,000', '24,00,000'],
    ['Ineligible ITC (Sec 17(5))', '0', '0', '0'],
    ['NET ELIGIBLE ITC', '92,50,000', '92,50,000', '1,85,00,000'],
  ];

  itcRows.forEach(([cat, cgst, sgst, total], i) => {
    const isTotal = i === itcRows.length - 1;
    if (isTotal) doc.rect(50, y - 2, 495, 20).fill('#eff6ff');
    else if (i % 2 === 0) doc.rect(50, y - 2, 495, 20).fill('#f8fafc');
    doc.fontSize(9).fillColor('#0f172a').font(isTotal ? 'Helvetica-Bold' : 'Helvetica');
    doc.text(cat, 60, y + 2, { width: 200 });
    doc.text(cgst, 270, y + 2, { width: 90, align: 'right' });
    doc.text(sgst, 370, y + 2, { width: 80, align: 'right' });
    doc.text(total, 455, y + 2, { width: 85, align: 'right' });
    y += 22;
  });

  y += 20;
  stamp(doc, y, 'Purchase Register reconciled against GSTR-2B. Ready for GSTR-3B auto-population. Verified by Tax Manager.');

  doc.end();
}

// ──── Run all generators ────
genBalanceSheet();
genBoardResolution();
genPanCard();
genPassport();
genShareholdersRegister();
genBoardMinutes();
genGSTR1();
genPurchaseRegister();

console.log('✅ All 8 PDF documents generated in public/documents/');
