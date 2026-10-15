import React, { useState } from 'react';
import { X, LogIn, Key, UserCheck, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('EMP-1001');
  const [password, setPassword] = useState('TeamPulse@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const ok = await login(identifier.trim(), password.trim());
      if (ok) {
        onClose();
        window.location.reload();
      } else {
        setError('Invalid identifier or password. Please verify your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setQuickCredentials = (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0E1424] border border-cyan-500/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Sign In to TeamPulse</h3>
              <p className="text-[11px] text-slate-400">Log in with Employee ID or Work Email</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Employee ID or Work Email *
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. EMP-1001 or john.doe@teampulse.ai"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-[#070A11] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Supports Employee IDs (EMP-1001..1008) or work email addresses.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-slate-400" /> Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-white/10 bg-[#070A11] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50"
            />
          </div>

          {/* Quick Demo Credentials for Judges */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Quick Demo Accounts for Judges
              </span>
              <span className="text-[9px] text-slate-400 font-mono">TeamPulse@2026</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setQuickCredentials('EMP-1001', 'TeamPulse@2026')}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-left transition-colors font-medium flex items-center justify-between"
              >
                <span>EMP-1001 (John Doe)</span>
                <span className="text-[9px] font-mono opacity-60">EMP</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickCredentials('EMP-1002', 'TeamPulse@2026')}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-left transition-colors font-medium flex items-center justify-between"
              >
                <span>EMP-1002 (Elena)</span>
                <span className="text-[9px] font-mono opacity-60">EMP</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickCredentials('sarah.johnson@teampulse.ai', 'TeamPulse@2026')}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-left transition-colors font-medium flex items-center justify-between"
              >
                <span>Sarah (Employer)</span>
                <span className="text-[9px] font-mono opacity-60">MGR</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickCredentials('alex.rivera@teampulse.ai', 'TeamPulse@2026')}
                className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-left transition-colors font-medium flex items-center justify-between"
              >
                <span>Alex (Admin)</span>
                <span className="text-[9px] font-mono opacity-60">ADM</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors shadow-glow-cyan disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" /> Sign In
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
