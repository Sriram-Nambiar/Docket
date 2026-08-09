"use client";

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import HeaderNav from '../../components/HeaderNav';
import SoloFounderIntake from '../../components/SoloFounderIntake';
import NewProjectModal from '../../components/NewProjectModal';

export default function IntakePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar activeView="intake" />
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderNav 
          activeView="intake" 
          onOpenNewProjectModal={() => setIsModalOpen(true)}
        />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <SoloFounderIntake onNavigateDashboard={() => {}} />
        </main>
      </div>
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
