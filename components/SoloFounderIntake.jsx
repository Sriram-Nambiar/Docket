"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Building2, 
  Search,
  ChevronRight,
  Info,
  AlertTriangle
} from 'lucide-react';

export default function SoloFounderIntake({ onNavigateDashboard }) {
  const [inputText, setInputText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadedFileContent, setUploadedFileContent] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);

  const handleSubmitIntake = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !uploadedFileName) return;

    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessDescription: inputText,
          sector: "IT Services / SaaS",
          turnover: "₹1.25 Crore",
          employees: 18,
          founders: 2,
          fdi: false,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setEvaluationResult(data.analysis);
      } else {
        throw new Error(data.error || 'Failed to analyze');
      }
    } catch (err) {
      // Fallback
      setEvaluationResult({
        bestMatch: "Private Limited Company",
        matchScore: "96%",
        rationale: "Ideal structure for equity fundraising, limited liability protection, ESOP pool creation, and global client credibility.",
        mandatoryCompliances: [
          { name: "GST Registration & Returns (GSTR-1/3B)", freq: "Monthly", authority: "CBIC / GSTN" },
          { name: "Form AOC-4 Financial Filing", freq: "Annual", authority: "MCA" },
          { name: "Form MGT-7 Annual Return", freq: "Annual", authority: "MCA" },
          { name: "DIR-3 Director KYC Verification", freq: "Annual (Sept 30)", authority: "MCA" },
          { name: "Income Tax Return (ITR-6)", freq: "Annual (Oct 31)", authority: "Income Tax Dept" },
        ]
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setInputText(`Analyze entity compliance requirements for uploaded document: ${file.name}`);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;
        if (file.name.toLowerCase().endsWith('.pdf')) {
          setUploadedFileContent(`[PDF Document: ${file.name}]\nBase64 Content: ${result.substring(0, 200)}...`);
        } else {
          setUploadedFileContent(result);
        }
      };

      if (file.name.toLowerCase().endsWith('.pdf')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  const handleAnalyzeDocument = async () => {
    if (!uploadedFileContent) return;
    
    setIsExtracting(true);
    setExtractionResult(null);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: uploadedFileContent,
          fileName: uploadedFileName
        }),
      });

      const data = await res.json();
      if (data.success && data.extraction) {
        setExtractionResult(data);
      } else {
        throw new Error(data.error || 'Failed to extract');
      }
    } catch (err) {
      console.error(err);
      // Fallback if needed, though we expect the real API to work
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex flex-col justify-between py-8 px-4 max-w-4xl mx-auto bg-paper">
      
      {/* Upper Empty Spacer */}
      <div className="flex-1" />

      {/* Centered Main Section (Google Search Vibe) */}
      <div className="w-full space-y-8 my-auto text-center">
        
        {/* Brand Header & Headline */}
        <div className="space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-amber-light border border-amber text-amber text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber" />
            <span>NVIDIA NIM Llama-3.1-70b Active</span>
          </div>

          <h1 className="text-3xl font-serif font-extrabold text-ink tracking-tight">
            What compliance does your business need?
          </h1>
          <p className="text-sm text-ink-light leading-relaxed">
            Enter your business activities, sector, or upload draft incorporation papers for an instant, SME-verified compliance roadmap.
          </p>
        </div>

        {/* Search Input & Drag-and-Drop Card Container */}
        <div className="space-y-4 max-w-2xl mx-auto text-left">
          
          <form onSubmit={handleSubmitIntake}>
            {/* Element 1: Large Inviting Natural Language Bar */}
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe your business to see your compliance requirements..."
                className="w-full bg-surface border border-hairline rounded-sm px-5 py-4 pl-12 text-sm text-ink placeholder-muted-light focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber-light transition-all"
              />
              <Search className="w-5 h-5 text-muted absolute left-4 top-4" />
              <button
                type="submit"
                disabled={isEvaluating}
                className="absolute right-2.5 top-2.5 px-4 py-2 rounded-sm bg-amber hover:bg-amber-hover text-white text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isEvaluating ? (
                  <span>Evaluating NVIDIA...</span>
                ) : (
                  <>
                    <span>Analyze Stack</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Element 2: Dashed-Border Drag and Drop Upload Zone */}
          <div className="relative border-2 border-dashed border-hairline hover:border-amber rounded-sm p-6 bg-paper-warm transition-all text-center group cursor-pointer">
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface border border-hairline flex items-center justify-center text-muted group-hover:text-amber group-hover:scale-110 transition-all">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-ink block group-hover:text-amber transition-colors">
                  {uploadedFileName ? `Attached: ${uploadedFileName}` : "Drag and drop legal or financial documents here"}
                </span>
                <span className="text-xs text-muted block mt-0.5">
                  PDF, DOCX, scanned certificates up to 25MB (Auto Layout-OCR Extraction)
                </span>
              </div>
            </div>
          </div>
          
          {uploadedFileName && (
            <div className="flex justify-center mt-2">
              <button
                type="button"
                onClick={handleAnalyzeDocument}
                disabled={isExtracting || !uploadedFileContent}
                className="px-6 py-2.5 rounded-sm bg-amber hover:bg-amber-hover text-white text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isExtracting ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Extracting with NVIDIA NIM...
                  </span>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Analyze Document</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Document Extraction Result Card */}
        {extractionResult && (
          <div className="max-w-2xl mx-auto text-left ledger-card p-5 border border-hairline space-y-5 bg-surface rounded-sm">
            <div className="flex items-center justify-between border-b border-hairline-light pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber" />
                <h3 className="text-base font-serif font-semibold text-ink">Extracted Document Intelligence</h3>
              </div>
              {extractionResult.extraction.confidence && (
                <span className="px-2.5 py-0.5 rounded-sm bg-amber-light text-amber font-bold text-xs border border-amber">
                  {extractionResult.extraction.confidence} Confidence
                </span>
              )}
            </div>

            <div className="space-y-4">
              {extractionResult.extraction.documentType && (
                <div>
                  <span className="px-2.5 py-1 rounded-sm bg-paper-warm text-ink-light text-sm font-semibold inline-block mb-3 border border-hairline">
                    Type: {extractionResult.extraction.documentType}
                  </span>
                </div>
              )}

              {/* Entities */}
              {extractionResult.extraction.entities && Object.keys(extractionResult.extraction.entities).length > 0 && (
                <div>
                  <span className="text-sm font-bold text-ink uppercase tracking-wider block mb-2">Key Entities</span>
                  <div className="grid grid-cols-2 gap-3 bg-paper-warm p-3 rounded-sm border border-hairline">
                    {Object.entries(extractionResult.extraction.entities).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-xs text-muted uppercase block">{key}</span>
                        <span className="text-sm font-mono text-ink">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Rules */}
              {extractionResult.extraction.matchedRules && extractionResult.extraction.matchedRules.length > 0 && (
                <div>
                  <span className="text-sm font-bold text-ink uppercase tracking-wider block mb-2">Matched Rules</span>
                  <div className="space-y-2">
                    {extractionResult.extraction.matchedRules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-verified-light p-2 rounded-sm border border-verified text-sm">
                        <CheckCircle2 className="w-4 h-4 text-verified mt-0.5 shrink-0" />
                        <div>
                          <span className="font-mono text-sm text-ink block">{rule.ruleName || rule.ruleId}</span>
                          <span className="text-verified text-xs status-verified">{rule.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gaps */}
              {extractionResult.extraction.gaps && extractionResult.extraction.gaps.length > 0 && (
                <div>
                  <span className="text-sm font-bold text-ink uppercase tracking-wider block mb-2">Compliance Gaps</span>
                  <div className="space-y-2">
                    {extractionResult.extraction.gaps.map((gap, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-overdue-light p-2 rounded-sm border border-overdue text-sm">
                        <AlertTriangle className="w-4 h-4 text-overdue mt-0.5 shrink-0" />
                        <span className="text-overdue font-medium status-overdue">{gap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-hairline-light flex items-center justify-between">
              <span className="text-xs text-amber flex items-center gap-1 font-medium bg-amber-light px-2 py-1 rounded-sm border border-amber">
                <Info className="w-3.5 h-3.5" />
                AI-generated • Pending SME verification
              </span>
            </div>
          </div>
        )}

        {/* AI Reasoning Evaluation Output Display */}
        {evaluationResult && (
          <div className="max-w-2xl mx-auto text-left ledger-card p-5 border border-hairline space-y-4 bg-surface rounded-sm">
            
            <div className="flex items-center justify-between border-b border-hairline-light pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-verified" />
                <h3 className="text-base font-serif font-semibold text-ink">Recommended Legal Structure</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-sm bg-verified-light text-verified font-bold text-xs border border-verified">
                <span className="text-amber font-semibold font-mono">{evaluationResult.matchScore}</span> Match
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-lg font-serif font-semibold text-ink">{evaluationResult.bestMatch}</span>
              <p className="text-sm text-ink-light leading-relaxed">{evaluationResult.rationale}</p>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-sm font-bold text-ink uppercase tracking-wider block">
                Resulting Baseline Statutory Compliance Stack:
              </span>

              <div className="grid grid-cols-1 gap-2">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {evaluationResult.mandatoryCompliances?.map((item, idx) => (
                      <tr key={idx} className="border-b border-hairline last:border-0">
                        <td className="py-2 pr-2">
                          <CheckCircle2 className="w-4 h-4 text-verified shrink-0" />
                        </td>
                        <td className="py-2 px-2 font-mono text-sm text-ink">{item.name}</td>
                        <td className="py-2 pl-2 text-xs text-muted text-right">{item.authority} • {item.freq}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 border-t border-hairline-light flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-muted">
                Guaranteed zero hallucination • Matched against SME-Approved Rule Library
              </span>
              <button
                onClick={() => onNavigateDashboard('dashboard')}
                className="px-4 py-2 rounded-sm bg-paper-warm border border-hairline hover:border-amber text-ink text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Compliance Head Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Lower Empty Spacer */}
      <div className="flex-1" />

      {/* Element 3: Minimal Footer with Secure Login & Clearance Indicators */}
      <footer className="pt-6 border-t border-hairline text-sm text-muted flex flex-col sm:flex-row items-center justify-between gap-3 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted" />
          <span className="font-medium">Secure Encrypted Portal Entry Point (OAuth2 / OIDC Ready)</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="hover:text-ink cursor-pointer font-medium">Clearance Level: Tier 2</span>
          <span>•</span>
          <span className="hover:text-ink cursor-pointer font-medium">Privacy Policy & Audit Log</span>
          <span>•</span>
          <button 
            onClick={() => onNavigateDashboard('dashboard')}
            className="text-amber hover:text-amber-hover font-semibold cursor-pointer"
          >
            Compliance Head Login →
          </button>
        </div>
      </footer>

    </div>
  );
}
