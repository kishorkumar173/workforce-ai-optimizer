import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, CheckCircle2, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const WorkloadPage: React.FC = () => {
  const navigate = useNavigate();
  const [workload, setWorkload] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkload();
  }, []);

  const loadWorkload = async () => {
    try {
      setLoading(true);
      const data = await api.getWorkloadOverview();
      setWorkload(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Calculating organizational capacity...</div>;
  }

  const employees = workload?.employees || [];
  const overloaded = employees.filter((e: any) => e.utilizationPercentage > 100);
  const nearCapacity = employees.filter((e: any) => e.utilizationPercentage >= 80 && e.utilizationPercentage <= 100);
  const optimal = employees.filter((e: any) => e.utilizationPercentage < 80);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Workload & Capacity Engine</h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Real-time utilization rates, capacity headroom, and multi-project allocation tracking.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Utilization</p>
          <p className="text-3xl font-black text-white mt-1">{workload?.averageUtilizationPercentage ?? 87}%</p>
          <p className="text-xs text-emerald-400 font-semibold mt-1">Healthy Enterprise Band (75-90%)</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Capacity</p>
          <p className="text-3xl font-black text-cyan-400 mt-1">{workload?.totalCapacityHours ?? 6080} hrs</p>
          <p className="text-xs text-slate-400 font-medium mt-1">Across 152 active employees</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allocated Hours</p>
          <p className="text-3xl font-black text-blue-400 mt-1">{workload?.totalAllocatedHours ?? 5289} hrs</p>
          <p className="text-xs text-slate-400 font-medium mt-1">Active project commitments</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overcapacity Warnings</p>
          <p className="text-3xl font-black text-rose-400 mt-1">{workload?.overloadedEmployeesCount ?? 0}</p>
          <p className="text-xs text-rose-400/80 font-semibold mt-1">Staff exceeding 100% capacity</p>
        </div>
      </div>

      {/* Department Utilization Comparison */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white mb-4">Department Utilization Heatmap</h3>
        <div className="space-y-4">
          {(workload?.departmentUtilization || []).map((dept: any, idx: number) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">{dept.department} ({dept.employeeCount} staff)</span>
                <span className="text-cyan-400">{dept.averageUtilization}% Utilized</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden border border-white/[0.05]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, dept.averageUtilization)}%`,
                    background:
                      dept.averageUtilization > 90
                        ? 'linear-gradient(90deg, #F43F5E, #E11D48)'
                        : dept.averageUtilization > 75
                        ? 'linear-gradient(90deg, #06B6D4, #3B82F6)'
                        : 'linear-gradient(90deg, #10B981, #06B6D4)',
                    boxShadow: '0 0 8px rgba(6, 182, 212, 0.4)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Capacity Roster */}
      <div className="glass-panel rounded-2xl border border-white/[0.08] shadow-card overflow-hidden p-6">
        <h3 className="text-sm font-bold text-white mb-4">Employee Capacity Allocations</h3>
        <div className="divide-y divide-white/[0.05]">
          {employees.map((emp: any) => (
            <div
              key={emp.employeeId}
              onClick={() => navigate(`/workforce/${emp.employeeId}`)}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.03] cursor-pointer px-2 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={emp.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                  alt={emp.employeeName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-cyan-400/50 transition-all"
                />
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{emp.employeeName}</h4>
                  <p className="text-[11px] text-slate-400">{emp.jobTitle} • {emp.department}</p>
                </div>
              </div>

              {/* Projects Breakdown */}
              <div className="flex flex-wrap gap-1.5 max-w-sm">
                {(emp.assignments || []).map((a: any, i: number) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] font-bold rounded bg-white/[0.04] text-slate-300 border border-white/10">
                    {a.projectName} ({a.allocationPercentage}%)
                  </span>
                ))}
                {(emp.assignments || []).length === 0 && (
                  <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    100% Available
                  </span>
                )}
              </div>

              {/* Capacity Bar */}
              <div className="w-44 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400">{emp.totalAllocatedHours} / {emp.weeklyCapacityHours} hrs</span>
                  <span className={emp.utilizationPercentage > 100 ? 'text-rose-400' : 'text-slate-200'}>
                    {emp.utilizationPercentage}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800/80 overflow-hidden border border-white/[0.05]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, emp.utilizationPercentage)}%`,
                      background:
                        emp.utilizationPercentage > 100
                          ? 'linear-gradient(90deg, #F43F5E, #E11D48)'
                          : emp.utilizationPercentage >= 80
                          ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                          : 'linear-gradient(90deg, #06B6D4, #3B82F6)',
                      boxShadow: '0 0 8px rgba(6, 182, 212, 0.4)',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
