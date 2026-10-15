import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  project: string;
  timeTag: string;
  isCompleted: boolean;
}

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design UI for dashboard',
    project: 'E-Commerce Platform',
    timeTag: 'Today',
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Team meeting',
    project: 'AI Chatbot Integration',
    timeTag: '10:00 AM',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Review project plan',
    project: 'Mobile App Redesign',
    timeTag: '1:00 PM',
    isCompleted: true,
  },
  {
    id: '4',
    title: 'Client presentation',
    project: 'Marketing Automation',
    timeTag: '3:00 PM',
    isCompleted: false,
  },
];

export const UpcomingTasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] flex flex-col relative overflow-hidden group">
      <div className="absolute -top-12 -left-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-700" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-bold text-white tracking-wide">Upcoming Tasks</h3>
        <Link
          to="/projects"
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-2 relative z-10">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center justify-between p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.isCompleted
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                    : 'border-slate-600 group-hover:border-cyan-400 bg-slate-900/40'
                }`}
              >
                {task.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <div>
                <p
                  className={`text-xs font-semibold leading-tight transition-all ${
                    task.isCompleted ? 'line-through text-slate-500' : 'text-slate-200 group-hover:text-cyan-300'
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {task.project}
                </p>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 border ${
                task.timeTag === 'Today'
                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
                  : 'text-slate-300 bg-white/[0.04] border-white/10'
              }`}
            >
              {task.timeTag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
