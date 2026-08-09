import React, { useState } from 'react';
import { 
  FileCheck2, 
  UploadCloud, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  Code, 
  ShieldCheck,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { SAMPLE_DOCUMENTS_EXTRACTION } from '../data/mockData';

export default function ExtractionLabView() {
  const [selectedDoc, setSelectedDoc] = useState(SAMPLE_DOCUMENTS_EXTRACTION[1]); // Default GSTR-3B
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPreset = (doc) => {
    setIsProcessing(true);
    setTimeout(() => {
      setSelectedDoc(doc);
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Regulatory Mapping & Document Extraction Lab</h2>
            <p className="text-xs text-slate-400">
              VLM & Layout-Aware OCR Extraction paired with SME-Approved Regulatory Rule Matching Engine.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Document Selectors */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Pre-loaded Statutory Document Scenario</span>
          <span className="text-[10px] text-emerald-400 font-mono">Working AI Pipeline (Track A)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_DOCUMENTS_EXTRACTION.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleSelectPreset(doc)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedDoc.id === doc.id
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-cyan-400">{doc.type}</span>
                {doc.verificationStatus.includes('VALIDATED') ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                )}
              </div>
              <span className="text-xs font-semibold text-white block truncate">{doc.filename}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Uploaded: {doc.uploadDate}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Document Viewer vs Extraction Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Document File Info & Raw View (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Source Document File</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">PDF / Scan Parser</span>
          </div>

          {/* Simulated PDF Preview Box */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-xs relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-white font-bold block">{selectedDoc.filename}</span>
                <span className="text-[10px] text-slate-400 block">{selectedDoc.type}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                Confidence: {selectedDoc.confidence}
              </span>
            </div>

            {/* Document Attributes */}
            <div className="space-y-2 text-[11px]">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Document Type</span>
                <span className="text-cyan-300 font-mono">{selectedDoc.type}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Layout OCR Engine</span>
                <span className="text-slate-200 font-mono">LayoutLMv3 + Vision-Language Model Fallback</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Source Hash Log</span>
                <span className="text-slate-400 font-mono text-[10px]">SHA256: 8f4a9b7c1d3e12c9b50a77c21199e4</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: AI Extraction & Rule Matcher Console (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Card 1: Document Extraction Agent JSON Fields */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Document Extraction Agent (Parsed Fields)
                </h3>
              </div>
              <span className="text-[10px] text-cyan-300 font-mono">VLM Structural Output</span>
            </div>

            {isProcessing ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                <span>Running Layout OCR & Field Extraction...</span>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(selectedDoc.extractedFields).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">{key}</span>
                      <span className="text-white font-mono font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Regulatory Matcher & Verification Outcome */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Regulatory Rule Matcher & Traceability
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">SME Verified</span>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Verification Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                selectedDoc.verificationStatus.includes('VALIDATED')
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center gap-2.5">
                  {selectedDoc.verificationStatus.includes('VALIDATED') ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
                  )}
                  <div>
                    <span className="font-bold text-xs block">{selectedDoc.verificationStatus}</span>
                    <span className="text-[10px] opacity-80 block">Matched to Rule ID: {selectedDoc.ruleMatchId}</span>
                  </div>
                </div>
              </div>

              {/* SME Legal Citation Box */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Statutory Source Citation</span>
                <p className="text-slate-200 italic font-serif text-xs">{selectedDoc.smeCitation}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-cyan-400">Approved by Legal SME</span>
                  <span className="text-slate-400">Zero Hallucination Guaranteed</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
