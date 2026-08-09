"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Sparkles, 
  Share2, 
  BookOpen, 
  Settings, 
  Lock, 
  ChevronRight,
  LogOut,
  Edit3,
  Layers,
  Calculator,
  Scan,
  Database,
  Workflow,
  Cpu,
  CheckSquare,
  MessageCircle,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function Sidebar({ activeView, setActiveView }) {
  const { user, logout } = useAuth();
  const isComplianceHead = user?.role === 'compliance_head';

  const navItems = [
    { id: 'checklist_workbook', label: 'Checklist Engine', icon: CheckSquare },
    { id: 'intake', label: 'Founder Intake', icon: Sparkles },
    { id: 'dashboard', label: 'Compliance Dashboard', icon: LayoutDashboard },
    { id: 'penalty_calculator', label: 'Risk & Penalty', icon: ShieldAlert },
    { id: 'whatsapp_settings', label: 'WhatsApp Gateway', icon: MessageCircle },
    { id: 'tasks', label: 'Task Canvas', icon: Share2 },
    { id: 'form_drafting', label: 'Form Drafting', icon: Edit3 },
    { id: 'templates_search', label: 'Templates & Search', icon: Layers },
    { id: 'financial_cost', label: 'Cost Tracking', icon: Calculator },
    { id: 'vlm_ocr', label: 'Document OCR', icon: Scan },
    { id: 'sector_modules', label: 'Sector Modules', icon: Cpu },
    { id: 'knowledge_graph', label: 'Knowledge Graph', icon: Database },
    { id: 'orchestration', label: 'Orchestration', icon: Workflow },
    { id: 'rules', label: 'Rule Library', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-paper border-r border-hairline flex flex-col justify-between shrink-0 h-screen sticky top-0">
      
      {/* Logo */}
      <div>
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-ink flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-serif font-semibold text-ink tracking-tight">DOCKET</span>
        </div>
        
        {/* Tier Indicator */}
        <div className="px-5 pb-3">
          <span className={isComplianceHead ? "tier-badge-active" : "tier-badge"}>
            {isComplianceHead ? 'TIER 2 — COMPLIANCE HEAD' : 'TIER 1 — FOUNDER'}
          </span>
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView?.(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'border-l-2 border-amber bg-amber-light text-ink'
                    : 'border-l-2 border-transparent text-muted hover:text-ink hover:bg-paper-warm'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber' : 'text-muted'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-hairline">
        <div className="flex items-center justify-between gap-2 px-2 py-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 ${
              isComplianceHead ? 'bg-ink' : 'bg-amber'
            }`}>
              {user?.avatar || 'U'}
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-ink block truncate">{user?.name || 'Guest'}</span>
              <span className="font-mono text-xs text-muted block truncate">{isComplianceHead ? 'Admin' : 'User'}</span>
            </div>
          </div>
          {user && (
            <button onClick={logout} title="Sign out" className="p-1.5 rounded-sm hover:bg-paper-warm text-muted hover:text-ink cursor-pointer">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
