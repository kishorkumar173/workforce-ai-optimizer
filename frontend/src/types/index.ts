export type UserRole = 'ADMIN' | 'EMPLOYER' | 'EMPLOYEE';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ProjectStatus = 'Planning' | 'In Progress' | 'On Track' | 'At Risk' | 'Completed' | 'On Hold';
export type EmployeeCurrentStatus = 'Available' | 'In a Meeting' | 'Busy' | 'On Leave';
export type RequirementImportance = 'NICE_TO_HAVE' | 'IMPORTANT' | 'CRITICAL';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  employeeId?: string;
  employeeCode?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface EmployeeSkill {
  id: string;
  employee_id: string;
  skill_id: string;
  skill_name?: string;
  category?: string;
  proficiency_level: number;
  is_verified: boolean;
  evidence?: string;
}

export interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  job_title: string;
  department: string;
  years_of_experience: number;
  weekly_capacity_hours: number;
  current_status: EmployeeCurrentStatus;
  employment_status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  avatar_url?: string;
  location?: string;
  skills?: EmployeeSkill[];
  current_utilization?: number;
}

export interface ProjectRequirement {
  id: string;
  project_id: string;
  skill_id: string;
  skill_name?: string;
  min_proficiency: number;
  importance: RequirementImportance;
  min_employee_count: number;
}

export interface Assignment {
  id: string;
  project_id: string;
  project_name?: string;
  employee_id: string;
  employee_name?: string;
  employee_avatar?: string;
  assigned_role: string;
  allocation_percentage: number;
  allocated_hours_per_week: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'REPLACED';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  department: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  start_date: string;
  deadline: string;
  requested_team_size: number;
  progress_percentage: number;
  budget?: number;
  requirements?: ProjectRequirement[];
  assignments?: Assignment[];
}

export interface TeamRecommendationMember {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_avatar?: string;
  job_title: string;
  suggested_role: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  allocated_percentage: number;
  match_reasons: string[];
  capacity_warnings: string[];
}

export interface TeamRecommendation {
  id: string;
  project_id: string;
  project_name?: string;
  algorithm_version: string;
  overall_score: number;
  skill_coverage_score: number;
  workload_safety_score: number;
  experience_score: number;
  critical_skills_covered: number;
  critical_skills_total: number;
  has_capacity_violation: boolean;
  explanation_summary: string;
  tradeoffs_summary: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  members: TeamRecommendationMember[];
  created_at: string;
}

export interface SimulationResult {
  simulationId: string;
  projectId: string;
  projectName: string;
  baseline: {
    overallScore: number;
    skillCoverage: number;
    teamSize: number;
    capacityViolations: number;
  };
  simulated: {
    overallScore: number;
    skillCoverage: number;
    teamSize: number;
    capacityViolations: number;
    coveredRequirements: Array<{
      skillName: string;
      satisfiedBy: string[];
      isCritical: boolean;
    }>;
    uncoveredRequirements: Array<{
      skillName: string;
      importance: RequirementImportance;
      gapDescription: string;
    }>;
    memberAnalysis: Array<{
      employeeId: string;
      name: string;
      role: string;
      allocatedPercentage: number;
      projectedUtilization: number;
      isOverloaded: boolean;
      status: string;
    }>;
  };
  delta: {
    scoreChange: number;
    skillCoverageChange: number;
    newlyCoveredSkills: string[];
    newlyUncoveredSkills: string[];
    newOverloadedEmployees: string[];
  };
  isFeasibleForApproval: boolean;
  approvalBlockers: string[];
}

export interface DashboardMetrics {
  totalEmployees: number;
  activeProjects: number;
  resourceUtilizationRate: number;
  projectSuccessRate: number;
  departmentAllocation: Array<{
    name: string;
    percentage: number;
    count: number;
    color: string;
  }>;
  progressOverview: Array<{
    month: string;
    planning: number;
    inProgress: number;
    completed: number;
  }>;
  aiInsights: Array<{
    id: string;
    category: 'Resource Optimization' | 'Potential Delay' | 'High Performer' | 'Skill Gap';
    title: string;
    description: string;
    severity: 'info' | 'warning' | 'success' | 'alert';
    badgeColor: string;
  }>;
  upcomingTasks: Array<{
    id: string;
    title: string;
    project: string;
    timeTag: string;
    isCompleted: boolean;
  }>;
  teamStatusPreview: Array<{
    id: string;
    name: string;
    title: string;
    avatar: string;
    status: EmployeeCurrentStatus;
    capacityPercentage: number;
  }>;
}

export interface NotificationItem {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface TrainingResource {
  id: string;
  skill_id?: string;
  skill_name?: string;
  title: string;
  provider: string;
  resource_url: string;
  difficulty: string;
  estimated_hours: number;
  description: string;
}

export interface DevelopmentGoal {
  id: string;
  employee_id: string;
  employee_name?: string;
  target_skill_name?: string;
  goal_title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  progress_percentage: number;
  target_date: string;
}

export interface AuditLog {
  id: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Review {
  id: string;
  employee_id: string;
  employee_name?: string;
  reviewer_id: string;
  reviewer_name?: string;
  review_type: string;
  review_period: string;
  rating?: number;
  strengths?: string;
  growth_areas?: string;
  manager_notes?: string;
  status: string;
  created_at: string;
}

export interface CourseEnrollment {
  id: string;
  employee_id: string;
  course_id: string;
  course_title?: string;
  provider?: string;
  resource_url?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  progress_percentage: number;
  enrolled_at: string;
  completed_at?: string;
}

export interface EmployeeSkillGap {
  skillId: string;
  skillName: string;
  category?: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  hasRecord: boolean;
  status: 'NO_RECORD' | 'BELOW_REQUIREMENT' | 'MEETS_REQUIREMENT';
  recommendedAction: string;
  recommendedCourse?: TrainingResource;
}
