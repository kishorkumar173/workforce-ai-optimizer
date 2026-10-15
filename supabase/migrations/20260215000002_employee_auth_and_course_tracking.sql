-- ============================================================
-- TeamPulse Intelligence - Migration 2: Employee Auth & Learning Progress
-- Migration: 20260215000002_employee_auth_and_course_tracking.sql
-- ============================================================

-- 1. Ensure unique constraints on employee_code and email
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_employees_employee_code'
    ) THEN
        ALTER TABLE public.employees ADD CONSTRAINT uq_employees_employee_code UNIQUE (employee_code);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_employees_email'
    ) THEN
        ALTER TABLE public.employees ADD CONSTRAINT uq_employees_email UNIQUE (email);
    END IF;
END $$;

-- 2. Add password_hash and password_salt columns to profiles for secure local credential management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_salt TEXT;

-- 3. Create USER_COURSE_ENROLLMENTS table for learning progress tracking
CREATE TABLE IF NOT EXISTS public.user_course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.training_resources(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED')),
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    UNIQUE(employee_id, course_id)
);

-- 4. Enable Row Level Security (RLS) on user_course_enrollments
ALTER TABLE public.user_course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User course enrollments read access" ON public.user_course_enrollments
    FOR SELECT USING (true);

CREATE POLICY "User course enrollments modify access" ON public.user_course_enrollments
    FOR ALL USING (true);

-- 5. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_employees_code ON public.employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_employee ON public.user_course_enrollments(employee_id, status);
