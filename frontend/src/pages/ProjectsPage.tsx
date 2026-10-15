import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  FolderKanban,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { Project, Skill } from '../types';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { useAuth } from '../context/AuthContext';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projList, skillList] = await Promise.all([
        api.getProjects(),
        api.getSkills(),
      ]);
      setProjects(projList);
      setSkills(skillList);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDept = departmentFilter === 'ALL' || p.department.toLowerCase() === departmentFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesDept;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'On Track':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">On Track</span>;
      case 'In Progress':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]">In Progress</span>;
      case 'At Risk':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]">At Risk</span>;
      default:
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Critical</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">High</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-slate-800 text-slate-300 border border-slate-700">{priority}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Project Management</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Monitor organizational projects, configure skill targets, and staff high-performance teams.
          </p>
        </div>

        {user.role !== 'EMPLOYEE' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/[0.08] flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by name, description, deliverables..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-slate-500 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-white/10 bg-[#0B101E] text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="On Track">On Track</option>
            <option value="At Risk">At Risk</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-white/10 bg-[#0B101E] text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">All Departments</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading enterprise projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/[0.08]">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-200">No projects match filters</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting search filters or create a new project initiative.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel rounded-2xl border border-white/[0.08] p-5 hover:border-cyan-500/40 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />

              <div className="relative z-10">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      {project.department}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {getPriorityBadge(project.priority)}
                    {getStatusBadge(project.status)}
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {project.description || 'Enterprise project initiative.'}
                </p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Delivery Progress</span>
                    <span className="text-cyan-400">{project.progress_percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden border border-white/[0.05]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${project.progress_percentage}%`,
                        background:
                          project.status === 'At Risk'
                            ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
                            : project.progress_percentage >= 75
                            ? 'linear-gradient(90deg, #10B981, #06B6D4)'
                            : 'linear-gradient(90deg, #06B6D4, #3B82F6)',
                        boxShadow: '0 0 8px rgba(6, 182, 212, 0.3)',
                      }}
                    />
                  </div>
                </div>

                {/* Metadata details */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05] mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Due: {project.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Target: {project.requested_team_size} members</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06] relative z-10">
                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] rounded-xl border border-white/10 transition-colors text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => navigate(`/team-recommendations?projectId=${project.id}`)}
                  className="flex-1 py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Team</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadData}
        skills={skills}
      />
    </div>
  );
};
