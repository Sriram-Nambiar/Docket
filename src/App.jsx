import React, { useState } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import AdvisorView from './components/AdvisorView';
import ExtractionLabView from './components/ExtractionLabView';
import TaskCanvasView from './components/TaskCanvasView';
import InsightsView from './components/InsightsView';
import AgentSkillsDrawer from './components/AgentSkillsDrawer';
import CommandPaletteModal from './components/CommandPaletteModal';

import { INITIAL_COMPANY_PROFILE, REGULATORY_RULES_DB } from './data/mockData';

export default function App() {
  const [companyProfile, setCompanyProfile] = useState(INITIAL_COMPANY_PROFILE);
  const [rules, setRules] = useState(REGULATORY_RULES_DB);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeRole, setActiveRole] = useState('Compliance Head');
  const [selectedRuleForTask, setSelectedRuleForTask] = useState(null);
  
  // Modal / Drawer state
  const [isSkillsDrawerOpen, setIsSkillsDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const handleSelectRuleForTask = (rule) => {
    setSelectedRuleForTask(rule);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Navigation */}
      <Header
        companyProfile={companyProfile}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSkillsDrawer={() => setIsSkillsDrawerOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Body Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            rules={rules}
            companyProfile={companyProfile}
            onSelectRule={(rule) => console.log('Selected rule:', rule)}
            onAssignTask={handleSelectRuleForTask}
            onNavigateTab={setActiveTab}
            onOpenSkillsDrawer={() => setIsSkillsDrawerOpen(true)}
          />
        )}

        {activeTab === 'advisor' && <AdvisorView />}

        {activeTab === 'extraction' && <ExtractionLabView />}

        {activeTab === 'tasks' && (
          <TaskCanvasView selectedRuleForTask={selectedRuleForTask} />
        )}

        {activeTab === 'insights' && <InsightsView />}
      </main>

      {/* Anthropic Agent Skills Drawer Inspector */}
      <AgentSkillsDrawer
        isOpen={isSkillsDrawerOpen}
        onClose={() => setIsSkillsDrawerOpen(false)}
      />

      {/* Vercel-Style Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={setActiveTab}
        onQueryAgent={(text) => {
          setIsCommandPaletteOpen(true);
        }}
      />

      {/* Footer Status Bar */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-4 lg:px-8 py-3 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-zinc-400">SLKS Ideathon • Anthropic Skills & Vercel AI SDK Standard</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Jurisdiction: <strong className="text-zinc-300">India Baseline</strong></span>
            <span>Rule Engine: <strong className="text-emerald-400">SME Approved</strong></span>
            <span>Orchestrator: <strong className="text-indigo-400">Temporal Spine</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
}
