"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  HeartPulse, 
  Factory, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function SectorComplianceModules() {
  const [activeSector, setActiveSector] = useState('healthcare');

  const sectorsData = {
    healthcare: {
      name: "Healthcare & HealthTech Data Compliance",
      icon: HeartPulse,
      accent: "text-rose-600 bg-rose-50 border-rose-200",
      description: "Digital Personal Data Protection Act 2023 (DPDP) compliance for electronic health records (EHR) & patient consent trails.",
      modules: [
        { title: "DPDP Patient Explicit Consent Logger", authority: "Data Protection Board of India", status: "Active Mapping", freq: "Per Patient Intake", ruleId: "IN-DPDP-EHR-2023" },
        { title: "DISHA Medical Records Security Audit", authority: "Ministry of Health & Family Welfare", status: "Verified", freq: "Annual Audit", ruleId: "IN-HEALTH-DISHA-001" },
        { title: "Biomedical Waste Management License", authority: "State Pollution Control Board", status: "Compliant", freq: "Annual Renewal", ruleId: "IN-BMW-RENEWAL-2026" },
      ]
    },
    manufacturing: {
      name: "Manufacturing & Industrial Environmental Clearance",
      icon: Factory,
      accent: "text-amber-600 bg-amber-50 border-amber-200",
      description: "Consent to Establish (CTE) & Consent to Operate (CTO) environmental compliance engines for plant operations.",
      modules: [
        { title: "Consent to Establish (CTE) Water & Air Act", authority: "State Pollution Control Board (SPCB)", status: "Approved", freq: "Pre-Commissioning", ruleId: "IN-SPCB-CTE-2024" },
        { title: "Consent to Operate (CTO) Plant License", authority: "SPCB / MoEFCC", status: "Due for Renewal (60 Days)", freq: "5-Year Cycle", ruleId: "IN-SPCB-CTO-2026" },
        { title: "Hazardous Waste Return Filing (Form 4)", authority: "SPCB Environment Cell", status: "Satisfied", freq: "Annual (June 30)", ruleId: "IN-HAZWASTE-FORM4" },
      ]
    },
    semiconductor: {
      name: "Semiconductor & Hardware Tech Incentives (SPECS / ISM)",
      icon: Cpu,
      accent: "text-indigo-600 bg-indigo-50 border-indigo-200",
      description: "MeitY SPECS & India Semiconductor Mission (ISM) capital expenditure compliance and incentive disbursement reporting.",
      modules: [
        { title: "SPECS Capital Expenditure (CapEx) Audit", authority: "Ministry of Electronics & IT (MeitY)", status: "Active Tracking", freq: "Quarterly Audit", ruleId: "IN-MEITY-SPECS-004" },
        { title: "ISM Fab Subsidy Disbursement Declaration", authority: "India Semiconductor Mission", status: "Approved", freq: "Milestone-Based", ruleId: "IN-ISM-CHIP-SUB-01" },
        { title: "Customs Concessional Duty Export-Import Log", authority: "CBIC / Customs Dept", status: "Verified", freq: "Monthly", ruleId: "IN-CUSTOMS-IGCR-2026" },
      ]
    }
  };

  const currentSector = sectorsData[activeSector];
  const IconComponent = currentSector.icon;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-900 text-white">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Sector-Specific Compliance Modules</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Specialized regulatory mapping engines covering DPDP Healthcare, Manufacturing Environmental Clearances, and Semiconductor Schemes.
          </p>
        </div>
      </div>

      {/* Sector Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.keys(sectorsData).map(key => {
          const sec = sectorsData[key];
          const SecIcon = sec.icon;
          const isActive = activeSector === key;

          return (
            <button
              key={key}
              onClick={() => setActiveSector(key)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <SecIcon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-700'}`} />
                <span className="text-xs font-bold">{sec.name.split(' ')[0]} Module</span>
              </div>
              <p className={`text-[11px] ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                {sec.modules.length} Specialized Statutory Rules
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Sector Modules Detail */}
      <div className="enterprise-card p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className={`p-2.5 rounded-xl border ${currentSector.accent}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{currentSector.name}</h2>
            <p className="text-xs text-slate-600">{currentSector.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          {currentSector.modules.map((mod, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900">{mod.title}</span>
                  <span className="font-mono text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {mod.ruleId}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px] block">
                  Authority: <strong>{mod.authority}</strong> • Frequency: {mod.freq}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {mod.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
