import React, { useState } from 'react';
import { 
  Zap, 
  Code2, 
  Terminal, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  Cpu, 
  ShieldCheck, 
  Play, 
  Sliders,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';

export const AGENT_SKILLS_MANIFEST = [
  {
    id: "mca-secretarial-skill",
    name: "MCA Statutory Compliance Skill",
    version: "v2.1.0",
    author: "Anthropic Agent Skills Standard",
    description: "Evaluates Companies Act 2013 filings (AOC-4, MGT-7, DIR-3 KYC, ADT-1) against RoC state & central rules.",
    status: "active",
    tools: ["evaluate_mca_thresholds", "verify_din_kyc_status", "calculate_aoc4_late_fee"],
    instructions: "Reads company profile JSON -> Matches against RoC filing dates -> Emits structured ObligationInstance records.",
    lastExecution: "Executed 12s ago (Result: 3 Rules Matched)",
  },
  {
    id: "gst-tax-skill",
    name: "CBIC / GSTN Tax Compliance Skill",
    version: "v1.4.2",
    author: "Vercel AI SDK Standard",
    description: "Parses GSTR-1 & GSTR-3B filings, calculates CGST/SGST/IGST liability, and reconciles against 26AS/GSTR-2B.",
    status: "active",
    tools: ["parse_gstr3b_ack", "reconcile_itc_2b", "check_gstr1_blocking"],
    instructions: "Ingests monthly turnover & ITC receipts -> Matches CGST Act Sec 39 -> Verifies filing ARN checksum.",
    lastExecution: "Executed 45s ago (Result: GSTR-3B Pending Action)",
  },
  {
    id: "vlm-layout-ocr-skill",
    name: "LayoutLMv3 Vision OCR Skill",
    version: "v3.0.0",
    author: "Document Intelligence Agent",
    description: "Layout-aware vision model parsing scanned PDFs, statutory receipts, signatures, and government seals.",
    status: "active",
    tools: ["extract_pdf_layout", "vlm_bounding_box_extract", "verify_arn_signature"],
    instructions: "Receives raw PDF buffer -> Runs spatial layout parsing -> Populates structured Evidence JSON with 98%+ confidence.",
    lastExecution: "Executed 1m ago (Result: Parsed GSTR_3B_Ack.pdf)",
  },
  {
    id: "dpdp-privacy-skill",
    name: "MeitY DPDP Data Privacy Skill",
    version: "v1.0.1",
    author: "Sectoral Compliance Module",
    description: "Evaluates personal data processing activities, consent architecture, and data fiduciary statutory requirements.",
    status: "active",
    tools: ["audit_data_fiduciary_consent", "flag_dpdp_breach_risk"],
    instructions: "Maps data flows -> Identifies patient/user PII -> Emits DPDP compliance requirements & consent logs.",
    lastExecution: "Standby (Ready for Sectoral Trigger)",
  },
  {
    id: "temporal-orchestrator-spine",
    name: "Temporal Durable Workflow Spine",
    version: "v1.9.0",
    author: "System Workflow Core",
    description: "Provides state persistence, retry policies, human-in-the-loop approval pauses, and replay audit logs.",
    status: "active",
    tools: ["start_compliance_workflow", "pause_for_sme_approval", "append_audit_event"],
    instructions: "Wraps LangGraph state transitions in durable event history. Guarantees 0% state loss on failure.",
    lastExecution: "Running Continuous Heartbeat",
  },
];

export default function AgentSkillsDrawer({ isOpen, onClose, activeToolCalls }) {
  const [selectedSkill, setSelectedSkill] = useState(AGENT_SKILLS_MANIFEST[0]);
  const [expandedTool, setExpandedTool] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="w-full max-w-xl bg-zinc-950 border-l border-zinc-800/80 h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Agent Skills & Tool Execution Inspector
              </h3>
              <p className="text-[11px] text-zinc-400">Anthropic & Vercel AI Agent Open Standard Manifest</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          
          {/* Active Skills Selector Grid */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              Loaded Active Skills ({AGENT_SKILLS_MANIFEST.length})
            </span>

            <div className="grid grid-cols-1 gap-2">
              {AGENT_SKILLS_MANIFEST.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSkill.id === skill.id
                      ? 'bg-indigo-950/40 border-indigo-500/80 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-bold text-xs">{skill.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30">
                      {skill.version}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">{skill.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>{skill.author}</span>
                    <span className="text-emerald-400 font-semibold">• {skill.status.toUpperCase()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Skill Instruction & Parameters Breakdown */}
          {selectedSkill && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-bold text-white text-xs">{selectedSkill.name} Execution Spec</span>
                <span className="text-[10px] font-mono text-cyan-400">{selectedSkill.lastExecution}</span>
              </div>

              {/* Instructions */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-mono uppercase block">System Instructions (SKILL.md)</span>
                <p className="text-zinc-200 bg-zinc-950 p-3 rounded-lg border border-zinc-800/80 font-mono text-[11px] leading-relaxed">
                  {selectedSkill.instructions}
                </p>
              </div>

              {/* Tools Offered */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-mono uppercase block">Exposed Agent Tool Call Declarations</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.tools.map((tool) => (
                    <span key={tool} className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-mono text-[10px]">
                      🔧 {tool}()
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Real-time Agent Tool Execution Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Live Agent Tool Call Output Stream
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Tool Tracing
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 font-mono text-cyan-400">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>vlm_parse_document(file="GSTR3B_Jul2026.pdf")</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">200 OK (340ms)</span>
                </div>
                <div className="bg-zinc-900/90 p-2.5 rounded-lg font-mono text-[10px] text-zinc-300 overflow-x-auto border border-zinc-800">
                  {`{ "arn": "AA27072612345", "confidence": 0.987, "status": "MATCHED", "sme_rule": "IN-GST-GSTR3B-004" }`}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 font-mono text-cyan-400">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>evaluate_mca_thresholds(entity="Pvt Ltd", turnover=12500000)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">200 OK (110ms)</span>
                </div>
                <div className="bg-zinc-900/90 p-2.5 rounded-lg font-mono text-[10px] text-zinc-300 overflow-x-auto border border-zinc-800">
                  {`{ "aoc4_required": true, "mgt7_required": true, "dir3_kyc_status": "AT_RISK_DIR2" }`}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-400">
          <span>Standard: <strong className="text-zinc-200">Anthropic + Vercel Agent Skills</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
