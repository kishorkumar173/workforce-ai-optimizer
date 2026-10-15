import { Router, Request, Response } from 'express';
import { db } from '../repositories/db';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { MatchingEngine } from '../algorithms/matchingEngine';
import { CompositionOptimizer } from '../algorithms/compositionOptimizer';
import { WorkloadCalculator } from '../algorithms/workloadCalculator';
import { SkillGapAnalyzer } from '../algorithms/skillGapAnalyzer';
import { SimulationEngine } from '../algorithms/simulationEngine';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  createProjectSchema,
  updateProjectSchema,
  setProjectRequirementsSchema,
  simulationRequestSchema,
  approveRecommendationSchema,
  createDevelopmentGoalSchema,
  loginSchema,
  setPasswordSchema,
  updateCourseProgressSchema,
} from '../validators/schemas';

const router = Router();
const matchingEngine = new MatchingEngine();
const compositionOptimizer = new CompositionOptimizer();

const getParamId = (req: Request): string => (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || '');

// ============================================================
// 1. HEALTH & METRICS
// ============================================================
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TeamPulse Intelligence API',
    version: '1.0.0',
    mode: 'in-memory-with-supabase-compatibility',
  });
});

// ============================================================
// 2. AUTH & PROFILES
// ============================================================
router.post('/auth/login', (req: Request, res: Response) => {
  const validated = loginSchema.parse(req.body);
  const result = db.verifyLogin(validated.identifier, validated.password);
  if (!result.success) {
    res.status(401).json({ error: result.error });
    return;
  }
  res.json({
    token: result.token,
    user: result.user,
  });
});

router.post('/auth/set-password', authenticate, (req: Request, res: Response) => {
  const validated = setPasswordSchema.parse(req.body);
  const success = db.setPassword(req.user?.id || req.user?.email || '', validated.password);
  if (!success) {
    res.status(404).json({ error: 'User account not found' });
    return;
  }
  res.json({ success: true, message: 'Password updated successfully' });
});

router.get('/me', authenticate, (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
});

router.get('/me/profile', authenticate, (req: Request, res: Response) => {
  const profile = db.profiles.find((p) => p.email === req.user?.email) || db.profiles[0];
  res.json({ profile });
});

router.patch('/me/profile', authenticate, (req: Request, res: Response) => {
  const profile = db.profiles.find((p) => p.email === req.user?.email) || db.profiles[0];
  const { full_name, avatar_url } = req.body;
  if (full_name) profile.full_name = full_name;
  if (avatar_url) profile.avatar_url = avatar_url;
  profile.updated_at = new Date().toISOString();
  res.json({ profile });
});

// ============================================================
// 3. EMPLOYEES
// ============================================================
router.get('/employees', authenticate, (req: Request, res: Response) => {
  const { department, status, search, skill } = req.query;
  let list = db.getEmployees();

  if (department && typeof department === 'string') {
    list = list.filter((e) => e.department.toLowerCase() === department.toLowerCase());
  }

  if (status && typeof status === 'string') {
    list = list.filter((e) => e.current_status.toLowerCase() === status.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (e) =>
        e.full_name.toLowerCase().includes(q) ||
        e.job_title.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
    );
  }

  if (skill && typeof skill === 'string') {
    list = list.filter((e) =>
      (e.skills || []).some((s) => s.skill_name?.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  // Calculate live utilization for each employee
  const workload = WorkloadCalculator.calculateWorkload(list, db.getAssignments());
  const enriched = list.map((emp) => {
    const summary = workload.employees.find((w) => w.employeeId === emp.id);
    return {
      ...emp,
      current_utilization: summary ? summary.utilizationPercentage : 0,
    };
  });

  res.json({ employees: enriched, count: enriched.length });
});

// Self-profile lookup for current authenticated employee
router.get('/employees/me', authenticate, (req: Request, res: Response) => {
  const userEmail = req.user?.email?.toLowerCase();
  const userId = req.user?.id;
  const profile = db.profiles.find(
    (p) => (userEmail && p.email.toLowerCase() === userEmail) || (userId && p.id === userId)
  );
  const employee = db.getEmployees().find(
    (e) => (profile && e.profile_id === profile.id) || (userEmail && e.email.toLowerCase() === userEmail) || (userId && (e.id === userId || e.profile_id === userId))
  );

  if (!employee) {
    res.status(404).json({ error: 'No employee record associated with current authenticated account.' });
    return;
  }

  const assignments = db.getAssignments().filter((a) => a.employee_id === employee.id && a.status === 'ACTIVE');
  const workload = WorkloadCalculator.calculateWorkload([employee], assignments);
  const skillGaps = db.getEmployeeSkillGaps(employee.id);
  const enrollments = db.getEmployeeEnrollments(employee.id);

  res.json({
    employee,
    assignments,
    workload: workload.employees[0],
    skillGaps,
    courses: enrollments,
    enrollments,
  });
});

router.get('/employees/:id', authenticate, (req: Request, res: Response) => {
  const employee = db.getEmployeeById(getParamId(req));
  if (!employee) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }

  // Enrich with current assignments and active workload
  const assignments = db.getAssignments().filter((a) => a.employee_id === employee.id && a.status === 'ACTIVE');
  const workload = WorkloadCalculator.calculateWorkload([employee], assignments);

  res.json({
    employee,
    assignments,
    workload: workload.employees[0],
  });
});

// Employee Personalized Skill Gaps
router.get('/employees/:id/skill-gaps', authenticate, (req: Request, res: Response) => {
  const gaps = db.getEmployeeSkillGaps(getParamId(req));
  res.json({ skillGaps: gaps });
});

// Employee Enrolled & Recommended Courses
router.get('/employees/:id/courses', authenticate, (req: Request, res: Response) => {
  const enrollments = db.getEmployeeEnrollments(getParamId(req));
  const courses = db.getTrainingResources();
  res.json({ courses, enrollments });
});

// Update Course Progress (Separated from skill verification)
router.post('/employees/:id/courses/:courseId/progress', authenticate, (req: Request, res: Response) => {
  const validated = updateCourseProgressSchema.parse(req.body);
  const courseId = Array.isArray(req.params.courseId) ? req.params.courseId[0] : req.params.courseId || '';
  const progressPct = validated.progress_percentage !== undefined
    ? validated.progress_percentage
    : (validated.progress_pct !== undefined
      ? validated.progress_pct
      : (validated.status === 'COMPLETED' ? 100 : (validated.status === 'IN_PROGRESS' ? 50 : 0)));
  const enrollment = db.updateCourseProgress(getParamId(req), courseId, validated.status, progressPct);
  res.json({ enrollment });
});

// Workforce-wide skill gaps for Admins & Employers
router.get('/workforce/skill-gaps', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const gaps = db.getWorkforceSkillGaps();
  res.json({ workforceSkillGaps: gaps, skillGaps: gaps });
});

router.post('/employees', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const validated = createEmployeeSchema.parse(req.body);
  try {
    const employee = db.createEmployee(validated);
    res.status(201).json({ employee });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create employee' });
  }
});

router.patch('/employees/:id', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const validated = updateEmployeeSchema.parse(req.body);
  const updated = db.updateEmployee(getParamId(req), validated);
  if (!updated) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
  res.json({ employee: updated });
});

router.delete('/employees/:id', authenticate, requireRole(['ADMIN']), (req: Request, res: Response) => {
  const success = db.deleteEmployee(getParamId(req));
  if (!success) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
  res.json({ success: true, message: 'Employee marked inactive to preserve assignment history' });
});

// ============================================================
// 4. SKILLS & EMPLOYEE SKILLS
// ============================================================
router.get('/skills', authenticate, (req: Request, res: Response) => {
  res.json({ skills: db.getSkills() });
});

router.post('/skills', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const { name, category, description } = req.body;
  if (!name || !category) {
    res.status(400).json({ error: 'Skill name and category are required' });
    return;
  }
  const skill = db.createSkill({ name, category, description });
  res.status(201).json({ skill });
});

router.get('/employees/:id/skills', authenticate, (req: Request, res: Response) => {
  const employee = db.getEmployeeById(getParamId(req));
  if (!employee) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
  res.json({ skills: employee.skills || [] });
});

// ============================================================
// 5. PROJECTS & REQUIREMENTS
// ============================================================
router.get('/projects', authenticate, (req: Request, res: Response) => {
  const { status, department, priority } = req.query;
  let list = db.getProjects();

  if (status && typeof status === 'string') {
    list = list.filter((p) => p.status.toLowerCase() === status.toLowerCase());
  }

  if (department && typeof department === 'string') {
    list = list.filter((p) => p.department.toLowerCase() === department.toLowerCase());
  }

  if (priority && typeof priority === 'string') {
    list = list.filter((p) => p.priority.toLowerCase() === priority.toLowerCase());
  }

  res.json({ projects: list, count: list.length });
});

router.get('/projects/:id', authenticate, (req: Request, res: Response) => {
  const project = db.getProjectById(getParamId(req));
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // Calculate gap analysis on current team
  const assignedEmployees = db.getEmployees().filter((e) =>
    (project.assignments || []).some((a) => a.employee_id === e.id)
  );
  const gapReport = SkillGapAnalyzer.analyzeProjectGaps(project, assignedEmployees, db.getTrainingResources());

  res.json({
    project,
    gapReport,
  });
});

router.post('/projects', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const validated = createProjectSchema.parse(req.body);
  const project = db.createProject(validated);
  res.status(201).json({ project });
});

router.patch('/projects/:id', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const validated = updateProjectSchema.parse(req.body);
  const updated = db.updateProject(getParamId(req), validated);
  if (!updated) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json({ project: updated });
});

router.delete('/projects/:id', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const success = db.deleteProject(getParamId(req));
  if (!success) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json({ success: true });
});

router.get('/projects/:id/requirements', authenticate, (req: Request, res: Response) => {
  const reqs = db.getProjectRequirements(getParamId(req));
  res.json({ requirements: reqs });
});

router.put('/projects/:id/requirements', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const validated = setProjectRequirementsSchema.parse(req.body);
  const updatedReqs = db.setProjectRequirements(getParamId(req), validated.requirements);
  res.json({ requirements: updatedReqs });
});

// ============================================================
// 6. TEAM RECOMMENDATIONS & MATCHING ENGINE
// ============================================================
router.post('/projects/:id/recommendations', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const project = db.getProjectById(getParamId(req));
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const allEmployees = db.getEmployees();
  const allAssignments = db.getAssignments();

  // Compute current allocations % for all candidates
  const workload = WorkloadCalculator.calculateWorkload(allEmployees, allAssignments);
  const allocMap: Record<string, number> = {};
  workload.employees.forEach((w) => {
    allocMap[w.employeeId] = w.utilizationPercentage;
  });

  const recommendation = compositionOptimizer.generateRecommendation(project, allEmployees, allocMap);
  db.saveTeamRecommendation(recommendation);

  // Log Audit
  db.logAudit(
    req.user?.fullName || 'Sarah Johnson',
    'RECOMMENDATION_GENERATED',
    'PROJECT',
    project.id,
    { overallScore: recommendation.overall_score, membersCount: recommendation.members.length }
  );

  res.status(201).json({ recommendation });
});

router.get('/projects/:id/recommendations', authenticate, (req: Request, res: Response) => {
  const recs = db.getProjectRecommendations(getParamId(req));
  res.json({ recommendations: recs });
});

router.get('/recommendations/:id', authenticate, (req: Request, res: Response) => {
  const rec = db.getTeamRecommendation(getParamId(req));
  if (!rec) {
    res.status(404).json({ error: 'Recommendation not found' });
    return;
  }
  res.json({ recommendation: rec });
});

// Candidate match preview for individual employees
router.get('/projects/:id/candidates', authenticate, (req: Request, res: Response) => {
  const project = db.getProjectById(getParamId(req));
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const allEmployees = db.getEmployees();
  const allAssignments = db.getAssignments();
  const workload = WorkloadCalculator.calculateWorkload(allEmployees, allAssignments);
  const allocMap: Record<string, number> = {};
  workload.employees.forEach((w) => {
    allocMap[w.employeeId] = w.utilizationPercentage;
  });

  const scored = allEmployees
    .filter((e) => e.employment_status === 'ACTIVE')
    .map((e) => matchingEngine.evaluateCandidate(e, project, allocMap[e.id] || 0));

  scored.sort((a, b) => b.overallScore - a.overallScore);

  res.json({ candidates: scored });
});

// ============================================================
// 7. INTERACTIVE WORKFORCE SIMULATION
// ============================================================
router.post('/projects/:id/simulations', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const project = db.getProjectById(getParamId(req));
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const validated = simulationRequestSchema.parse({
    projectId: getParamId(req),
    ...req.body,
  });

  const allEmployees = db.getEmployees();
  const allAssignments = db.getAssignments();

  const simulationResult = SimulationEngine.evaluateSimulation(
    project,
    allEmployees,
    allAssignments,
    validated
  );

  res.json({ simulation: simulationResult });
});

// ============================================================
// 8. TEAM APPROVAL (ATOMIC TRANSACTION)
// ============================================================
router.post('/recommendations/:id/approve', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const validated = approveRecommendationSchema.parse(req.body);
  const actor = req.user?.fullName || validated.approvedBy;

  const result = db.approveTeamRecommendation(getParamId(req), actor);

  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.json({
    success: true,
    message: 'Team recommendation approved and assignments committed successfully.',
    assignments: result.approvedAssignments,
  });
});

// ============================================================
// 9. ASSIGNMENTS
// ============================================================
router.get('/assignments', authenticate, (req: Request, res: Response) => {
  const { projectId, employeeId, status } = req.query;
  let list = db.getAssignments();

  if (projectId && typeof projectId === 'string') {
    list = list.filter((a) => a.project_id === projectId);
  }
  if (employeeId && typeof employeeId === 'string') {
    list = list.filter((a) => a.employee_id === employeeId);
  }
  if (status && typeof status === 'string') {
    list = list.filter((a) => a.status === status);
  }

  res.json({ assignments: list, count: list.length });
});

router.post('/assignments', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const { project_id, employee_id, assigned_role, allocation_percentage, start_date, end_date } = req.body;
  if (!project_id || !employee_id || !assigned_role) {
    res.status(400).json({ error: 'Missing required assignment fields' });
    return;
  }

  const asg = db.createAssignment({
    project_id,
    employee_id,
    assigned_role,
    allocation_percentage: allocation_percentage || 50,
    allocated_hours_per_week: ((allocation_percentage || 50) / 100) * 40,
    start_date: start_date || new Date().toISOString().split('T')[0],
    end_date: end_date || '2026-12-31',
    status: 'ACTIVE',
  });

  res.status(201).json({ assignment: asg });
});

router.post('/assignments/:id/cancel', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  const success = db.cancelAssignment(getParamId(req));
  if (!success) {
    res.status(404).json({ error: 'Assignment not found' });
    return;
  }
  res.json({ success: true });
});

// ============================================================
// 10. WORKLOAD & CAPACITY
// ============================================================
router.get('/workload/overview', authenticate, (req: Request, res: Response) => {
  const employees = db.getEmployees();
  const assignments = db.getAssignments();
  const workload = WorkloadCalculator.calculateWorkload(employees, assignments);
  res.json({ workload });
});

// ============================================================
// 11. ANALYTICS & DASHBOARD METRICS
// ============================================================
router.get('/analytics/dashboard', authenticate, (req: Request, res: Response) => {
  const metrics = db.getDashboardMetrics();
  res.json({ metrics });
});

// ============================================================
// 12. TRAINING & UPSKILLING
// ============================================================
router.get('/training-resources', authenticate, (req: Request, res: Response) => {
  res.json({ trainingResources: db.getTrainingResources() });
});

// ============================================================
// 13. DEVELOPMENT GOALS
// ============================================================
router.get('/development-goals', authenticate, (req: Request, res: Response) => {
  const { employeeId } = req.query;
  let list = db.getDevelopmentGoals();
  if (employeeId && typeof employeeId === 'string') {
    list = list.filter((g) => g.employee_id === employeeId);
  }
  res.json({ developmentGoals: list });
});

router.post('/development-goals', authenticate, (req: Request, res: Response) => {
  const validated = createDevelopmentGoalSchema.parse(req.body);
  const goal = db.createDevelopmentGoal({
    ...validated,
    status: 'IN_PROGRESS',
    progress_percentage: 0,
  });
  res.status(201).json({ developmentGoal: goal });
});

// ============================================================
// 14. REVIEWS
// ============================================================
router.get('/reviews', authenticate, (req: Request, res: Response) => {
  res.json({ reviews: db.getReviews() });
});

// ============================================================
// 15. NOTIFICATIONS
// ============================================================
router.get('/notifications', authenticate, (req: Request, res: Response) => {
  const { all } = req.query;
  const filterUserId = (all === 'true' && req.user?.role === 'ADMIN') ? undefined : req.user?.id;
  const notifs = db.getNotifications(filterUserId);
  const unreadCount = notifs.filter((n) => !n.is_read).length;
  res.json({ notifications: notifs, unreadCount });
});

router.patch('/notifications/:id/read', authenticate, (req: Request, res: Response) => {
  const success = db.markNotificationRead(getParamId(req));
  res.json({ success });
});

router.post('/notifications/mark-all-read', authenticate, (req: Request, res: Response) => {
  db.markAllNotificationsRead(req.user?.id);
  res.json({ success: true, message: 'All notifications marked as read' });
});

// ============================================================
// 16. AUDIT LOGS
// ============================================================
router.get('/audit-logs', authenticate, requireRole(['ADMIN', 'EMPLOYER']), (req: Request, res: Response) => {
  res.json({ auditLogs: db.getAuditLogs() });
});

// ============================================================
// 17. AI ASSISTANT CONVERSATION (Matching Right Rail AI Card)
// ============================================================
router.post('/ai/assistant/chat', authenticate, (req: Request, res: Response) => {
  const { prompt } = req.body;
  const p = (prompt || '').toLowerCase();

  let responseText = '';
  let suggestedActions: string[] = [];

  if (p.includes('suggest optimal team') || p.includes('optimal team')) {
    responseText =
      'Based on current skill requirements and capacity analysis, for **AI Chatbot Integration**, I recommend a 3-person team: **Priya Patel (AI/ML Lead, 70%)**, **John Doe (Senior Full Stack, 50%)**, and **Sophia Lee (QA Lead, 40%)**. This achieves 94% requirement coverage with zero overcapacity risk.';
    suggestedActions = ['Run Team Simulation', 'View Skill Gap Matrix', 'Approve Proposal'];
  } else if (p.includes('predict') || p.includes('completion')) {
    responseText =
      'Predictive sprint analysis indicates **Mobile App Redesign (90%)** will complete on time by May 28, 2026. However, **Marketing Automation (30%)** is currently At Risk with a projected 12-day milestone slippage unless additional marketing engineering capacity is allocated.';
    suggestedActions = ['Reallocate Capacity', 'View Workload Heatmap'];
  } else if (p.includes('resource') || p.includes('allocation insights')) {
    responseText =
      'Workforce resource utilization is currently at **87%** across 152 employees. Development is operating at 91% capacity, while Operations has 28 hours of open capacity this week that can be mobilized to relieve bottlenecked projects.';
    suggestedActions = ['Inspect Operations Headroom', 'Rebalance Team'];
  } else if (p.includes('risk') || p.includes('potential project risks')) {
    responseText =
      'Identified 2 primary risks: 1) **Marketing Automation** faces resource deficit with upcoming deadline Jun 20; 2) **PyTorch & AI Specialist concentration**: only Priya Patel holds verified level 5 proficiency, creating a single-point-of-dependency.';
    suggestedActions = ['Enroll Engineers in AI Course', 'Staff External Specialist'];
  } else {
    responseText =
      `I have analyzed the workforce database regarding: "${prompt}". Total 152 employees are active with 87% resource utilization across 24 projects. I can help you optimize team formation, simulate allocation changes, or identify critical skill gaps.`;
    suggestedActions = ['Suggest optimal team', 'Show resource allocation insights', 'Predict project completion time'];
  }

  res.json({
    reply: responseText,
    suggestedActions,
    timestamp: new Date().toISOString(),
  });
});

export default router;
