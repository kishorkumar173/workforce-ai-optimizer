import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Briefcase,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { Employee } from '../types';
import { AddEmployeeModal } from '../components/employees/AddEmployeeModal';
import { useAuth } from '../context/AuthContext';

export const WorkforcePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const list = await api.getEmployees();
      setEmployees(list);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
      emp.job_title.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department === 'ALL' || emp.department.toLowerCase() === department.toLowerCase();
    const matchesStatus = status === 'ALL' || emp.current_status.toLowerCase() === status.toLowerCase();
    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'Available':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">Available</span>;
      case 'In a Meeting':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]">In a Meeting</span>;
      case 'Busy':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]">Busy</span>;
      case 'On Leave':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)]">On Leave</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">{s}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Workforce Directory</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Discover internal talent, verified competencies, availability, and weekly workload capacity.
          </p>
        </div>

        {user.role !== 'EMPLOYEE' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/[0.08] flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role, email, skills..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-slate-500 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-white/10 bg-[#0B101E] text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">All Departments</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
            <option value="Management">Management</option>
            <option value="QA">QA</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-white/10 bg-[#0B101E] text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">All Statuses</option>
            <option value="Available">Available</option>
            <option value="In a Meeting">In a Meeting</option>
            <option value="Busy">Busy</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Employee List Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading workforce database...</div>
      ) : (
        <div className="glass-panel rounded-2xl border border-white/[0.08] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Employee</th>
                  <th className="py-3 px-4">Role & Dept</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Capacity / Utilization</th>
                  <th className="py-3 px-4">Core Skills</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filtered.map((emp) => {
                  const util = emp.current_utilization || 0;
                  return (
                    <tr
                      key={emp.id}
                      onClick={() => navigate(`/workforce/${emp.id}`)}
                      className="hover:bg-white/[0.03] cursor-pointer transition-colors group/row"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                            alt={emp.full_name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 group-hover/row:ring-cyan-400/50 transition-all"
                          />
                          <div>
                            <span className="font-bold text-white group-hover/row:text-cyan-300 transition-colors">
                              {emp.full_name}
                            </span>
                            <p className="text-[11px] text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role & Dept */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-200">{emp.job_title}</p>
                        <span className="text-[11px] text-cyan-400 font-medium">{emp.department}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(emp.current_status)}
                      </td>

                      {/* Capacity / Utilization */}
                      <td className="py-3.5 px-4 w-44">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-400">{emp.weekly_capacity_hours}h/wk</span>
                            <span className={util > 100 ? 'text-rose-400' : 'text-slate-200'}>{util}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-800/80 overflow-hidden border border-white/[0.05]">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(100, util)}%`,
                                background:
                                  util > 100
                                    ? 'linear-gradient(90deg, #F43F5E, #E11D48)'
                                    : util >= 80
                                    ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                                    : 'linear-gradient(90deg, #06B6D4, #3B82F6)',
                                boxShadow: '0 0 8px rgba(6, 182, 212, 0.4)',
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Skills */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(emp.skills || []).slice(0, 3).map((s) => (
                            <span
                              key={s.id}
                              className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.08] flex items-center gap-1"
                            >
                              {s.is_verified && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />}
                              <span>{s.skill_name}</span>
                            </span>
                          ))}
                          {(emp.skills || []).length > 3 && (
                            <span className="text-[10px] text-cyan-400 font-bold self-center">
                              +{(emp.skills || []).length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <span className="text-xs font-bold text-cyan-400 group-hover/row:translate-x-1 inline-flex items-center gap-1 transition-transform">
                          <span>View Profile</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadEmployees}
      />
    </div>
  );
};
