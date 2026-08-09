"use client";

import React, { useState } from 'react';
import { 
  Eye, 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Scan, 
  Image as ImageIcon,
  Stamp,
  PenTool
} from 'lucide-react';

export default function VlmOcrPipeline() {
  const [selectedDocType, setSelectedDocType] = useState('scanned_pdf');
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleScanData = {
    scanned_pdf: {
      title: "Scanned MCA Incorporation Certificate & Memorandum (MoA)",
      imageType: "PDF Scan (300 DPI)",
      vlmFeatures: ["Official ROC Embossed Seal", "Handwritten Registrar Signature", "Registration Serial Number"],
      extractedFields: [
        { label: "Company Name", value: "Apex Technologies Private Limited", confidence: "99.8%" },
        { label: "CIN Number", value: "U72900MH2024PTC412345", confidence: "99.2%" },
        { label: "Incorporation Date", value: "15th February 2024", confidence: "98.7%" },
        { label: "ROC Seal Verified", value: "Mumbai Registrar Stamp Detected", confidence: "97.5%" },
        { label: "Director 1 Signature", value: "Verified Match (Sanjay Sharma)", confidence: "94.2%" }
      ]
    },
    handwritten_form: {
      title: "Handwritten Board Resolution & Share Allotment Note",
      imageType: "Mobile Camera Capture / Handwritten Notes",
      vlmFeatures: ["Handwritten Cursive Script", "Ink Stamp Verification", "Marginal Comments"],
      extractedFields: [
        { label: "Resolution Date", value: "28th June 2026", confidence: "94.5%" },
        { label: "Authorized Capital", value: "₹25,00,000", confidence: "91.8%" },
        { label: "Share Class", value: "Series A Preference Shares", confidence: "93.0%" },
        { label: "Chairman Seal", value: "Apex Corp Ink Stamp Verified", confidence: "96.4%" }
      ]
    }
  };

  const currentData = sampleScanData[selectedDocType];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Scan className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Vision-Language Model (VLM) & Multi-modal OCR Pipeline</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Advanced parsing fallback for non-standard documents, scanned PDFs, handwritten forms, official stamps, and seals.
          </p>
        </div>
      </div>

      {/* Document Type Selector Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedDocType('scanned_pdf')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            selectedDocType === 'scanned_pdf'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Stamp className="w-4 h-4 text-indigo-400" />
          <span>Scanned Official Certificate with Seals</span>
        </button>

        <button
          onClick={() => setSelectedDocType('handwritten_form')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            selectedDocType === 'handwritten_form'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <PenTool className="w-4 h-4 text-amber-400" />
          <span>Handwritten Notes & Mobile Captures</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Simulated Visual Canvas */}
        <div className="enterprise-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-slate-500" /> Visual Inspection Canvas
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold">
              {currentData.imageType}
            </span>
          </div>

          <div className="h-[280px] rounded-xl bg-slate-900 p-4 border border-slate-800 flex flex-col justify-between relative overflow-hidden text-slate-300 font-mono text-xs">
            <div className="flex justify-between items-start z-10">
              <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded text-[11px]">
                🔍 VLM Multi-Modal Detection Active
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                High Resolution Mode
              </span>
            </div>

            {/* Visual Bounding Box Highlights */}
            <div className="space-y-2 z-10">
              <div className="p-2 rounded bg-indigo-900/60 border border-indigo-400 text-indigo-200 text-[11px] flex justify-between">
                <span>[Bounding Box 1] Official Embossed Seal</span>
                <span className="text-emerald-400 font-bold">97.5% Match</span>
              </div>
              <div className="p-2 rounded bg-amber-900/60 border border-amber-400 text-amber-200 text-[11px] flex justify-between">
                <span>[Bounding Box 2] Handwritten Signature</span>
                <span className="text-emerald-400 font-bold">94.2% Match</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 z-10 border-t border-slate-800 pt-2">
              Vision Model: Llama-3.2-Vision / Multi-Modal VLM Engine
            </div>
          </div>
        </div>

        {/* Right Side: Structured Extraction Output */}
        <div className="enterprise-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Extracted Structured JSON Payload
            </h2>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md font-mono">
              VLM Verified
            </span>
          </div>

          <div className="space-y-2.5">
            {currentData.extractedFields.map((field, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">{field.label}</span>
                  <span className="font-bold text-slate-900">{field.value}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] border border-emerald-200">
                  {field.confidence}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
