"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import HeaderNav from '../components/HeaderNav';
import SoloFounderIntake from '../components/SoloFounderIntake';
import ComplianceHeadDashboard from '../components/ComplianceHeadDashboard';
import ChecklistEngineWorkbook from '../components/ChecklistEngineWorkbook';
import StatutoryFormDrafting from '../components/StatutoryFormDrafting';
import EntityTemplatesSearch from '../components/EntityTemplatesSearch';
import FinancialCostTracking from '../components/FinancialCostTracking';
import VlmOcrPipeline from '../components/VlmOcrPipeline';
import SectorComplianceModules from '../components/SectorComplianceModules';
import KnowledgeGraphView from '../components/KnowledgeGraphView';
import OrchestrationTimeline from '../components/OrchestrationTimeline';
import NewProjectModal from '../components/NewProjectModal';
import TasksView from '../components/TasksView';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../lib/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user?.defaultView) {
      setActiveView(user.defaultView);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-slate-900 animate-pulse flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="flex-1 flex flex-col min-w-0">
        
        <HeaderNav 
          activeView={activeView} 
          setActiveView={setActiveView}
          onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        />

        <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
          {activeView === 'checklist_workbook' && <ChecklistEngineWorkbook />}
          {activeView === 'intake' && <SoloFounderIntake onNavigateDashboard={setActiveView} />}
          {activeView === 'dashboard' && (
            <ComplianceHeadDashboard 
              onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
              onNavigateView={setActiveView}
            />
          )}
          {activeView === 'form_drafting' && <StatutoryFormDrafting />}
          {activeView === 'templates_search' && <EntityTemplatesSearch />}
          {activeView === 'financial_cost' && <FinancialCostTracking />}
          {activeView === 'vlm_ocr' && <VlmOcrPipeline />}
          {activeView === 'sector_modules' && <SectorComplianceModules />}
          {activeView === 'knowledge_graph' && <KnowledgeGraphView />}
          {activeView === 'orchestration' && <OrchestrationTimeline />}
          {activeView === 'tasks' && <TasksView />}

          {activeView === 'rules' && (
            <div className="enterprise-card p-6 space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">Statutory Rule Library</h2>
              <p className="text-xs text-slate-500">Version-controlled repository of verified regulatory rules.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 font-mono text-xs space-y-1">
                  <span className="text-slate-900 font-semibold block">IN-GST-GSTR3B-004</span>
                  <span className="text-slate-500 block">CGST Act 2017 Sec 39 • v2.1</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 font-mono text-xs space-y-1">
                  <span className="text-slate-900 font-semibold block">IN-MCA-AOC4-001</span>
                  <span className="text-slate-500 block">Companies Act 2013 Sec 137 • v3.0</span>
                </div>
              </div>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="enterprise-card p-6 space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">Access Control</h2>
              <p className="text-xs text-slate-500">Role-based access profiles.</p>
              <div className="space-y-2">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between">
                  <span className="font-medium text-slate-900">Compliance Head</span>
                  <span className="text-slate-500">Tier 2 — Full Access</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between">
                  <span className="font-medium text-slate-900">Department Collaborator</span>
                  <span className="text-slate-500">Tier 1 — Scoped Access</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
