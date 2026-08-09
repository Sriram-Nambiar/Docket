"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Workflow, Play, RotateCcw, CheckCircle2, AlertCircle, Loader2, Terminal, Clock, Hash, Cpu, Brain, ShieldCheck, FileText, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

const initialAgents = [
  { step: 1, name: 'Intake Advisor Agent', description: 'Evaluates business structure via NVIDIA NIM AI', status: 'pending', messages: [], output: null, duration: null, summary: null, error: null },
  { step: 2, name: 'Rule Engine Evaluator', description: 'Matches applicable statutory obligations from rule library', status: 'pending', messages: [], output: null, duration: null, summary: null, error: null },
  { step: 3, name: 'Penalty Risk Scanner', description: 'Computes penalty exposure for overdue filings', status: 'pending', messages: [], output: null, duration: null, summary: null, error: null },
  { step: 4, name: 'Form Pre-Fill Agent', description: 'Generates pre-filled statutory form templates', status: 'pending', messages: [], output: null, duration: null, summary: null, error: null },
  { step: 5, name: 'Audit & Hash Engine', description: 'Computes SHA-256 hash and logs to audit trail', status: 'pending', messages: [], output: null, duration: null, summary: null, error: null },
];

export default function OrchestrationTimeline() {
  const [inputText, setInputText] = useState('SaaS Private Limited Company in Bengaluru, ₹50L annual turnover, 10 employees, 2 co-founders');
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [agents, setAgents] = useState(initialAgents);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [workflowResult, setWorkflowResult] = useState(null);
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [runningTimers, setRunningTimers] = useState({});
  const [timerTick, setTimerTick] = useState(0);

  const terminalRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTimerTick(prev => prev + 1), 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const extractEntities = (text) => {
    // Simple heuristic for demo
    return {
      sector: text.toLowerCase().includes('saas') ? 'Tech/SaaS' : 'General',
      turnover: text.match(/₹[\d.,]+[L|Cr]/i)?.[0] || 'Unknown',
      employees: parseInt(text.match(/(\d+)\s+employees/i)?.[1]) || 10,
      founders: parseInt(text.match(/(\d+)\s+co-founders/i)?.[1]) || 2,
    };
  };

  const getAgentColor = (step) => {
    const colors = ['text-blue-400', 'text-purple-400', 'text-orange-400', 'text-cyan-400', 'text-emerald-400'];
    return colors[step - 1] || 'text-slate-400';
  };

  const addLog = (log) => {
    setTerminalLogs(prev => [...prev, log]);
  };

  const runWorkflow = async () => {
    if (isRunning) return;
    
    // Reset state
    setAgents(initialAgents);
    setTerminalLogs([]);
    setWorkflowResult(null);
    setExpandedAgent(null);
    setRunningTimers({});
    setIsRunning(true);
    setIsComplete(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const entities = extractEntities(inputText);

    try {
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessDescription: inputText,
          ...entities,
          fdi: false
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep the incomplete part

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              const now = new Date();
              const timestampStr = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
              
              if (data.type === 'workflow:start') {
                addLog({ timestamp: timestampStr, message: `Workflow started: ${data.workflowId}`, type: 'system' });
              } 
              else if (data.type === 'agent:update') {
                const step = data.step;
                setAgents(prev => prev.map(a => {
                  if (a.step === step) {
                    const newMessages = [...a.messages, data.message];
                    return { ...a, status: data.status, messages: newMessages };
                  }
                  return a;
                }));
                
                if (data.status === 'thinking' || data.status === 'running') {
                  setRunningTimers(prev => ({
                    ...prev,
                    [step]: prev[step] || Date.now()
                  }));
                }

                addLog({ 
                  timestamp: timestampStr, 
                  agent: `[Agent ${step}]`,
                  agentClass: getAgentColor(step),
                  message: data.message, 
                  type: 'update' 
                });
              }
              else if (data.type === 'agent:complete') {
                const step = data.step;
                setAgents(prev => prev.map(a => 
                  a.step === step 
                    ? { ...a, status: 'complete', duration: data.duration, summary: data.summary, output: data.output } 
                    : a
                ));
                
                setRunningTimers(prev => {
                  const newTimers = { ...prev };
                  delete newTimers[step];
                  return newTimers;
                });

                addLog({ 
                  timestamp: timestampStr, 
                  agent: `[Agent ${step}]`,
                  agentClass: getAgentColor(step),
                  message: `✓ ${data.summary}`, 
                  type: 'success' 
                });
              }
              else if (data.type === 'agent:error') {
                const step = data.step;
                setAgents(prev => prev.map(a => 
                  a.step === step ? { ...a, status: 'error', error: data.message } : a
                ));
                setRunningTimers(prev => {
                  const newTimers = { ...prev };
                  delete newTimers[step];
                  return newTimers;
                });
                addLog({ 
                  timestamp: timestampStr, 
                  agent: `[Agent ${step}]`,
                  agentClass: getAgentColor(step),
                  message: `✗ ${data.message}`, 
                  type: 'error' 
                });
              }
              else if (data.type === 'workflow:complete') {
                setWorkflowResult({
                  workflowId: data.workflowId,
                  totalDuration: data.totalDuration,
                  hash: data.hash
                });
                addLog({ timestamp: timestampStr, message: `Workflow complete: ${data.workflowId}`, type: 'system' });
                setIsRunning(false);
                setIsComplete(true);
              }
            } catch (err) {
              console.error('Error parsing SSE event', err, line);
            }
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Workflow error:', error);
        addLog({ timestamp: '[SYS]', message: `Error: ${error.message}`, type: 'error' });
      }
      setIsRunning(false);
    }
  };

  const toggleExpand = (step) => {
    setExpandedAgent(expandedAgent === step ? null : step);
  };

  const getAgentIcon = (step) => {
    switch(step) {
      case 1: return <Brain className="w-5 h-5" />;
      case 2: return <FileText className="w-5 h-5" />;
      case 3: return <ShieldCheck className="w-5 h-5" />;
      case 4: return <Calculator className="w-5 h-5" />;
      case 5: return <Cpu className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const formatDuration = (ms) => {
    if (!ms) return '0.0s';
    return (ms / 1000).toFixed(1) + 's';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-6">
      {/* Input Section */}
      <div className="ledger-card bg-surface p-6 rounded-lg border border-hairline shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Workflow className="w-6 h-6 text-amber" />
          <h2 className="heading-serif text-2xl font-semibold text-ink">Agentic AI Compliance Workflow Engine</h2>
        </div>
        <p className="text-muted mb-6">Enter your business details and watch 5 AI agents analyze, classify, and audit your compliance stack in real-time.</p>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1 w-full">
            <label className="label-caps text-xs text-muted block mb-2">Business Description</label>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isRunning}
              className="w-full px-4 py-3 rounded border border-hairline bg-paper-warm text-ink focus:border-amber focus:ring-1 focus:ring-amber outline-none transition-all disabled:opacity-50"
              placeholder="e.g. SaaS startup in Mumbai, 10 employees..."
            />
          </div>
          <button 
            onClick={runWorkflow}
            disabled={isRunning}
            className={`btn-accent px-6 py-3 rounded font-medium flex items-center justify-center gap-2 min-w-[200px] transition-all ${isRunning ? 'bg-amber/70 text-white cursor-not-allowed' : 'bg-amber text-white hover:bg-amber/90'}`}
          >
            {isRunning ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Agents Running...</>
            ) : isComplete ? (
              <><RotateCcw className="w-5 h-5" /> Re-run Workflow</>
            ) : (
              <><Play className="w-5 h-5" /> Run Workflow</>
            )}
          </button>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Agent Execution Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4 relative">
          <div className="absolute left-6 top-8 bottom-8 w-px bg-slate-200 z-0"></div>
          
          {agents.map((agent) => {
            const isPending = agent.status === 'pending';
            const isRunningState = agent.status === 'thinking' || agent.status === 'running';
            const isComplete = agent.status === 'complete';
            const isError = agent.status === 'error';
            const isExpanded = expandedAgent === agent.step;

            let cardClasses = "ledger-card relative z-10 p-5 rounded-lg ml-12 transition-all duration-300 ";
            let badgeClasses = "absolute -left-12 top-5 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm z-20 ";
            let statusBadge = null;

            if (isPending) {
              cardClasses += "bg-paper-warm border-hairline opacity-60";
              badgeClasses += "bg-slate-300 text-white";
              statusBadge = <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200 text-slate-600">Pending</span>;
            } else if (isRunningState) {
              cardClasses += "bg-amber-light border-amber/40 border-l-4 border-l-amber animate-pulse shadow-md";
              badgeClasses += "bg-amber text-white shadow-amber/30";
              statusBadge = <span className="text-xs font-medium px-2 py-1 rounded bg-amber/20 text-amber-700 animate-pulse flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> {agent.status === 'thinking' ? 'Thinking...' : 'Running...'}</span>;
            } else if (isComplete) {
              cardClasses += "bg-surface border-hairline border-l-4 border-l-emerald-600 shadow-sm cursor-pointer hover:shadow-md";
              badgeClasses += "bg-emerald-600 text-white";
              statusBadge = <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-100 text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Complete</span>;
            } else if (isError) {
              cardClasses += "bg-red-50 border-red-200 border-l-4 border-l-red-500";
              badgeClasses += "bg-red-500 text-white";
              statusBadge = <span className="text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-700 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Error</span>;
            }

            const currentDuration = runningTimers[agent.step] ? Date.now() - runningTimers[agent.step] : (agent.duration || 0);

            return (
              <div key={agent.step} className="relative">
                <div className={badgeClasses}>{agent.step}</div>
                <div 
                  className={cardClasses} 
                  onClick={() => isComplete ? toggleExpand(agent.step) : null}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={isComplete ? 'text-emerald-600' : isRunningState ? 'text-amber' : 'text-slate-400'}>
                        {getAgentIcon(agent.step)}
                      </div>
                      <h3 className="font-semibold text-ink">{agent.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {(isRunningState || isComplete) && (
                        <div className="flex items-center gap-1 text-xs text-muted font-mono">
                          <Clock className="w-3 h-3" />
                          {formatDuration(currentDuration)}
                        </div>
                      )}
                      {statusBadge}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted mb-3">{agent.description}</p>
                  
                  {isRunningState && agent.messages.length > 0 && (
                    <div className="text-sm text-ink bg-white/50 p-3 rounded border border-hairline mt-3 font-medium flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber mt-1.5 animate-ping"></div>
                      {agent.messages[agent.messages.length - 1]}
                    </div>
                  )}

                  {isComplete && agent.summary && (
                    <div className="text-sm text-emerald-800 bg-emerald-50 p-3 rounded mt-3 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{agent.summary}</span>
                      </div>
                      <button className="text-emerald-600 hover:text-emerald-800 p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {isError && agent.error && (
                    <div className="text-sm text-red-700 bg-red-100 p-3 rounded mt-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{agent.error}</span>
                    </div>
                  )}

                  {isComplete && isExpanded && agent.output && (
                    <div className="mt-3 bg-slate-900 rounded-md p-4 overflow-x-auto">
                      <pre className="text-xs text-slate-300 font-mono">
                        {JSON.stringify(agent.output, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Live Agent Terminal */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 flex flex-col h-[600px] bg-slate-900 rounded-sm border border-slate-700 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-400 font-semibold">{'> Agent Execution Log'}</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
              </div>
            </div>
            <div 
              ref={terminalRef}
              className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1.5 scroll-smooth"
            >
              {terminalLogs.length === 0 && (
                <div className="text-slate-500 italic">Waiting for workflow execution...</div>
              )}
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex items-start break-words">
                  <span className="text-slate-500 mr-2 flex-shrink-0">{log.timestamp}</span>
                  {log.agent && (
                    <span className={`${log.agentClass} mr-2 font-bold whitespace-nowrap`}>{log.agent}</span>
                  )}
                  <span className={`
                    ${log.type === 'error' ? 'text-red-400' : ''}
                    ${log.type === 'success' ? 'text-slate-300' : ''}
                    ${log.type === 'update' ? 'text-slate-300' : ''}
                    ${log.type === 'system' ? 'text-blue-300 font-semibold' : ''}
                  `}>
                    {log.message}
                  </span>
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center gap-2 text-slate-500 mt-2 animate-pulse">
                  <span className="w-2 h-4 bg-slate-500 animate-pulse"></span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Workflow Result Banner */}
      {isComplete && workflowResult && (
        <div className="mt-8 ledger-card bg-verified-light border border-verified border-l-4 border-l-verified p-6 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-verified" />
              <h3 className="font-semibold text-verified-dark">Execution Complete & Audited</h3>
            </div>
            <p className="text-sm text-slate-600">All agent outputs have been verified and sealed.</p>
          </div>
          
          <div className="flex flex-col gap-2 md:items-end">
            <div className="flex items-center gap-4 text-sm bg-white/50 px-4 py-2 rounded border border-verified/20">
              <div className="flex flex-col">
                <span className="text-xs text-muted uppercase">Workflow ID</span>
                <span className="font-mono text-ink font-medium">{workflowResult.workflowId}</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-xs text-muted uppercase">Total Duration</span>
                <span className="font-mono text-ink font-medium">{formatDuration(workflowResult.totalDuration)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-1">
              <Hash className="w-3 h-3" />
              <span className="truncate max-w-[200px] md:max-w-xs">{workflowResult.hash}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
