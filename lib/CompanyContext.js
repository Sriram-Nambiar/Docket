"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CompanyContext = createContext(null);

export const INITIAL_COMPANIES = [
  {
    id: "comp-apex",
    name: "Apex Technologies Pvt Ltd",
    cin: "U72900MH2024PTC412345",
    gstin: "27AAACA1234B1Z5",
    sector: "IT Services & SaaS",
    entityType: "Private Limited Company",
    state: "Maharashtra",
    annualTurnover: "₹1.25 Crore",
    employeeCount: 18,
    score: 78,
    scoreBadge: "High Readiness",
    upcomingDeadlinesCount: 5,
    activeRiskAlertsCount: 2,
    riskAlertMessage: "Form DIR-3 KYC Director 2 OTP pending",
    isAutomating: false,
    lastAutomatedAt: "Just now",
    obligations: [
      {
        id: "TL-01",
        title: "EPF Monthly ECR Filing & Statutory Deposit",
        authority: "EPFO (Employees' Provident Fund)",
        dueDate: "2026-08-15",
        status: "Amber",
        statusText: "Due in 11 Days",
        citation: "EPF & MP Act, 1952 - Paragraph 38",
        description: "Monthly deposit of Provident Fund contributions for 18 employees.",
        assignedTo: "HR & Payroll Lead",
        evidenceFile: "EPF_ECR_Draft_Aug2026.pdf",
        cycle: "Monthly Recurring",
      },
      {
        id: "TL-02",
        title: "GSTR-3B Monthly Summary Return & Tax Payment",
        authority: "CBIC / GSTN",
        dueDate: "2026-08-20",
        status: "Amber",
        statusText: "Due in 16 Days",
        citation: "CGST Act, 2017 - Section 39 & Rule 61(5)",
        description: "Monthly return filing & tax liability settlement for July 2026.",
        assignedTo: "Tax Department",
        evidenceFile: "GSTR3B_July2026_Challan.pdf",
        cycle: "Monthly Recurring",
      },
      {
        id: "TL-03",
        title: "Form DIR-3 KYC Director Annual Verification",
        authority: "Ministry of Corporate Affairs (MCA)",
        dueDate: "2026-09-30",
        status: "Red",
        statusText: "AT RISK - OTP Pending",
        citation: "Companies Director Rules, 2014 - Rule 12A",
        description: "Director 2 (Sanjay Sharma) KYC verification pending mobile OTP.",
        assignedTo: "Secretarial Team",
        evidenceFile: "DIR3_KYC_Pending_Director2.pdf",
        cycle: "1-Year Cycle",
      },
      {
        id: "TL-04",
        title: "Form AOC-4: Annual Financial Statements Filing",
        authority: "MCA (Companies Act, 2013)",
        dueDate: "2026-10-30",
        status: "Green",
        statusText: "Satisfied (FY 2024-25)",
        citation: "Companies Act, 2013 - Section 137",
        description: "Annual balance sheet & financial statement filing with Registrar of Companies.",
        assignedTo: "External CA Auditor",
        evidenceFile: "Form_AOC4_Filing_SRN_Z98765432.pdf",
        cycle: "1-Year Cycle",
      },
      {
        id: "TL-05",
        title: "Form MGT-7: Corporate Annual Return",
        authority: "MCA (Companies Act, 2013)",
        dueDate: "2026-11-29",
        status: "Green",
        statusText: "Satisfied (FY 2024-25)",
        citation: "Companies Act, 2013 - Section 92(4)",
        description: "Annual return of company details, shareholders, and board meetings.",
        assignedTo: "Secretarial Team",
        evidenceFile: "Form_MGT7_Ack_SRN_X12345678.pdf",
        cycle: "1-Year Cycle",
      }
    ],
    auditLogs: [
      {
        id: "act-101",
        actor: "Tax Department Lead",
        avatar: "TD",
        action: "uploaded evidence",
        target: "Form_26Q_Q1_Ack_Receipt.pdf",
        timestamp: "12 minutes ago",
        hash: "0x8f4a9b...7c1d",
        status: "Green",
      },
      {
        id: "act-102",
        actor: "Document Extraction Agent",
        avatar: "AI",
        action: "parsed & matched rule",
        target: "IN-GST-GSTR3B-004 (CGST Act Sec 39)",
        timestamp: "45 minutes ago",
        hash: "0x3e12c9...b50a",
        status: "Green",
      },
      {
        id: "act-103",
        actor: "Compliance Head",
        avatar: "CH",
        action: "created task node",
        target: "Director 2 DIR-3 KYC Verification",
        timestamp: "2 hours ago",
        hash: "0x77c211...99e4",
        status: "Amber",
      }
    ]
  },
  {
    id: "comp-acme",
    name: "Acme Cloud Systems Pvt Ltd",
    cin: "U72200KA2022PTC189234",
    gstin: "29AABCA9876C1Z3",
    sector: "Enterprise Software / B2B",
    entityType: "Private Limited Company",
    state: "Karnataka",
    annualTurnover: "₹12.5 Crore",
    employeeCount: 45,
    score: 92,
    scoreBadge: "Exceptional",
    upcomingDeadlinesCount: 2,
    activeRiskAlertsCount: 0,
    riskAlertMessage: "All statutory filings satisfied for Q2",
    isAutomating: false,
    lastAutomatedAt: "2 hours ago",
    obligations: [
      {
        id: "TL-AC1",
        title: "GSTR-1 Outward Supply Return",
        authority: "CBIC / GSTN",
        dueDate: "2026-08-11",
        status: "Amber",
        statusText: "Due in 7 Days",
        citation: "CGST Act, 2017 - Section 37",
        description: "Monthly filing of outward supplies for July 2026.",
        assignedTo: "Finance Team",
        evidenceFile: "GSTR1_Acme_July2026.pdf",
        cycle: "Monthly Recurring",
      },
      {
        id: "TL-AC2",
        title: "TDS Payment Deposit (Form 281)",
        authority: "Income Tax Department",
        dueDate: "2026-08-07",
        status: "Green",
        statusText: "Satisfied (Deposit Verified)",
        citation: "Income Tax Act 1961 - Sec 200",
        description: "TDS deducted on contractor & employee salary payments.",
        assignedTo: "Accounts Lead",
        evidenceFile: "Challan281_Acme_July2026.pdf",
        cycle: "Monthly Recurring",
      },
      {
        id: "TL-AC3",
        title: "Form AOC-4 Financial Statements",
        authority: "MCA",
        dueDate: "2026-10-30",
        status: "Green",
        statusText: "Auditor Approved",
        citation: "Companies Act, 2013 - Section 137",
        description: "Financials verified by Ernst & Young LLP.",
        assignedTo: "CFO & Audit Desk",
        evidenceFile: "Acme_AOC4_FY25.pdf",
        cycle: "1-Year Cycle",
      }
    ],
    auditLogs: [
      {
        id: "act-ac1",
        actor: "Audit & Hash Engine",
        avatar: "AI",
        action: "generated cryptographic hash",
        target: "EY_Statutory_Audit_Report_2026.pdf",
        timestamp: "2 hours ago",
        hash: "0xaa419f...9b21",
        status: "Green",
      },
      {
        id: "act-ac2",
        actor: "Tax Department Lead",
        avatar: "TD",
        action: "filed return",
        target: "GSTR-3B (July 2026)",
        timestamp: "Yesterday",
        hash: "0x12bb5a...991c",
        status: "Green",
      }
    ]
  },
  {
    id: "comp-fintech",
    name: "FinTech Pay Global India Pvt Ltd",
    cin: "U65999DL2023PTC345678",
    gstin: "07AAFCF4321D1Z9",
    sector: "FinTech & Payments",
    entityType: "Private Limited Company",
    state: "Delhi",
    annualTurnover: "₹35.0 Crore",
    employeeCount: 85,
    score: 64,
    scoreBadge: "Attention Required",
    upcomingDeadlinesCount: 7,
    activeRiskAlertsCount: 4,
    riskAlertMessage: "RBI Cyber Security Compliance Audit & MSME-1 overdue",
    isAutomating: false,
    lastAutomatedAt: "Yesterday",
    obligations: [
      {
        id: "TL-FT1",
        title: "RBI Annual Cyber Security Compliance Return",
        authority: "Reserve Bank of India (RBI)",
        dueDate: "2026-07-31",
        status: "Red",
        statusText: "CRITICAL OVERDUE",
        citation: "RBI Master Direction on Digital Payment Security Controls",
        description: "Mandatory annual VAPT & SOC2 audit report submission to RBI.",
        assignedTo: "CISO & Compliance Desk",
        evidenceFile: "RBI_CyberAudit_Pending.pdf",
        cycle: "Annual Mandatory",
      },
      {
        id: "TL-FT2",
        title: "Form MSME-1 Half Yearly Return",
        authority: "MCA",
        dueDate: "2026-10-31",
        status: "Red",
        statusText: "AT RISK - 45 Day Vendor Delay",
        citation: "Companies Act 2013 - Sec 405",
        description: "Outstanding vendor payments exceeding statutory 45-day limit.",
        assignedTo: "Accounts Payable",
        evidenceFile: "MSME1_FintechPay_Draft.pdf",
        cycle: "6-Month Cycle",
      },
      {
        id: "TL-FT3",
        title: "EPF Monthly Deposit & ECR Filing",
        authority: "EPFO",
        dueDate: "2026-08-15",
        status: "Amber",
        statusText: "Due in 11 Days",
        citation: "EPF Act 1952 - Sec 6",
        description: "PF calculation for 85 headcount.",
        assignedTo: "HR Director",
        evidenceFile: "EPF_Fintech_Aug26.pdf",
        cycle: "Monthly Recurring",
      }
    ],
    auditLogs: [
      {
        id: "act-ft1",
        actor: "Penalty Risk Scanner",
        avatar: "AI",
        action: "flagged high vulnerability exposure",
        target: "RBI Master Direction Sec 4.2",
        timestamp: "3 hours ago",
        hash: "0xe77811...33ba",
        status: "Red",
      },
      {
        id: "act-ft2",
        actor: "CISO Desk",
        avatar: "CS",
        action: "requested extension",
        target: "RBI Digital Audit Review",
        timestamp: "5 hours ago",
        hash: "0x44c10a...129d",
        status: "Amber",
      }
    ]
  },
  {
    id: "comp-horizon",
    name: "Horizon Health Diagnostics Ltd",
    cin: "L85110TN2021PLC078901",
    gstin: "33AAACH5678E1Z2",
    sector: "Healthcare & Biotech",
    entityType: "Public Limited Company",
    state: "Tamil Nadu",
    annualTurnover: "₹50.0 Crore",
    employeeCount: 120,
    score: 88,
    scoreBadge: "High Readiness",
    upcomingDeadlinesCount: 3,
    activeRiskAlertsCount: 1,
    riskAlertMessage: "Bio-Medical Waste License Renewal approaching",
    isAutomating: false,
    lastAutomatedAt: "3 hours ago",
    obligations: [
      {
        id: "TL-HZ1",
        title: "Bio-Medical Waste Management Annual Report",
        authority: "State Pollution Control Board (TNPCB)",
        dueDate: "2026-08-30",
        status: "Amber",
        statusText: "Due in 26 Days",
        citation: "Bio-Medical Waste Management Rules 2016 - Rule 13",
        description: "Annual disposal metrics & incineration logs for 4 diagnostic centers.",
        assignedTo: "EHS Officer",
        evidenceFile: "TNPCB_BMW_Report2026.pdf",
        cycle: "Annual Cycle",
      },
      {
        id: "TL-HZ2",
        title: "Form MGT-7 Annual Return",
        authority: "MCA",
        dueDate: "2026-11-29",
        status: "Green",
        statusText: "Satisfied (FY 2024-25)",
        citation: "Companies Act 2013 - Sec 92",
        description: "Public listed company filing complete.",
        assignedTo: "Company Secretary",
        evidenceFile: "MGT7_HorizonHealth.pdf",
        cycle: "1-Year Cycle",
      }
    ],
    auditLogs: [
      {
        id: "act-hz1",
        actor: "Rule Engine Evaluator",
        avatar: "AI",
        action: "updated state rule set",
        target: "TNPCB Bio-Medical Amendment 2026",
        timestamp: "4 hours ago",
        hash: "0x22f188...881e",
        status: "Green",
      }
    ]
  }
];

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [activeCompanyId, setActiveCompanyId] = useState("comp-apex");
  const [automationStatus, setAutomationStatus] = useState({ isRunning: false, currentStep: 0, logMessage: '' });

  // Save/load active company selection
  useEffect(() => {
    try {
      const savedId = localStorage.getItem('docket_active_company_id');
      if (savedId && companies.some(c => c.id === savedId)) {
        setActiveCompanyId(savedId);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const changeActiveCompany = (companyId) => {
    setActiveCompanyId(companyId);
    try {
      localStorage.setItem('docket_active_company_id', companyId);
      const target = companies.find(c => c.id === companyId);
      if (target) {
        localStorage.setItem('docket_active_workspace', target.name);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeCompany = companies.find(c => c.id === activeCompanyId) || companies[0];

  const addCompany = (newCompanyData) => {
    const newId = `comp-${Date.now()}`;
    const formatted = {
      id: newId,
      name: newCompanyData.name || "New Venture Pvt Ltd",
      cin: newCompanyData.cin || `U72900KA${new Date().getFullYear()}PTC${Math.floor(100000 + Math.random() * 900000)}`,
      gstin: newCompanyData.gstin || `29AAACG${Math.floor(1000 + Math.random() * 9000)}F1Z5`,
      sector: newCompanyData.sector || "Technology / SaaS",
      entityType: newCompanyData.entityType || "Private Limited Company",
      state: newCompanyData.state || "Karnataka",
      annualTurnover: newCompanyData.turnover || "₹1.0 Crore",
      employeeCount: newCompanyData.employees || 10,
      score: 75,
      scoreBadge: "Baseline Configured",
      upcomingDeadlinesCount: 3,
      activeRiskAlertsCount: 1,
      riskAlertMessage: "First-year statutory setup pending",
      isAutomating: false,
      lastAutomatedAt: "Just created",
      obligations: [
        {
          id: `TL-NEW-1`,
          title: "Form INC-20A Business Commencement Declaration",
          authority: "MCA",
          dueDate: "2026-09-15",
          status: "Amber",
          statusText: "Due in 35 Days",
          citation: "Companies Act 2013 - Sec 10A",
          description: "Declaration of share capital deposit by founders.",
          assignedTo: "Company Secretary",
          evidenceFile: "Bank_Capital_Deposit.pdf",
          cycle: "One-Time",
        },
        {
          id: `TL-NEW-2`,
          title: "GST Registration & GSTR-3B Return Setup",
          authority: "CBIC / GSTN",
          dueDate: "2026-08-20",
          status: "Amber",
          statusText: "Due in 16 Days",
          citation: "CGST Act 2017 - Sec 22",
          description: "Monthly tax filing configuration.",
          assignedTo: "Tax Lead",
          evidenceFile: "GST_Certificate.pdf",
          cycle: "Monthly",
        }
      ],
      auditLogs: [
        {
          id: `act-${Date.now()}`,
          actor: "Orchestrator AI",
          avatar: "AI",
          action: "created workspace node",
          target: newCompanyData.name,
          timestamp: "Just now",
          hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          status: "Green",
        }
      ]
    };

    setCompanies(prev => [formatted, ...prev]);
    changeActiveCompany(newId);
    return formatted;
  };

  // Real-time AI Automation Engine Trigger
  const runAutomationForCompany = async (companyId = activeCompanyId) => {
    const targetCompany = companies.find(c => c.id === companyId);
    if (!targetCompany || targetCompany.isAutomating) return;

    // Mark company as automating
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, isAutomating: true } : c));
    setAutomationStatus({ isRunning: true, currentStep: 1, logMessage: `Initiating multi-agent compliance scan for ${targetCompany.name}...` });

    try {
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessDescription: `${targetCompany.name} - ${targetCompany.sector}, ${targetCompany.annualTurnover} turnover, ${targetCompany.employeeCount} employees`,
          sector: targetCompany.sector,
          turnover: targetCompany.annualTurnover,
          employees: targetCompany.employeeCount,
          founders: 2,
          fdi: false
        })
      });

      if (!response.body) throw new Error("No stream available");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));

              if (data.type === 'agent:update') {
                setAutomationStatus({
                  isRunning: true,
                  currentStep: data.step,
                  logMessage: `[Agent ${data.step}] ${data.message}`
                });

                // Add real-time audit log step into the company's audit feed
                const newLog = {
                  id: `act-auto-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                  actor: `Agent ${data.step}`,
                  avatar: "AI",
                  action: "processed task",
                  target: data.message,
                  timestamp: "Just now",
                  hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
                  status: data.status === 'error' ? 'Red' : 'Green',
                };

                setCompanies(prev => prev.map(c => {
                  if (c.id === companyId) {
                    return {
                      ...c,
                      auditLogs: [newLog, ...c.auditLogs.slice(0, 10)]
                    };
                  }
                  return c;
                }));
              }
              else if (data.type === 'agent:complete') {
                if (data.step === 3 && data.output?.totalExposure) {
                  // Real-time update exposure & score calculation
                  setCompanies(prev => prev.map(c => {
                    if (c.id === companyId) {
                      const newScore = Math.min(98, Math.max(70, c.score + 5));
                      return {
                        ...c,
                        score: newScore,
                        scoreBadge: newScore >= 90 ? "Exceptional" : newScore >= 80 ? "High Readiness" : "Satisfactory",
                        activeRiskAlertsCount: data.output.criticalCount || 0,
                      };
                    }
                    return c;
                  }));
                }
              }
              else if (data.type === 'workflow:complete') {
                const finalHash = data.hash ? data.hash.substring(0, 14) : `0x${Math.random().toString(16).substring(2, 10)}`;
                const finalLog = {
                  id: `act-complete-${Date.now()}`,
                  actor: "Audit & Hash Engine",
                  avatar: "AI",
                  action: "sealed compliance ledger hash",
                  target: `Workflow ${data.workflowId}`,
                  timestamp: "Just now",
                  hash: finalHash,
                  status: "Green",
                };

                setCompanies(prev => prev.map(c => {
                  if (c.id === companyId) {
                    const postScore = Math.min(96, c.score + 4);
                    return {
                      ...c,
                      isAutomating: false,
                      lastAutomatedAt: "Just now",
                      score: postScore,
                      scoreBadge: postScore >= 90 ? "Exceptional" : "High Readiness",
                      auditLogs: [finalLog, ...c.auditLogs.slice(0, 10)]
                    };
                  }
                  return c;
                }));

                setAutomationStatus({ isRunning: false, currentStep: 5, logMessage: `Automation complete for ${targetCompany.name}!` });
              }
            } catch (err) {
              console.error('Error parsing SSE event in CompanyContext', err);
            }
          }
        }
      }
    } catch (err) {
      console.error('Automation error:', err);
      setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, isAutomating: false } : c));
      setAutomationStatus({ isRunning: false, currentStep: 0, logMessage: `Automation error: ${err.message}` });
    }
  };

  const addAuditLog = (companyId, log) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        return {
          ...c,
          auditLogs: [log, ...c.auditLogs]
        };
      }
      return c;
    }));
  };

  const updateObligationStatus = (companyId, obligationId, newStatus, newStatusText) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        const updatedObligations = c.obligations.map(ob => {
          if (ob.id === obligationId) {
            return { ...ob, status: newStatus, statusText: newStatusText };
          }
          return ob;
        });

        // Recalculate metrics
        const redCount = updatedObligations.filter(o => o.status === 'Red').length;
        const amberCount = updatedObligations.filter(o => o.status === 'Amber').length;
        const total = updatedObligations.length;
        const greenCount = updatedObligations.filter(o => o.status === 'Green').length;
        const newScore = Math.round((greenCount / total) * 100);

        return {
          ...c,
          obligations: updatedObligations,
          activeRiskAlertsCount: redCount,
          upcomingDeadlinesCount: amberCount,
          score: newScore,
          scoreBadge: newScore >= 90 ? "Exceptional" : newScore >= 75 ? "High Readiness" : "Attention Needed"
        };
      }
      return c;
    }));
  };

  return (
    <CompanyContext.Provider value={{
      companies,
      activeCompany,
      activeCompanyId,
      changeActiveCompany,
      addCompany,
      runAutomationForCompany,
      automationStatus,
      addAuditLog,
      updateObligationStatus
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
