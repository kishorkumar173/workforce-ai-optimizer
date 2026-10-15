import React, { useEffect, useState } from 'react';
import { BrainCircuit, TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { DashboardMetrics } from '../types';
import { useNavigate } from 'react-router-dom';

export const InsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Insights & Predictive Analytics</h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Autonomous organizational analysis, bottleneck detection, and talent optimization suggestions.
        </p>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-[#0C1425] via-[#111A33] to-[#0A0E1A] text-white rounded-3xl p-6 md:p-8 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 group">
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-all" />

        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[11px] font-bold shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Autonomous Intelligence Engine v2.4</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Workforce Synergy & Delivery Forecasting</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Overall organizational efficiency is benchmarked at 87%. Our predictive model projects a 98% on-time milestone delivery across current active sprints provided marketing resourcing is rebalanced.
          </p>
        </div>

        <button
          onClick={() => navigate('/team-recommendations')}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-all self-start md:self-auto flex items-center gap-2 relative z-10"
        >
          <span>Run Team Optimization</span>
          <ArrowRight className="w-4 h-4 text-cyan-200" />
        </button>
      </div>

      {/* Categorized Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(metrics?.aiInsights || []).map((insight) => (
          <div
            key={insight.id}
            className="glass-panel p-6 rounded-2xl border border-white/[0.08] hover:border-cyan-500/30 transition-all flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 shadow-sm">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{insight.title}</span>
                <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-white/[0.04] text-slate-300 border border-white/10">
                  {insight.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
