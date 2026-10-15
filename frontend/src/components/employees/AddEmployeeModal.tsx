import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Key, Shield, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { Skill } from '../../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('TeamPulse@2026');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('Development');
  const [experience, setExperience] = useState(4.0);
  const [capacity, setCapacity] = useState(40.0);
  const [status, setStatus] = useState<'Available' | 'In a Meeting' | 'Busy' | 'On Leave'>('Available');
  const [location, setLocation] = useState('San Francisco, CA');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');

  // Skills selection
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedProficiency, setSelectedProficiency] = useState(3);
  const [skillsList, setSkillsList] = useState<{ skill_id: string; skill_name: string; proficiency_level: number }[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Suggest next employee code
      const randNum = Math.floor(1000 + Math.random() * 9000);
      setEmployeeCode(`EMP-${randNum}`);
      setError(null);
      
      api.getSkills().then(skills => {
        setAvailableSkills(skills);
        if (skills.length > 0) {
          setSelectedSkillId(skills[0].id);
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (!selectedSkillId) return;
    const existing = skillsList.find(s => s.skill_id === selectedSkillId);
    if (existing) {
      setSkillsList(skillsList.map(s => s.skill_id === selectedSkillId ? { ...s, proficiency_level: selectedProficiency } : s));
    } else {
      const skillObj = availableSkills.find(s => s.id === selectedSkillId);
      setSkillsList([...skillsList, {
        skill_id: selectedSkillId,
        skill_name: skillObj ? skillObj.name : selectedSkillId,
        proficiency_level: selectedProficiency
      }]);
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    setSkillsList(skillsList.filter(s => s.skill_id !== skillId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.createEmployee({
        employee_code: employeeCode.trim().toUpperCase(),
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        job_title: jobTitle.trim(),
        department,
        years_of_experience: Number(experience),
        weekly_capacity_hours: Number(capacity),
        current_status: status,
        employment_status: 'ACTIVE',
        location,
        avatar_url: avatarUrl,
        skills: skillsList.map(s => ({
          skill_id: s.skill_id,
          proficiency_level: s.proficiency_level,
          is_verified: true,
        })) as any,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800">Add New Employee Account</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                <Shield className="w-3 h-3" /> Auth-Synchronized
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Creates employee profile, links auth credentials, and registers skills</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {/* Employee ID & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Employee ID * <span className="text-[10px] text-slate-400 font-normal">(Unique identifier)</span>
              </label>
              <input
                type="text"
                required
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                placeholder="e.g. EMP-1009"
                className="w-full px-3 py-2 text-xs font-mono font-bold uppercase rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex.chen@teampulse.ai"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Full Name & Initial Password */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Key className="w-3 h-3 text-slate-400" /> Initial Password *
              </label>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Initial password for login"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Designation & Department */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation / Role *</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
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
                <option value="QA">QA</option>
              </select>
            </div>
          </div>

          {/* Experience & Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weekly Capacity (Hrs)</label>
              <input
                type="number"
                min="10"
                max="60"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Availability Status & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Availability Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Available">Available</option>
                <option value="In a Meeting">In a Meeting</option>
                <option value="Busy">Busy</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote / San Francisco"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Skills & Proficiencies Selection */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Employee Skills & Proficiencies
              </label>
              <span className="text-[10px] text-slate-400">Levels 1 (Novice) to 5 (Expert)</span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {availableSkills.map((sk) => (
                  <option key={sk.id} value={sk.id}>
                    {sk.name} ({sk.category})
                  </option>
                ))}
              </select>

              <select
                value={selectedProficiency}
                onChange={(e) => setSelectedProficiency(Number(e.target.value))}
                className="w-28 px-2 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value={1}>Lvl 1 - Novice</option>
                <option value={2}>Lvl 2 - Basic</option>
                <option value={3}>Lvl 3 - Competent</option>
                <option value={4}>Lvl 4 - Advanced</option>
                <option value={5}>Lvl 5 - Expert</option>
              </select>

              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl flex items-center gap-1 transition-colors border border-indigo-200"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {/* Selected Skills Tag List */}
            {skillsList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                {skillsList.map((s) => (
                  <span
                    key={s.skill_id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 shadow-sm text-slate-700"
                  >
                    <span>{s.skill_name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                      Lvl {s.proficiency_level}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s.skill_id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 italic py-1">
                No skills added yet. Add at least one verified skill to match against projects.
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-shrink-0">
            <span className="text-[11px] text-slate-400">
              Account role: <strong className="text-slate-700">EMPLOYEE</strong>
            </span>
            <div className="flex items-center gap-3">
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
                {loading ? 'Creating Account...' : 'Create Employee Account'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
