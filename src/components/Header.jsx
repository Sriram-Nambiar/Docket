import React from 'react';
import { 
  ShieldCheck, 
  Bot, 
  Lock, 
  Building2, 
  UserCheck, 
  Search,
  Sparkles,
  FileCheck2,
  Share2,
  Zap,
  Command,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export default function Header({ 
  companyProfile, 
  activeRole, 
  setActiveRole, 
  activeTab, 
  setActiveTab,
  onOpenSkillsDrawer,
  onOpenCommandPalette
}) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Vercel Geist Aesthetic Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/10">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white tracking-tight font-sans">SLKS Compliance Intelligence</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-800/90 text-zinc-300 border border-zinc-700">
                Track A Demo
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Agentic Platform • Anthropic & Vercel Skills Standard</p>
          </div>
        </div>

        {/* Global Action Bar: Command Palette + Agent Skills Trigger */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Vercel-Style Command Palette Trigger Button */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all text-xs cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span>Ask Agent or Search...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-[10px] text-zinc-400">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* Anthropic Agent Skills Drawer Inspector Button */}
          <button
            onClick={onOpenSkillsDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 hover:border-indigo-500 text-indigo-300 text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Agent Skills (5 Active)</span>
          </button>

          {/* Entity Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-zinc-200">{companyProfile.name}</span>
          </div>

          {/* User Persona Switcher */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveRole('Compliance Head')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeRole === 'Compliance Head'
                  ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Compliance Head
            </button>
            <button
              onClick={() => setActiveRole('Tax Lead')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeRole === 'Tax Lead'
                  ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tax Lead
            </button>
          </div>

        </div>

      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-3.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            GenAI Dashboard
          </button>

          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'advisor'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Suitability Advisor
          </button>

          <button
            onClick={() => setActiveTab('extraction')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'extraction'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            Extraction & Mapping Lab
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            Task Scripting Canvas
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'insights'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            Risk & Security Scorecard
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <span>Engine: <strong className="text-emerald-400">Zero Hallucination Mode</strong></span>
        </div>
      </div>
    </header>
  );
}
