import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('TeamPulse Intelligence Backend API Suite', () => {
  it('GET /api/health returns 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toContain('TeamPulse');
  });

  it('GET /api/employees returns seeded employees with current utilization', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body.employees).toBeInstanceOf(Array);
    expect(res.body.employees.length).toBeGreaterThanOrEqual(5);
    expect(res.body.employees[0]).toHaveProperty('current_utilization');
  });

  it('POST /api/employees validates invalid email or missing fields', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('x-user-role', 'ADMIN')
      .send({
        full_name: 'Incomplete User',
        email: 'invalid-email',
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Validation failed');
  });

  // Feature 1: Employee creation with unique employee code, email, password hashing, and skills
  it('Feature 1 & 2: POST /api/employees creates employee with unique ID and links profile', async () => {
    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    const newEmpCode = `EMP-TEST-${uniqueNum}`;
    const newEmail = `dev.test.${uniqueNum}@teampulse.ai`;

    const res = await request(app)
      .post('/api/employees')
      .set('x-user-role', 'ADMIN')
      .send({
        employee_code: newEmpCode,
        full_name: 'Test New Developer',
        email: newEmail,
        password: 'Password123!',
        job_title: 'Junior Software Engineer',
        department: 'Development',
        years_of_experience: 2.5,
        weekly_capacity_hours: 40,
        current_status: 'Available',
        skills: [
          { skill_id: 'sk-1', proficiency_level: 4, is_verified: true },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.employee).toBeDefined();
    expect(res.body.employee.employee_code).toBe(newEmpCode);
    expect(res.body.employee.profile_id).toBeDefined();

    // Verify duplicate employee_code rejection
    const dupRes = await request(app)
      .post('/api/employees')
      .set('x-user-role', 'ADMIN')
      .send({
        employee_code: newEmpCode,
        full_name: 'Duplicate Code Attempt',
        email: `different.${uniqueNum}@teampulse.ai`,
        password: 'Password123!',
        job_title: 'Junior Software Engineer',
        department: 'Development',
        years_of_experience: 2,
      });

    expect(dupRes.status).toBe(400);
    expect(dupRes.body.error).toContain('already exists');

    // Verify duplicate email rejection
    const dupEmailRes = await request(app)
      .post('/api/employees')
      .set('x-user-role', 'ADMIN')
      .send({
        employee_code: `EMP-DIFF-${uniqueNum}`,
        full_name: 'Duplicate Email Attempt',
        email: newEmail,
        password: 'Password123!',
        job_title: 'Junior Software Engineer',
        department: 'Development',
        years_of_experience: 2,
      });

    expect(dupEmailRes.status).toBe(400);
    expect(dupEmailRes.body.error).toContain('already registered');
  });

  // Feature 1: Login via Email OR Employee ID
  it('Feature 1: POST /api/auth/login authenticates with Email and with Employee ID', async () => {
    // 1. Login with registered email
    const emailLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'john.doe@teampulse.ai',
        password: 'TeamPulse@2026',
      });

    expect(emailLoginRes.status).toBe(200);
    expect(emailLoginRes.body.token).toBeDefined();
    expect(emailLoginRes.body.user.role).toBe('EMPLOYEE');
    expect(emailLoginRes.body.user.employeeCode).toBe('EMP-1001');

    // 2. Login with Employee ID (EMP-1001)
    const empIdLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'EMP-1001',
        password: 'TeamPulse@2026',
      });

    expect(empIdLoginRes.status).toBe(200);
    expect(empIdLoginRes.body.token).toBeDefined();
    expect(empIdLoginRes.body.user.full_name).toBe('John Doe');

    // 3. Reject invalid password
    const badPassRes = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'EMP-1001',
        password: 'WrongPassword',
      });

    expect(badPassRes.status).toBe(401);
  });

  // Feature 2: Data synchronization on GET /api/employees/me
  it('Feature 2: GET /api/employees/me retrieves synchronized personal employee profile', async () => {
    const res = await request(app)
      .get('/api/employees/me')
      .set('x-user-id', 'prof-3') // John Doe
      .set('x-user-role', 'EMPLOYEE');

    expect(res.status).toBe(200);
    expect(res.body.employee).toBeDefined();
    expect(res.body.employee.full_name).toBe('John Doe');
    expect(res.body.employee.employee_code).toBe('EMP-1001');
    expect(res.body.assignments).toBeInstanceOf(Array);
    expect(res.body.skillGaps).toBeInstanceOf(Array);
    expect(res.body.courses).toBeInstanceOf(Array);
  });

  // Feature 3: Project creation triggers persistent notifications
  it('Feature 3: POST /api/projects saves project and generates notifications for eligible employees', async () => {
    const notifsBefore = await request(app)
      .get('/api/notifications')
      .set('x-user-id', 'prof-3')
      .set('x-user-role', 'EMPLOYEE');

    const prevCount = notifsBefore.body.notifications.length;

    const res = await request(app)
      .post('/api/projects')
      .set('x-user-role', 'EMPLOYER')
      .send({
        name: 'Autonomous Drone Fleet Controller',
        description: 'Next-gen distributed robotics fleet management system.',
        department: 'Development',
        priority: 'HIGH',
        start_date: '2026-06-01',
        deadline: '2026-11-30',
        requested_team_size: 3,
        status: 'Planning',
      });

    expect(res.status).toBe(201);
    expect(res.body.project).toBeDefined();

    // Verify persistent notifications were generated for eligible employees
    const notifsAfter = await request(app)
      .get('/api/notifications')
      .set('x-user-id', 'prof-3')
      .set('x-user-role', 'EMPLOYEE');

    expect(notifsAfter.body.notifications.length).toBeGreaterThan(prevCount);
    const newProjNotif = notifsAfter.body.notifications.find((n: any) =>
      n.title.includes('Autonomous Drone Fleet Controller')
    );
    expect(newProjNotif).toBeDefined();
    expect(newProjNotif.message).toContain('Deadline: 2026-11-30');
  });

  // Feature 4: Explainable skill-based matching and unmet requirement warnings
  it('Feature 4: POST /api/projects/:id/recommendations computes explainable matching with unmet requirements', async () => {
    const res = await request(app)
      .post('/api/projects/proj-2/recommendations')
      .set('x-user-role', 'EMPLOYER');

    expect(res.status).toBe(201);
    expect(res.body.recommendation).toBeDefined();
    expect(res.body.recommendation.members.length).toBeGreaterThan(0);
    expect(res.body.recommendation.explanation_summary).toBeDefined();

    // Check individual candidate scoring factors
    const firstMember = res.body.recommendation.members[0];
    expect(firstMember.match_score).toBeGreaterThan(0);
    expect(firstMember.match_reasons).toBeInstanceOf(Array);
    expect(firstMember.match_reasons.length).toBeGreaterThan(0);
  });

  // Feature 5: Course progress tracking isolated from verified skill proficiency
  it('Feature 5: POST /api/employees/:id/courses/:courseId/progress updates course progress without changing verified skill proficiency', async () => {
    // 1. Get current employee proficiency for React
    const empBefore = await request(app).get('/api/employees/emp-1');
    const reactSkillBefore = empBefore.body.employee.skills.find((s: any) => s.skill_id === 'sk-1');
    const originalProficiency = reactSkillBefore ? reactSkillBefore.proficiency_level : 4;

    // 2. Complete course crs-1
    const progressRes = await request(app)
      .post('/api/employees/emp-1/courses/crs-1/progress')
      .set('x-user-role', 'EMPLOYEE')
      .send({
        status: 'COMPLETED',
        progress_pct: 100,
      });

    expect(progressRes.status).toBe(200);
    expect(progressRes.body.enrollment.status).toBe('COMPLETED');
    expect(progressRes.body.enrollment.progress_pct).toBe(100);
    expect(progressRes.body.enrollment.completed_at).toBeDefined();

    // 3. Verify verified skill proficiency level was NOT automatically modified (independent isolation)
    const empAfter = await request(app).get('/api/employees/emp-1');
    const reactSkillAfter = empAfter.body.employee.skills.find((s: any) => s.skill_id === 'sk-1');
    expect(reactSkillAfter.proficiency_level).toBe(originalProficiency);
  });

  // Feature 5: Workforce skill gaps endpoint for Admins/Employers
  it('Feature 5: GET /api/workforce/skill-gaps returns aggregated gaps and upskilling priorities', async () => {
    const res = await request(app)
      .get('/api/workforce/skill-gaps')
      .set('x-user-role', 'EMPLOYER');

    expect(res.status).toBe(200);
    expect(res.body.skillGaps).toBeInstanceOf(Array);
    if (res.body.skillGaps.length > 0) {
      const first = res.body.skillGaps[0];
      expect(first).toHaveProperty('skill_name');
      expect(first).toHaveProperty('affected_projects_count');
      expect(first).toHaveProperty('missing_count');
      expect(first).toHaveProperty('priority');
    }
  });

  it('GET /api/projects returns active project list matching UI design', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body.projects).toBeInstanceOf(Array);
    const ecommerce = res.body.projects.find((p: any) => p.name === 'E-Commerce Platform');
    expect(ecommerce).toBeDefined();
    expect(ecommerce.progress_percentage).toBe(75);
  });

  it('POST /api/recommendations/:id/approve executes atomic approval and updates assignments', async () => {
    const recRes = await request(app)
      .post('/api/projects/proj-1/recommendations')
      .set('x-user-role', 'EMPLOYER');

    const recId = recRes.body.recommendation.id;

    const approveRes = await request(app)
      .post(`/api/recommendations/${recId}/approve`)
      .set('x-user-role', 'EMPLOYER')
      .send({ approvedBy: 'Sarah Johnson' });

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.success).toBe(true);
    expect(approveRes.body.assignments.length).toBeGreaterThan(0);
  });

  it('GET /api/workload/overview aggregates utilization and detects capacity status', async () => {
    const res = await request(app).get('/api/workload/overview');
    expect(res.status).toBe(200);
    expect(res.body.workload.totalEmployees).toBeGreaterThan(0);
    expect(res.body.workload.departmentUtilization).toBeInstanceOf(Array);
  });

  it('POST /api/ai/assistant/chat delivers intelligent contextual workforce guidance', async () => {
    const res = await request(app)
      .post('/api/ai/assistant/chat')
      .send({ prompt: 'Suggest optimal team for a new project' });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain('Priya Patel');
    expect(res.body.suggestedActions.length).toBeGreaterThan(0);
  });
});
