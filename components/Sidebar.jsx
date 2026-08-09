"use client";

import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  CheckSquare,
  ChevronDown,
  Cpu,
  Database,
  Edit3,
  FileSearch,
  LayoutDashboard,
  Layers,
  LogOut,
  MessageCircle,
  Scan,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Share2,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const primaryItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: Share2 },
  { id: 'checklist_workbook', label: 'Checklist', icon: CheckSquare },
  { id: 'intake', label: 'Business intake', icon: Sparkles },
];

const toolItems = [
  { id: 'penalty_calculator', label: 'Risk & penalties', icon: ShieldAlert },
  { id: 'whatsapp_settings', label: 'Reminders', icon: MessageCircle },
  { id: 'form_drafting', label: 'Form drafting', icon: Edit3 },
  { id: 'templates_search', label: 'Templates', icon: Layers },
  { id: 'financial_cost', label: 'Cost tracking', icon: Calculator },
  { id: 'vlm_ocr', label: 'Document review', icon: Scan },
  { id: 'sector_modules', label: 'Sector modules', icon: Cpu },
  { id: 'knowledge_graph', label: 'Knowledge graph', icon: Database },
  { id: 'orchestration', label: 'Automation', icon: Workflow },
  { id: 'rules', label: 'Rule library', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function NavButton({ item, activeView, setActiveView }) {
  const Icon = item.icon;
  const isActive = activeView === item.id;

  return (
    <button
      type="button"
      onClick={() => setActiveView?.(item.id)}
      aria-current={isActive ? 'page' : undefined}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm font-medium transition-colors text-left ${
        isActive
          ? 'bg-amber-light text-ink border-l-2 border-amber'
          : 'text-muted border-l-2 border-transparent hover:text-ink hover:bg-paper-warm'
      }`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber' : 'text-muted'}`} />
      <span>{item.label}</span>
    </button>
  );
}

export const workspaceNavigation = [...primaryItems, ...toolItems];

export default function Sidebar({ activeView, setActiveView }) {
  const { user, logout } = useAuth();
  const isComplianceHead = user?.role === 'compliance_head';
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolIsActive = toolItems.some((item) => item.id === activeView);
  const showTools = isToolsOpen || toolIsActive;

  return (
    <aside className="hidden lg:flex w-60 bg-paper border-r border-hairline flex-col justify-between shrink-0 min-h-screen sticky top-0">
      <div className="min-h-0 overflow-y-auto">
        <div className="px-5 pt-5 pb-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-ink flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-serif font-semibold text-ink tracking-tight block leading-none">Docket</span>
            <span className="label-caps text-[0.58rem] mt-1 block">Compliance workspace</span>
          </div>
        </div>

        <div className="px-5 pb-4">
          <span className={`tier-badge ${isComplianceHead ? 'tier-badge-active' : ''}`}>
            {isComplianceHead ? 'Tier 2 · Compliance lead' : 'Tier 1 · Founder'}
          </span>
        </div>

        <nav className="px-3 pb-4" aria-label="Workspace navigation">
          <p className="label-caps px-3 pb-1.5">Workspace</p>
          <div className="space-y-0.5">
            {primaryItems.map((item) => (
              <NavButton key={item.id} item={item} activeView={activeView} setActiveView={setActiveView} />
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-hairline-light">
            <button
              type="button"
              onClick={() => setIsToolsOpen((open) => !open)}
              aria-expanded={showTools}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-muted hover:text-ink hover:bg-paper-warm rounded-sm"
            >
              <span className="flex items-center gap-2.5"><FileSearch className="w-4 h-4" /> More tools</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTools ? 'rotate-180' : ''}`} />
            </button>
            {showTools && (
              <div className="mt-1 space-y-0.5">
                {toolItems.map((item) => (
                  <NavButton key={item.id} item={item} activeView={activeView} setActiveView={setActiveView} />
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="p-3 border-t border-hairline bg-paper">
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 ${isComplianceHead ? 'bg-ink' : 'bg-amber'}`}>
              {user?.avatar || 'G'}
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-ink block truncate">{user?.name || 'Guest workspace'}</span>
              <span className="font-mono text-xs text-muted block truncate">{isComplianceHead ? 'Compliance lead' : 'Founder access'}</span>
            </div>
          </div>
          {user && (
            <button type="button" onClick={logout} title="Sign out" className="p-1.5 rounded-sm hover:bg-paper-warm text-muted hover:text-ink">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
