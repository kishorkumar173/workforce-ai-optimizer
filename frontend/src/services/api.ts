import {
  DashboardMetrics,
  Employee,
  Project,
  Skill,
  TeamRecommendation,
  SimulationResult,
  Assignment,
  TrainingResource,
  DevelopmentGoal,
  Review,
  NotificationItem,
  AuditLog,
  UserRole,
  UserProfile,
  CourseEnrollment,
  EmployeeSkillGap,
} from '../types';

const API_BASE = '/api';

// Helper to retrieve current session headers
const getAuthHeaders = (): Record<string, string> => {
  const storedRole = (localStorage.getItem('teampulse_role') as UserRole) || 'EMPLOYER';
  const storedName = localStorage.getItem('teampulse_user_name') || 'Sarah Johnson';
  const storedId = localStorage.getItem('teampulse_user_id') || 'prof-1';
  const storedEmail = localStorage.getItem('teampulse_user_email') || 'sarah.johnson@teampulse.ai';
  const storedToken = localStorage.getItem('teampulse_token') || '';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-user-role': storedRole,
    'x-user-name': storedName,
    'x-user-id': storedId,
    'x-user-email': storedEmail,
  };

  if (storedToken) {
    headers['Authorization'] = `Bearer ${storedToken}`;
  }

  return headers;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `API Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      errorMsg = errorData.error || errorData.message || errorMsg;
    } catch {
      // keep fallback errorMsg
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Authentication
  async login(identifier: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return handleResponse(res);
  },

  async setPassword(password: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/set-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ password }),
    });
    return handleResponse(res);
  },
  // Dashboard Metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const res = await fetch(`${API_BASE}/analytics/dashboard`, { headers: getAuthHeaders() });
    const data = await handleResponse<{ metrics: DashboardMetrics }>(res);
    return data.metrics;
  },

  // Employees
  async getEmployees(params: { department?: string; status?: string; search?: string; skill?: string } = {}): Promise<Employee[]> {
    const query = new URLSearchParams();
    if (params.department) query.set('department', params.department);
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.skill) query.set('skill', params.skill);

    const res = await fetch(`${API_BASE}/employees?${query.toString()}`, { headers: getAuthHeaders() });
    const data = await handleResponse<{ employees: Employee[] }>(res);
    return data.employees;
  },

  async getMeEmployee(): Promise<{
    employee: Employee;
    assignments: Assignment[];
    workload: any;
    skillGaps: EmployeeSkillGap[];
    courses: CourseEnrollment[];
  }> {
    const res = await fetch(`${API_BASE}/employees/me`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async getEmployeeById(id: string): Promise<{ employee: Employee; assignments: Assignment[]; workload: any }> {
    const res = await fetch(`${API_BASE}/employees/${id}`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(employeeData),
    });
    const data = await handleResponse<{ employee: Employee }>(res);
    return data.employee;
  },

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await handleResponse<{ employee: Employee }>(res);
    return data.employee;
  },

  async deleteEmployee(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<{ success: boolean }>(res);
    return data.success;
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    const res = await fetch(`${API_BASE}/skills`, { headers: getAuthHeaders() });
    const data = await handleResponse<{ skills: Skill[] }>(res);
    return data.skills;
  },

  async createSkill(skill: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill),
    });
    const data = await handleResponse<{ skill: Skill }>(res);
    return data.skill;
  },

  // Projects
  async getProjects(params: { status?: string; department?: string; priority?: string } = {}): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.department) query.set('department', params.department);
    if (params.priority) query.set('priority', params.priority);

    const res = await fetch(`${API_BASE}/projects?${query.toString()}`, { headers: getAuthHeaders() });
    const data = await handleResponse<{ projects: Project[] }>(res);
    return data.projects;
  },

  async getProjectById(id: string): Promise<{ project: Project; gapReport: any }> {
    const res = await fetch(`${API_BASE}/projects/${id}`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async createProject(projectData: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    const data = await handleResponse<{ project: Project }>(res);
    return data.project;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await handleResponse<{ project: Project }>(res);
    return data.project;
  },

  async deleteProject(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<{ success: boolean }>(res);
    return data.success;
  },

  async setProjectRequirements(id: string, requirements: any[]): Promise<any> {
    const res = await fetch(`${API_BASE}/projects/${id}/requirements`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ requirements }),
    });
    return handleResponse(res);
  },

  // Team Formation & Recommendations
  async generateTeamRecommendation(projectId: string): Promise<TeamRecommendation> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/recommendations`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<{ recommendation: TeamRecommendation }>(res);
    return data.recommendation;
  },

  async getProjectRecommendations(projectId: string): Promise<TeamRecommendation[]> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/recommendations`, { headers: getAuthHeaders() });
    const data = await handleResponse<{ recommendations: TeamRecommendation[] }>(res);
    return data.recommendations;
  },

  async getProjectCandidates(projectId: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/candidates`, { headers: getAuthHeaders() });
    const data = await handleResponse<{ candidates: any[] }>(res);
    return data.candidates;
  },

  // Team Simulation
  async runSimulation(
    projectId: string,
    proposedMembers: Array<{ employeeId: string; role: string; allocationPercentage: number }>
  ): Promise<SimulationResult> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/simulations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ proposedMembers }),
    });
    const data = await handleResponse<{ simulation: SimulationResult }>(res);
    return data.simulation;
  },

  // Atomic Team Approval
  async approveTeamRecommendation(recommendationId: string, approvedBy?: string): Promise<{ success: boolean; assignments: Assignment[] }> {
    const res = await fetch(`${API_BASE}/recommendations/${recommendationId}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ approvedBy }),
    });
    return handleResponse(res);
  },

  // Assignments
  async getAssignments(params: { projectId?: string; employeeId?: string; status?: string } = {}): Promise<Assignment[]> {
    const query = new URLSearchParams();
    if (params.projectId) query.set('projectId', params.projectId);
    if (params.employeeId) query.set('employeeId', params.employeeId);
    if (params.status) query.set('status', params.status);

    const res = await fetch(`${API_BASE}/assignments?${query.toString()}`, { headers: getAuthHeaders() });
    const data = await handleResponse<{ assignments: Assignment[] }>(res);
    return data.assignments;
  },

  async createAssignment(assignmentData: Partial<Assignment>): Promise<Assignment> {
    const res = await fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(assignmentData),
    });
    const data = await handleResponse<{ assignment: Assignment }>(res);
    return data.assignment;
  },

  async cancelAssignment(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/assignments/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<{ success: boolean }>(res);
    return data.success;
  },

  // Workload
  async getWorkloadOverview(): Promise<any> {
    const res = await fetch(`${API_BASE}/workload/overview`, { headers: getAuthHeaders() });
    const data = await handleResponse<{ workload: any }>(res);
    return data.workload;
  },

  // Training & Upskilling
  async getTrainingResources(): Promise<TrainingResource[]> {
    const res = await fetch(`${API_BASE}/training-resources`, { headers: getAuthHeaders() });
    const data = await handleResponse<{ trainingResources: TrainingResource[] }>(res);
    return data.trainingResources;
  },

  async getEmployeeSkillGaps(employeeId: string): Promise<{ employeeId: string; employeeName: string; skillGaps: EmployeeSkillGap[] }> {
    const res = await fetch(`${API_BASE}/employees/${employeeId}/skill-gaps`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async getEmployeeCourses(employeeId: string): Promise<{ enrollments: CourseEnrollment[] }> {
    const res = await fetch(`${API_BASE}/employees/${employeeId}/courses`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async updateCourseProgress(
    employeeId: string,
    courseId: string,
    progressData: { status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'; progress_pct?: number }
  ): Promise<{ enrollment: CourseEnrollment }> {
    const res = await fetch(`${API_BASE}/employees/${employeeId}/courses/${courseId}/progress`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(progressData),
    });
    return handleResponse(res);
  },

  async getWorkforceSkillGaps(): Promise<{ skillGaps: any[] }> {
    const res = await fetch(`${API_BASE}/workforce/skill-gaps`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  // Development Goals
  async getDevelopmentGoals(employeeId?: string): Promise<DevelopmentGoal[]> {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    const res = await fetch(`${API_BASE}/development-goals${query}`, { headers: getAuthHeaders() });
    const data = await handleResponse<{ developmentGoals: DevelopmentGoal[] }>(res);
    return data.developmentGoals;
  },

  async createDevelopmentGoal(goal: Partial<DevelopmentGoal>): Promise<DevelopmentGoal> {
    const res = await fetch(`${API_BASE}/development-goals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(goal),
    });
    const data = await handleResponse<{ developmentGoal: DevelopmentGoal }>(res);
    return data.developmentGoal;
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews`, { headers: getAuthHeaders() });
    const data = await handleResponse<{ reviews: Review[] }>(res);
    return data.reviews;
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    const res = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async markNotificationRead(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<{ success: boolean }>(res);
    return data.success;
  },

  async markAllNotificationsRead(): Promise<number> {
    const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<{ count: number }>(res);
    return data.count;
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${API_BASE}/audit-logs`, { headers: getAuthHeaders() });
    const data = await handleResponse<{ auditLogs: AuditLog[] }>(res);
    return data.auditLogs;
  },

  // Conversational AI Assistant
  async askAiAssistant(prompt: string): Promise<{ reply: string; suggestedActions: string[] }> {
    const res = await fetch(`${API_BASE}/ai/assistant/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ prompt }),
    });
    return handleResponse(res);
  },
};
