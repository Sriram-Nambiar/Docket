"use client";

import React, { useState } from 'react';
import { Building2, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { useCompany } from '../lib/CompanyContext';

export default function NewProjectModal({ isOpen, onClose, onCreate }) {
  const { addCompany } = useCompany();
  const [projectName, setProjectName] = useState('');
  const [template, setTemplate] = useState('Pvt Ltd');
  const [isCreated, setIsCreated] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsCreated(false);
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newCompany = addCompany({
      name: projectName.trim(),
      entityType: template === 'LLP' ? 'LLP' : 'Private Limited Company',
      sector: template === 'Startup' ? 'Technology / SaaS' : template === 'Hospital' ? 'Healthcare' : 'General Business'
    });

    const project = { name: newCompany.name, template, createdAt: new Date().toISOString() };
    const existing = JSON.parse(window.localStorage.getItem('docket_projects') || '[]');
    window.localStorage.setItem('docket_projects', JSON.stringify([project, ...existing.filter((item) => item.name !== project.name)]));
    onCreate?.(project);
    setIsCreated(true);
    window.setTimeout(() => {
      setProjectName('');
      handleClose();
    }, 900);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="new-project-title">
      <div className="modal-panel max-w-md shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-hairline pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-amber-light text-amber flex items-center justify-center"><Building2 className="w-5 h-5" /></div>
            <div>
              <h2 id="new-project-title" className="font-serif text-lg font-semibold text-ink">Create a workspace</h2>
              <p className="text-sm text-muted mt-0.5">Start with a tailored compliance baseline.</p>
            </div>
          </div>
          <button type="button" onClick={handleClose} className="p-1 text-muted hover:text-ink" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        {isCreated ? (
          <div className="py-8 flex flex-col items-center text-center gap-3">
            <CheckCircle2 className="w-9 h-9 text-verified" />
            <p className="font-semibold text-ink">Workspace created</p>
            <p className="text-sm text-muted">Opening your business intake.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-ink block mb-1.5">Business or entity name</label>
              <input type="text" value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="e.g. Apex Health Services Ltd" className="ledger-input" required autoFocus />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink block mb-1.5">Starting template</label>
              <select value={template} onChange={(event) => setTemplate(event.target.value)} className="ledger-input">
                <option value="Pvt Ltd">Private limited company</option>
                <option value="LLP">Limited liability partnership</option>
                <option value="Startup">Technology startup</option>
                <option value="Hospital">Healthcare provider</option>
                <option value="Public Listed">Public listed entity</option>
              </select>
            </div>
            <div className="flex gap-2.5 p-3 bg-paper-warm border border-hairline rounded-sm text-sm text-muted leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-amber shrink-0 mt-0.5" />
              <span>We’ll save this workspace on this device and take you to the intake to complete its compliance profile.</span>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={handleClose} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-accent">Create workspace</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
