import React, { useEffect, useState } from 'react';
import {
  User,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Clock,
  ExternalLink,
  Shield,
  Key,
  Bell,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  Employee,
  Assignment,
  EmployeeSkillGap,
  CourseEnrollment,
  NotificationItem,
} from '../../types';
import { useAuth } from '../../context/AuthContext';

export const EmployeePersonalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [workload, setWorkload] = useState<any>(null);
  const [skillGaps, setSkillGaps] = useState<EmployeeSkillGap[]>([]);
  const [courses, setCourses] = useState<CourseEnrollment[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Password reset state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    loadEmployeeData();
  }, [user]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      const data = await api.getMeEmployee();
      setEmployee(data.employee);
      setAssignments(data.assignments || []);
      setWorkload(data.workload);
      setSkillGaps(data.skillGaps || []);
      setCourses(data.courses || []);

      const notifData = await api.getNotifications();
      setNotifications(notifData.notifications || []);
    } catch (err) {
      console.error('Failed to load employee personal dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourseStatus = async (
    courseId: string,
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED',
    progressPct: number
  ) => {
    if (!employee) return;
    try {
      const res = await api.updateCourseProgress(employee.id, courseId, {
        status,
        progress_pct: progressPct,
      });

      // Update local course state
      setCourses((prev) => {
        const idx = prev.findIndex((c) => c.training_resource_id === courseId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = res.enrollment;
          return updated;
        } else {
          return [...prev, res.enrollment];
        }
      });
    } catch (err) {
      console.error('Failed to update course progress:', err);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    setPasswordError(null);
    setPasswordSuccess(null);
    setSavingPassword(true);

    try {
      await api.setPassword(newPassword.trim());
      setPasswordSuccess('Password updated successfully! You can now log in with this password.');
      setNewPassword('');
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleMarkNotifRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-cyan-400">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-300">Synchronizing Employee Workspace...</p>
        </div>
      </div>
    );
  }

  const allocatedHours = workload?.allocated_hours || 0;
  const capacityHours = employee?.weekly_capacity_hours || 40;
  const utilizationPct = Math.round((allocatedHours / capacityHours) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Employee Profile Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={employee?.avatar_url || user.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                alt={employee?.full_name || user.full_name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-glow-cyan"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0B101E] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {employee?.full_name || user.full_name}
                </h1>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {employee?.employee_code || user.employeeCode || 'EMP-1001'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {employee?.current_status || 'Available'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1">
                {employee?.job_title || 'Software Engineer'} • {employee?.department || 'Engineering'} • {employee?.years_of_experience || 4} Years Experience
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Work Email: <span className="text-slate-200 font-mono">{employee?.email || user.email}</span> • Location: {employee?.location || 'Remote'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 border border-white/10 transition-all shadow-sm"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Change Password</span>
            </button>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Account Security</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <Shield className="w-3.5 h-3.5" /> PBKDF2 Encrypted
              </span>
            </div>
          </div>
        </div>

        {/* Workload Capacity Bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Weekly Capacity</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-black text-white">{allocatedHours}h / {capacityHours}h</span>
              <span className="text-xs font-semibold text-slate-400">allocated</span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.08] rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  utilizationPct > 100
                    ? 'bg-rose-500 shadow-glow-rose'
                    : utilizationPct > 80
                    ? 'bg-amber-400'
                    : 'bg-cyan-400 shadow-glow-cyan'
                }`}
                style={{ width: `${Math.min(utilizationPct, 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Active Projects</span>
            <p className="text-lg font-black text-cyan-400 mt-1">{assignments.length} Projects</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Contributing team member</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Learning Courses</span>
            <p className="text-lg font-black text-emerald-400 mt-1">{courses.length} Active Tracks</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Personal upskilling plan</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left 2 Cols (Assignments + Skills), Right 1 Col (Skill Gaps & Courses) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Project Assignments */}
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Current Project Assignments ({assignments.length})</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Synchronized with PM Allocations</span>
            </div>

            {assignments.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-slate-400">
                You currently have no active project assignments. You are available for team staffing.
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{asg.project_name || 'Enterprise Project'}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {asg.role_in_project || 'Core Contributor'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Dates: {asg.start_date || 'Active'} {asg.end_date ? `to ${asg.end_date}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-cyan-300">{asg.allocated_hours_per_week}h/week</span>
                        <p className="text-[10px] text-slate-400">Committed</p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow-cyan" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Skills Profile */}
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Verified Enterprise Skills ({employee?.skills?.length || 0})</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Admin/Employer
              </span>
            </div>

            {(!employee?.skills || employee.skills.length === 0) ? (
              <div className="p-6 text-center rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-slate-400">
                No verified skills recorded yet. Your manager will add verified competencies to your profile.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {employee.skills.map((sk) => (
                  <div
                    key={sk.id || sk.skill_id}
                    className="p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-200">{sk.skill_name || sk.skill_id}</p>
                      <span className="text-[10px] text-slate-400">{sk.category || 'Competency'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-black text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                        Level {sk.proficiency_level} / 5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project & Assignment Notifications */}
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">My Notifications & Project Alerts</h3>
              </div>
              <span className="text-[11px] text-slate-400">Preserved across sessions</span>
            </div>

            {notifications.length === 0 ? (
              <div className="p-4 text-center rounded-xl bg-white/[0.02] text-xs text-slate-400">
                No alerts at this time.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                      !n.is_read
                        ? 'bg-cyan-500/10 border-cyan-500/30'
                        : 'bg-white/[0.02] border-white/[0.05]'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-cyan-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">{n.title}</p>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                    {!n.is_read && (
                      <button
                        onClick={() => handleMarkNotifRead(n.id)}
                        className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex-shrink-0"
                      >
                        Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col (5 cols): Feature 5 Personalized Skill Gaps & Course Recommendations */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Project Skill Gaps & Upskilling</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Feature 5
              </span>
            </div>

            {/* Isolation Warning Banner as explicitly required */}
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/25 mb-4 text-[11px] text-blue-200 leading-relaxed">
              <p className="font-bold flex items-center gap-1.5 mb-1 text-cyan-300">
                <BookOpen className="w-3.5 h-3.5" /> Course Tracking & Skill Verification Isolation
              </p>
              Course completion is tracked in your learning dashboard. Verified skill levels remain independent and are updated when your manager reviews and verifies your proficiency.
            </div>

            {/* Evaluated Skill Gaps against Projects */}
            {skillGaps.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                You meet or exceed all skill requirements for active enterprise projects!
              </div>
            ) : (
              <div className="space-y-4">
                {skillGaps.map((gap, idx) => {
                  // Find if there's already an active enrollment for recommended course
                  const courseId = gap.recommended_course?.id;
                  const enrollment = courses.find(
                    (c) => c.training_resource_id === courseId
                  );
                  const currentStatus = enrollment?.status || 'NOT_ENROLLED';
                  const currentPct = enrollment?.progress_pct || 0;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-white/[0.08] bg-[#0E1424] space-y-3"
                    >
                      {/* Gap Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">{gap.skill_name}</span>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                gap.gap_status === 'NO_RECORD'
                                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {gap.gap_status === 'NO_RECORD' ? 'No Record' : 'Below Req'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Project: <strong className="text-slate-200">{gap.project_name}</strong> • Req: Lvl {gap.required_level} (You: {gap.current_level > 0 ? `Lvl ${gap.current_level}` : 'None'})
                          </p>
                        </div>
                      </div>

                      {/* Recommended Course Card */}
                      {gap.recommended_course && (
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                              Recommended Course
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {gap.recommended_course.estimated_hours}h • {gap.recommended_course.difficulty}
                            </span>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-100">{gap.recommended_course.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Provider: <strong className="text-slate-300">{gap.recommended_course.provider}</strong>
                            </p>
                          </div>

                          {/* Progress bar if in progress or completed */}
                          {currentStatus !== 'NOT_ENROLLED' && (
                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-semibold text-slate-300">
                                  Status: <strong className="text-cyan-300">{currentStatus}</strong>
                                </span>
                                <span className="font-mono text-cyan-400 font-bold">{currentPct}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    currentStatus === 'COMPLETED'
                                      ? 'bg-emerald-400 shadow-glow-cyan'
                                      : 'bg-cyan-400'
                                  }`}
                                  style={{ width: `${currentPct}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Interactive Status Buttons */}
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateCourseStatus(gap.recommended_course!.id, 'PLANNED', 0)
                              }
                              className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg border transition-all ${
                                currentStatus === 'PLANNED'
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                  : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/[0.06]'
                              }`}
                            >
                              Plan
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateCourseStatus(gap.recommended_course!.id, 'IN_PROGRESS', 50)
                              }
                              className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg border transition-all ${
                                currentStatus === 'IN_PROGRESS'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/[0.06]'
                              }`}
                            >
                              In Progress
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateCourseStatus(gap.recommended_course!.id, 'COMPLETED', 100)
                              }
                              className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg border transition-all ${
                                currentStatus === 'COMPLETED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/[0.06]'
                              }`}
                            >
                              Completed
                            </button>
                            <a
                              href={gap.recommended_course.resource_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-cyan-400 border border-white/10"
                              title="Open External Course"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#0E1424] border border-cyan-500/30 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-slate-100">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Key className="w-4 h-4 text-cyan-400" /> Change Personal Password
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Update your account password for email and Employee ID login.
            </p>

            <form onSubmit={handleSetPassword} className="space-y-4">
              {passwordSuccess && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl font-medium">
                  {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-xl font-medium">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter at least 6 characters"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-[#070A11] text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-4 py-2 text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-glow-cyan disabled:opacity-50"
                >
                  {savingPassword ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
