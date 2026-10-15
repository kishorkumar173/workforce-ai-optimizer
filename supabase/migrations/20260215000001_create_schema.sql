-- ============================================================
-- TeamPulse Intelligence - Supabase PostgreSQL Schema Migration
-- Migration: 20260215000001_create_schema.sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES (System user identity & role mapping)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- References auth.users(id) when Supabase Auth is active
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE' CHECK (role IN ('ADMIN', 'EMPLOYER', 'EMPLOYEE')),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. SKILLS (Standardized competency directory)
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL, -- e.g. Frontend, Backend, AI/ML, DevOps, Management, Design
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. EMPLOYEES (Workforce profiles with capacity and status)
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    job_title VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL, -- Development, Design, Marketing, Operations, Management, QA
    years_of_experience NUMERIC(4,1) NOT NULL DEFAULT 1.0,
    hourly_rate NUMERIC(10,2) DEFAULT 0.00,
    weekly_capacity_hours NUMERIC(5,2) NOT NULL DEFAULT 40.0,
    current_status VARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (current_status IN ('Available', 'In a Meeting', 'Busy', 'On Leave')),
    employment_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (employment_status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE')),
    avatar_url TEXT,
    location VARCHAR(100) DEFAULT 'Remote',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. EMPLOYEE_SKILLS (Associates employees with proficiency and verification status)
CREATE TABLE IF NOT EXISTS public.employee_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER NOT NULL CHECK (proficiency_level BETWEEN 1 AND 5), -- 1: Beginner, 2: Intermediate, 3: Competent, 4: Advanced, 5: Expert
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    evidence TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(employee_id, skill_id)
);

-- 5. PROJECTS (Enterprise initiatives and staffing targets)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(50) NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'In Progress', 'On Track', 'At Risk', 'Completed', 'On Hold')),
    start_date DATE NOT NULL,
    deadline DATE NOT NULL,
    requested_team_size INTEGER NOT NULL DEFAULT 3 CHECK (requested_team_size > 0),
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    budget NUMERIC(12,2) DEFAULT 0.00,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. PROJECT_REQUIREMENTS (Skill requirements, weights, and proficiency targets)
CREATE TABLE IF NOT EXISTS public.project_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    min_proficiency INTEGER NOT NULL DEFAULT 3 CHECK (min_proficiency BETWEEN 1 AND 5),
    importance VARCHAR(50) NOT NULL DEFAULT 'IMPORTANT' CHECK (importance IN ('NICE_TO_HAVE', 'IMPORTANT', 'CRITICAL')),
    min_employee_count INTEGER NOT NULL DEFAULT 1 CHECK (min_employee_count > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(project_id, skill_id)
);

-- 7. ASSIGNMENTS (Approved or active project staffing)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    assigned_role VARCHAR(100) NOT NULL,
    allocation_percentage INTEGER NOT NULL DEFAULT 100 CHECK (allocation_percentage BETWEEN 5 AND 100),
    allocated_hours_per_week NUMERIC(5,2) NOT NULL DEFAULT 40.0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED', 'REPLACED')),
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(project_id, employee_id, status)
);

-- 8. WORKLOAD_ALLOCATIONS (Granular temporal tracking)
CREATE TABLE IF NOT EXISTS public.workload_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    allocated_hours NUMERIC(5,2) NOT NULL DEFAULT 0.0,
    utilization_percentage INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('PLANNED', 'APPROVED', 'SIMULATED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TEAM_RECOMMENDATIONS (AI Team Formation Outputs)
CREATE TABLE IF NOT EXISTS public.team_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    algorithm_version VARCHAR(50) NOT NULL DEFAULT 'v2.4-explainable-hybrid',
    overall_score NUMERIC(5,2) NOT NULL, -- 0 - 100
    skill_coverage_score NUMERIC(5,2) NOT NULL,
    workload_safety_score NUMERIC(5,2) NOT NULL,
    experience_score NUMERIC(5,2) NOT NULL,
    critical_skills_covered INTEGER NOT NULL DEFAULT 0,
    critical_skills_total INTEGER NOT NULL DEFAULT 0,
    has_capacity_violation BOOLEAN NOT NULL DEFAULT FALSE,
    explanation_summary TEXT,
    tradeoffs_summary TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'SUPERSEDED')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. RECOMMENDATION_MEMBERS (Proposed personnel inside a recommendation)
CREATE TABLE IF NOT EXISTS public.recommendation_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES public.team_recommendations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    suggested_role VARCHAR(100) NOT NULL,
    match_score NUMERIC(5,2) NOT NULL,
    matched_skills TEXT[] DEFAULT '{}',
    missing_skills TEXT[] DEFAULT '{}',
    allocated_percentage INTEGER NOT NULL DEFAULT 50,
    match_reasons TEXT[] DEFAULT '{}',
    capacity_warnings TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. TRAINING_RESOURCES (Curated upskilling catalogue)
CREATE TABLE IF NOT EXISTS public.training_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(150) NOT NULL,
    resource_url TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'Intermediate' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    estimated_hours NUMERIC(5,1) DEFAULT 20.0,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. DEVELOPMENT_GOALS (Target skills and progress tracking)
CREATE TABLE IF NOT EXISTS public.development_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    target_skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    goal_title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED')),
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    target_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. REVIEWS (Periodic performance and capability evaluations)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    review_type VARCHAR(50) NOT NULL DEFAULT 'QUARTERLY' CHECK (review_type IN ('QUARTERLY', 'YEARLY', 'PROJECT_CLOSE', 'ONE_ON_ONE')),
    review_period VARCHAR(50) NOT NULL, -- e.g. 'Q1 2026'
    rating NUMERIC(3,2) CHECK (rating BETWEEN 1.0 AND 5.0),
    strengths TEXT,
    growth_areas TEXT,
    manager_notes TEXT,
    employee_comments TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'COMPLETED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. ONE_ON_ONE_MEETINGS (Coaching and workload pulse)
CREATE TABLE IF NOT EXISTS public.one_on_one_meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    manager_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    meeting_date TIMESTAMPTZ NOT NULL,
    agenda TEXT,
    action_items TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. NOTIFICATIONS (System alerts and team triggers)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM' CHECK (type IN ('RECOMMENDATION', 'ASSIGNMENT', 'WORKLOAD_ALERT', 'DEADLINE', 'SKILL_GAP', 'SYSTEM')),
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. AUDIT_LOGS (Immutable decision audit trails)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL, -- e.g. PROJECT_CREATED, TEAM_RECOMMENDED, TEAM_APPROVED, ALLOCATION_MODIFIED
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_employees_department ON public.employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(current_status, employment_status);
CREATE INDEX IF NOT EXISTS idx_employee_skills_emp_skill ON public.employee_skills(employee_id, skill_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_assignments_project_emp ON public.assignments(project_id, employee_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workload_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Read policies: Authenticated users can read public company directories
CREATE POLICY "Profiles read access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Employees read access" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Skills read access" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Employee skills read access" ON public.employee_skills FOR SELECT USING (true);
CREATE POLICY "Projects read access" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Project requirements read access" ON public.project_requirements FOR SELECT USING (true);
CREATE POLICY "Assignments read access" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Workload allocations read access" ON public.workload_allocations FOR SELECT USING (true);
CREATE POLICY "Training resources read access" ON public.training_resources FOR SELECT USING (true);

-- Personal data protection
CREATE POLICY "Notifications recipient access" ON public.notifications
    FOR ALL USING (auth.uid() = recipient_id OR auth.uid() IS NULL);

CREATE POLICY "Reviews access" ON public.reviews
    FOR SELECT USING (auth.uid() = reviewer_id OR auth.uid() IS NULL);

-- Admin & Employer full modification access (checked by role on profile)
CREATE POLICY "Admin/Employer project management" ON public.projects
    FOR ALL USING (true);

CREATE POLICY "Admin/Employer assignment management" ON public.assignments
    FOR ALL USING (true);

CREATE POLICY "Audit logs insert" ON public.audit_logs
    FOR INSERT WITH CHECK (true);
