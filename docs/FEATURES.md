# 📜 Docket — Comprehensive Feature & Architecture Guide

**Docket** is an AI-powered enterprise regulatory & compliance automation platform specifically designed for Indian corporate governance, statutory compliance (Companies Act 2013, CGST Act 2017, Income Tax Act 1961, EPF & MP Act 1952, ESI Act, and Indian Labour Laws), and financial risk mitigation.

This document provides a detailed breakdown of all features, their operational workflows, UI components, backend APIs, and underlying technical implementations.

---

## 📑 Table of Contents

1. [Dual-Tier Role-Based Access Control (RBAC)](#1-dual-tier-role-based-access-control-rbac)
2. [Checklist Engine Workbook](#2-checklist-engine-workbook)
3. [AI Penalty & Prosecution Risk Calculator](#3-ai-penalty--prosecution-risk-calculator)
4. [VLM / OCR Document Intelligence Pipeline](#4-vlm--ocr-document-intelligence-pipeline)
5. [WhatsApp Regulatory Reminder Gateway](#5-whatsapp-regulatory-reminder-gateway)
6. [Solo Founder Natural Language Intake](#6-solo-founder-natural-language-intake)
7. [Compliance Head Command Center](#7-compliance-head-command-center)
8. [Statutory Form Drafting & Auto-Fill Engine](#8-statutory-form-drafting--auto-fill-engine)
9. [Knowledge Graph & Statutory Dependency Visualizer](#9-knowledge-graph--statutory-dependency-visualizer)
10. [Sector-Specific Compliance Modules](#10-sector-specific-compliance-modules)
11. [Financial Cost & Budget Tracking](#11-financial-cost--budget-tracking)
12. [Entity Template Library](#12-entity-template-library)
13. [Event-Driven Notification Fanout Architecture](#13-event-driven-notification-fanout-architecture)
14. [Backend API Reference](#14-backend-api-reference)

---

## 1. Dual-Tier Role-Based Access Control (RBAC)

* **Primary Code References**: [`lib/AuthContext.js`](file:///c:/Users/Swathi/Desktop/testdoc/lib/AuthContext.js), [`components/AuthModal.jsx`](file:///c:/Users/Swathi/Desktop/testdoc/components/AuthModal.jsx)

### Overview
Docket serves two distinct user personas with tailored interface density and information architecture:

* **Tier 1 — Solo Founder View**: Optimized for simplicity, step-by-step guidance, conversational AI dossier intake, and high-level progress tracking without overwhelming jargon.
* **Tier 2 — Compliance Chief View**: Optimized for high information density, multi-entity command dashboards, statutory risk gauges, live timelines, downloadable audit sheets, and legal knowledge graphs.

### Key Capabilities
* **Instant Mode Switching**: Switch seamlessly between Tier 1 and Tier 2 from the global top header without losing workspace state.
* **Granular Permissions**: Restricts sensitive actions (e.g., overriding verified statuses, modifying statutory penalty formulas, exporting full audit ledgers) to Tier 2 administrators.

---

## 2. Checklist Engine Workbook

* **Primary Code Reference**: [`components/ChecklistEngineWorkbook.jsx`](file:///c:/Users/Swathi/Desktop/testdoc/components/ChecklistEngineWorkbook.jsx)

### Overview
The heart of Docket's operations is a spreadsheet-style, ledger-themed compliance workbook designed for high-volume task management.

### Status Workflow Architecture
Each statutory task progresses through four explicit verification states:
1. `⚪ Not Started`: Task is pending action; initial filing window is open.
2. `🔵 Evidence Uploaded`: Proof of filing (challan, ARN receipt, acknowledgement PDF) has been uploaded and queued for verification.
3. `🟢 Filed & Verified`: Verified by a Compliance Head or verified automatically via VLM/OCR parser.
4. `🔴 Overdue`: Statutory deadline passed without verification; daily late fees and prosecution risk timer active.

### Features
* **Multi-Act Filtering**: Filter compliance tasks by governing act (Companies Act 2013, CGST, Income Tax, EPF/ESI, Labour Laws, FEMA).
* **Spreadsheet Bulk Actions**: Bulk status updates, bulk evidence attachment, and CSV/JSON export/import.
* **Audit Trail Integration**: Every status mutation automatically generates a cryptographically hashed log entry in [`lib/taskStore.js`](file:///c:/Users/Swathi/Desktop/testdoc/lib/taskStore.js).

---

## 3. AI Penalty & Prosecution Risk Calculator

* **Primary Code References**: [`components/PenaltyCalculatorPanel.jsx`](file:///c:/Users/Swathi/Desktop/testdoc/components/PenaltyCalculatorPanel.jsx), [`app/api/penalty/route.js`](file:///c:/Users/Swathi/Desktop/testdoc/app/api/penalty/route.js)

### Overview
A statutory penalty simulation engine that quantifies financial and legal risks resulting from delayed filings.

### How It Works
1. **Deterministic Calculation**: Computes baseline statutory late fees (e.g., ₹50/day under CGST Act, ₹100/day under Companies Act AOC-4/MGT-7) and compound interest (18% p.a. under IT Act).
2. **Prosecution Countdown**: Tracks statutory grace periods before director disqualification (Section 164(2)) or penal proceedings under Section 447 are initiated.
3. **NVIDIA NIM AI Query Engine**: Integrates with `meta/llama-3.1-70b-instruct` to analyze custom penalty clauses, compounding rules, and relief provisions. Includes a local fallback engine if offline.

---

## 4. VLM / OCR Document Intelligence Pipeline

* **Primary Code References**: [`components/VlmOcrPipeline.jsx`](file:///c:/Users/Swathi/Desktop/testdoc/components/VlmOcrPipeline.jsx), [`app/api/extract/route.js`](file:///c:/Users/Swathi/Desktop/testdoc/app/api/extract/route.js)

### Overview
An automated document parsing engine that converts uploaded receipts, bank challans, and tax filing PDFs into verified compliance records.

### How It Works
* Upload a document (PDF, PNG, JPG).
* The VLM parser extracts key statutory attributes:
  * **ARN / Filing Acknowledgement Number**
  * **Tax Amount / Paid Fee**
  * **Filing Date & Assessment Period**
  * **Filing Status & Entity Name**
* Auto-matches extracted data with pending tasks in the workbook to automatically transition status from `Not Started` → `Filed & Verified`.

---

## 5. WhatsApp Regulatory Reminder Gateway

* **Primary Code References**: [`components/WhatsAppReminderSettings.jsx`](file:///c:/Users/Swathi/Desktop/testdoc/components/WhatsAppReminderSettings.jsx), [`app/api/notifications/route.js`](file:///c:/Users/Swathi/Desktop/testdoc/app/api/notifications/route.js)

### Overview
A proactive notification hub that delivers deadline alerts directly to founders on WhatsApp.

### Capabilities
* **Pre-Filing Cadence Triggers**: Configurable automated countdown dispatches (`30d`, `15d`, `7d`, `1d`).
* **Live Template Preview**: Real-time preview of formatted WhatsApp alert templates containing entity name, due date, daily penalty rates, and direct action links.
* **Dispatch Feed & Audit Log**: Immutable log of sent reminders with delivery receipts and tamper-evident hashes.

---

## 6. Solo Founder Natural Language Intake

* **Primary Code References**: [`components/SoloFounderIntake.jsx`](file:///c:/Users/Swathi/Desktop/testdoc/components/SoloFounderIntake.jsx), [`app/api/intake/route.js`](file:///c:/Users/Swathi/Desktop/testdoc/app/api/intake/route.js)

### Overview
A conversational assistant for non-legal founders to set up company compliance without manual configuration.

### How It Works
* Founder enters company details in plain language (e.g., *"We are a 10-person Private Limited IT company in Bengaluru with 50L turnover"*).
* The intake engine parses entity structure, headcount, and turnover to automatically generate a tailored compliance calendar with applicable tax and ROC obligations.

---

## 7. Compliance Head Command Center

* **Primary Code Reference**: [`components/ComplianceHeadDashboard.jsx`](file:///c:/Users/Swathi/Desktop/testdoc/components/ComplianceHeadDashboard.jsx)

### Overview
An executive dashboard providing a high-level overview of corporate compliance health across multiple entities.

### Key Metrics & Panels
* **Statutory Health Score**: Real-time 0-100 rating based on completed vs. overdue obligations.
* **Accrued Financial Exposure**: Live running counter of accumulated penalties and compounding interest.
* **Filing Timeline**: Visual chronological roadmaps of upcoming 30-day deadlines.
* **Risk Heatmaps**: Categorizes risk by governing act and operational urgency.

---

## 8. Statutory Form Drafting & Auto-Fill Engine

* **Primary Code Reference**: [`components/StatutoryFormDrafting.jsx`](file:///c:/Users/Swathi/Desktop/testdoc/components/StatutoryFormDrafting.jsx)

### Overview
Generates pre-filled statutory forms, board resolutions, and filing dossiers (e.g., DIR-3 KYC, AOC-4 summaries, MGT-7 cover sheets).

### Capabilities
* Auto-populates entity master data (CIN, PAN, Registered Address, Director Details).
* Generates downloadable, print-ready statutory documentation.

---

## 9. Knowledge Graph & Statutory Dependency Visualizer

* **Primary Code Reference**: [`components/KnowledgeGraphView.jsx`](file:///c:/Users/Swathi/Desktop/testdoc/components/KnowledgeGraphView.jsx)

### Overview
An interactive node-edge graph visualizer showing relationships between statutory filings, parent/subsidiary entities, and legal dependencies.

### Use Cases
* Visualizes how delaying one filing (e.g., Financial Statement AOC-4) blocks downstream filings (e.g., Annual Return MGT-7).
* Highlights cross-entity compliance risks in group corporate structures.

---

## 10. Sector-Specific Compliance Modules

* **Primary Code Reference**: [`components/SectorComplianceModules.jsx`](file:///c:/Users/Swathi/Desktop/testdoc/components/SectorComplianceModules.jsx)

### Overview
Provides specialized compliance checklists tailored for specific industries:
* 💳 **FinTech**: RBI NBFC guidelines, digital lending compliance, PMLA/KYC rules.
* 🎓 **EdTech & E-Commerce**: Consumer Protection E-Commerce Rules 2020, DPDP Act 2023.
* 🏥 **Healthcare & BioTech**: CDSCO regulations, biomedical waste management.
* ☁️ **SaaS / IT**: Cert-In cybersecurity directions, STPI filing obligations.

---

## 11. Financial Cost & Budget Tracking

* **Primary Code Reference**: [`components/FinancialCostTracking.jsx`](file:///c:/Users/Swathi/Desktop/testdoc/components/FinancialCostTracking.jsx)

### Overview
Tracks all filing-related expenditure including government statutory fees, professional auditor/CS retainer fees, and penalty budgets.

---

## 12. Entity Template Library

* **Primary Code Reference**: [`components/EntityTemplatesSearch.jsx`](file:///c:/Users/Swathi/Desktop/testdoc/components/EntityTemplatesSearch.jsx)

### Overview
Pre-built compliance master templates for standard Indian legal structures:
* Private Limited Company (Pvt Ltd)
* Limited Liability Partnership (LLP)
* One Person Company (OPC)
* Section 8 Non-Profit Company
* Sole Proprietorship / Partnership Firm

---

## 13. Event-Driven Notification Fanout Architecture

* **Primary Code References**: [`lib/notificationFanout.js`](file:///c:/Users/Swathi/Desktop/testdoc/lib/notificationFanout.js), [`lib/redisClient.js`](file:///c:/Users/Swathi/Desktop/testdoc/lib/redisClient.js)

### Overview
An asynchronous notification engine built on Redis queues and Pub/Sub channel event fanouts.

```
Task Mutation / Trigger 
       │
       ▼
processNotificationFanout()
       │
       ├──► Email Channel (Transactional HTML)
       ├──► SMS Gateway (Telecom Alert)
       ├──► Slack Webhook (Block Kit Card)
       ├──► Custom HTTP Webhook (JSON Event)
       └─► Redis Queue & Pub/Sub (`compliance:notifications:queue`)
```

---

## 14. Backend API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/penalty` | `POST` | Computes penalty accruals & queries NVIDIA NIM AI engine. |
| `/api/intake` | `POST` | Processes natural language founder input & generates tasks. |
| `/api/extract` | `POST` | Runs VLM/OCR parsing on uploaded statutory documents. |
| `/api/notifications` | `GET / POST` | Fetches notification queue history / triggers new fanout. |
| `/api/query` | `POST` | Natural language regulatory Q&A lookup. |
| `/api/tasks` | `GET / POST` | RESTful task CRUD and state updates. |
| `/api/auth` | `GET / POST` | Manages user session roles (Tier 1 vs Tier 2). |

---

*Documentation maintained for Docket v1.0.0 — AI Compliance & Regulatory Platform.*
