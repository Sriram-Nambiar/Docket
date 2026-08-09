"use client";

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Send, 
  Check, 
  Clock, 
  BellRing, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import { taskStore, useAuditLog } from '../lib/taskStore';

export default function WhatsAppReminderSettings() {
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [founderName, setFounderName] = useState('Ankit Sharma (Founder)');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [testSent, setTestSent] = useState(false);
  const [selectedIntervals, setSelectedIntervals] = useState(['30d', '15d', '7d', '1d']);
  
  const auditLog = useAuditLog();
  const whatsappLogs = auditLog.filter(log => 
    log.actor === 'WhatsApp Reminder Bot' || 
    log.action.toLowerCase().includes('whatsapp') || 
    log.action.toLowerCase().includes('sms')
  );

  const toggleInterval = (code) => {
    setSelectedIntervals(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSendTestReminder = () => {
    taskStore.appendAudit({
      actor: 'WhatsApp Reminder Bot',
      avatar: 'WA',
      action: `sent WhatsApp compliance digest to ${phoneNumber} (${founderName})`,
      target: `GSTR-3B Due in 7 Days (Aug 20) — Accruing ₹50/day late fee if missed`,
      status: 'Amber'
    });

    // Also dispatch notification to API
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'WHATSAPP_REMINDER_SENT',
        title: `WhatsApp Alert Sent: GSTR-3B Return`,
        description: `Digest delivered to ${phoneNumber} (${founderName}) — Due in 7 Days`,
        entityName: 'Apex Technologies Pvt Ltd',
        metadata: { recipient: phoneNumber, daysLeft: 7, dailyPenalty: '₹50/day' }
      })
    }).catch(err => console.warn(err));

    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="ledger-card p-6 border-l-4 border-l-emerald-600 bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-300">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="heading-serif text-xl font-semibold text-ink flex items-center gap-2">
                WhatsApp Regulatory Reminder Gateway
                <span className="tier-badge tier-badge-active text-[10px]">TIER 1 & TIER 2</span>
              </h1>
              <p className="text-sm text-muted mt-0.5">
                Proactive deadline delivery straight to phone — designed for founders who check WhatsApp daily
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="status-verified font-mono text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              Gateway Connected
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Phone & Cadence Configuration (7 cols) */}
        <div className="lg:col-span-7 ledger-card p-6 space-y-5 bg-surface">
          <h2 className="heading-serif text-base font-semibold text-ink border-b border-hairline pb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber" />
            Founder WhatsApp Profile Settings
          </h2>

          <div className="space-y-4 text-xs">
            
            {/* Founder Name */}
            <div>
              <label className="label-caps block mb-1">Founder / Recipient Name</label>
              <input 
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                className="ledger-input"
                placeholder="e.g. Ankit Sharma (Solo Founder)"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="label-caps block mb-1">WhatsApp Mobile Number</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="ledger-input font-mono flex-1"
                  placeholder="+91 98765 43210"
                />
                <button
                  onClick={handleSendTestReminder}
                  className="btn-accent text-xs whitespace-nowrap cursor-pointer"
                >
                  {testSent ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Test Digest
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-muted mt-1">
                Reminders arrive via verified Docket WhatsApp Business API template
              </p>
            </div>

            {/* Cadence Selector */}
            <div className="space-y-2 pt-2 border-t border-hairline">
              <label className="label-caps block">Automated Dispatch Cadence</label>
              <p className="text-xs text-muted">
                Choose pre-filing countdown triggers for automated WhatsApp delivery:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { code: '30d', label: '30 Days Out', desc: 'Advance Notice' },
                  { code: '15d', label: '15 Days Out', desc: 'Preparation Alert' },
                  { code: '7d', label: '7 Days Out', desc: 'Urgent Filing' },
                  { code: '1d', label: '1 Day Out', desc: 'Final Warning' },
                ].map(interval => {
                  const isActive = selectedIntervals.includes(interval.code);
                  return (
                    <button
                      key={interval.code}
                      onClick={() => toggleInterval(interval.code)}
                      className={`p-3 rounded-sm border text-left cursor-pointer transition-all ${
                        isActive 
                          ? 'border-amber bg-amber-light text-ink font-semibold' 
                          : 'border-hairline bg-paper-warm text-muted hover:border-amber'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold">{interval.label}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-amber" />}
                      </div>
                      <span className="text-[10px] block opacity-80">{interval.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sample Message Preview Card */}
            <div className="pt-2">
              <label className="label-caps block mb-1">Live WhatsApp Message Template Preview</label>
              <div className="p-4 rounded-sm bg-[#E5DDD5] border border-hairline font-sans text-xs text-slate-800 space-y-2 relative">
                <div className="bg-white p-3 rounded-md shadow-xs max-w-sm space-y-1.5 border-l-4 border-l-emerald-600">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 border-b border-slate-100 pb-1">
                    <span>📋 DOCKET STATUTORY ALERT</span>
                    <span className="font-mono font-normal text-[10px] text-slate-400">10:42 AM</span>
                  </div>
                  <p className="text-slate-900 font-medium text-xs">
                    Hi {founderName.split(' ')[0]}, action required for <strong>Apex Technologies Pvt Ltd</strong>:
                  </p>
                  <p className="text-slate-700 text-xs">
                    ⚠️ <strong>GSTR-3B Monthly Return</strong> is due in <strong>7 days (Aug 20)</strong>.
                  </p>
                  <div className="bg-amber-50 p-2 rounded text-[11px] border border-amber-200 font-mono text-amber-900">
                    Penalty if missed: ₹50/day late fee (₹14,600 projected exposure)
                  </div>
                  <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                    Reply "FILE NOW" or click docket.app/f/GST-002 to upload evidence.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: WhatsApp Audit Trail & Log Feed (5 cols) */}
        <div className="lg:col-span-5 ledger-card p-6 space-y-4 bg-surface">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h2 className="heading-serif text-base font-semibold text-ink flex items-center gap-2">
              <BellRing className="w-4 h-4 text-emerald-700" />
              WhatsApp Dispatch Audit Feed
            </h2>
            <span className="font-mono text-xs text-muted">{whatsappLogs.length} Events</span>
          </div>

          <p className="text-xs text-muted">
            Printed log of sent WhatsApp reminders & delivery confirmations:
          </p>

          <div className="space-y-2.5">
            {whatsappLogs.length > 0 ? (
              whatsappLogs.map((log) => (
                <div key={log.id} className="p-3 bg-paper-warm border border-hairline rounded-sm space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-sm bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        WA
                      </span>
                      <span className="font-semibold text-ink">{log.actor}</span>
                    </div>
                    <span className="text-[11px] text-muted whitespace-nowrap">{log.timestamp}</span>
                  </div>

                  <div className="text-xs text-ink-light pl-7 space-y-0.5 leading-relaxed">
                    <span>{log.action} </span>
                    {log.target && <strong className="text-ink font-semibold block mt-0.5">{log.target}</strong>}
                  </div>

                  <div className="pl-7 pt-1.5 flex items-center justify-between text-[10px] text-muted border-t border-hairline/60">
                    <span>Hash: <code className="text-ink font-bold">{log.hash}</code></span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-700" /> Delivered
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-sm bg-paper-warm border border-hairline text-center text-xs text-muted space-y-1">
                <MessageCircle className="w-5 h-5 text-muted mx-auto" />
                <p>No WhatsApp dispatch logs recorded yet.</p>
                <button 
                  onClick={handleSendTestReminder}
                  className="text-amber font-semibold hover:underline cursor-pointer"
                >
                  Click to send test digest →
                </button>
              </div>
            )}
          </div>

          {/* Pitch Note Box */}
          <div className="p-3.5 rounded-sm bg-amber-light border border-amber/40 text-xs text-ink space-y-1">
            <span className="font-bold font-mono text-[10px] uppercase text-amber block">
              Founder Pitch Note:
            </span>
            <p className="leading-relaxed">
              "Docket doesn't just track compliance — it makes sure the founder actually sees the deadline on WhatsApp before it costs them money."
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
