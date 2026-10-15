import React, { useEffect, useState } from 'react';
import { Target, Award, Plus, CheckCircle2, Star, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { DevelopmentGoal, Review } from '../types';

export const ReviewsGoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<DevelopmentGoal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'GOALS' | 'REVIEWS'>('GOALS');
  const [loading, setLoading] = useState(true);

  // New Goal inputs
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-08-30');
  const [showAddGoal, setShowAddGoal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gList, rList] = await Promise.all([
        api.getDevelopmentGoals(),
        api.getReviews(),
      ]);
      setGoals(gList);
      setReviews(rList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const created = await api.createDevelopmentGoal({
        employee_id: 'emp-1',
        employee_name: 'John Doe',
        goal_title: newTitle.trim(),
        target_date: newDate,
      });
      setGoals([created, ...goals]);
      setNewTitle('');
      setShowAddGoal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Development & Reviews</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Track employee career progression targets and quarterly performance evaluations.
          </p>
        </div>

        {activeTab === 'GOALS' && (
          <button
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Development Goal</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/[0.08]">
        <button
          onClick={() => setActiveTab('GOALS')}
          className={`pb-3 text-xs font-bold transition-colors relative ${
            activeTab === 'GOALS' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Development Goals ({goals.length})</span>
          {activeTab === 'GOALS' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('REVIEWS')}
          className={`pb-3 text-xs font-bold transition-colors relative ${
            activeTab === 'REVIEWS' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Performance Reviews ({reviews.length})</span>
          {activeTab === 'REVIEWS' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          )}
        </button>
      </div>

      {/* New Goal Form if toggled */}
      {showAddGoal && (
        <form onSubmit={handleCreateGoal} className="glass-panel p-5 rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row gap-3 items-end animate-in fade-in">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-300 mb-1">Goal Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Master Production Kubernetes Cluster Deployment"
              className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          <div className="w-full sm:w-48">
            <label className="block text-xs font-bold text-slate-300 mb-1">Target Date</label>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0B101E] text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20"
          >
            Save Goal
          </button>
        </form>
      )}

      {/* Content */}
      {activeTab === 'GOALS' ? (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="glass-panel p-5 rounded-2xl border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  {goal.employee_name || 'Staff Member'}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{goal.goal_title}</h4>
                <p className="text-xs text-slate-400 max-w-xl">{goal.description || 'Target capability development milestone.'}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium pt-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Target Due: {goal.target_date}</span>
                </div>
              </div>

              <div className="w-full sm:w-48 space-y-1 self-end sm:self-center">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Progress</span>
                  <span className="text-cyan-400">{goal.progress_percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden border border-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_6px_rgba(6,182,212,0.4)]"
                    style={{ width: `${goal.progress_percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="glass-panel p-6 rounded-2xl border border-white/[0.08] hover:border-cyan-500/30 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.employee_name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Reviewer: {rev.reviewer_name} • Period: {rev.review_period}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 text-amber-400 text-xs font-bold shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rev.rating} / 5.0</span>
                </div>
              </div>

              {rev.strengths && (
                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] text-xs">
                  <span className="font-bold text-slate-300">Key Strengths: </span>
                  <span className="text-slate-400">{rev.strengths}</span>
                </div>
              )}

              {rev.growth_areas && (
                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.05] text-xs">
                  <span className="font-bold text-slate-300">Growth Opportunities: </span>
                  <span className="text-slate-400">{rev.growth_areas}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
