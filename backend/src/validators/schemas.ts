import { z } from 'zod';

export const createEmployeeSchema = z.object({
  employee_code: z.string().min(2, 'Employee code must be at least 2 characters'),
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  job_title: z.string().min(2, 'Job title is required'),
  department: z.string().min(2, 'Department is required'),
  years_of_experience: z.number().min(0, 'Experience must be non-negative'),
  weekly_capacity_hours: z.number().min(5).max(80).default(40),
  current_status: z.enum(['Available', 'In a Meeting', 'Busy', 'On Leave']).default('Available'),
  employment_status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']).default('ACTIVE'),
  avatar_url: z.string().url().optional(),
  location: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  skills: z
    .array(
      z.object({
        skill_id: z.string().min(1),
        proficiency_level: z.number().min(1).max(5),
        is_verified: z.boolean().default(false),
        evidence: z.string().optional(),
      })
    )
    .optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or Employee ID is required'),
  password: z.string().min(1, 'Password is required'),
});

export const setPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateCourseProgressSchema = z.object({
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED']),
  progress_percentage: z.number().min(0).max(100).optional(),
  progress_pct: z.number().min(0).max(100).optional(),
});

export const createProjectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().optional(),
  department: z.string().min(2, 'Department is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  status: z.enum(['Planning', 'In Progress', 'On Track', 'At Risk', 'Completed', 'On Hold']).default('Planning'),
  start_date: z.string().min(4, 'Start date is required'),
  deadline: z.string().min(4, 'Deadline is required'),
  requested_team_size: z.number().min(1, 'Team size must be at least 1').max(25),
  progress_percentage: z.number().min(0).max(100).default(0),
  budget: z.number().min(0).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const setProjectRequirementsSchema = z.object({
  requirements: z.array(
    z.object({
      skill_id: z.string().min(1, 'Skill ID is required'),
      min_proficiency: z.number().min(1).max(5),
      importance: z.enum(['NICE_TO_HAVE', 'IMPORTANT', 'CRITICAL']),
      min_employee_count: z.number().min(1).default(1),
    })
  ),
});

export const simulationRequestSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  name: z.string().optional(),
  proposedMembers: z.array(
    z.object({
      employeeId: z.string().min(1, 'Employee ID is required'),
      role: z.string().min(1, 'Role is required'),
      allocationPercentage: z.number().min(5).max(100),
    })
  ),
});

export const approveRecommendationSchema = z.object({
  approvedBy: z.string().optional().default('Sarah Johnson'),
});

export const createDevelopmentGoalSchema = z.object({
  employee_id: z.string().min(1),
  target_skill_id: z.string().optional(),
  goal_title: z.string().min(3),
  description: z.string().optional(),
  target_date: z.string().min(4),
});
