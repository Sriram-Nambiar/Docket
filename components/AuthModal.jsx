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
    <div className="modal-overlay">
      <div className="modal-panel">
        
        {/* Top Header */}
        <div className="border-b border-hairline pb-4 mb-4 relative">
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-0 right-0 text-muted hover:text-ink transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-sm bg-amber-light flex items-center justify-center text-amber">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-ink">Docket</h2>
              <span className="text-sm text-muted font-medium">Enterprise RBAC & Identity Portal</span>
            </div>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Sign in to access your tailored workspace experience: <strong className="text-ink">User Intake Canvas</strong> or <strong className="text-ink">Compliance Head Command Center</strong>.
          </p>
        </div>

        {/* Quick Demo One-Click Access Options */}
        <div className="mb-6 space-y-3">
          <span className="text-sm font-bold uppercase tracking-wider text-muted block">
            ⚡ Quick Demo One-Click Authentication
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Solo Founder / User Quick Access */}
            <button
              type="button"
              onClick={() => handleDemoSelect('founder')}
              className="ledger-card-interactive p-4 bg-paper hover:bg-paper-warm text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-ink flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber" />
                    Solo Founder / User
                  </span>
                  <span className="tier-badge">Tier 1</span>
                </div>
                <p className="text-sm text-muted leading-relaxed mt-2">
                  Prompt-driven intake form, AI structure mapping & baseline compliance checklists.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold text-amber group-hover:translate-x-0.5 transition-transform">
                <span>Launch Intake Canvas</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Compliance Head Quick Access */}
            <button
              type="button"
              onClick={() => handleDemoSelect('compliance_head')}
              className="ledger-card-interactive p-4 bg-paper border-amber hover:bg-paper-warm text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-ink flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4 text-amber" />
                    Compliance Head
                  </span>
                  <span className="tier-badge tier-badge-active">Tier 2</span>
                </div>
                <p className="text-sm text-muted leading-relaxed mt-2">
                  Ledger dashboard, visual task graph, live audit feed & rule engine.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold text-amber group-hover:translate-x-0.5 transition-transform">
                <span>Launch Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>

        {/* Credentials Form (Login / Register) */}
        <div className="space-y-4">
          <div className="flex border-b border-hairline gap-4">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`pb-2 text-sm font-bold transition-all ${
                mode === 'login' 
                  ? 'border-b-2 border-amber text-amber' 
                  : 'text-muted hover:text-ink'
              }`}
            >
              Sign In with Password
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`pb-2 text-sm font-bold transition-all ${
                mode === 'register' 
                  ? 'border-b-2 border-amber text-amber' 
                  : 'text-muted hover:text-ink'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-sm bg-overdue-light border border-overdue text-overdue text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-ink mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Swathi Sharma"
                    className="ledger-input w-full pl-9"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. founder@apextech.in"
                  className="ledger-input w-full pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="ledger-input w-full pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Select Interface & Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="ledger-input w-full"
              >
                <option value="compliance_head">🛡️ Compliance Head (Command Center & Ledger UI)</option>
                <option value="user">🚀 Department Collaborator / Solo Founder (Intake Canvas)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
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
