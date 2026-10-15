import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  GitCompare,
  Calendar,
  Users,
  ShieldAlert,
  Award,
  BookOpen,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../services/api';
import { Project } from '../types';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [gapReport, setGapReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await api.getProjectById(id!);
      setProject(data.project);
      setGapReport(data.gapReport);
    } catch (err) {
      console.error('Failed to load project details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading project data...</div>;
  }

  if (!project) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm font-bold text-slate-700">Project not found</p>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  const requirements = project.requirements || [];
  const assignments = project.assignments || [];

  return (
    <div className="space-y-6">
      {/* Back Button & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/simulation?projectId=${project.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-bold text-slate-200 shadow-sm transition-all"
          >
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>Simulate Staffing</span>
          </button>
          <button
            onClick={() => navigate(`/team-recommendations?projectId=${project.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Team Formation</span>
          </button>
        </div>
      </div>

      {/* Main Project Overview Card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/[0.08] relative overflow-hidden group">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/15 transition-all" />

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {project.department}
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-white/[0.04] text-slate-300 border border-white/10">
                Priority: {project.priority}
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {project.status}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {project.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {project.description || 'Enterprise project initiative.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06] text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Target Deadline</p>
              <p className="font-bold text-slate-200 mt-0.5">{project.deadline}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Requested Size</p>
              <p className="font-bold text-slate-200 mt-0.5">{project.requested_team_size} members</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Budget</p>
              <p className="font-bold text-cyan-400 mt-0.5">${(project.budget || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
            <span>Overall Delivery Milestone</span>
            <span className="text-cyan-400">{project.progress_percentage}% Completed</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-800/80 overflow-hidden border border-white/[0.05]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
              style={{ width: `${project.progress_percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Skill Requirements & Current Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Skill Requirements Checklist (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Project Skill Competencies ({requirements.length})</span>
            </h3>
          </div>

          {requirements.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No specific competency requirements defined.</p>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {requirements.map((req) => (
                <div key={req.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{req.skill_name}</span>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border ${
                          req.importance === 'CRITICAL'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : req.importance === 'IMPORTANT'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-white/[0.04] text-slate-300 border-white/10'
                        }`}
                      >
                        {req.importance}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Minimum Target Proficiency: Level {req.min_proficiency} / 5
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <span
                        key={lvl}
                        className={`w-4 h-1.5 rounded-full ${
                          lvl <= req.min_proficiency
                            ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Currently Assigned Personnel (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Assigned Personnel ({assignments.length})</span>
            </h3>
          </div>

          {assignments.length === 0 ? (
            <div className="p-6 text-center bg-white/[0.02] rounded-xl border border-white/[0.05]">
              <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-300">No team members assigned yet</p>
              <button
                onClick={() => navigate(`/team-recommendations?projectId=${project.id}`)}
                className="mt-3 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl shadow-md shadow-cyan-500/20 transition-all"
              >
                Generate AI Team Recommendation
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={asg.employee_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                      alt={asg.employee_name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{asg.employee_name}</p>
                      <p className="text-[11px] text-slate-400">{asg.assigned_role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {asg.allocation_percentage}% Alloc
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{asg.allocated_hours_per_week}h / week</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skill Gap Analysis & Recommended Upskilling Pathway */}
      {gapReport && (
        <div className="glass-panel rounded-2xl p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Competency Gap Breakdown & Training Opportunities</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Team satisfies {gapReport.coveragePercentage}% of technical requirements. {gapReport.suggestedActionPlan}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-[11px] text-slate-400 font-bold uppercase">
                  <th className="py-2.5">Competency</th>
                  <th className="py-2.5">Required vs Max Available</th>
                  <th className="py-2.5">Coverage Status</th>
                  <th className="py-2.5">Actionable Remediation / Upskilling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {gapReport.gaps.map((gap: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/[0.03]">
                    <td className="py-3 font-semibold text-slate-200">{gap.skillName}</td>
                    <td className="py-3 text-slate-400">
                      Req: <span className="font-bold text-white">L{gap.requiredProficiency}</span> / Max Avail:{' '}
                      <span className="font-bold text-white">L{gap.availableProficiency}</span>
                    </td>
                    <td className="py-3">
                      {gap.status === 'FULLY_COVERED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Covered
                        </span>
                      ) : gap.status === 'PARTIALLY_COVERED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <AlertTriangle className="w-3.5 h-3.5" /> Proficiency Gap
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                          <AlertTriangle className="w-3.5 h-3.5" /> Uncovered
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-slate-300">
                      {gap.recommendedTraining ? (
                        <a
                          href={gap.recommendedTraining.resource_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold underline"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{gap.recommendedTraining.title}</span>
                        </a>
                      ) : (
                        <span>{gap.actionRecommendation}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
