"use client";

import React, { useState } from 'react';
import { Bell, Plus, Building2, ChevronDown, RefreshCw } from 'lucide-react';
import NotificationCenterModal from './NotificationCenterModal';
import AuthModal from './AuthModal';
import { useAuth } from '../lib/AuthContext';
import { useCompany } from '../lib/CompanyContext';
import { workspaceNavigation } from './Sidebar';

const viewTitles = {
  checklist_workbook: 'Checklist', intake: 'Business intake', dashboard: 'Overview',
  penalty_calculator: 'Risk & penalties', whatsapp_settings: 'Reminders', tasks: 'Tasks',
  form_drafting: 'Form drafting', templates_search: 'Templates', financial_cost: 'Cost tracking',
  vlm_ocr: 'Document review', sector_modules: 'Sector modules', knowledge_graph: 'Knowledge graph',
  orchestration: 'Automation', rules: 'Rule library', settings: 'Settings',
};

export default function HeaderNav({ activeView, setActiveView, onOpenNewProjectModal }) {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { companies, activeCompany, activeCompanyId, changeActiveCompany } = useCompany();

  return (
    <>
      <header className="bg-paper/95 backdrop-blur border-b border-hairline sticky top-0 z-30 px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-3">
          <select
            aria-label="Choose workspace view"
            value={activeView}
            onChange={(event) => setActiveView?.(event.target.value)}
            className="lg:hidden ledger-input w-36 py-1 text-xs font-semibold"
          >
            {workspaceNavigation.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          
          <div className="hidden lg:block">
            <p className="label-caps leading-none mb-1 text-[10px]">Workspace View</p>
            <h1 className="font-serif text-base font-semibold text-ink leading-none">{viewTitles[activeView] || 'Overview'}</h1>
          </div>

          {/* Interactive Company Switcher Dropdown */}
          <div className="flex items-center gap-2 border-l border-hairline pl-3">
            <div className="relative flex items-center">
              <Building2 className="w-3.5 h-3.5 text-amber absolute left-2 pointer-events-none" />
              <select
                aria-label="Select company workspace"
                value={activeCompanyId}
                onChange={(e) => changeActiveCompany(e.target.value)}
                className="bg-paper-warm border border-hairline hover:border-amber rounded-sm pl-7 pr-7 py-1 text-xs font-bold text-ink cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber appearance-none max-w-56 truncate"
              >
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} ({comp.score}% Score)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-muted absolute right-2 pointer-events-none" />
            </div>

            {activeCompany?.isAutomating && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber/20 text-amber font-mono text-[10px] font-bold animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Real-time Syncing
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button type="button" onClick={() => setIsNotificationModalOpen(true)} className="relative p-2 rounded-sm hover:bg-paper-warm text-muted hover:text-ink" title="Notifications" aria-label="Open notifications">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber absolute top-2 right-2" />
          </button>

          {isAuthenticated ? (
            <button type="button" onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-paper-warm" aria-label="Open account settings">
              <div className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[10px] text-white ${user?.role === 'compliance_head' ? 'bg-ink' : 'bg-amber'}`}>{user?.avatar || 'U'}</div>
              <span className="text-xs font-medium text-ink hidden md:block max-w-28 truncate">{user?.name}</span>
            </button>
          ) : (
            <button type="button" onClick={() => setIsAuthModalOpen(true)} className="btn-ink px-3 py-1.5 text-sm">Sign in</button>
          )}

          <button type="button" onClick={onOpenNewProjectModal} className="btn-accent px-3 sm:px-3.5 py-2 text-sm">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New project</span>
          </button>
        </div>
      </header>

      <NotificationCenterModal isOpen={isNotificationModalOpen} onClose={() => setIsNotificationModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
