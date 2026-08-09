"use client";

import React, { useState } from 'react';
import { Bell, Plus, LogOut, ArrowRightLeft } from 'lucide-react';
import NotificationCenterModal from './NotificationCenterModal';
import AuthModal from './AuthModal';
import { useAuth } from '../lib/AuthContext';

export default function HeaderNav({ activeView, setActiveView, onOpenNewProjectModal }) {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  // Map view IDs to readable page titles
  const viewTitles = {
    checklist_workbook: 'Checklist Engine',
    intake: 'Founder Intake',
    dashboard: 'Compliance Dashboard',
    penalty_calculator: 'Risk & Penalty Calculator',
    whatsapp_settings: 'WhatsApp Reminder Gateway',
    tasks: 'Task Canvas',
    form_drafting: 'Form Drafting',
    templates_search: 'Templates & Search',
    financial_cost: 'Cost Tracking',
    vlm_ocr: 'Document OCR',
    sector_modules: 'Sector Modules',
    knowledge_graph: 'Knowledge Graph',
    orchestration: 'Orchestration',
    rules: 'Rule Library',
    settings: 'Settings',
  };

  return (
    <>
      <header className="bg-paper border-b border-hairline sticky top-0 z-30 px-6 h-14 flex items-center justify-between">
        
        {/* Left: Page title */}
        <h1 className="font-serif text-base font-semibold text-ink">
          {viewTitles[activeView] || 'Dashboard'}
        </h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          
          {/* Notifications */}
          <button
            onClick={() => setIsNotificationModalOpen(true)}
            className="relative p-2 rounded-sm hover:bg-paper-warm text-muted hover:text-ink transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber absolute top-2 right-2" />
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm hover:bg-paper-warm transition-colors cursor-pointer"
            >
              <div className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[10px] text-white ${
                user?.role === 'compliance_head' ? 'bg-ink' : 'bg-amber'
              }`}>
                {user?.avatar || 'U'}
              </div>
              <span className="text-xs font-medium text-ink hidden sm:block">{user?.name}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="btn-ink px-3 py-1.5 rounded-sm text-white text-sm font-medium cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* New Project */}
          <button
            onClick={onOpenNewProjectModal}
            className="px-3 py-1.5 rounded-sm bg-amber hover:bg-amber-hover text-white text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Project</span>
          </button>
        </div>
      </header>

      <NotificationCenterModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
