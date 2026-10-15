import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  GitCompare,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { Project, Employee, SimulationResult } from '../types';
import { useAuth } from '../context/AuthContext';

export const SimulationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    searchParams.get('projectId') || ''
  );
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

  // Simulation State
  const [proposedMembers, setProposedMembers] = useState<
    Array<{ employeeId: string; role: string; allocationPercentage: number }>
  >([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState(false);

  // Load initial projects and employee directory
  useEffect(() => {
    async function init() {
      try {
        const [projList, empList] = await Promise.all([
          api.getProjects(),
          api.getEmployees(),
        ]);
        setProjects(projList);
        setAllEmployees(empList);

        const initialProjId = searchParams.get('projectId') || (projList[0] ? projList[0].id : '');
        setSelectedProjectId(initialProjId);
      } catch (err) {
        console.error(err);
      }
    }
    init();
  }, []);

  // When selected project changes, initialize simulation roster from existing assignments or recommendations
  useEffect(() => {
    if (selectedProjectId) {
      loadProjectBaseline(selectedProjectId);
    }
  }, [selectedProjectId]);

  const loadProjectBaseline = async (projId: string) => {
    try {
      setLoading(true);
      setApprovalSuccess(false);

      const projData = await api.getProjectById(projId);
      const assignments = projData.project.assignments || [];

      let initialRoster: Array<{ employeeId: string; role: string; allocationPercentage: number }> = [];

      if (assignments.length > 0) {
        initialRoster = assignments.map((a) => ({
          employeeId: a.employee_id,
          role: a.assigned_role,
          allocationPercentage: a.allocation_percentage,
        }));
      } else {
        // Fallback: check if a recommendation exists
        const recs = await api.getProjectRecommendations(projId);
        if (recs.length > 0) {
          initialRoster = recs[recs.length - 1].members.map((m) => ({
            employeeId: m.employee_id,
            role: m.suggested_role,
            allocationPercentage: m.allocated_percentage,
          }));
        } else {
          // Default to top 2 available engineers
          initialRoster = allEmployees.slice(0, 2).map((e) => ({
            employeeId: e.id,
            role: e.job_title,
            allocationPercentage: 50,
          }));
        }
      }

      setProposedMembers(initialRoster);
      await triggerSimulationEvaluation(projId, initialRoster);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerSimulationEvaluation = async (
    projId: string,
    members: Array<{ employeeId: string; role: string; allocationPercentage: number }>
  ) => {
    try {
      const result = await api.runSimulation(projId, members);
      setSimulationResult(result);
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for interactive tweaking
  const handleAllocationChange = (index: number, newPercent: number) => {
    const updated = [...proposedMembers];
    updated[index].allocationPercentage = newPercent;
    setProposedMembers(updated);
    triggerSimulationEvaluation(selectedProjectId, updated);
  };

  const handleRoleChange = (index: number, newRole: string) => {
    const updated = [...proposedMembers];
    updated[index].role = newRole;
    setProposedMembers(updated);
  };

  const handleRemoveMember = (index: number) => {
    const updated = proposedMembers.filter((_, i) => i !== index);
    setProposedMembers(updated);
    triggerSimulationEvaluation(selectedProjectId, updated);
  };

  const handleAddMember = (empId: string) => {
    if (!empId) return;
    const emp = allEmployees.find((e) => e.id === empId);
    if (!emp) return;

    const updated = [
      ...proposedMembers,
      {
        employeeId: emp.id,
        role: emp.job_title,
        allocationPercentage: 50,
      },
    ];
    setProposedMembers(updated);
    triggerSimulationEvaluation(selectedProjectId, updated);
  };

  const handleResetToBaseline = () => {
    if (selectedProjectId) {
      loadProjectBaseline(selectedProjectId);
    }
  };

  const handleApproveSimulation = async () => {
    if (!simulationResult || !simulationResult.isFeasibleForApproval) return;
    try {
      setApproving(true);
      // Create and save temporary recommendation for this simulation then approve atomically
      const rec = await api.generateTeamRecommendation(selectedProjectId);
      // Update recommendation members with simulated configurations
      rec.members = proposedMembers.map((pm, idx) => {
        const emp = allEmployees.find((e) => e.id === pm.employeeId);
        return {
          id: `sim-rec-${idx}`,
          employee_id: pm.employeeId,
          employee_name: emp ? emp.full_name : 'Staff Member',
          employee_avatar: emp?.avatar_url,
          job_title: emp ? emp.job_title : 'Engineer',
          suggested_role: pm.role,
          match_score: 90,
          matched_skills: (emp?.skills || []).map((s) => s.skill_name || 'Skill'),
          missing_skills: [],
          allocated_percentage: pm.allocationPercentage,
          match_reasons: ['Selected via interactive manager simulation'],
          capacity_warnings: [],
        };
      });

      await api.approveTeamRecommendation(rec.id, user.full_name);
      setApprovalSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Failed to approve simulation');
    } finally {
      setApproving(false);
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const eligibleCandidatesToAdd = allEmployees.filter(
    (e) => !proposedMembers.some((pm) => pm.employeeId === e.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-bold text-cyan-300 mb-2 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive What-If Staffing Sandbox</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Workforce Simulation & Side-by-Side Comparison
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Safely model proposed personnel swaps, adjust allocations %, and compare impact against baseline assignments.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-300">Active Project:</label>
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

      {/* Success Notification */}
      {approvalSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-emerald-300 text-xs font-semibold animate-in slide-in-from-top-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Simulated staffing proposal successfully committed and approved as active project assignments!</span>
          </div>
          <button
            onClick={() => navigate(`/projects/${selectedProjectId}`)}
            className="text-xs font-bold text-cyan-300 underline hover:text-white"
          >
            Inspect Project Roster
          </button>
        </div>
      )}

      {/* Side-by-Side Comparison Metric Cards */}
      {simulationResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Baseline Plan */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] relative overflow-hidden">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Baseline Plan (Current)</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-white">{simulationResult.baseline.overallScore}%</span>
              <span className="text-xs font-bold text-slate-400">{simulationResult.baseline.teamSize} Assigned</span>
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-slate-400">
              <p>Skill Coverage: <span className="font-bold text-slate-200">{simulationResult.baseline.skillCoverage}%</span></p>
              <p>Capacity Conflicts: <span className="font-bold text-slate-200">{simulationResult.baseline.capacityViolations}</span></p>
            </div>
          </div>

          {/* Delta Comparison */}
          <div className="bg-gradient-to-tr from-[#090D16] via-[#10182E] to-[#142347] border border-cyan-500/30 text-white rounded-2xl p-5 shadow-xl shadow-cyan-500/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Delta Variance</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-3xl font-black ${simulationResult.delta.scoreChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simulationResult.delta.scoreChange >= 0 ? `+${simulationResult.delta.scoreChange}` : simulationResult.delta.scoreChange} pts
                </span>
                <span className="text-xs text-slate-300">Net Score Delta</span>
              </div>
            </div>

            <div className="text-xs space-y-1 mt-3">
              {simulationResult.delta.newlyCoveredSkills.length > 0 && (
                <p className="text-emerald-400 font-semibold">
                  + Newly Covered: {simulationResult.delta.newlyCoveredSkills.join(', ')}
                </p>
              )}
              {simulationResult.delta.newOverloadedEmployees.length > 0 && (
                <p className="text-rose-400 font-semibold">
                  ⚠️ Overloaded: {simulationResult.delta.newOverloadedEmployees.join(', ')}
                </p>
              )}
              {simulationResult.delta.newlyCoveredSkills.length === 0 && simulationResult.delta.newOverloadedEmployees.length === 0 && (
                <p className="text-slate-400">Stable allocation profile with zero regressions.</p>
              )}
            </div>
          </div>

          {/* Proposed Simulated Plan */}
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Simulated Plan (Proposed)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Sandbox</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-cyan-400">{simulationResult.simulated.overallScore}%</span>
              <span className="text-xs font-bold text-slate-300">{simulationResult.simulated.teamSize} Proposed</span>
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-slate-400">
              <p>Skill Coverage: <span className="font-bold text-white">{simulationResult.simulated.skillCoverage}%</span></p>
              <p>Capacity Conflicts: <span className="font-bold text-white">{simulationResult.simulated.capacityViolations}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Controls & Member Roster */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/[0.08] space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="text-base font-bold text-white">
              Interactive Team Configuration Roster
            </h3>
            <p className="text-xs text-slate-400">
              Adjust effort percentage or swap members. Baseline records remain untouched until authorized submission.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Add Member Dropdown */}
            {eligibleCandidatesToAdd.length > 0 && (
              <select
                onChange={(e) => {
                  handleAddMember(e.target.value);
                  e.target.value = '';
                }}
                defaultValue=""
                className="px-3 py-2 text-xs font-bold rounded-xl border border-white/10 bg-[#0B101E] text-slate-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              >
                <option value="" disabled>+ Add Team Member</option>
                {eligibleCandidatesToAdd.map((cand) => (
                  <option key={cand.id} value={cand.id}>
                    {cand.full_name} ({cand.job_title})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handleResetToBaseline}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Member Sliders */}
        {proposedMembers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No personnel in proposed simulation.</div>
        ) : (
          <div className="space-y-4">
            {proposedMembers.map((member, idx) => {
              const emp = allEmployees.find((e) => e.id === member.employeeId);
              const analysis = simulationResult?.simulated.memberAnalysis.find(
                (m) => m.employeeId === member.employeeId
              );

              return (
                <div
                  key={member.employeeId}
                  className="p-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Left: Info */}
                  <div className="flex items-center gap-3 min-w-[240px]">
                    <img
                      src={emp?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                      alt={emp?.full_name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{emp?.full_name}</h4>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleRoleChange(idx, e.target.value)}
                        className="text-[11px] text-slate-400 bg-transparent border-b border-transparent hover:border-white/20 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Middle: Effort Slider */}
                  <div className="flex-1 w-full max-w-md px-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>Assigned Project Effort</span>
                      <span className="text-cyan-400">{member.allocationPercentage}% ({Math.round(40 * (member.allocationPercentage / 100))} hrs/wk)</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={member.allocationPercentage}
                      onChange={(e) => handleAllocationChange(idx, Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  {/* Right: Projected Total Utilization & Delete */}
                  <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Total Utilization</p>
                      <p
                        className={`text-xs font-black ${
                          analysis?.isOverloaded ? 'text-rose-400 animate-pulse' : 'text-slate-200'
                        }`}
                      >
                        {analysis?.projectedUtilization}%
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveMember(idx)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Remove from simulated plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Feasibility Check & Atomic Approval Action */}
        {simulationResult && (
          <div className="pt-6 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {simulationResult.isFeasibleForApproval ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Proposal is fully feasible and ready for executive approval.</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span>Approval Blockers Detected ({simulationResult.approvalBlockers.length})</span>
                  </div>
                  <ul className="text-[11px] text-slate-400 list-disc list-inside">
                    {simulationResult.approvalBlockers.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {user.role !== 'EMPLOYEE' && (
              <button
                onClick={handleApproveSimulation}
                disabled={!simulationResult.isFeasibleForApproval || approving}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{approving ? 'Committing...' : 'Approve Simulated Proposal'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
