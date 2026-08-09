"use client";

import React, { useState } from 'react';
import { Plus, X, Building2, ShieldCheck, Sparkles } from 'lucide-react';

export default function NewProjectModal({ isOpen, onClose }) {
  const [projectName, setProjectName] = useState('');
  const [template, setTemplate] = useState('Pvt Ltd');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900">Initialize New Compliance Project</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 hover:bg-slate-100 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-700 font-semibold block">Project / Entity Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Apex Health Services Ltd"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-semibold block">Entity Structure Template</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-700"
            >
              <option value="Pvt Ltd">Private Limited Company (Standard Baseline)</option>
              <option value="Public Listed">Public Listed Entity (SEBI LODR & PIT)</option>
              <option value="LLP">Limited Liability Partnership (LLP Act)</option>
              <option value="Hospital">Hospital / Healthcare Provider (PCPNDT, AERB, DPDP)</option>
              <option value="Startup">Tech Startup (DPIIT, FEMA FC-GPR, ESOPs)</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
            💡 Selecting a template pre-maps the mandatory statutory rule stack (MCA, GST, Direct Tax, Labor) along with compliance lifecycles.
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs"
            >
              Create Project
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
