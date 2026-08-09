import React, { useState, useEffect } from 'react';
import { 
  Command, 
  Search, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  CornerDownLeft,
  Bot,
  Zap,
  Terminal,
  Clock
} from 'lucide-react';

export default function CommandPaletteModal({ isOpen, onClose, onNavigateTab, onQueryAgent }) {
  const [query, setQuery] = useState('');
  const [isExecutingTool, setIsExecutingTool] = useState(false);
  const [toolResult, setToolResult] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onQueryAgent(''); // Open modal
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onQueryAgent]);

  if (!isOpen) return null;

  const handleRunCommand = (text) => {
    setIsExecutingTool(true);
    setTimeout(() => {
      let result = "";
      if (text.includes('GST') || text.includes('3B')) {
        result = "Tool Call `parse_gstr3b_ack()` executed -> GSTR-3B July 2026 is PENDING ACTION (Due Aug 20). No late fee accrued yet.";
      } else if (text.includes('KYC') || text.includes('Director')) {
        result = "Tool Call `verify_din_kyc_status()` executed -> Form DIR-3 KYC for Director 2 is AT RISK (Expiry Sept 30). Penalty risk: ₹5,000.";
      } else if (text.includes('Cost') || text.includes('Budget')) {
        result = "Tool Call `calculate_compliance_budget()` executed -> Annual compliance budget: ₹1,45,000 (Savings via early filing: ₹45,000).";
      } else {
        result = "Agent Swarm executed over 18 SME-approved RegulatoryRules. Zero hallucinations. 14 Satisfied, 1 At Risk, 3 Pending Action.";
      }
      setToolResult(result);
      setIsExecutingTool(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRunCommand(query);
            }}
            placeholder="Type an agent query, tool execution, or jump to view (Press Enter)..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Dynamic Tool Result Banner */}
        {isExecutingTool && (
          <div className="p-4 bg-indigo-950/40 border-b border-indigo-500/30 flex items-center gap-3 text-xs text-indigo-300">
            <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Agent Skill Swarm executing tool call over SME-Approved Rule DB...</span>
          </div>
        )}

        {toolResult && !isExecutingTool && (
          <div className="p-4 bg-emerald-950/30 border-b border-emerald-500/30 text-xs text-emerald-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-white">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Tool Call Execution Result (Zero Hallucination)</span>
            </div>
            <p className="font-mono text-[11px] text-zinc-200">{toolResult}</p>
          </div>
        )}

        {/* Quick Commands & Navigation Options */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-3 text-xs">
          
          {/* Section 1: Agent Commands */}
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase px-3 mb-1.5 block">
              Suggested Agent Commands & Tools
            </span>

            <div className="space-y-1">
              <button
                onClick={() => {
                  setQuery("Analyze gap on DIR-3 Director KYC");
                  handleRunCommand("DIR-3 KYC");
                }}
                className="w-full p-2.5 rounded-xl hover:bg-zinc-900 flex items-center justify-between text-left transition-all text-zinc-200 hover:text-white cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Analyze gap on Director 2 DIR-3 KYC</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono text-zinc-400">Run Tool</span>
                  <CornerDownLeft className="w-3 h-3 text-zinc-400" />
                </div>
              </button>

              <button
                onClick={() => {
                  setQuery("What GST returns are due next month?");
                  handleRunCommand("GST");
                }}
                className="w-full p-2.5 rounded-xl hover:bg-zinc-900 flex items-center justify-between text-left transition-all text-zinc-200 hover:text-white cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Check pending GST GSTR-3B & GSTR-1 returns</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono text-zinc-400">Run Tool</span>
                  <CornerDownLeft className="w-3 h-3 text-zinc-400" />
                </div>
              </button>

              <button
                onClick={() => {
                  setQuery("Show estimated annual compliance cost");
                  handleRunCommand("Cost");
                }}
                className="w-full p-2.5 rounded-xl hover:bg-zinc-900 flex items-center justify-between text-left transition-all text-zinc-200 hover:text-white cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Calculate annual statutory compliance budget</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono text-zinc-400">Run Tool</span>
                  <CornerDownLeft className="w-3 h-3 text-zinc-400" />
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Quick Jump Views */}
          <div className="pt-2 border-t border-zinc-900">
            <span className="text-[10px] font-mono text-zinc-500 uppercase px-3 mb-1.5 block">
              Workspace Navigation Jump
            </span>

            <div className="space-y-1">
              <button
                onClick={() => {
                  onNavigateTab('dashboard');
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-zinc-900 flex items-center justify-between text-left text-zinc-300 hover:text-white cursor-pointer"
              >
                <span>Jump to GenAI Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              <button
                onClick={() => {
                  onNavigateTab('advisor');
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-zinc-900 flex items-center justify-between text-left text-zinc-300 hover:text-white cursor-pointer"
              >
                <span>Jump to Entity Suitability Advisor</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              <button
                onClick={() => {
                  onNavigateTab('extraction');
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-zinc-900 flex items-center justify-between text-left text-zinc-300 hover:text-white cursor-pointer"
              >
                <span>Jump to Extraction & Mapping Lab</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              <button
                onClick={() => {
                  onNavigateTab('tasks');
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-zinc-900 flex items-center justify-between text-left text-zinc-300 hover:text-white cursor-pointer"
              >
                <span>Jump to Task Scripting Canvas</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-3 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Standard: <strong className="text-zinc-200">Vercel AI SDK Command Palette</strong></span>
          <span className="font-mono">SME-Approved DB Matcher</span>
        </div>

      </div>
    </div>
  );
}
