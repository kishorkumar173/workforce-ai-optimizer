// ============================================================
// TeamPulse Intelligence - Core Domain Types
// ============================================================

export type UserRole = 'ADMIN' | 'EMPLOYER' | 'EMPLOYEE';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ProjectStatus = 'Planning' | 'In Progress' | 'On Track' | 'At Risk' | 'Completed' | 'On Hold';
export type RequirementImportance = 'NICE_TO_HAVE' | 'IMPORTANT' | 'CRITICAL';
export type EmployeeCurrentStatus = 'Available' | 'In a Meeting' | 'Busy' | 'On Leave';
export type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
export type AssignmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'REPLACED';
export type RecommendationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'SUPERSEDED';

export interface Profile {
  id: string;
  auth_user_id?: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  status: AccountStatus;
  password_hash?: string;
  password_salt?: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  created_at?: string;
}

export interface EmployeeSkill {
  id: string;
  employee_id: string;
  skill_id: string;
  skill_name?: string;
  category?: string;
  proficiency_level: number; // 1 - 5
  is_verified: boolean;
  verified_by?: string;
  verified_at?: string;
  evidence?: string;
}

export interface Employee {
  id: string;
  profile_id?: string;
  employee_code: string;
  full_name: string;
  email: string;
  job_title: string;
  department: string;
  years_of_experience: number;
  hourly_rate?: number;
  weekly_capacity_hours: number;
  current_status: EmployeeCurrentStatus;
  employment_status: EmploymentStatus;
  avatar_url?: string;
  location?: string;
  skills?: EmployeeSkill[];
  current_utilization?: number; // Calculated percentage (e.g. 80%)
  created_at: string;
  updated_at: string;
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
  owner_id?: string;
  requirements?: ProjectRequirement[];
  assignments?: Assignment[];
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  project_id: string;
  project_name?: string;
  employee_id: string;
  employee_name?: string;
  employee_avatar?: string;
  assigned_role: string;
  allocation_percentage: number; // e.g. 60%
  allocated_hours_per_week: number;
  start_date: string;
  end_date: string;
  status: AssignmentStatus;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkloadAllocation {
  id: string;
  employee_id: string;
  assignment_id?: string;
  project_id?: string;
  week_start_date: string;
  allocated_hours: number;
  utilization_percentage: number;
  status: 'PLANNED' | 'APPROVED' | 'SIMULATED';
}

export interface EmployeeMatchResult {
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  jobTitle: string;
  department: string;
  overallScore: number; // 0 - 100
  skillMatchScore: number;
  experienceScore: number;
  availabilityScore: number;
  workloadSuitabilityScore: number;
  projectExperienceScore: number;
  matchedSkills: Array<{
    skillId: string;
    skillName: string;
    employeeLevel: number;
    requiredLevel: number;
    isVerified: boolean;
  }>;
  missingSkills: Array<{
    skillId: string;
    skillName: string;
    requiredLevel: number;
    importance: RequirementImportance;
  }>;
  proficiencyGaps: Array<{
    skillName: string;
    gap: number;
  }>;
  verificationWarnings: string[];
  capacityWarnings: string[];
  recommendationReasons: string[];
  currentUtilization: number;
  availableCapacityHours: number;
}

export interface TeamRecommendationMember {
  id: string;
  recommendation_id?: string;
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
  status: RecommendationStatus;
  unmet_requirements?: string[];
  members: TeamRecommendationMember[];
  created_at: string;
}

export interface SimulationRequest {
  projectId: string;
  name?: string;
  proposedMembers: Array<{
    employeeId: string;
    role: string;
    allocationPercentage: number;
  }>;
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

export interface TrainingResource {
  id: string;
  skill_id?: string;
  skill_name?: string;
  title: string;
  provider: string;
  resource_url: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_hours: number;
  description: string;
}

export interface DevelopmentGoal {
  id: string;
  employee_id: string;
  employee_name?: string;
  target_skill_id?: string;
  target_skill_name?: string;
  goal_title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  progress_percentage: number;
  target_date: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  employee_id: string;
  employee_name?: string;
  reviewer_id: string;
  reviewer_name?: string;
  review_type: 'QUARTERLY' | 'YEARLY' | 'PROJECT_CLOSE' | 'ONE_ON_ONE';
  review_period: string;
  rating?: number;
  strengths?: string;
  growth_areas?: string;
  manager_notes?: string;
  employee_comments?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'COMPLETED';
  created_at: string;
}

export interface NotificationItem {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  type: 'RECOMMENDATION' | 'ASSIGNMENT' | 'WORKLOAD_ALERT' | 'DEADLINE' | 'SKILL_GAP' | 'SYSTEM';
  related_entity_type?: string;
  related_entity_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface DashboardMetrics {
  totalEmployees: number;
  activeProjects: number;
  resourceUtilizationRate: number; // e.g. 87%
  projectSuccessRate: number; // e.g. 98%
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
