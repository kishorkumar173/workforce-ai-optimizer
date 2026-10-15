import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Briefcase,
  CheckCircle2,
  Clock,
  Award,
  FolderKanban,
  Target,
  Sparkles,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { Employee, Assignment } from '../types';

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployeeById(id!);
      setEmployee(data.employee);
      setAssignments(data.assignments);
    } catch (err) {
      console.error('Failed to load employee:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
        <Sparkles className="w-6 h-6 text-cyan-400 mx-auto mb-2 animate-spin" />
        Deciphering talent profile & verified competencies...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-16 text-center bg-[#0E1424]/80 backdrop-blur-xl rounded-3xl border border-white/[0.08]">
        <p className="text-sm font-bold text-white">Employee profile not found</p>
        <button
          onClick={() => navigate('/workforce')}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
        >
          Return to Workforce Directory
        </button>
      </div>
    );
  }

  const skills = employee.skills || [];

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/workforce')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Workforce</span>
      </button>

      {/* Header Profile Card */}
      <div className="relative overflow-hidden bg-[#0E1424]/85 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/[0.08] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={employee.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                alt={employee.full_name}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/10"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#0E1424]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black text-white tracking-tight">{employee.full_name}</h1>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {employee.employee_code}
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {employee.current_status}
                </span>
              </div>
              <p className="text-sm font-semibold text-cyan-400 mt-0.5">
                {employee.job_title} <span className="text-slate-500">•</span> {employee.department}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  {employee.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {employee.location || 'Remote'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  {employee.years_of_experience} yrs experience
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#121A30]/90 p-4 rounded-2xl border border-white/[0.08] min-w-[210px] text-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weekly Workload Capacity</p>
            <p className="text-xl font-black text-white mt-1">
              {employee.weekly_capacity_hours} <span className="text-xs text-slate-400 font-normal">Hours / Week</span>
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-cyan-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Active on {assignments.length} project(s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Skills Matrix & Active Project Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Verified Skills Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-[#0E1424]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Competency Matrix & Verified Skills ({skills.length})</span>
            </h3>
          </div>

          {skills.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No skills mapped yet.</p>
          ) : (
            <div className="space-y-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-3.5 rounded-xl border border-white/[0.06] bg-[#121A30]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-cyan-500/30 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{skill.skill_name}</span>
                      {skill.is_verified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium">Self-Reported</span>
                      )}
                    </div>
                    {skill.evidence && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">"{skill.evidence}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-[11px] font-bold text-cyan-300">Level {skill.proficiency_level}/5</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <span
                          key={lvl}
                          className={`w-3.5 h-1.5 rounded-full ${
                            lvl <= skill.proficiency_level ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'bg-slate-700/60'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Active Project Staffing (5 cols) */}
        <div className="lg:col-span-5 bg-[#0E1424]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-indigo-400" />
              <span>Project Assignments ({assignments.length})</span>
            </h3>
          </div>

          {assignments.length === 0 ? (
            <div className="p-8 text-center bg-[#121A30]/50 rounded-xl border border-white/[0.06]">
              <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-slate-300 font-medium">Currently 100% available for new project staffing.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-3.5 rounded-xl border border-white/[0.06] bg-[#121A30]/60 flex items-center justify-between hover:border-indigo-500/30 transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{asg.project_name}</h4>
                    <p className="text-[11px] text-slate-400">{asg.assigned_role}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      {asg.allocation_percentage}% Allocation
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{asg.allocated_hours_per_week}h/week</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
