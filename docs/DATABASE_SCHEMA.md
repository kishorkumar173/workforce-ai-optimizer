# Database Schema Documentation

The TeamPulse Intelligence database is designed as a fully normalized relational PostgreSQL database implemented in `supabase/migrations/20260215000001_create_schema.sql`.

## Table Inventory (16 Core Tables)

| # | Table Name | Purpose | Key Columns |
|---|------------|---------|-------------|
| 1 | `profiles` | System identity & RBAC role mapping | `id`, `auth_user_id`, `email`, `full_name`, `role` (`ADMIN`, `EMPLOYER`, `EMPLOYEE`), `status` |
| 2 | `skills` | Standardized competency directory | `id`, `name`, `category`, `description` |
| 3 | `employees` | Workforce personnel directory | `id`, `employee_code`, `full_name`, `email`, `job_title`, `department`, `weekly_capacity_hours`, `current_status` |
| 4 | `employee_skills` | Personnel skill associations & evidence | `id`, `employee_id`, `skill_id`, `proficiency_level` (1-5), `is_verified`, `evidence` |
| 5 | `projects` | Enterprise initiatives | `id`, `name`, `department`, `priority`, `status`, `start_date`, `deadline`, `requested_team_size`, `progress_percentage`, `budget` |
| 6 | `project_requirements` | Project competency constraints | `id`, `project_id`, `skill_id`, `min_proficiency`, `importance` (`NICE_TO_HAVE`, `IMPORTANT`, `CRITICAL`) |
| 7 | `assignments` | Approved and active project staffing | `id`, `project_id`, `employee_id`, `assigned_role`, `allocation_percentage`, `allocated_hours_per_week`, `status` |
| 8 | `workload_allocations` | Temporal week-by-week allocations | `id`, `employee_id`, `project_id`, `week_start_date`, `allocated_hours`, `utilization_percentage`, `status` |
| 9 | `team_recommendations` | AI recommendation outputs | `id`, `project_id`, `algorithm_version`, `overall_score`, `skill_coverage_score`, `workload_safety_score`, `status` |
| 10 | `recommendation_members` | Recommended candidate members | `id`, `recommendation_id`, `employee_id`, `suggested_role`, `match_score`, `allocated_percentage`, `match_reasons` |
| 11 | `training_resources` | Curated upskilling catalog | `id`, `skill_id`, `title`, `provider`, `resource_url`, `difficulty`, `estimated_hours` |
| 12 | `development_goals` | Personnel career progression targets | `id`, `employee_id`, `target_skill_id`, `goal_title`, `status`, `progress_percentage`, `target_date` |
| 13 | `reviews` | Periodic performance evaluations | `id`, `employee_id`, `reviewer_id`, `review_type`, `review_period`, `rating`, `strengths`, `growth_areas` |
| 14 | `one_on_one_meetings` | Manager coaching pulse sessions | `id`, `employee_id`, `manager_id`, `meeting_date`, `agenda`, `status` |
| 15 | `notifications` | System alerts & deadline reminders | `id`, `recipient_id`, `title`, `message`, `type`, `is_read`, `created_at` |
| 16 | `audit_logs` | Immutable decision audit logs | `id`, `actor_name`, `action`, `entity_type`, `entity_id`, `metadata`, `created_at` |

## Row Level Security (RLS) Policies
- All tables have RLS enabled.
- Public read access is permitted for active profiles, skill catalogues, project overviews, and training resources.
- Personal data (e.g. notifications, reviews, development goals) is restricted to the authenticated employee or their authorized reviewer.
- Administrative operations (such as project creation, team recommendation approval, and employee status modification) require the `ADMIN` or `EMPLOYER` role verified by server-side logic and database policies.
