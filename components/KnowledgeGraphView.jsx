"use client";

import React, { useState } from 'react';
import { 
  GitBranch, 
  Building2, 
  FileCheck, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Search, 
  ChevronRight,
  Database
} from 'lucide-react';

export default function KnowledgeGraphView() {
  const [selectedNode, setSelectedNode] = useState('entity-1');

  const nodes = [
    { id: 'entity-1', label: 'Apex Technologies Pvt Ltd', type: 'Entity', detail: 'Private Limited Company (CIN: U72900MH2024PTC412345)' },
    { id: 'ob-1', label: 'Form AOC-4 Financial Filing Mandate', type: 'Obligation', detail: 'Companies Act 2013 Sec 137 • Annual Statutory Mandate' },
    { id: 'ob-2', label: 'DIR-3 KYC Director Verification', type: 'Obligation', detail: 'Director 2 (Sanjay Sharma) Annual Mobile/Email KYC' },
    { id: 'deadline-1', label: 'Statutory Deadline: Oct 30, 2026', type: 'Deadline', detail: 'Due in 83 Days • Registrar of Companies (ROC Mumbai)' },
    { id: 'evidence-1', label: 'Form_AOC4_Filing_SRN_Z987.pdf', type: 'Evidence Document', detail: 'Verified Hash: sha256:e8f9a1b2c3d4e5f6... • Status: Satisfied' },
    { id: 'evidence-2', label: 'DIR3_KYC_Pending_Director2.pdf', type: 'Evidence Document', detail: 'Pending Evidence Upload • Status: Action Required' }
  ];

  const connections = [
    { from: 'Apex Technologies Pvt Ltd', to: 'Form AOC-4 Financial Filing Mandate', relationship: 'HAS_OBLIGATION' },
    { from: 'Form AOC-4 Financial Filing Mandate', to: 'Statutory Deadline: Oct 30, 2026', relationship: 'ANCHORED_TO_DEADLINE' },
    { from: 'Form AOC-4 Financial Filing Mandate', to: 'Form_AOC4_Filing_SRN_Z987.pdf', relationship: 'SATISFIED_BY_EVIDENCE' },
    { from: 'Apex Technologies Pvt Ltd', to: 'DIR-3 KYC Director Verification', relationship: 'HAS_OBLIGATION' },
    { from: 'DIR-3 KYC Director Verification', to: 'DIR3_KYC_Pending_Director2.pdf', relationship: 'REQUIRES_EVIDENCE' },
  ];

  const currentNode = nodes.find(n => n.id === selectedNode) || nodes[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Knowledge Graph Database (Neo4j Multi-Layer Mapping)</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Programmatically connects Entity ➔ Statutory Obligations ➔ Deadlines ➔ Uploaded Evidence for 100% full statutory traceability.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
          Cypher Query Engine Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph Canvas Visualizer */}
        <div className="lg:col-span-2 enterprise-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-600" /> Interactive Knowledge Graph Visualizer
            </span>
            <span className="text-[10px] font-mono text-slate-500">6 Graph Nodes • 5 Directed Edges</span>
          </div>

          <div className="p-6 rounded-xl bg-slate-900 text-white min-h-[340px] space-y-6 overflow-x-auto font-mono">
            <div className="text-[11px] text-slate-400 mb-4 border-b border-slate-800 pb-2 flex justify-between">
              <span>MATCH (e:Entity)-[:HAS_OBLIGATION]-&gt;(o:Obligation)-[:SATISFIED_BY]-&gt;(doc:Evidence)</span>
              <span className="text-emerald-400">Status: Replayable</span>
            </div>

            {/* Simulated Node Relationship Graph */}
            <div className="space-y-4 text-xs">
              
              {/* Entity Core Node */}
              <div 
                onClick={() => setSelectedNode('entity-1')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedNode === 'entity-1' ? 'bg-indigo-900/80 border-indigo-400 shadow-md' : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-white font-sans">Apex Technologies Pvt Ltd</span>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30">
                  Node: Root Entity
                </span>
              </div>

              {/* Directed Relationship Arrows to Obligations */}
              <div className="pl-6 space-y-3 border-l-2 border-slate-700">
                
                {/* Obligation 1 */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    └─ [:HAS_OBLIGATION] ──►
                  </span>
                  <div 
                    onClick={() => setSelectedNode('ob-1')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedNode === 'ob-1' ? 'bg-emerald-900/80 border-emerald-400 shadow-md' : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-slate-200 font-sans">Form AOC-4 Financial Filing Mandate</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Obligation</span>
                  </div>

                  <div className="pl-6 space-y-2 border-l-2 border-emerald-700/50 text-[11px]">
                    <span className="text-cyan-400 font-bold block">├─ [:ANCHORED_TO_DEADLINE] ──► Statutory Deadline: Oct 30, 2026</span>
                    <span className="text-emerald-400 font-bold block">└─ [:SATISFIED_BY_EVIDENCE] ──► Form_AOC4_Filing_SRN_Z987.pdf</span>
                  </div>
                </div>

                {/* Obligation 2 */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-amber-400 font-bold block">
                    └─ [:HAS_OBLIGATION] ──►
                  </span>
                  <div 
                    onClick={() => setSelectedNode('ob-2')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedNode === 'ob-2' ? 'bg-amber-900/80 border-amber-400 shadow-md' : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-slate-200 font-sans">DIR-3 KYC Director Verification</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Obligation</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Selected Node Property Inspector */}
        <div className="enterprise-card p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Neo4j Node Property Inspector
            </span>
            <h3 className="text-base font-bold text-slate-900">{currentNode.label}</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Node Type</span>
              <span className="font-bold text-slate-900 font-mono">{currentNode.type}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Statutory Context</span>
              <p className="text-slate-700 leading-relaxed font-sans">{currentNode.detail}</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-mono text-[11px] space-y-1">
              <span className="font-bold block font-sans">Traceability Anchor</span>
              <span>Provenanced Hash: <strong>sha256:e8f9a1b2c3d4...</strong></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
