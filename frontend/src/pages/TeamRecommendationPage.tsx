import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  Award,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { Project, TeamRecommendation } from '../types';
import { useAuth } from '../context/AuthContext';

export const TeamRecommendationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    searchParams.get('projectId') || ''
  );
  const [recommendation, setRecommendation] = useState<TeamRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadExistingOrGenerate(selectedProjectId);
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const list = await api.getProjects();
      setProjects(list);
      if (!selectedProjectId && list.length > 0) {
        setSelectedProjectId(list[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadExistingOrGenerate = async (projId: string) => {
    try {
      setLoading(true);
      setApprovalSuccess(false);
      const existing = await api.getProjectRecommendations(projId);
      if (existing.length > 0) {
        setRecommendation(existing[existing.length - 1]);
      } else {
        await handleGenerate(projId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (projId: string) => {
    try {
      setLoading(true);
      setApprovalSuccess(false);
      const rec = await api.generateTeamRecommendation(projId);
      setRecommendation(rec);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!recommendation) return;
    try {
      setApproving(true);
      await api.approveTeamRecommendation(recommendation.id, user.full_name);
      setApprovalSuccess(true);
      setRecommendation({ ...recommendation, status: 'ACCEPTED' });
    } catch (err: any) {
      alert(err.message || 'Failed to approve team');
    } finally {
      setApproving(false);
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-bold text-cyan-300 mb-2 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Multi-Objective Composition Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Intelligent Team Formation & Recommendations
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Synthesizes competency depth, availability, experience, and workload safety into explainable team compositions.
          </p>
        </div>

        {/* Project Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-300">Select Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-white/10 bg-[#0B101E] text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 shadow-sm"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Success Banner if Approved */}
      {approvalSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-emerald-300 text-xs font-semibold animate-in slide-in-from-top-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Team composition successfully approved! Personnel assignments have been committed to the live database.</span>
          </div>
          <button
            onClick={() => navigate(`/projects/${selectedProjectId}`)}
            className="text-xs font-bold text-cyan-300 underline hover:text-white"
          >
            View Project Staffing
          </button>
        </div>
      )}

      {loading ? (
        <div className="glass-panel rounded-3xl p-16 text-center border border-white/[0.08]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-white">Evaluating Workforce Combinations...</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Matching competencies, verifying capacity headroom, and optimizing team synergy for {selectedProject?.name}.
          </p>
        </div>
      ) : !recommendation ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/[0.08]">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-200">No recommendation available</h3>
          <button
            onClick={() => selectedProjectId && handleGenerate(selectedProjectId)}
            className="mt-4 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20"
          >
            Generate Recommendation
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Recommendation Overview Hero Card */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/[0.08] relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-700" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-white/[0.08] relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Algorithm: {recommendation.algorithm_version}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                      recommendation.status === 'ACCEPTED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    Status: {recommendation.status}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Optimal Team Recommendation for {selectedProject?.name}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                  {recommendation.explanation_summary}
                </p>
              </div>

              {/* Overall Score Badge */}
              <div className="flex items-center gap-4 bg-gradient-to-tr from-[#090D16] via-[#10182E] to-[#142347] border border-cyan-500/30 text-white p-5 rounded-2xl shadow-xl shadow-cyan-500/10 flex-shrink-0">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest">Match Score</p>
                  <p className="text-3xl font-black text-white mt-0.5 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    {recommendation.overall_score}%
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-xs space-y-1 text-slate-300">
                  <p className="font-semibold text-emerald-400">
                    ✓ {recommendation.critical_skills_covered}/{recommendation.critical_skills_total} Critical Skills
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {recommendation.members.length} Proposed Members
                  </p>
                </div>
              </div>
            </div>

            {/* Score Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 relative z-10">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Requirement Coverage</p>
                <p className="text-xl font-black text-cyan-400 mt-1">{recommendation.skill_coverage_score}%</p>
                <div className="h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden border border-white/[0.05]">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${recommendation.skill_coverage_score}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Workload Safety Index</p>
                <p className="text-xl font-black text-emerald-400 mt-1">{recommendation.workload_safety_score}%</p>
                <div className="h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden border border-white/[0.05]">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    style={{ width: `${recommendation.workload_safety_score}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Collective Seniority</p>
                <p className="text-xl font-black text-violet-400 mt-1">{recommendation.experience_score}%</p>
                <div className="h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden border border-white/[0.05]">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    style={{ width: `${recommendation.experience_score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Trade-offs & Assumptions Card */}
            <div className="mt-5 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-3 relative z-10">
              <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-cyan-300">Optimization Trade-offs & Assumptions</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {recommendation.tradeoffs_summary}
                </p>
              </div>
            </div>
          </div>

          {/* Proposed Team Members */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">
              Recommended Personnel Roster ({recommendation.members.length} Members)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendation.members.map((member) => (
                <div
                  key={member.id}
                  className="glass-panel rounded-2xl p-5 border border-white/[0.08] hover:border-cyan-500/40 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.employee_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                          alt={member.employee_name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-cyan-400/50 transition-all"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {member.employee_name}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium">{member.job_title}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-cyan-400">{member.match_score}%</span>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Match</p>
                      </div>
                    </div>

                    {/* Role & Allocation */}
                    <div className="p-2.5 bg-white/[0.02] rounded-xl border border-white/[0.05] mb-3 text-xs">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Proposed Project Role</p>
                      <p className="font-bold text-slate-200 mt-0.5">{member.suggested_role}</p>
                      <p className="text-[11px] text-cyan-400 font-semibold mt-1">
                        Proposed Effort: {member.allocated_percentage}% ({Math.round(40 * (member.allocated_percentage / 100))} hrs/wk)
                      </p>
                    </div>

                    {/* Explainable Reasons */}
                    <div className="space-y-1.5 mb-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Why this candidate?</p>
                      {member.match_reasons.slice(0, 2).map((reason, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    {/* Capacity Warnings if any */}
                    {member.capacity_warnings.length > 0 && (
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-semibold flex items-center gap-1.5 mb-3">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>{member.capacity_warnings[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills tags */}
                  <div className="pt-3 border-t border-white/[0.06] flex flex-wrap gap-1 relative z-10">
                    {member.matched_skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold rounded-md border border-cyan-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Next Step Decisions</h4>
              <p className="text-xs text-slate-400">
                You can approve this composition directly or open it in the interactive simulator to test alternative personnel adjustments.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/simulation?projectId=${selectedProjectId}&recId=${recommendation.id}`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 font-bold text-xs shadow-sm transition-all"
              >
                <GitCompare className="w-4 h-4 text-cyan-400" />
                <span>Open in Simulation Sandbox</span>
              </button>

              {user.role !== 'EMPLOYEE' && recommendation.status !== 'ACCEPTED' && (
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{approving ? 'Approving...' : 'Approve & Deploy Assignments'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
