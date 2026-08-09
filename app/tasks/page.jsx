"use client";

import React from 'react';
import Sidebar from '../../components/Sidebar';
import HeaderNav from '../../components/HeaderNav';
import TasksView from '../../components/TasksView';

export default function TasksPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeView="tasks" />
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderNav activeView="tasks" />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          <TasksView />
        </main>
      </div>
    </div>
  );
}
