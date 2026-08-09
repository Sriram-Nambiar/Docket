"use client";

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import HeaderNav from '../../components/HeaderNav';
import ComplianceHeadDashboard from '../../components/ComplianceHeadDashboard';
import NewProjectModal from '../../components/NewProjectModal';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar activeView="dashboard" />
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderNav 
          activeView="dashboard" 
          onOpenNewProjectModal={() => setIsModalOpen(true)}
        />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <ComplianceHeadDashboard 
            onOpenNewProjectModal={() => setIsModalOpen(true)}
            onNavigateView={() => {}}
          />
        </main>
      </div>
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
