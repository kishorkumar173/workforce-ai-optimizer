import React from 'react';
import { Users, ClipboardList, Clock, BarChart3, TrendingUp, Sparkles } from 'lucide-react';
import { DashboardMetrics } from '../../types';

interface StatCardsProps {
  metrics?: DashboardMetrics;
}

export const StatCards: React.FC<StatCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Total Employees',
      value: metrics?.totalEmployees ?? 152,
      trend: '+8%',
      trendColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      icon: Users,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/15 border-cyan-500/30',
      borderColor: 'hover:border-cyan-500/40',
      topGlow: 'from-cyan-500/40 via-cyan-500/10 to-transparent',
      sparklineColor: '#22D3EE',
      sparklinePath: 'M0,20 Q20,5 40,15 T80,5',
    },
    {
      title: 'Active Projects',
      value: metrics?.activeProjects ?? 24,
      trend: '+12%',
      trendColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      icon: ClipboardList,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30',
      borderColor: 'hover:border-emerald-500/40',
      topGlow: 'from-emerald-500/40 via-emerald-500/10 to-transparent',
      sparklineColor: '#34D399',
      sparklinePath: 'M0,22 Q25,18 45,8 T80,4',
    },
    {
      title: 'Resource Utilization',
      value: `${metrics?.resourceUtilizationRate ?? 87}%`,
      trend: '+5%',
      trendColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      icon: Clock,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15 border-amber-500/30',
      borderColor: 'hover:border-amber-500/40',
      topGlow: 'from-amber-500/40 via-amber-500/10 to-transparent',
      sparklineColor: '#FBBF24',
      sparklinePath: 'M0,18 Q20,22 45,12 T80,8',
    },
    {
      title: 'Project Success Rate',
      value: `${metrics?.projectSuccessRate ?? 98}%`,
      trend: '+3%',
      trendColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
      icon: BarChart3,
      iconColor: 'text-violet-400',
      iconBg: 'bg-violet-500/15 border-violet-500/30',
      borderColor: 'hover:border-violet-500/40',
      topGlow: 'from-violet-500/40 via-violet-500/10 to-transparent',
      sparklineColor: '#A78BFA',
      sparklinePath: 'M0,15 Q25,8 50,14 T80,6',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl bg-[#0E1424]/80 backdrop-blur-xl border border-white/[0.08] p-5 shadow-card-dark transition-all duration-300 hover:-translate-y-1 ${card.borderColor}`}
          >
            {/* Top Luminous Highlight */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.topGlow}`} />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.iconBg} ${card.iconColor} shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white tracking-tight leading-none">{card.value}</p>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">{card.title}</p>
                </div>
              </div>

              {/* Sparkline Visual */}
              <div className="w-16 h-8 flex items-center justify-end">
                <svg className="w-16 h-7 overflow-visible" viewBox="0 0 80 25">
                  <path
                    d={card.sparklinePath}
                    fill="none"
                    stroke={card.sparklineColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Trend Pill */}
            <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-white/[0.05]">
              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold ${card.trendColor}`}>
                <TrendingUp className="w-3 h-3" />
                <span>{card.trend} vs last period</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Optimal Velocity</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
