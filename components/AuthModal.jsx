"use client";

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Sparkles, 
  LayoutDashboard, 
  X, 
  Mail, 
  Building2, 
  ArrowRight,
  UserCheck,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, loginAsDemo } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('compliance_head'); // 'user' or 'compliance_head'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password, selectedRole);
        if (res.success) {
          onClose();
        }
      } else {
        const res = await register(name, email, password, selectedRole);
        if (res.success) {
          onClose();
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (roleKey) => {
    loginAsDemo(roleKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="bg-slate-900 p-6 text-white relative">
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Docket</h2>
              <span className="text-xs text-indigo-300 font-medium">Enterprise RBAC & Identity Portal</span>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Sign in to access your tailored workspace experience: <strong className="text-white">User Intake Canvas</strong> or <strong className="text-white">Compliance Head Bento Command Center</strong>.
          </p>
        </div>

        {/* Quick Demo One-Click Access Options */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
            ⚡ Quick Demo One-Click Authentication
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Solo Founder / User Quick Access */}
            <button
              type="button"
              onClick={() => handleDemoSelect('founder')}
              className="p-3.5 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50/50 hover:border-indigo-400 text-left transition-all group cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Solo Founder / User
                  </span>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">Tier 1</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Prompt-driven intake form, AI structure mapping & baseline compliance checklists.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                <span>Launch Intake Canvas</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            {/* Compliance Head Quick Access */}
            <button
              type="button"
              onClick={() => handleDemoSelect('compliance_head')}
              className="p-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 hover:border-slate-400 text-left transition-all group cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                    Compliance Head
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Tier 2</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Bento-Box dashboard, visual task graph, live audit feed & rule engine.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                <span>Launch Command Center</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>

        {/* Credentials Form (Login / Register) */}
        <div className="p-6 space-y-4">
          <div className="flex border-b border-slate-200 gap-4">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`pb-2 text-xs font-bold transition-all ${
                mode === 'login' 
                  ? 'text-slate-900 border-b-2 border-indigo-600' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In with Password
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`pb-2 text-xs font-bold transition-all ${
                mode === 'register' 
                  ? 'text-slate-900 border-b-2 border-indigo-600' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Swathi Sharma"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. founder@apextech.in"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Interface & Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value="compliance_head">🛡️ Compliance Head (Command Center & Bento UI)</option>
                <option value="user">🚀 Department Collaborator / Solo Founder (Intake Canvas)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{mode === 'login' ? 'Sign In to Workspace' : 'Complete Registration'}</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
