import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Bot, Smartphone, Megaphone, Users2 } from 'lucide-react';
import { Project } from '../../types';

interface ActiveProjectsTableProps {
  projects?: Project[];
}

const PROJECT_ICONS: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  'E-Commerce Platform': { icon: ShoppingBag, bg: 'bg-purple-500/10 border border-purple-500/30', color: 'text-purple-400' },
  'AI Chatbot Integration': { icon: Bot, bg: 'bg-cyan-500/10 border border-cyan-500/30', color: 'text-cyan-400' },
  'Mobile App Redesign': { icon: Smartphone, bg: 'bg-blue-500/10 border border-blue-500/30', color: 'text-blue-400' },
  'Marketing Automation': { icon: Megaphone, bg: 'bg-amber-500/10 border border-amber-500/30', color: 'text-amber-400' },
  'HR Management System': { icon: Users2, bg: 'bg-emerald-500/10 border border-emerald-500/30', color: 'text-emerald-400' },
};

export const ActiveProjectsTable: React.FC<ActiveProjectsTableProps> = ({ projects = [] }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'On Track':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
            On Track
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.15)]">
            In Progress
          </span>
        );
      case 'At Risk':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]">
            At Risk
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] flex flex-col h-full relative overflow-hidden group">
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/15 transition-all duration-700" />

      {/* Table Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-base font-bold text-white tracking-wide">Active Projects</h3>
        <Link
          to="/projects"
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 pr-4 font-semibold">Project Name</th>
              <th className="py-2.5 px-4 font-semibold">Progress</th>
              <th className="py-2.5 px-4 font-semibold">Team</th>
              <th className="py-2.5 px-4 font-semibold">Deadline</th>
              <th className="py-2.5 pl-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-xs">
            {projects.slice(0, 5).map((project) => {
              const iconConfig = PROJECT_ICONS[project.name] || {
                icon: ShoppingBag,
                bg: 'bg-indigo-500/10 border border-indigo-500/30',
                color: 'text-indigo-400',
              };
              const Icon = iconConfig.icon;

              return (
                <tr
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="hover:bg-white/[0.03] cursor-pointer transition-colors group/row"
                >
                  {/* Name with Icon */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconConfig.bg} ${iconConfig.color} flex-shrink-0 shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-200 group-hover/row:text-cyan-400 transition-colors">
                        {project.name}
                      </span>
                    </div>
                  </td>

                  {/* Progress Bar */}
                  <td className="py-3.5 px-4 w-36">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 h-2 rounded-full bg-slate-800/80 overflow-hidden border border-white/[0.05]">
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
                            boxShadow:
                              project.status === 'At Risk'
                                ? '0 0 8px rgba(245, 158, 11, 0.4)'
                                : '0 0 8px rgba(6, 182, 212, 0.4)',
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-300 w-8">
                        {project.progress_percentage}%
                      </span>
                    </div>
                  </td>

                  {/* Team Avatars Stack */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center -space-x-2">
                      <img
                        className="w-6 h-6 rounded-full border-2 border-[#0B101E] object-cover"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                        alt="Member"
                      />
                      <img
                        className="w-6 h-6 rounded-full border-2 border-[#0B101E] object-cover"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                        alt="Member"
                      />
                      <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#0B101E] bg-slate-800 text-[10px] font-bold text-cyan-300">
                        +{project.requested_team_size - 1}
                      </span>
                    </div>
                  </td>

                  {/* Deadline */}
                  <td className="py-3.5 px-4 text-slate-400 font-medium whitespace-nowrap">
                    {project.deadline}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 pl-4 text-right">
                    {getStatusBadge(project.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
