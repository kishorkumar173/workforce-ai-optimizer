-- ============================================================
-- TeamPulse Intelligence - Seed Dataset
-- File: supabase/seed.sql
-- ============================================================

-- 1. Profiles
INSERT INTO public.profiles (id, email, full_name, avatar_url, role, status) VALUES
('a0000000-0000-0000-0000-000000000001', 'sarah.johnson@teampulse.ai', 'Sarah Johnson', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'EMPLOYER', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000002', 'alex.admin@teampulse.ai', 'Alex Rivera', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'ADMIN', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000003', 'john.doe@teampulse.ai', 'John Doe', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'EMPLOYEE', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000004', 'emily.clark@teampulse.ai', 'Emily Clark', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'EMPLOYEE', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000005', 'michael.brown@teampulse.ai', 'Michael Brown', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'EMPLOYER', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000006', 'sophia.lee@teampulse.ai', 'Sophia Lee', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'EMPLOYEE', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- 2. Standardized Skills
INSERT INTO public.skills (id, name, category, description) VALUES
('b0000000-0000-0000-0000-000000000001', 'React.js', 'Frontend', 'Modern declarative UI development, hooks, state management'),
('b0000000-0000-0000-0000-000000000002', 'TypeScript', 'Frontend', 'Strongly typed JavaScript, interfaces, generics'),
('b0000000-0000-0000-0000-000000000003', 'Node.js & Express', 'Backend', 'Asynchronous REST APIs, microservices, runtime management'),
('b0000000-0000-0000-0000-000000000004', 'PostgreSQL & SQL', 'Backend', 'Relational database modeling, query optimization, indexing'),
('b0000000-0000-0000-0000-000000000005', 'Python', 'Backend', 'Scripting, backend service development, data pipelines'),
('b0000000-0000-0000-0000-000000000006', 'LLM & AI Prompting', 'AI/ML', 'Generative models, RAG pipelines, fine-tuning and embeddings'),
('b0000000-0000-0000-0000-000000000007', 'PyTorch', 'AI/ML', 'Deep learning framework for neural network training and inference'),
('b0000000-0000-0000-0000-000000000008', 'Docker & Kubernetes', 'DevOps', 'Containerization, cluster orchestration, Helm charts'),
('b0000000-0000-0000-0000-000000000009', 'CI/CD Pipelines', 'DevOps', 'Automated testing and deployment with GitHub Actions / GitLab'),
('b0000000-0000-0000-0000-000000000010', 'UI/UX Design & Figma', 'Design', 'Design systems, wireframing, high-fidelity interactive prototyping'),
('b0000000-0000-0000-0000-000000000011', 'Automated QA & Testing', 'QA', 'E2E testing with Playwright, Cypress, Vitest, test plans'),
('b0000000-0000-0000-0000-000000000012', 'Agile & Project Leadership', 'Management', 'Scrum ceremonies, risk mitigation, stakeholder management')
ON CONFLICT (name) DO NOTHING;

-- 3. Core Employees
INSERT INTO public.employees (id, profile_id, employee_code, full_name, email, job_title, department, years_of_experience, weekly_capacity_hours, current_status, employment_status, avatar_url, location) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'EMP-1001', 'John Doe', 'john.doe@teampulse.ai', 'Senior Full Stack Developer', 'Development', 6.5, 40.0, 'Available', 'ACTIVE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'San Francisco, CA'),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'EMP-1002', 'Emily Clark', 'emily.clark@teampulse.ai', 'Lead UI/UX Designer', 'Design', 5.0, 40.0, 'In a Meeting', 'ACTIVE', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'New York, NY'),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005', 'EMP-1003', 'Michael Brown', 'michael.brown@teampulse.ai', 'Senior Project Manager', 'Management', 8.0, 40.0, 'On Leave', 'ACTIVE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Austin, TX'),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000006', 'EMP-1004', 'Sophia Lee', 'sophia.lee@teampulse.ai', 'Lead QA Automation Engineer', 'QA', 4.5, 40.0, 'Available', 'ACTIVE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Seattle, WA'),
('c0000000-0000-0000-0000-000000000005', NULL, 'EMP-1005', 'David Kim', 'david.kim@teampulse.ai', 'Staff DevOps Engineer', 'Operations', 7.0, 40.0, 'Available', 'ACTIVE', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'Chicago, IL'),
('c0000000-0000-0000-0000-000000000006', NULL, 'EMP-1006', 'Priya Patel', 'priya.patel@teampulse.ai', 'AI/ML Research Engineer', 'Development', 5.5, 40.0, 'Available', 'ACTIVE', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Boston, MA'),
('c0000000-0000-0000-0000-000000000007', NULL, 'EMP-1007', 'Carlos Rodriguez', 'carlos.r@teampulse.ai', 'Backend Systems Engineer', 'Development', 4.0, 40.0, 'Busy', 'ACTIVE', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'Miami, FL'),
('c0000000-0000-0000-0000-000000000008', NULL, 'EMP-1008', 'Aisha Bello', 'aisha.b@teampulse.ai', 'Product Growth & Marketing', 'Marketing', 3.5, 40.0, 'Available', 'ACTIVE', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150', 'London, UK')
ON CONFLICT (employee_code) DO NOTHING;

-- 4. Employee Skills
INSERT INTO public.employee_skills (employee_id, skill_id, proficiency_level, is_verified, evidence) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 5, TRUE, 'Architected enterprise React 18 component design system'),
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 5, TRUE, 'Authored core TypeScript definitions and compiler configurations'),
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 4, TRUE, 'Built scalable microservices handling 20K req/sec'),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000010', 5, TRUE, 'Figma Certified Design Leader with 50+ published design tokens'),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000012', 5, TRUE, 'PMP & Certified Scrum Master across 12 delivered enterprise software products'),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000011', 5, TRUE, 'Maintained 94% test automation coverage across web and mobile'),
('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000008', 5, TRUE, 'CKA certified Kubernetes administrator, multi-region AWS setup'),
('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 4, TRUE, 'Engineered automated multi-stage blue-green deployment pipelines'),
('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 5, TRUE, 'Implemented production LLM agents and multi-vector RAG search'),
('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000007', 4, TRUE, 'Published research in transformer fine-tuning for biomedical domains')
ON CONFLICT (employee_id, skill_id) DO NOTHING;

-- 5. Active Projects (matching reference UI)
INSERT INTO public.projects (id, name, description, department, priority, status, start_date, deadline, requested_team_size, progress_percentage, budget) VALUES
('d0000000-0000-0000-0000-000000000001', 'E-Commerce Platform', 'High-scale omnichannel commerce platform with checkout optimization', 'Development', 'HIGH', 'On Track', '2026-01-10', '2026-05-30', 4, 75, 180000.00),
('d0000000-0000-0000-0000-000000000002', 'AI Chatbot Integration', 'Intelligent conversational assistant and customer service orchestration', 'Development', 'CRITICAL', 'In Progress', '2026-02-01', '2026-06-15', 3, 45, 140000.00),
('d0000000-0000-0000-0000-000000000003', 'Mobile App Redesign', 'Complete UX refresh, design system unification and native performance', 'Design', 'HIGH', 'On Track', '2026-01-15', '2026-05-28', 5, 90, 115000.00),
('d0000000-0000-0000-0000-000000000004', 'Marketing Automation', 'Cross-channel attribution, automated customer lifecycle nurturing campaigns', 'Marketing', 'MEDIUM', 'At Risk', '2026-03-01', '2026-06-20', 3, 30, 95000.00),
('d0000000-0000-0000-0000-000000000005', 'HR Management System', 'Core workforce database, compensation planning and talent lifecycle suite', 'Operations', 'MEDIUM', 'In Progress', '2026-02-15', '2026-06-10', 4, 60, 130000.00)
ON CONFLICT (id) DO NOTHING;

-- 6. Project Requirements
INSERT INTO public.project_requirements (project_id, skill_id, min_proficiency, importance, min_employee_count) VALUES
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 4, 'CRITICAL', 1),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 4, 'IMPORTANT', 1),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 3, 'IMPORTANT', 1),
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 4, 'CRITICAL', 1),
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 4, 'CRITICAL', 1),
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 3, 'IMPORTANT', 1)
ON CONFLICT (project_id, skill_id) DO NOTHING;

-- 7. Current Assignments
INSERT INTO public.assignments (id, project_id, employee_id, assigned_role, allocation_percentage, allocated_hours_per_week, start_date, end_date, status) VALUES
('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Lead Architect', 80, 32.0, '2026-01-10', '2026-05-30', 'ACTIVE'),
('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'UI/UX Lead', 60, 24.0, '2026-01-15', '2026-05-28', 'ACTIVE'),
('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000006', 'AI Architect', 70, 28.0, '2026-02-01', '2026-06-15', 'ACTIVE'),
('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'QA Automation Lead', 70, 28.0, '2026-01-10', '2026-05-30', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 8. Training Resources
INSERT INTO public.training_resources (id, skill_id, title, provider, resource_url, difficulty, estimated_hours, description) VALUES
('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Deep Learning Specialization & LLM Agent Engineering', 'DeepLearning.AI', 'https://www.deeplearning.ai/courses', 'Advanced', 40.0, 'Hands-on curriculum mastering transformers, vector retrieval, and model orchestration.'),
('f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000008', 'Production Kubernetes: Security and High Availability', 'Linux Foundation', 'https://training.linuxfoundation.org', 'Advanced', 35.0, 'Complete guide to deploying zero-downtime, compliant container clusters.'),
('f0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'React 18 Architecture & Concurrent Rendering Patterns', 'Frontend Masters', 'https://frontendmasters.com', 'Intermediate', 24.0, 'Master modern server components, suspense boundaries, and high-performance client architectures.')
ON CONFLICT (id) DO NOTHING;

-- 9. Notifications
INSERT INTO public.notifications (id, recipient_id, title, message, type, is_read) VALUES
('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'AI Recommendation Ready', 'AI generated an optimal 3-person team for AI Chatbot Integration with 94% skill coverage.', 'RECOMMENDATION', FALSE),
('10000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Workload Bottleneck Warning', 'Marketing Automation has a resource deficit that may delay the June 20 milestone.', 'WORKLOAD_ALERT', FALSE),
('10000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Milestone Review Due', 'Mobile App Redesign is at 90% progress and ready for final stakeholder sign-off.', 'DEADLINE', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 10. Audit Logs
INSERT INTO public.audit_logs (id, actor_name, action, entity_type, entity_id, metadata) VALUES
('20000000-0000-0000-0000-000000000001', 'Sarah Johnson', 'PROJECT_CREATED', 'PROJECT', 'd0000000-0000-0000-0000-000000000002', '{"name": "AI Chatbot Integration", "priority": "CRITICAL"}'::jsonb),
('20000000-0000-0000-0000-000000000002', 'Sarah Johnson', 'TEAM_RECOMMENDED', 'PROJECT', 'd0000000-0000-0000-0000-000000000002', '{"algorithm": "v2.4-explainable-hybrid", "score": 94.2}'::jsonb),
('20000000-0000-0000-0000-000000000003', 'Alex Rivera', 'ASSIGNMENT_APPROVED', 'ASSIGNMENT', 'e0000000-0000-0000-0000-000000000001', '{"employee": "John Doe", "allocation": 80}'::jsonb)
ON CONFLICT (id) DO NOTHING;
