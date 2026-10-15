import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface TeamMemberStatus {
  id: string;
  name: string;
  title: string;
  avatar: string;
  status: 'Available' | 'In a Meeting' | 'Busy' | 'On Leave';
  capacityPercentage: number;
}

const DEFAULT_MEMBERS: TeamMemberStatus[] = [
  {
    id: 'emp-1',
    name: 'John Doe',
    title: 'Developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'Available',
    capacityPercentage: 80,
  },
  {
    id: 'emp-2',
    name: 'Emily Clark',
    title: 'Designer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    status: 'In a Meeting',
    capacityPercentage: 60,
  },
  {
    id: 'emp-3',
    name: 'Michael Brown',
    title: 'Project Manager',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'On Leave',
    capacityPercentage: 0,
  },
  {
    id: 'emp-4',
    name: 'Sophia Lee',
    title: 'QA Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'Available',
    capacityPercentage: 70,
  },
];

export const TeamStatusList: React.FC = () => {
  const navigate = useNavigate();

  const getStatusDot = (status: TeamMemberStatus['status']) => {
    switch (status) {
      case 'Available':
        return <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />;
      case 'In a Meeting':
        return <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />;
      case 'On Leave':
        return <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />;
      default:
        return <span className="w-2 h-2 rounded-full bg-slate-500" />;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] flex flex-col relative overflow-hidden group">
      <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-700" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-bold text-white tracking-wide">Team Status</h3>
        <Link
          to="/workforce"
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-2 relative z-10">
        {DEFAULT_MEMBERS.map((member) => (
          <div
            key={member.id}
            onClick={() => navigate(`/workforce/${member.id}`)}
            className="flex items-center justify-between p-2 rounded-xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-cyan-400/50 transition-all"
              />
              <div>
                <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {member.name}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">{member.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Indicator */}
              <div className="flex items-center gap-1.5">
                {getStatusDot(member.status)}
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  {member.status}
                </span>
              </div>

              {/* Capacity Progress Bar */}
              <div className="w-16 flex items-center gap-1.5">
                <div className="flex-1 h-1.5 rounded-full bg-slate-800/80 overflow-hidden border border-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_6px_rgba(6,182,212,0.4)]"
                    style={{ width: `${member.capacityPercentage}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-300 w-6 text-right">
                  {member.capacityPercentage}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
