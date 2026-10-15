import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { Skill } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  skills: Skill[];
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  skills,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Development');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [status, setStatus] = useState<'Planning' | 'In Progress' | 'On Track'>('Planning');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState('2026-07-30');
  const [requestedTeamSize, setRequestedTeamSize] = useState(3);
  const [budget, setBudget] = useState(120000);

  // Requirements builder
  const [reqs, setReqs] = useState<Array<{ skill_id: string; min_proficiency: number; importance: 'NICE_TO_HAVE' | 'IMPORTANT' | 'CRITICAL' }>>([
    { skill_id: skills[0]?.id || '', min_proficiency: 4, importance: 'CRITICAL' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddReq = () => {
    setReqs([...reqs, { skill_id: skills[0]?.id || '', min_proficiency: 3, importance: 'IMPORTANT' }]);
  };

  const handleRemoveReq = (index: number) => {
    setReqs(reqs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const newProj = await api.createProject({
        name,
        description,
        department,
        priority,
        status,
        start_date: startDate,
        deadline,
        requested_team_size: Number(requestedTeamSize),
        progress_percentage: 0,
        budget: Number(budget),
      });

      // Save requirements if any
      if (reqs.length > 0 && newProj.id) {
        await api.setProjectRequirements(
          newProj.id,
          reqs.map((r) => ({
            skill_id: r.skill_id,
            min_proficiency: r.min_proficiency,
            importance: r.importance,
            min_employee_count: 1,
          }))
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">Create New Project</h3>
            <p className="text-xs text-slate-500">Define scope, timeline, and competency requirements</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Next-Gen Mobile Banking"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline project objectives and technical deliverables..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Deadline</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Requested Team Size</label>
              <input
                type="number"
                min="1"
                max="20"
                value={requestedTeamSize}
                onChange={(e) => setRequestedTeamSize(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Budget ($)</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Skill Requirements Section */}
          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800">Required Skills & Proficiencies</label>
              <button
                type="button"
                onClick={handleAddReq}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto">
              {reqs.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <select
                    value={req.skill_id}
                    onChange={(e) => {
                      const updated = [...reqs];
                      updated[idx].skill_id = e.target.value;
                      setReqs(updated);
                    }}
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  >
                    {skills.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>

                  <select
                    value={req.min_proficiency}
                    onChange={(e) => {
                      const updated = [...reqs];
                      updated[idx].min_proficiency = Number(e.target.value);
                      setReqs(updated);
                    }}
                    className="w-24 px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  >
                    <option value={1}>Level 1 (Novice)</option>
                    <option value={2}>Level 2 (Junior)</option>
                    <option value={3}>Level 3 (Mid)</option>
                    <option value={4}>Level 4 (Senior)</option>
                    <option value={5}>Level 5 (Expert)</option>
                  </select>

                  <select
                    value={req.importance}
                    onChange={(e) => {
                      const updated = [...reqs];
                      updated[idx].importance = e.target.value as any;
                      setReqs(updated);
                    }}
                    className="w-28 px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="NICE_TO_HAVE">Nice to have</option>
                  </select>

                  {reqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveReq(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
