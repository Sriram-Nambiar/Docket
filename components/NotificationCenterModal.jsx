"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Send, 
  Mail, 
  MessageSquare, 
  Globe, 
  Server, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle,
  Radio,
  Share2
} from 'lucide-react';

export default function NotificationCenterModal({ isOpen, onClose }) {
  const [redisInfo, setRedisInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [queueLength, setQueueLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dispatching, setDispatching] = useState(false);

  // Form state for custom event test
  const [eventTitle, setEventTitle] = useState('DIR-3 KYC Statutory Deadline Alert');
  const [eventDescription, setEventDescription] = useState('OTP verification pending for Director 2. Risk of DIN deactivation.');
  const [eventType, setEventType] = useState('OBLIGATION_DUE_ALERT');

  const fetchNotificationState = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setRedisInfo(data.redisInfo);
        setHistory(data.history || []);
        setQueueLength(data.queueLength || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notification state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotificationState();
    }
  }, [isOpen]);

  const handleSendTestNotification = async (e) => {
    e.preventDefault();
    setDispatching(true);

    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          title: eventTitle,
          description: eventDescription,
          entityName: 'Apex Technologies Pvt Ltd',
          metadata: { statusColor: eventType === 'OBLIGATION_DUE_ALERT' ? 'Red' : 'Amber', dueDate: '2026-08-30' },
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchNotificationState();
      }
    } catch (err) {
      console.error('Dispatch error:', err);
    } finally {
      setDispatching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 text-xs">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Bell className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Redis Event-Driven Notification Engine</h3>
              <p className="text-[11px] text-slate-500">Multi-Channel Fan-Out: Email • SMS • Slack Webhook • Custom Webhook</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={fetchNotificationState}
              disabled={loading}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
              title="Refresh Redis Queue"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Redis Docker Status Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">Docker Redis Engine Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/40">
                  {redisInfo?.connected ? '🟢 ONLINE (Port 6379)' : '🟡 FALLBACK MODE'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {redisInfo?.url || 'redis://127.0.0.1:6379'} • Queue Length: <strong className="text-emerald-400">{queueLength}</strong> messages
              </span>
            </div>
          </div>

          <div className="text-right font-mono text-[10px] text-slate-400">
            <span className="block text-emerald-400">LPUSH / PUBLISH Active</span>
            <span>History Trimmed: 100 max</span>
          </div>
        </div>

        {/* Active Channel Matrix */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">
            Configured Fan-Out Dispatch Channels:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">Email</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">SMS Gateway</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-600" />
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">Slack Webhook</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-600" />
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">HTTP Webhook</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Event Simulator */}
        <form onSubmit={handleSendTestNotification} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-700 animate-pulse" />
              Trigger Event Fan-Out via Redis Queue
            </span>
            <span className="text-[10px] text-slate-500 font-mono">POST /api/notifications</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-600 font-bold uppercase">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:outline-none focus:border-blue-700"
              >
                <option value="OBLIGATION_DUE_ALERT">Obligation Due Alert</option>
                <option value="TASK_CREATED">Task Created</option>
                <option value="TASK_STATE_CHANGE">Task State Transition</option>
                <option value="RULE_UPDATE_NOTIF">Rule SME Approval</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] text-slate-600 font-bold uppercase">Notification Title</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:outline-none focus:border-blue-700"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-600 font-bold uppercase">Event Payload Description</label>
            <input
              type="text"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:outline-none focus:border-blue-700"
              required
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={dispatching}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-indigo-400" />
              <span>{dispatching ? 'Publishing to Redis...' : 'Dispatch Redis Event'}</span>
            </button>
          </div>
        </form>

        {/* Live Redis Dispatch History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
              Recent Redis Dispatch History ({history.length} events logged):
            </span>
            <span className="text-[10px] text-emerald-700 font-mono">Immutable Redis Store</span>
          </div>

          {history.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-xs">
              No notifications dispatched yet. Use the form above or interact with compliance tasks to generate events.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {history.map((item, idx) => (
                <div key={item.eventId || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold">
                        {item.eventType}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{item.timestamp?.substring(11, 19)}</span>
                  </div>

                  <p className="text-[11px] text-slate-600">{item.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                    {item.dispatches?.map((disp, dIdx) => (
                      <div key={dIdx} className="p-1.5 rounded bg-white border border-slate-200 text-[10px]">
                        <span className="font-bold text-slate-800 block">{disp.channel}</span>
                        <span className="text-emerald-600 font-semibold">{disp.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
