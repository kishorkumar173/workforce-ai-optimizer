import React, { useEffect, useState } from 'react';
import { Award, BookOpen, ExternalLink, Plus, Search, Sparkles, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { Skill, TrainingResource } from '../types';

export const SkillsTrainingPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [training, setTraining] = useState<TrainingResource[]>([]);
  const [workforceGaps, setWorkforceGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [showAddSkill, setShowAddSkill] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sList, tList, gapsData] = await Promise.all([
        api.getSkills(),
        api.getTrainingResources(),
        api.getWorkforceSkillGaps().catch(() => ({ skillGaps: [] })),
      ]);
      setSkills(sList);
      setTraining(tList);
      setWorkforceGaps(gapsData.skillGaps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      const created = await api.createSkill({
        name: newSkillName.trim(),
        category: newSkillCategory,
        description: `Standardized enterprise competency in ${newSkillCategory}.`,
      });
      setSkills([...skills, created]);
      setNewSkillName('');
      setShowAddSkill(false);
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['ALL', 'Frontend', 'Backend', 'AI/ML', 'DevOps', 'Design', 'QA', 'Management'];

  const filteredSkills = skills.filter((s) =>
    activeCategory === 'ALL' ? true : s.category.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Skill Matrix & Training Catalog</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Maintain organizational competency frameworks and curated upskilling resources.
          </p>
        </div>

        <button
          onClick={() => setShowAddSkill(!showAddSkill)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Competency</span>
        </button>
      </div>

      {/* Add Skill Form if toggled */}
      {showAddSkill && (
        <form onSubmit={handleCreateSkill} className="glass-panel p-5 rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row gap-3 items-end animate-in fade-in">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-300 mb-1">Skill Name</label>
            <input
              type="text"
              required
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. GraphQL & Apollo"
              className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          <div className="w-full sm:w-48">
            <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-[#0B101E] text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="AI/ML">AI/ML</option>
              <option value="DevOps">DevOps</option>
              <option value="Design">Design</option>
              <option value="QA">QA</option>
              <option value="Management">Management</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20"
          >
            Save Skill
          </button>
        </form>
      )}

      {/* Workforce-Wide Skill Gaps & Upskilling Priorities (Feature 5) */}
      {workforceGaps.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 bg-gradient-to-br from-[#0E1424] to-[#0A0E1A]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Workforce-Wide Skill Gaps & Upskilling Priorities
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Active Project Demand
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Identifies competencies most frequently missing or below requirement across active projects, with recommended training courses to bridge the gaps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workforceGaps.map((gap, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{gap.skill_name}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        gap.priority === 'CRITICAL'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : gap.priority === 'HIGH'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {gap.priority} PRIORITY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Category: <strong className="text-slate-300">{gap.category}</strong>
                  </p>
                  <div className="mt-2 text-[11px] text-slate-300 flex items-center justify-between">
                    <span>Affected Projects: <strong className="text-cyan-400">{gap.affected_projects_count}</strong></span>
                    <span>Staff Below Req: <strong className="text-amber-400">{gap.missing_count}</strong></span>
                  </div>
                </div>

                {gap.recommended_course && (
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="truncate mr-2">
                      <p className="text-[10px] text-slate-400">Recommended Course:</p>
                      <p className="text-xs font-semibold text-slate-200 truncate">{gap.recommended_course.title}</p>
                    </div>
                    <a
                      href={gap.recommended_course.resource_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex-shrink-0"
                      title="View Course"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 border border-cyan-400/30'
                : 'glass-panel text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white mb-4">Competency Directory ({filteredSkills.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">{skill.name}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {skill.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{skill.description || 'Standard verified competency.'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Training Resources */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Curated Upskilling & Training Catalog</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {training.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-2xl border border-white/[0.06] hover:border-cyan-500/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {course.difficulty}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{course.estimated_hours} Hours</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors mb-1 leading-snug">{course.title}</h4>
                <p className="text-[11px] text-cyan-400 font-semibold mb-2">Provider: {course.provider}</p>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">{course.description}</p>
              </div>

              <a
                href={course.resource_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-all"
              >
                <span>Access Course Content</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
