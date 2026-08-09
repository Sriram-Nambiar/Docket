"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Layers, 
  Sparkles, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  Sliders, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function EntityTemplatesSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  const templatesList = [
    {
      id: 'tmpl-pvt',
      name: 'Private Limited Company (SaaS / Tech)',
      tagline: 'Ideal for VC fundraising & ESOP creation',
      baselineStackCount: 14,
      authorities: ['MCA', 'CBIC/GSTN', 'Income Tax', 'EPFO'],
      compliances: ['Form AOC-4 Financials', 'Form MGT-7 Annual Return', 'DIR-3 KYC', 'GSTR-3B Monthly', 'ITR-6'],
      recommendedFor: 'Startups, SaaS platforms, VC-funded tech entities'
    },
    {
      id: 'tmpl-llp',
      name: 'Limited Liability Partnership (LLP)',
      tagline: 'Low secretarial overhead for professional services',
      baselineStackCount: 8,
      authorities: ['MCA', 'GSTN', 'Income Tax'],
      compliances: ['LLP Form 11 Annual Return', 'LLP Form 8 Statement of Accounts', 'GSTR-3B', 'ITR-5'],
      recommendedFor: 'Consultancies, boutique agencies, joint ventures'
    },
    {
      id: 'tmpl-ngo',
      name: 'Section 8 NGO / Non-Profit Corporation',
      tagline: 'CSR eligible structure with tax exemption stack',
      baselineStackCount: 18,
      authorities: ['MCA', 'Income Tax (12A/80G)', 'FCRA', 'Ministry of Home Affairs'],
      compliances: ['Form AOC-4 (Section 8)', '12A & 80G Annual Filings', 'FCRA Quarterly Declarations'],
      recommendedFor: 'Social enterprises, charitable trusts, foundation labs'
    },
    {
      id: 'tmpl-semicon',
      name: 'Semiconductor & Hardware Tech Plant',
      tagline: 'MeitY SPECS / ISM incentive compliance stack',
      baselineStackCount: 26,
      authorities: ['MeitY / ISM', 'State Pollution Control Board', 'MCA', 'Customs'],
      compliances: ['Consent to Establish (CTE)', 'Consent to Operate (CTO)', 'SPECS Incentive Audit', 'Customs Duty Drawback'],
      recommendedFor: 'Chip fab packaging units, hardware manufacturing plants'
    }
  ];

  const searchIndexMock = [
    { id: 'SEARCH-1', title: 'Form AOC-4 FY 2024-25', entity: 'Apex Tech Pvt Ltd', type: 'Filing', status: 'Satisfied', hash: 'sha256:e8f9a1b...' },
    { id: 'SEARCH-2', title: 'GSTR-3B July 2026 Return', entity: 'Apex Tech Pvt Ltd', type: 'Tax Obligation', status: 'Due in 16 Days', hash: 'sha256:9c8d7e...' },
    { id: 'SEARCH-3', title: 'DIR-3 KYC Sanjay Sharma', entity: 'Apex Tech Pvt Ltd', type: 'Director DIN Verification', status: 'Action Required', hash: 'sha256:1a2b3c...' },
    { id: 'SEARCH-4', title: 'Environmental CTE Clearance', entity: 'Apex Hardware Fab 1', type: 'Regulatory License', status: 'Approved', hash: 'sha256:7f8e9d...' }
  ];

  const filteredSearchResults = searchIndexMock.filter(item => 
    !searchQuery || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Entity Templates & Global Search</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Pre-built entity templates pre-mapped to baseline compliance stacks & global instant search across past filings and audit logs.
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="enterprise-card p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past projects, filings, DINs, statutory rules, or audit hashes (e.g. 'AOC-4', 'DIR-3', 'Apex')..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        {searchQuery && (
          <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Global Search Results ({filteredSearchResults.length})
            </span>
            {filteredSearchResults.map(res => (
              <div key={res.id} className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between font-mono">
                <div>
                  <span className="font-bold text-slate-900 block">{res.title}</span>
                  <span className="text-slate-500 text-[10px]">{res.entity} • {res.type}</span>
                </div>
                <span className="text-emerald-700 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  {res.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workspace Templates List */}
      <div className="space-y-3">
        <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Pre-Mapped Workspace Entity Templates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templatesList.map(tmpl => (
            <div key={tmpl.id} className="enterprise-card p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900">{tmpl.name}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold font-mono">
                    {tmpl.baselineStackCount} Baseline Rules
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">{tmpl.tagline}</p>

                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Statutory Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {tmpl.compliances.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px]">
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Target: <strong>{tmpl.recommendedFor}</strong></span>
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer">
                  <span>Instantiate</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
