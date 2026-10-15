import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown, Activity } from 'lucide-react';

interface ProjectProgressChartProps {
  data?: Array<{
    month: string;
    planning: number;
    inProgress: number;
    completed: number;
  }>;
}

const DEFAULT_DATA = [
  { month: 'Jan', planning: 20, inProgress: 40, completed: 30 },
  { month: 'Feb', planning: 25, inProgress: 45, completed: 38 },
  { month: 'Mar', planning: 28, inProgress: 52, completed: 42 },
  { month: 'Apr', planning: 30, inProgress: 60, completed: 55 },
  { month: 'May', planning: 35, inProgress: 75, completed: 68 },
  { month: 'Jun', planning: 38, inProgress: 88, completed: 82 },
];

export const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({ data = DEFAULT_DATA }) => {
  const [timeframe, setTimeframe] = useState('Last 6 Months');

  return (
    <div className="rounded-2xl bg-[#0E1424]/80 backdrop-blur-xl border border-white/[0.08] p-6 shadow-card-dark flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Project Progress Overview</h3>
            <p className="text-[10px] text-slate-400 font-medium">Sprint velocity and completion projections</p>
          </div>
        </div>

        {/* Timeframe Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] transition-colors">
            <span>{timeframe}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-5 mb-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan" />
          <span className="text-slate-300">Planning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-emerald" />
          <span className="text-slate-300">In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-glow-violet" />
          <span className="text-slate-300">Completed</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cyberPlanning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="cyberProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="cyberCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090D16',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            />
            <Area
              type="monotone"
              dataKey="planning"
              stroke="#06B6D4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#cyberPlanning)"
            />
            <Area
              type="monotone"
              dataKey="inProgress"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#cyberProgress)"
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#cyberCompleted)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
