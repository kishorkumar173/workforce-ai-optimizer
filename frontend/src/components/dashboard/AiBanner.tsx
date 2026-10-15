import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, BrainCircuit, Users, FolderKanban, Zap } from 'lucide-react';

export const AiBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C1425] via-[#111A33] to-[#0A0E1A] border border-cyan-500/30 p-6 md:p-8 text-white shadow-2xl group">
      {/* Dynamic Aurora Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.12),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Content */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-semibold text-cyan-300 mb-3 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next-Gen Workforce Intelligence</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
            Leverage AI for Smarter Workforce Management
          </h2>
          <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
            Optimize resources, predict outcomes, and achieve project success — all in one explainable platform.
          </p>

          <button
            onClick={() => navigate('/team-recommendations')}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all group/btn"
          >
            <span>Explore AI Features</span>
            <ArrowRight className="w-4 h-4 text-cyan-200 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Graphic: Futuristic AI Connection Nodes */}
        <div className="hidden lg:flex items-center gap-6 pr-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs font-semibold text-slate-200 shadow-lg backdrop-blur-md">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>People</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs font-semibold text-slate-200 shadow-lg backdrop-blur-md">
              <FolderKanban className="w-3.5 h-3.5 text-emerald-400" />
              <span>Projects</span>
            </div>
          </div>

          {/* Central Glowing AI Node */}
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 p-1 shadow-2xl shadow-cyan-500/50 animate-pulse">
            <div className="w-full h-full rounded-full bg-[#07090E] flex flex-col items-center justify-center">
              <BrainCircuit className="w-7 h-7 text-cyan-400" />
              <span className="text-[10px] font-black tracking-widest text-white mt-0.5">AI</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs font-semibold text-slate-200 shadow-lg backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Productivity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
