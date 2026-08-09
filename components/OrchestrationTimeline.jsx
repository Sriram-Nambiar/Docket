"use client";

import React, { useState } from 'react';
import { 
  GitCommit, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Activity,
  Cpu,
  Workflow
} from 'lucide-react';

export default function OrchestrationTimeline() {
  const [isReplaying, setIsReplaying] = useState(false);

  const executionSteps = [
    { step: 1, agent: 'Intake Advisor Agent', state: 'COMPLETED', duration: '240ms', details: 'Evaluated SaaS sector input & mapped MCA Private Limited structure.' },
    { step: 2, agent: 'Rule Engine Evaluator', state: 'COMPLETED', duration: '180ms', details: 'Matched 14 statutory obligations across MCA, GSTN, and EPFO.' },
    { step: 3, agent: 'Form Pre-Fill Agent', state: 'COMPLETED', duration: '310ms', details: 'Pre-populated Form AOC-4 & GSTR-3B with 98.5% confidence.' },
    { step: 4, agent: 'VLM OCR Fallback Engine', state: 'COMPLETED', duration: '450ms', details: 'Extracted ROC embossed seal & handwritten board minutes.' },
    { step: 5, agent: 'Audit Feed Hash Engine', state: 'COMPLETED', duration: '90ms', details: 'Generated immutable SHA-256 state log entry in Redis Docker.' },
  ];

  const handleReplay = () => {
    setIsReplaying(true);
    setTimeout(() => {
      setIsReplaying(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Workflow className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Temporal.io & LangGraph Multi-Agent Orchestration</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Durable workflow execution engine with deterministic sequencing, failure retries, and replayable execution history.
          </p>
        </div>
        <button
          onClick={handleReplay}
          disabled={isReplaying}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isReplaying ? 'animate-spin' : ''}`} />
          <span>{isReplaying ? 'Replaying History...' : 'Replay Durable History'}</span>
        </button>
      </div>

      <div className="enterprise-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-mono text-[10px] font-bold">
              <Activity className="w-4 h-4 text-indigo-600" /> Temporal Workflow ID: wf-docket-2026-0808-001
            </span>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
            Execution Durable & Replayable
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {executionSteps.map((st) => (
            <div 
              key={st.step} 
              className={`p-4 rounded-xl border transition-all ${
                isReplaying ? 'bg-indigo-50 border-indigo-300' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center font-sans">
                    {st.step}
                  </span>
                  <span className="font-bold text-slate-900 font-sans">{st.agent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">{st.duration}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold font-sans flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {st.state}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 font-sans pl-8">{st.details}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
