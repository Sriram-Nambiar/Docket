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
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function Sidebar({ activeView, setActiveView }) {
  const { user, logout } = useAuth();
  const isComplianceHead = user?.role === 'compliance_head';

  const navItems = [
    { id: 'checklist_workbook', label: 'Checklist Engine', icon: CheckSquare },
    { id: 'intake', label: 'Founder Intake', icon: Sparkles },
    { id: 'dashboard', label: 'Compliance Dashboard', icon: LayoutDashboard },
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
    <aside className="w-56 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      
      {/* Logo */}
      <div>
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <span className="font-bold text-sm text-slate-900 tracking-tight">Docket</span>
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
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2 px-2 py-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 ${
              isComplianceHead ? 'bg-slate-700' : 'bg-indigo-600'
            }`}>
              {user?.avatar || 'U'}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-900 block truncate">{user?.name || 'Guest'}</span>
              <span className="text-[10px] text-slate-400 block truncate">{isComplianceHead ? 'Admin' : 'User'}</span>
            </div>
          </div>
          {user && (
            <button onClick={logout} title="Sign out" className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
