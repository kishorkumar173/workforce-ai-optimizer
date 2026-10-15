import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface WorkforceAllocationDonutProps {
  data?: Array<{
    name: string;
    percentage: number;
    count: number;
    color: string;
  }>;
  totalEmployees?: number;
}

const DEFAULT_DEPARTMENTS = [
  { name: 'Development', percentage: 35, color: '#3B82F6' },
  { name: 'Design', percentage: 15, color: '#10B981' },
  { name: 'Marketing', percentage: 10, color: '#F59E0B' },
  { name: 'Operations', percentage: 20, color: '#06B6D4' },
  { name: 'Management', percentage: 10, color: '#EF4444' },
  { name: 'Others', percentage: 10, color: '#8B5CF6' },
];

export const WorkforceAllocationDonut: React.FC<WorkforceAllocationDonutProps> = ({
  data = DEFAULT_DEPARTMENTS,
  totalEmployees = 152,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] flex flex-col h-full relative overflow-hidden group">
      {/* Subtle background ambient glow */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-700" />

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
          <span>Workforce Allocation</span>
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
          Distribution
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between flex-1 gap-4 relative z-10">
        {/* Donut Chart with Center Number */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="percentage"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Central Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl font-black text-white tracking-tight leading-none drop-shadow-sm">
              {totalEmployees}
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-1">
              Employees
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs font-medium p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}80`,
                  }}
                />
                <span className="text-slate-300 font-medium">{item.name}</span>
              </div>
              <span className="text-white font-bold">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
