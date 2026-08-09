"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Percent, 
  PieChart, 
  Calculator,
  Building2,
  Sparkles
} from 'lucide-react';

export default function FinancialCostTracking() {
  const financialMetrics = {
    totalMaintenanceCost: "₹4,85,000 / year",
    penaltyRiskExposure: "₹2,40,000",
    potentialSavings: "₹1,15,000",
    complianceROI: "340%",
    breakdownByAuthority: [
      { authority: 'MCA (Secretarial & Financials)', cost: '₹1,20,000', penaltyRisk: '₹50,000', status: 'High Risk (DIR-3 OTP)' },
      { authority: 'CBIC / GSTN (Monthly Returns)', cost: '₹2,10,000', penaltyRisk: '₹1,20,000', status: 'Moderate (Interest calculation)' },
      { authority: 'Income Tax Dept (ITR-6 & TDS)', cost: '₹95,000', penaltyRisk: '₹40,000', status: 'Compliant' },
      { authority: 'EPFO & ESIC (Payroll)', cost: '₹60,000', penaltyRisk: '₹30,000', status: 'On Track' },
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Calculator className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Financial & Cost Impact Tracking</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Translates compliance actions into monetary metrics, calculates operational maintenance costs, penalty exposures, and savings.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
          Currency: INR (₹) Baseline
        </span>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="enterprise-card p-5 space-y-2">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
            Annual Compliance Cost
          </span>
          <div className="text-xl font-extrabold text-slate-900 font-mono">
            {financialMetrics.totalMaintenanceCost}
          </div>
          <span className="text-[11px] text-slate-500 block">CA retainer + secretarial + portal fees</span>
        </div>

        <div className="enterprise-card p-5 space-y-2 border-l-4 border-l-rose-500">
          <span className="text-[10px] font-extrabold uppercase text-rose-500 tracking-wider block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Penalty Risk Exposure
          </span>
          <div className="text-xl font-extrabold text-rose-700 font-mono">
            {financialMetrics.penaltyRiskExposure}
          </div>
          <span className="text-[11px] text-rose-600 block font-semibold">DIR-3 KYC delay + GSTR interest</span>
        </div>

        <div className="enterprise-card p-5 space-y-2 border-l-4 border-l-emerald-500">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Cost Reduction Potential
          </span>
          <div className="text-xl font-extrabold text-emerald-700 font-mono">
            {financialMetrics.potentialSavings}
          </div>
          <span className="text-[11px] text-emerald-600 block font-semibold">Early ITC reconciliation & automated pre-fill</span>
        </div>

        <div className="enterprise-card p-5 space-y-2 bg-slate-900 text-white">
          <span className="text-[10px] font-extrabold uppercase text-indigo-400 tracking-wider block">
            Compliance Automation ROI
          </span>
          <div className="text-xl font-extrabold text-white font-mono">
            {financialMetrics.complianceROI}
          </div>
          <span className="text-[11px] text-slate-400 block">Prevented penalties vs software investment</span>
        </div>

      </div>

      {/* Breakdown Table */}
      <div className="enterprise-card p-6 space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Monetary Cost & Risk Breakdown by Statutory Authority
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] bg-slate-50">
                <th className="p-3">Statutory Authority Scope</th>
                <th className="p-3">Annual Maintenance Cost</th>
                <th className="p-3">Penalty Exposure Risk</th>
                <th className="p-3">Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {financialMetrics.breakdownByAuthority.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-sans font-bold text-slate-900">{item.authority}</td>
                  <td className="p-3 text-slate-800 font-bold">{item.cost}</td>
                  <td className="p-3 text-rose-700 font-bold">{item.penaltyRisk}</td>
                  <td className="p-3 font-sans font-semibold">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      item.status.includes('High') ? 'bg-rose-100 text-rose-800' :
                      item.status.includes('Moderate') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
