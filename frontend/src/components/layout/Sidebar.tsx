import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Sparkles,
  GitCompare,
  Clock,
  Award,
  Target,
  BrainCircuit,
  Settings,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, badge: null },
    { label: 'Projects', path: '/projects', icon: FolderKanban, badge: '24' },
    { label: 'Workforce', path: '/workforce', icon: Users, badge: '152' },
    { label: 'Team Formation', path: '/team-recommendations', icon: Sparkles, badge: 'AI' },
    { label: 'Simulation', path: '/simulation', icon: GitCompare, badge: 'Live' },
    { label: 'Workload & Heatmap', path: '/workload', icon: Clock, badge: null },
    { label: 'Skill Matrix', path: '/skills-training', icon: Award, badge: null },
    { label: 'Reviews & Goals', path: '/reviews', icon: Target, badge: null },
    { label: 'AI Insights', path: '/insights', icon: BrainCircuit, badge: null },
    { label: 'Audit Logs', path: '/audit-logs', icon: ShieldCheck, badge: null },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#090D16]/95 backdrop-blur-2xl border-r border-white/[0.07] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.06]">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-500 p-[1.5px] shadow-glow-cyan">
            <div className="w-full h-full bg-[#090D16] rounded-[14px] flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400 shadow-glow-cyan"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">WorkForceAI</span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              People • Projects • Productivity
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 via-cyan-500/20 to-transparent text-white border-l-2 border-cyan-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className={isActive ? 'font-bold' : ''}>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                          item.badge === 'AI' || item.badge === 'Live'
                            ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border-cyan-500/30 animate-pulse'
                            : 'bg-white/[0.06] text-slate-400 border-white/[0.06]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quantum Engine Callout */}
        <div className="p-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#131A2B] to-[#0D121F] border border-cyan-500/20 p-4 text-white shadow-card-dark">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <Zap className="w-4 h-4 fill-cyan-400" />
              </div>
              <button
                onClick={() => navigate('/team-recommendations')}
                className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-cyan-500 hover:text-black flex items-center justify-center transition-all group"
                title="Launch Team Optimizer"
              >
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <h4 className="text-xs font-bold text-white tracking-tight">
              Quantum Team Engine
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              5-factor explainable staffing
            </p>
          </div>
        </div>

        {/* Settings Footer */}
        <div className="p-3 border-t border-white/[0.06]">
          <NavLink
            to="/insights"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & Node Status</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
