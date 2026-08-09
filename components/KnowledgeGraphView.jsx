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
            <span className="p-2 rounded-sm bg-verified-light text-verified">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-xl font-semibold text-ink tracking-tight">Knowledge Graph Database (Neo4j Multi-Layer Mapping)</h1>
          </div>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            Programmatically connects Entity ➔ Statutory Obligations ➔ Deadlines ➔ Uploaded Evidence for 100% full statutory traceability.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-sm bg-verified-light border border-verified/20 text-verified text-sm font-mono font-bold">
          Cypher Query Engine Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph Canvas Visualizer */}
        <div className="lg:col-span-2 ledger-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <span className="text-sm font-bold text-ink flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-amber" /> Interactive Knowledge Graph Visualizer
            </span>
            <span className="text-sm font-mono text-muted">6 Graph Nodes • 5 Directed Edges</span>
          </div>

          <div className="p-6 rounded-sm bg-paper text-ink min-h-[340px] space-y-6 overflow-x-auto border border-hairline">
            <div className="text-sm text-muted font-mono mb-4 border-b border-hairline pb-2 flex justify-between">
              <span>MATCH (e:Entity)-[:HAS_OBLIGATION]-&gt;(o:Obligation)-[:SATISFIED_BY]-&gt;(doc:Evidence)</span>
              <span className="text-verified font-sans font-semibold">Status: Replayable</span>
            </div>

            {/* Simulated Node Relationship Graph */}
            <div className="space-y-4 text-sm font-sans">
              
              {/* Entity Core Node */}
              <div 
                onClick={() => setSelectedNode('entity-1')}
                className={`p-3.5 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                  selectedNode === 'entity-1' ? 'bg-[#0F172A] border-[#0F172A]' : 'bg-surface border-hairline'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className={`w-4 h-4 ${selectedNode === 'entity-1' ? 'text-white' : 'text-ink'}`} />
                  <span className={`font-semibold ${selectedNode === 'entity-1' ? 'text-white' : 'text-ink'}`}>Apex Technologies Pvt Ltd</span>
                </div>
                <span className={`text-sm px-2 py-0.5 rounded-sm ${selectedNode === 'entity-1' ? 'bg-white/20 text-white' : 'bg-paper-warm text-muted border border-hairline'}`}>
                  Node: Root Entity
                </span>
              </div>

              {/* Directed Relationship Arrows to Obligations */}
              <div className="pl-6 space-y-3 border-l border-hairline">
                
                {/* Obligation 1 */}
                <div className="space-y-2">
                  <span className="text-sm text-muted font-mono block">
                    └─ [:HAS_OBLIGATION] ──►
                  </span>
                  <div 
                    onClick={() => setSelectedNode('ob-1')}
                    className={`p-3 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                      selectedNode === 'ob-1' ? 'bg-verified border-verified' : 'bg-surface border-hairline'
                    }`}
                  >
                    <span className={`font-semibold ${selectedNode === 'ob-1' ? 'text-white' : 'text-ink'}`}>Form AOC-4 Financial Filing Mandate</span>
                    <span className={`text-sm px-2 py-0.5 rounded-sm ${selectedNode === 'ob-1' ? 'bg-white/20 text-white' : 'bg-paper-warm text-muted'}`}>Obligation</span>
                  </div>

                  <div className="pl-6 space-y-2 border-l border-hairline text-sm">
                    <span className="text-muted font-mono block">├─ [:ANCHORED_TO_DEADLINE] ──► Statutory Deadline: Oct 30, 2026</span>
                    <span className="text-muted font-mono block">└─ [:SATISFIED_BY_EVIDENCE] ──► Form_AOC4_Filing_SRN_Z987.pdf</span>
                  </div>
                </div>

                {/* Obligation 2 */}
                <div className="space-y-2 pt-2">
                  <span className="text-sm text-muted font-mono block">
                    └─ [:HAS_OBLIGATION] ──►
                  </span>
                  <div 
                    onClick={() => setSelectedNode('ob-2')}
                    className={`p-3 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                      selectedNode === 'ob-2' ? 'bg-verified border-verified' : 'bg-surface border-hairline'
                    }`}
                  >
                    <span className={`font-semibold ${selectedNode === 'ob-2' ? 'text-white' : 'text-ink'}`}>DIR-3 KYC Director Verification</span>
                    <span className={`text-sm px-2 py-0.5 rounded-sm ${selectedNode === 'ob-2' ? 'bg-white/20 text-white' : 'bg-paper-warm text-muted'}`}>Obligation</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Selected Node Property Inspector */}
        <div className="ledger-card p-4 space-y-4">
          <div className="border-b border-hairline pb-3">
            <span className="text-sm font-bold text-muted uppercase tracking-wider block font-mono">
              Neo4j Node Property Inspector
            </span>
            <h3 className="font-serif text-base font-semibold text-ink mt-1">{currentNode.label}</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-sm bg-surface border border-hairline">
              <span className="text-sm font-bold text-muted block uppercase">Node Type</span>
              <span className="font-bold text-ink font-mono mt-1 block">{currentNode.type}</span>
            </div>

            <div className="p-3 rounded-sm bg-surface border border-hairline">
              <span className="text-sm font-bold text-muted block uppercase">Statutory Context</span>
              <p className="text-ink leading-relaxed font-sans mt-1">{currentNode.detail}</p>
            </div>

            <div className="p-3 rounded-sm bg-verified-light border border-verified/20 text-verified font-mono text-sm space-y-1">
              <span className="font-bold block font-sans">Traceability Anchor</span>
              <span className="block mt-1">Provenanced Hash: <strong>sha256:e8f9a1b2c3d4...</strong></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
