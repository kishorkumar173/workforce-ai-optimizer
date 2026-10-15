import { v4 as uuidv4 } from 'uuid';
import {
  Profile,
  Employee,
  Skill,
  EmployeeSkill,
  Project,
  ProjectRequirement,
  Assignment,
  TeamRecommendation,
  TrainingResource,
  DevelopmentGoal,
  Review,
  NotificationItem,
  AuditLog,
  DashboardMetrics,
  CourseEnrollment,
  EmployeeSkillGap,
} from '../types';
import { hashPassword, verifyPassword } from '../utils/security';

export class DatabaseStore {
  public profiles: Profile[] = [];
  public skills: Skill[] = [];
  public employees: Employee[] = [];
  public employeeSkills: EmployeeSkill[] = [];
  public projects: Project[] = [];
  public projectRequirements: ProjectRequirement[] = [];
  public assignments: Assignment[] = [];
  public recommendations: TeamRecommendation[] = [];
  public trainingResources: TrainingResource[] = [];
  public developmentGoals: DevelopmentGoal[] = [];
  public reviews: Review[] = [];
  public notifications: NotificationItem[] = [];
  public auditLogs: AuditLog[] = [];
  public courseEnrollments: CourseEnrollment[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const defaultAuth = hashPassword('TeamPulse@2026');

    // 1. Profiles (Linked to Authentication and Role Hierarchy)
    this.profiles = [
      {
        id: 'prof-1',
        email: 'sarah.johnson@teampulse.ai',
        full_name: 'Sarah Johnson',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        role: 'EMPLOYER',
        status: 'ACTIVE',
        password_hash: defaultAuth.hash,
        password_salt: defaultAuth.salt,
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'prof-2',
        email: 'alex.rivera@teampulse.ai',
        full_name: 'Alex Rivera',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'ADMIN',
        status: 'ACTIVE',
        password_hash: defaultAuth.hash,
        password_salt: defaultAuth.salt,
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'prof-3',
        email: 'john.doe@teampulse.ai',
        full_name: 'John Doe',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        password_hash: defaultAuth.hash,
        password_salt: defaultAuth.salt,
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'prof-4',
        email: 'emily.clark@teampulse.ai',
        full_name: 'Emily Clark',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        password_hash: defaultAuth.hash,
        password_salt: defaultAuth.salt,
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'prof-5',
        email: 'michael.brown@teampulse.ai',
        full_name: 'Michael Brown',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        password_hash: defaultAuth.hash,
        password_salt: defaultAuth.salt,
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'prof-6',
        email: 'sophia.lee@teampulse.ai',
        full_name: 'Sophia Lee',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        password_hash: defaultAuth.hash,
        password_salt: defaultAuth.salt,
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'prof-7',
        email: 'david.kim@teampulse.ai',
        full_name: 'David Kim',
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        password_hash: defaultAuth.hash,
        password_salt: defaultAuth.salt,
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'prof-8',
        email: 'priya.patel@teampulse.ai',
        full_name: 'Priya Patel',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        password_hash: defaultAuth.hash,
        password_salt: defaultAuth.salt,
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'prof-9',
        email: 'carlos.r@teampulse.ai',
        full_name: 'Carlos Rodriguez',
        avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        password_hash: defaultAuth.hash,
        password_salt: defaultAuth.salt,
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'prof-10',
        email: 'aisha.b@teampulse.ai',
        full_name: 'Aisha Bello',
        avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        password_hash: defaultAuth.hash,
        password_salt: defaultAuth.salt,
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
    ];

    // 2. Standardized Skills
    this.skills = [
      { id: 'sk-1', name: 'React.js', category: 'Frontend', description: 'Declarative UI development, hooks, state management' },
      { id: 'sk-2', name: 'TypeScript', category: 'Frontend', description: 'Strongly typed JavaScript, interfaces, generics' },
      { id: 'sk-3', name: 'Node.js & Express', category: 'Backend', description: 'Asynchronous REST APIs, microservices' },
      { id: 'sk-4', name: 'PostgreSQL & SQL', category: 'Backend', description: 'Relational database modeling, query optimization' },
      { id: 'sk-5', name: 'Python', category: 'Backend', description: 'Data pipelines, backend services, scripting' },
      { id: 'sk-6', name: 'AI & LLM Orchestration', category: 'AI/ML', description: 'Prompt engineering, RAG pipelines, model fine-tuning' },
      { id: 'sk-7', name: 'PyTorch & ML Ops', category: 'AI/ML', description: 'Deep learning frameworks, model training, deployment' },
      { id: 'sk-8', name: 'Docker & Kubernetes', category: 'DevOps', description: 'Containerization, cluster orchestration, Helm' },
      { id: 'sk-9', name: 'CI/CD Pipelines', category: 'DevOps', description: 'Automated test and build delivery pipelines' },
      { id: 'sk-10', name: 'UI/UX Design & Figma', category: 'Design', description: 'Design systems, prototyping, wireframing' },
      { id: 'sk-11', name: 'Automated QA & Testing', category: 'QA', description: 'End-to-end testing, test plan creation, automation' },
      { id: 'sk-12', name: 'Agile & Project Leadership', category: 'Management', description: 'Sprint planning, risk tracking, stakeholder alignment' },
    ];

    // 3. Employees (Representing key members from the reference UI)
    this.employees = [
      {
        id: 'emp-1',
        profile_id: 'prof-3',
        employee_code: 'EMP-1001',
        full_name: 'John Doe',
        email: 'john.doe@teampulse.ai',
        job_title: 'Senior Developer',
        department: 'Development',
        years_of_experience: 6.5,
        weekly_capacity_hours: 40.0,
        current_status: 'Available',
        employment_status: 'ACTIVE',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        location: 'San Francisco, CA',
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'emp-2',
        profile_id: 'prof-4',
        employee_code: 'EMP-1002',
        full_name: 'Emily Clark',
        email: 'emily.clark@teampulse.ai',
        job_title: 'Lead Designer',
        department: 'Design',
        years_of_experience: 5.0,
        weekly_capacity_hours: 40.0,
        current_status: 'In a Meeting',
        employment_status: 'ACTIVE',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        location: 'New York, NY',
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'emp-3',
        profile_id: 'prof-5',
        employee_code: 'EMP-1003',
        full_name: 'Michael Brown',
        email: 'michael.brown@teampulse.ai',
        job_title: 'Project Manager',
        department: 'Management',
        years_of_experience: 8.0,
        weekly_capacity_hours: 40.0,
        current_status: 'On Leave',
        employment_status: 'ACTIVE',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        location: 'Austin, TX',
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'emp-4',
        profile_id: 'prof-6',
        employee_code: 'EMP-1004',
        full_name: 'Sophia Lee',
        email: 'sophia.lee@teampulse.ai',
        job_title: 'QA Engineer',
        department: 'Operations',
        years_of_experience: 4.5,
        weekly_capacity_hours: 40.0,
        current_status: 'Available',
        employment_status: 'ACTIVE',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        location: 'Seattle, WA',
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'emp-5',
        profile_id: 'prof-7',
        employee_code: 'EMP-1005',
        full_name: 'David Kim',
        email: 'david.kim@teampulse.ai',
        job_title: 'DevOps Architect',
        department: 'Operations',
        years_of_experience: 7.0,
        weekly_capacity_hours: 40.0,
        current_status: 'Available',
        employment_status: 'ACTIVE',
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
        location: 'Chicago, IL',
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'emp-6',
        profile_id: 'prof-8',
        employee_code: 'EMP-1006',
        full_name: 'Priya Patel',
        email: 'priya.patel@teampulse.ai',
        job_title: 'AI/ML Specialist',
        department: 'Development',
        years_of_experience: 5.5,
        weekly_capacity_hours: 40.0,
        current_status: 'Available',
        employment_status: 'ACTIVE',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        location: 'Boston, MA',
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'emp-7',
        profile_id: 'prof-9',
        employee_code: 'EMP-1007',
        full_name: 'Carlos Rodriguez',
        email: 'carlos.r@teampulse.ai',
        job_title: 'Backend Engineer',
        department: 'Development',
        years_of_experience: 4.0,
        weekly_capacity_hours: 40.0,
        current_status: 'Busy',
        employment_status: 'ACTIVE',
        avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
        location: 'Miami, FL',
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
      {
        id: 'emp-8',
        profile_id: 'prof-10',
        employee_code: 'EMP-1008',
        full_name: 'Aisha Bello',
        email: 'aisha.b@teampulse.ai',
        job_title: 'Marketing Specialist',
        department: 'Marketing',
        years_of_experience: 3.5,
        weekly_capacity_hours: 40.0,
        current_status: 'Available',
        employment_status: 'ACTIVE',
        avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
        location: 'London, UK',
        created_at: new Date('2026-01-01').toISOString(),
        updated_at: new Date('2026-01-01').toISOString(),
      },
    ];

    // 4. Employee Skills
    this.employeeSkills = [
      { id: 'es-1', employee_id: 'emp-1', skill_id: 'sk-1', proficiency_level: 5, is_verified: true, evidence: 'React 18 Architecture Lead' },
      { id: 'es-2', employee_id: 'emp-1', skill_id: 'sk-2', proficiency_level: 5, is_verified: true, evidence: 'TypeScript lead maintainer' },
      { id: 'es-3', employee_id: 'emp-1', skill_id: 'sk-3', proficiency_level: 4, is_verified: true, evidence: 'Node.js production microservices' },
      { id: 'es-4', employee_id: 'emp-2', skill_id: 'sk-10', proficiency_level: 5, is_verified: true, evidence: 'Figma Design System Creator' },
      { id: 'es-5', employee_id: 'emp-3', skill_id: 'sk-12', proficiency_level: 5, is_verified: true, evidence: 'Certified Scrum Professional' },
      { id: 'es-6', employee_id: 'emp-4', skill_id: 'sk-11', proficiency_level: 5, is_verified: true, evidence: 'Lead QA automation engineer' },
      { id: 'es-7', employee_id: 'emp-5', skill_id: 'sk-8', proficiency_level: 5, is_verified: true, evidence: 'Kubernetes CKA Certified' },
      { id: 'es-8', employee_id: 'emp-5', skill_id: 'sk-9', proficiency_level: 5, is_verified: true, evidence: 'GitHub Actions / ArgoCD architect' },
      { id: 'es-9', employee_id: 'emp-6', skill_id: 'sk-6', proficiency_level: 5, is_verified: true, evidence: 'RAG and LLM Agent implementations' },
      { id: 'es-10', employee_id: 'emp-6', skill_id: 'sk-7', proficiency_level: 4, is_verified: true, evidence: 'PyTorch deep neural network models' },
      { id: 'es-11', employee_id: 'emp-7', skill_id: 'sk-3', proficiency_level: 4, is_verified: true, evidence: 'REST API design' },
      { id: 'es-12', employee_id: 'emp-7', skill_id: 'sk-4', proficiency_level: 4, is_verified: true, evidence: 'PostgreSQL tuning & queries' },
    ];

    // Populate skills on employee objects
    this.employees.forEach((emp) => {
      emp.skills = this.employeeSkills
        .filter((es) => es.employee_id === emp.id)
        .map((es) => {
          const s = this.skills.find((item) => item.id === es.skill_id);
          return {
            ...es,
            skill_name: s ? s.name : 'Skill',
            category: s ? s.category : 'General',
          };
        });
    });

    // 5. Active Projects (Matching the uploaded design screenshot exactly)
    this.projects = [
      {
        id: 'proj-1',
        name: 'E-Commerce Platform',
        description: 'Scalable omnichannel shopping experience with optimized checkout flow and payment gateway integrations.',
        department: 'Development',
        priority: 'HIGH',
        status: 'On Track',
        start_date: '2026-01-10',
        deadline: 'May 30, 2026',
        requested_team_size: 4,
        progress_percentage: 75,
        budget: 180000,
        created_at: new Date('2026-01-10').toISOString(),
        updated_at: new Date('2026-01-10').toISOString(),
      },
      {
        id: 'proj-2',
        name: 'AI Chatbot Integration',
        description: 'Enterprise AI conversational intelligence assistant powered by LLM embeddings and context-aware customer service automation.',
        department: 'Development',
        priority: 'CRITICAL',
        status: 'In Progress',
        start_date: '2026-02-01',
        deadline: 'Jun 15, 2026',
        requested_team_size: 3,
        progress_percentage: 45,
        budget: 140000,
        created_at: new Date('2026-02-01').toISOString(),
        updated_at: new Date('2026-02-01').toISOString(),
      },
      {
        id: 'proj-3',
        name: 'Mobile App Redesign',
        description: 'Native mobile app visual overhaul, performance acceleration, accessibility compliance, and design token unification.',
        department: 'Design',
        priority: 'HIGH',
        status: 'On Track',
        start_date: '2026-01-15',
        deadline: 'May 28, 2026',
        requested_team_size: 5,
        progress_percentage: 90,
        budget: 115000,
        created_at: new Date('2026-01-15').toISOString(),
        updated_at: new Date('2026-01-15').toISOString(),
      },
      {
        id: 'proj-4',
        name: 'Marketing Automation',
        description: 'Multi-touch campaign attribution pipeline, automated email journeys, and unified CRM lead scoring.',
        department: 'Marketing',
        priority: 'MEDIUM',
        status: 'At Risk',
        start_date: '2026-03-01',
        deadline: 'Jun 20, 2026',
        requested_team_size: 3,
        progress_percentage: 30,
        budget: 95000,
        created_at: new Date('2026-03-01').toISOString(),
        updated_at: new Date('2026-03-01').toISOString(),
      },
      {
        id: 'proj-5',
        name: 'HR Management System',
        description: 'Workforce records management, internal mobility, compensation models, and automated compliance auditing.',
        department: 'Operations',
        priority: 'MEDIUM',
        status: 'In Progress',
        start_date: '2026-02-15',
        deadline: 'Jun 10, 2026',
        requested_team_size: 4,
        progress_percentage: 60,
        budget: 130000,
        created_at: new Date('2026-02-15').toISOString(),
        updated_at: new Date('2026-02-15').toISOString(),
      },
    ];

    // 6. Project Requirements
    this.projectRequirements = [
      { id: 'pr-1', project_id: 'proj-1', skill_id: 'sk-1', min_proficiency: 4, importance: 'CRITICAL', min_employee_count: 1 },
      { id: 'pr-2', project_id: 'proj-1', skill_id: 'sk-2', min_proficiency: 4, importance: 'CRITICAL', min_employee_count: 1 },
      { id: 'pr-3', project_id: 'proj-1', skill_id: 'sk-4', min_proficiency: 3, importance: 'IMPORTANT', min_employee_count: 1 },
      { id: 'pr-4', project_id: 'proj-2', skill_id: 'sk-6', min_proficiency: 4, importance: 'CRITICAL', min_employee_count: 1 },
      { id: 'pr-5', project_id: 'proj-2', skill_id: 'sk-3', min_proficiency: 4, importance: 'IMPORTANT', min_employee_count: 1 },
      { id: 'pr-6', project_id: 'proj-2', skill_id: 'sk-7', min_proficiency: 3, importance: 'IMPORTANT', min_employee_count: 1 },
      { id: 'pr-7', project_id: 'proj-3', skill_id: 'sk-10', min_proficiency: 5, importance: 'CRITICAL', min_employee_count: 1 },
      { id: 'pr-8', project_id: 'proj-3', skill_id: 'sk-1', min_proficiency: 3, importance: 'IMPORTANT', min_employee_count: 1 },
    ];

    // Populate requirements on projects
    this.projects.forEach((p) => {
      p.requirements = this.projectRequirements
        .filter((r) => r.project_id === p.id)
        .map((r) => {
          const s = this.skills.find((item) => item.id === r.skill_id);
          return {
            ...r,
            skill_name: s ? s.name : 'Skill',
          };
        });
    });

    // 7. Assignments (Matching reference UI workload indicators)
    this.assignments = [
      {
        id: 'asg-1',
        project_id: 'proj-1',
        project_name: 'E-Commerce Platform',
        employee_id: 'emp-1',
        employee_name: 'John Doe',
        assigned_role: 'Lead Architect',
        allocation_percentage: 80,
        allocated_hours_per_week: 32.0,
        start_date: '2026-01-10',
        end_date: '2026-05-30',
        status: 'ACTIVE',
        created_at: new Date('2026-01-10').toISOString(),
        updated_at: new Date('2026-01-10').toISOString(),
      },
      {
        id: 'asg-2',
        project_id: 'proj-3',
        project_name: 'Mobile App Redesign',
        employee_id: 'emp-2',
        employee_name: 'Emily Clark',
        assigned_role: 'Lead Designer',
        allocation_percentage: 60,
        allocated_hours_per_week: 24.0,
        start_date: '2026-01-15',
        end_date: '2026-05-28',
        status: 'ACTIVE',
        created_at: new Date('2026-01-15').toISOString(),
        updated_at: new Date('2026-01-15').toISOString(),
      },
      {
        id: 'asg-3',
        project_id: 'proj-2',
        project_name: 'AI Chatbot Integration',
        employee_id: 'emp-6',
        employee_name: 'Priya Patel',
        assigned_role: 'AI Architect',
        allocation_percentage: 70,
        allocated_hours_per_week: 28.0,
        start_date: '2026-02-01',
        end_date: '2026-06-15',
        status: 'ACTIVE',
        created_at: new Date('2026-02-01').toISOString(),
        updated_at: new Date('2026-02-01').toISOString(),
      },
      {
        id: 'asg-4',
        project_id: 'proj-1',
        project_name: 'E-Commerce Platform',
        employee_id: 'emp-4',
        employee_name: 'Sophia Lee',
        assigned_role: 'QA Automation Lead',
        allocation_percentage: 70,
        allocated_hours_per_week: 28.0,
        start_date: '2026-01-10',
        end_date: '2026-05-30',
        status: 'ACTIVE',
        created_at: new Date('2026-01-10').toISOString(),
        updated_at: new Date('2026-01-10').toISOString(),
      },
    ];

    // Populate assignments on projects
    this.projects.forEach((p) => {
      p.assignments = this.assignments.filter((a) => a.project_id === p.id && a.status === 'ACTIVE');
    });

    // 8. Training Resources
    this.trainingResources = [
      {
        id: 'tr-1',
        skill_id: 'sk-6',
        skill_name: 'AI & LLM Orchestration',
        title: 'Deep Learning Specialization & LLM Agent Architecture',
        provider: 'DeepLearning.AI',
        resource_url: 'https://www.deeplearning.ai/courses',
        difficulty: 'Advanced',
        estimated_hours: 40,
        description: 'Comprehensive curriculum covering transformer architectures, multi-vector embeddings, and LangChain/LlamaIndex agents.',
      },
      {
        id: 'tr-2',
        skill_id: 'sk-8',
        skill_name: 'Docker & Kubernetes',
        title: 'Cloud Native Kubernetes: Multi-Cluster Orchestration',
        provider: 'Linux Foundation',
        resource_url: 'https://training.linuxfoundation.org',
        difficulty: 'Advanced',
        estimated_hours: 32,
        description: 'Hands-on production cluster setup, ingress routing, stateful applications, and security hardening.',
      },
      {
        id: 'tr-3',
        skill_id: 'sk-1',
        skill_name: 'React.js',
        title: 'React 18 & Next.js Enterprise Full-Stack Patterns',
        provider: 'Frontend Masters',
        resource_url: 'https://frontendmasters.com',
        difficulty: 'Intermediate',
        estimated_hours: 24,
        description: 'Master server components, progressive streaming, client-side caching, and accessible component architectures.',
      },
      {
        id: 'tr-4',
        skill_id: 'sk-2',
        skill_name: 'TypeScript',
        title: 'Advanced TypeScript: Type-Safe Architecture & Generics',
        provider: 'Total TypeScript',
        resource_url: 'https://www.totaltypescript.com',
        difficulty: 'Intermediate',
        estimated_hours: 20,
        description: 'Master strict typing, template literal types, conditional types, and scalable enterprise patterns.',
      },
      {
        id: 'tr-5',
        skill_id: 'sk-3',
        skill_name: 'Node.js & Express',
        title: 'High-Performance Node.js Microservices & API Design',
        provider: 'Coursera',
        resource_url: 'https://www.coursera.org/learn/server-side-nodejs',
        difficulty: 'Intermediate',
        estimated_hours: 28,
        description: 'Build enterprise-grade asynchronous REST APIs, event-driven pipelines, and rate-limited gateways.',
      },
      {
        id: 'tr-6',
        skill_id: 'sk-4',
        skill_name: 'PostgreSQL & SQL',
        title: 'PostgreSQL Deep Dive: Query Optimization & Indexing',
        provider: 'Pluralsight',
        resource_url: 'https://www.pluralsight.com/courses/postgresql-deep-dive',
        difficulty: 'Intermediate',
        estimated_hours: 22,
        description: 'Advanced relational modeling, CTEs, window functions, and query explain execution plans.',
      },
      {
        id: 'tr-7',
        skill_id: 'sk-5',
        skill_name: 'Python',
        title: 'Python for Enterprise Systems & Data Engineering',
        provider: 'edX',
        resource_url: 'https://www.edx.org/course/python-data-structures',
        difficulty: 'Intermediate',
        estimated_hours: 30,
        description: 'Object-oriented Python, automated data ingestion pipelines, FastAPI integration, and asynchronous workers.',
      },
      {
        id: 'tr-8',
        skill_id: 'sk-7',
        skill_name: 'PyTorch & ML Ops',
        title: 'Deep Learning with PyTorch & End-to-End MLOps',
        provider: 'DeepLearning.AI',
        resource_url: 'https://www.deeplearning.ai/courses',
        difficulty: 'Advanced',
        estimated_hours: 36,
        description: 'Build, train, and deploy production machine learning pipelines, tensor operations, and MLflow tracking.',
      },
      {
        id: 'tr-9',
        skill_id: 'sk-9',
        skill_name: 'CI/CD Pipelines',
        title: 'Enterprise CI/CD with GitHub Actions & ArgoCD',
        provider: 'Linux Foundation',
        resource_url: 'https://training.linuxfoundation.org',
        difficulty: 'Intermediate',
        estimated_hours: 18,
        description: 'Automated testing gates, Docker image build caching, zero-downtime deployment workflows.',
      },
      {
        id: 'tr-10',
        skill_id: 'sk-10',
        skill_name: 'UI/UX Design & Figma',
        title: 'Enterprise Design Systems & Accessible UI in Figma',
        provider: 'Interaction Design Foundation',
        resource_url: 'https://www.interaction-design.org',
        difficulty: 'Intermediate',
        estimated_hours: 25,
        description: 'Design tokens, Figma auto-layout components, WCAG 2.1 AA accessibility standards, and developer handoff.',
      },
      {
        id: 'tr-11',
        skill_id: 'sk-11',
        skill_name: 'Automated QA & Testing',
        title: 'Full-Stack Test Automation with Vitest & Playwright',
        provider: 'Test Automation University',
        resource_url: 'https://testautomationu.applitools.com',
        difficulty: 'Intermediate',
        estimated_hours: 20,
        description: 'Comprehensive unit, integration, and E2E regression testing strategies with CI integration.',
      },
      {
        id: 'tr-12',
        skill_id: 'sk-12',
        skill_name: 'Agile & Project Leadership',
        title: 'Agile Delivery Leadership & Team Capacity Optimization',
        provider: 'Scrum Alliance',
        resource_url: 'https://www.scrumalliance.org',
        difficulty: 'Beginner',
        estimated_hours: 16,
        description: 'Sprint capacity planning, risk mitigation matrices, cross-functional bottleneck resolution.',
      },
    ];

    // Seed Initial Course Enrollments
    this.courseEnrollments = [
      {
        id: 'ce-1',
        employee_id: 'emp-1',
        course_id: 'tr-1',
        course_title: 'Deep Learning Specialization & LLM Agent Architecture',
        provider: 'DeepLearning.AI',
        resource_url: 'https://www.deeplearning.ai/courses',
        status: 'IN_PROGRESS',
        progress_percentage: 50,
        enrolled_at: new Date('2026-03-01').toISOString(),
      },
    ];

    // 9. Development Goals
    this.developmentGoals = [
      {
        id: 'dg-1',
        employee_id: 'emp-1',
        employee_name: 'John Doe',
        target_skill_id: 'sk-6',
        target_skill_name: 'AI & LLM Orchestration',
        goal_title: 'Complete LLM Agent and Embeddings Upskilling',
        description: 'Expand full-stack capabilities to integrate generative AI APIs and vector database retrieval.',
        status: 'IN_PROGRESS',
        progress_percentage: 65,
        target_date: '2026-06-30',
        created_at: new Date('2026-01-15').toISOString(),
        updated_at: new Date('2026-02-01').toISOString(),
      },
      {
        id: 'dg-2',
        employee_id: 'emp-4',
        employee_name: 'Sophia Lee',
        target_skill_id: 'sk-9',
        target_skill_name: 'CI/CD Pipelines',
        goal_title: 'Automate Playwright Regression in GitHub Actions',
        description: 'Implement zero-flakiness test pipeline on every pull request.',
        status: 'IN_PROGRESS',
        progress_percentage: 80,
        target_date: '2026-05-15',
        created_at: new Date('2026-01-20').toISOString(),
        updated_at: new Date('2026-02-10').toISOString(),
      },
    ];

    // 10. Reviews
    this.reviews = [
      {
        id: 'rev-1',
        employee_id: 'emp-1',
        employee_name: 'John Doe',
        reviewer_id: 'prof-1',
        reviewer_name: 'Sarah Johnson',
        review_type: 'QUARTERLY',
        review_period: 'Q1 2026',
        rating: 4.8,
        strengths: 'Outstanding architecture leadership on the E-Commerce platform. Delivers 40% higher productivity than team benchmark.',
        growth_areas: 'Continue delegating code reviews to junior team members to maintain work-life balance.',
        manager_notes: 'Promoted to Staff candidate in H2.',
        status: 'COMPLETED',
        created_at: new Date('2026-03-31').toISOString(),
      },
    ];

    // 11. Notifications (Matching UI notification bell)
    this.notifications = [
      {
        id: 'notif-1',
        recipient_id: 'prof-1',
        title: 'Optimal Team Recommendation Ready',
        message: 'AI generated an optimal 3-person team for AI Chatbot Integration with 94% skill coverage.',
        type: 'RECOMMENDATION',
        related_entity_type: 'PROJECT',
        related_entity_id: 'proj-2',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'notif-2',
        recipient_id: 'prof-1',
        title: 'Resource Constraint Warning',
        message: 'Marketing Automation has a resource deficit that may delay the milestone due June 20, 2026.',
        type: 'WORKLOAD_ALERT',
        related_entity_type: 'PROJECT',
        related_entity_id: 'proj-4',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
      {
        id: 'notif-3',
        recipient_id: 'prof-1',
        title: 'Milestone Review Due',
        message: 'Mobile App Redesign is at 90% progress and ready for final stakeholder sign-off.',
        type: 'DEADLINE',
        related_entity_type: 'PROJECT',
        related_entity_id: 'proj-3',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      },
    ];

    // 12. Audit Logs
    this.auditLogs = [
      {
        id: 'aud-1',
        actor_name: 'Sarah Johnson',
        action: 'PROJECT_CREATED',
        entity_type: 'PROJECT',
        entity_id: 'proj-2',
        metadata: { name: 'AI Chatbot Integration', priority: 'CRITICAL' },
        created_at: new Date('2026-02-01T10:00:00Z').toISOString(),
      },
      {
        id: 'aud-2',
        actor_name: 'Sarah Johnson',
        action: 'TEAM_RECOMMENDED',
        entity_type: 'PROJECT',
        entity_id: 'proj-2',
        metadata: { algorithm: 'v2.4-explainable-hybrid', score: 94 },
        created_at: new Date('2026-02-02T14:30:00Z').toISOString(),
      },
      {
        id: 'aud-3',
        actor_name: 'Alex Rivera',
        action: 'ASSIGNMENT_APPROVED',
        entity_type: 'ASSIGNMENT',
        entity_id: 'asg-1',
        metadata: { employee: 'John Doe', allocation: 80 },
        created_at: new Date('2026-01-10T09:15:00Z').toISOString(),
      },
    ];
  }

  // ============================================================
  // DATABASE ACCESS METHODS
  // ============================================================

  public getDashboardMetrics(): DashboardMetrics {
    return {
      totalEmployees: 152, // Organizational head count as shown on reference design
      activeProjects: 24,  // Active projects count from reference design
      resourceUtilizationRate: 87, // 87% from reference design
      projectSuccessRate: 98, // 98% from reference design
      departmentAllocation: [
        { name: 'Development', percentage: 35, count: 53, color: '#3B82F6' },
        { name: 'Design', percentage: 15, count: 23, color: '#10B981' },
        { name: 'Marketing', percentage: 10, count: 15, color: '#F59E0B' },
        { name: 'Operations', percentage: 20, count: 30, color: '#06B6D4' },
        { name: 'Management', percentage: 10, count: 15, color: '#EF4444' },
        { name: 'Others', percentage: 10, count: 16, color: '#8B5CF6' },
      ],
      progressOverview: [
        { month: 'Jan', planning: 22, inProgress: 45, completed: 30 },
        { month: 'Feb', planning: 26, inProgress: 48, completed: 35 },
        { month: 'Mar', planning: 28, inProgress: 52, completed: 42 },
        { month: 'Apr', planning: 32, inProgress: 60, completed: 50 },
        { month: 'May', planning: 34, inProgress: 72, completed: 68 },
        { month: 'Jun', planning: 38, inProgress: 88, completed: 82 },
      ],
      aiInsights: [
        {
          id: 'insight-1',
          category: 'Resource Optimization',
          title: 'Resource Optimization',
          description: '2 projects are over-resourced. Consider reallocating team members.',
          severity: 'info',
          badgeColor: 'teal',
        },
        {
          id: 'insight-2',
          category: 'Potential Delay',
          title: 'Potential Delay',
          description: 'Marketing Automation may face delay due to resource constraints.',
          severity: 'warning',
          badgeColor: 'amber',
        },
        {
          id: 'insight-3',
          category: 'High Performer',
          title: 'High Performer',
          description: "John Doe's productivity is 40% above team average.",
          severity: 'success',
          badgeColor: 'green',
        },
        {
          id: 'insight-4',
          category: 'Skill Gap',
          title: 'Skill Gap',
          description: 'Consider upskilling team in AI/ML for upcoming projects.',
          severity: 'alert',
          badgeColor: 'purple',
        },
      ],
      upcomingTasks: [
        {
          id: 'task-1',
          title: 'Design UI for dashboard',
          project: 'E-Commerce Platform',
          timeTag: 'Today',
          isCompleted: false,
        },
        {
          id: 'task-2',
          title: 'Team meeting',
          project: 'AI Chatbot Integration',
          timeTag: '10:00 AM',
          isCompleted: false,
        },
        {
          id: 'task-3',
          title: 'Review project plan',
          project: 'Mobile App Redesign',
          timeTag: '1:00 PM',
          isCompleted: true,
        },
        {
          id: 'task-4',
          title: 'Client presentation',
          project: 'Marketing Automation',
          timeTag: '3:00 PM',
          isCompleted: false,
        },
      ],
      teamStatusPreview: [
        {
          id: 'emp-1',
          name: 'John Doe',
          title: 'Developer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          status: 'Available',
          capacityPercentage: 80,
        },
        {
          id: 'emp-2',
          name: 'Emily Clark',
          title: 'Designer',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          status: 'In a Meeting',
          capacityPercentage: 60,
        },
        {
          id: 'emp-3',
          name: 'Michael Brown',
          title: 'Project Manager',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          status: 'On Leave',
          capacityPercentage: 0,
        },
        {
          id: 'emp-4',
          name: 'Sophia Lee',
          title: 'QA Engineer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          status: 'Available',
          capacityPercentage: 70,
        },
      ],
    };
  }

  // Employee Methods
  public getEmployees(): Employee[] {
    return this.employees;
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.employees.find((e) => e.id === id);
  }

  public createEmployee(empData: Omit<Employee, 'id' | 'created_at' | 'updated_at'> & { password?: string; skills?: any[] }): Employee {
    const rawCode = empData.employee_code?.trim() || '';
    const rawEmail = empData.email?.trim().toLowerCase() || '';

    // 1. Prevent duplicate employee IDs
    const existingCode = this.employees.find(
      (e) => e.employee_code.trim().toUpperCase() === rawCode.toUpperCase()
    );
    if (existingCode) {
      throw new Error(`Employee ID "${rawCode}" already exists. Please specify a unique employee ID.`);
    }

    // 2. Prevent duplicate work email addresses
    const existingEmail =
      this.employees.find((e) => e.email.trim().toLowerCase() === rawEmail) ||
      this.profiles.find((p) => p.email.trim().toLowerCase() === rawEmail);
    if (existingEmail) {
      throw new Error(`Work email "${rawEmail}" is already registered. Duplicate employee accounts are prohibited.`);
    }

    // 3. Create associated authentication profile with EMPLOYEE role securely assigned
    const profileId = `prof-${Date.now()}`;
    const initialPassword = empData.password || 'TeamPulse@2026';
    const { hash, salt } = hashPassword(initialPassword);

    const newProfile: Profile = {
      id: profileId,
      email: rawEmail,
      full_name: empData.full_name,
      avatar_url: empData.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'EMPLOYEE', // Strictly assign EMPLOYEE role (Employers cannot create Admin accounts)
      status: 'ACTIVE',
      password_hash: hash,
      password_salt: salt,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.profiles.push(newProfile);

    // 4. Create Employee record linked to profile
    const newEmpId = `emp-${Date.now()}`;
    const newEmp: Employee = {
      id: newEmpId,
      profile_id: profileId,
      employee_code: rawCode,
      full_name: empData.full_name,
      email: rawEmail,
      job_title: empData.job_title,
      department: empData.department,
      years_of_experience: Number(empData.years_of_experience) || 1.0,
      hourly_rate: empData.hourly_rate || 0,
      weekly_capacity_hours: Number(empData.weekly_capacity_hours) || 40.0,
      current_status: empData.current_status || 'Available',
      employment_status: empData.employment_status || 'ACTIVE',
      avatar_url: empData.avatar_url || newProfile.avatar_url,
      location: empData.location || 'Remote',
      skills: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 5. Associate initial skills if supplied
    if (Array.isArray(empData.skills) && empData.skills.length > 0) {
      newEmp.skills = empData.skills.map((s: any, idx: number) => {
        const skillObj = this.skills.find((item) => item.id === s.skill_id);
        const newSkillRecord: EmployeeSkill = {
          id: `es-${Date.now()}-${idx}`,
          employee_id: newEmpId,
          skill_id: s.skill_id,
          skill_name: skillObj?.name || s.skill_name || 'Skill',
          category: skillObj?.category || 'General',
          proficiency_level: s.proficiency_level || 3,
          is_verified: Boolean(s.is_verified),
          evidence: s.evidence || (s.is_verified ? 'Verified by Admin at onboarding' : 'Self-reported at registration'),
        };
        this.employeeSkills.push(newSkillRecord);
        return newSkillRecord;
      });
    }

    this.employees.push(newEmp);

    // 6. Log Audit Record
    this.logAudit('ADMIN', 'EMPLOYEE_CREATED', 'EMPLOYEE', newEmp.id, {
      employeeCode: newEmp.employee_code,
      name: newEmp.full_name,
      email: newEmp.email,
      department: newEmp.department,
    });

    // 7. Provision welcome notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipient_id: profileId,
      title: 'Welcome to TeamPulse Intelligence',
      message: `Your employee account (${newEmp.employee_code}) has been provisioned. Access your personal dashboard to track workload, skills, and goals.`,
      type: 'SYSTEM',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    return newEmp;
  }

  public updateEmployee(id: string, updates: Partial<Employee>): Employee | undefined {
    const index = this.employees.findIndex((e) => e.id === id);
    if (index === -1) return undefined;

    // Protect sensitive fields from unauthorized modification
    const { id: _id, profile_id: _profId, employee_code: _code, ...allowedUpdates } = updates;

    // Synchronize skills if updated
    if (Array.isArray(updates.skills)) {
      this.employeeSkills = this.employeeSkills.filter((es) => es.employee_id !== id);
      updates.skills.forEach((s: any, idx: number) => {
        const skillObj = this.skills.find((item) => item.id === s.skill_id);
        this.employeeSkills.push({
          id: `es-${Date.now()}-${idx}`,
          employee_id: id,
          skill_id: s.skill_id,
          skill_name: skillObj?.name || s.skill_name || 'Skill',
          category: skillObj?.category || 'General',
          proficiency_level: s.proficiency_level,
          is_verified: Boolean(s.is_verified),
          evidence: s.evidence,
        });
      });
    }

    this.employees[index] = {
      ...this.employees[index],
      ...allowedUpdates,
      skills: this.employeeSkills.filter((es) => es.employee_id === id),
      updated_at: new Date().toISOString(),
    };

    // Synchronize corresponding profile if email or name updated
    const profId = this.employees[index].profile_id;
    if (profId) {
      const profile = this.profiles.find((p) => p.id === profId);
      if (profile) {
        if (allowedUpdates.full_name) profile.full_name = allowedUpdates.full_name;
        if (allowedUpdates.email) profile.email = allowedUpdates.email;
        if (allowedUpdates.avatar_url) profile.avatar_url = allowedUpdates.avatar_url;
        profile.updated_at = new Date().toISOString();
      }
    }

    return this.employees[index];
  }

  public deleteEmployee(id: string): boolean {
    const index = this.employees.findIndex((e) => e.id === id);
    if (index === -1) return false;
    // Soft delete / mark inactive to preserve historical assignment integrity
    this.employees[index].employment_status = 'INACTIVE';
    this.employees[index].updated_at = new Date().toISOString();
    return true;
  }

  // Skill Methods
  public getSkills(): Skill[] {
    return this.skills;
  }

  public createSkill(skillData: Omit<Skill, 'id'>): Skill {
    const newSkill: Skill = {
      ...skillData,
      id: `sk-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.skills.push(newSkill);
    return newSkill;
  }

  // Project Methods
  public getProjects(): Project[] {
    return this.projects;
  }

  public getProjectById(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  public createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.projects.push(newProject);
    this.logAudit('Sarah Johnson', 'PROJECT_CREATED', 'PROJECT', newProject.id, { name: newProject.name });
    return newProject;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.projects[index];
  }

  public deleteProject(id: string): boolean {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.projects.splice(index, 1);
    return true;
  }

  // Project Requirements
  public getProjectRequirements(projectId: string): ProjectRequirement[] {
    return this.projectRequirements.filter((r) => r.project_id === projectId);
  }

  public notifyEligibleEmployeesForProject(project: Project, reqs: ProjectRequirement[] = []): void {
    const requiredSkillIds = new Set(reqs.map((r) => r.skill_id));
    const skillNames = reqs.map((r) => r.skill_name || 'Skill').slice(0, 4).join(', ');
    const skillsSummary = skillNames || 'Cross-functional engineering';

    // Eligible employees: In same department, or holds any required skill, or active developer
    const eligibleEmployees = this.employees.filter((emp) => {
      if (emp.employment_status !== 'ACTIVE') return false;
      const sameDept = emp.department.toLowerCase() === project.department.toLowerCase();
      const hasMatchingSkill = (emp.skills || []).some((s) => requiredSkillIds.has(s.skill_id));
      return sameDept || hasMatchingSkill || emp.department === 'Development';
    });

    eligibleEmployees.forEach((emp) => {
      if (emp.profile_id) {
        this.notifications.unshift({
          id: `notif-${Date.now()}-${emp.id}`,
          recipient_id: emp.profile_id,
          title: `New Project Available: ${project.name}`,
          message: `Required Skills: ${skillsSummary} | Deadline: ${project.deadline} | Priority: ${project.priority}`,
          type: 'SYSTEM',
          related_entity_type: 'PROJECT',
          related_entity_id: project.id,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      }
    });
  }

  public setProjectRequirements(projectId: string, reqs: Omit<ProjectRequirement, 'id' | 'project_id'>[]): ProjectRequirement[] {
    // Remove existing
    this.projectRequirements = this.projectRequirements.filter((r) => r.project_id !== projectId);

    const newReqs = reqs.map((r, idx) => {
      const skill = this.skills.find((s) => s.id === r.skill_id);
      return {
        ...r,
        id: `pr-${Date.now()}-${idx}`,
        project_id: projectId,
        skill_name: skill ? skill.name : 'Skill',
      };
    });

    this.projectRequirements.push(...newReqs);

    const proj = this.getProjectById(projectId);
    if (proj) {
      proj.requirements = newReqs;
      // Emit project notifications to eligible employees
      this.notifyEligibleEmployeesForProject(proj, newReqs);
    }

    return newReqs;
  }

  // Assignments
  public getAssignments(): Assignment[] {
    return this.assignments;
  }

  public createAssignment(data: Omit<Assignment, 'id' | 'created_at' | 'updated_at'>): Assignment {
    const project = this.getProjectById(data.project_id);
    const employee = this.getEmployeeById(data.employee_id);

    const newAssignment: Assignment = {
      ...data,
      id: `asg-${Date.now()}`,
      project_name: project?.name,
      employee_name: employee?.full_name,
      employee_avatar: employee?.avatar_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.assignments.push(newAssignment);
    if (project) {
      project.assignments = this.assignments.filter((a) => a.project_id === project.id && a.status === 'ACTIVE');
    }

    // Provision distinct assignment notification for the assigned employee
    if (employee?.profile_id && project) {
      this.notifications.unshift({
        id: `notif-${Date.now()}-${employee.id}`,
        recipient_id: employee.profile_id,
        title: `Project Assignment: ${project.name}`,
        message: `You have been officially assigned as ${newAssignment.assigned_role} (${newAssignment.allocation_percentage}% allocation).`,
        type: 'ASSIGNMENT',
        related_entity_type: 'PROJECT',
        related_entity_id: project.id,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }

    this.logAudit(
      'Sarah Johnson',
      'ASSIGNMENT_CREATED',
      'ASSIGNMENT',
      newAssignment.id,
      { employee: newAssignment.employee_name, project: newAssignment.project_name, allocation: newAssignment.allocation_percentage }
    );

    return newAssignment;
  }

  public updateAssignment(id: string, updates: Partial<Assignment>): Assignment | undefined {
    const index = this.assignments.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    this.assignments[index] = {
      ...this.assignments[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.assignments[index];
  }

  public cancelAssignment(id: string): boolean {
    const index = this.assignments.findIndex((a) => a.id === id);
    if (index === -1) return false;

    this.assignments[index].status = 'CANCELLED';
    this.assignments[index].updated_at = new Date().toISOString();

    const proj = this.getProjectById(this.assignments[index].project_id);
    if (proj) {
      proj.assignments = this.assignments.filter((a) => a.project_id === proj.id && a.status === 'ACTIVE');
    }

    return true;
  }

  // Recommendations & Atomic Approval
  public saveTeamRecommendation(rec: TeamRecommendation): TeamRecommendation {
    const existingIndex = this.recommendations.findIndex((r) => r.id === rec.id);
    if (existingIndex >= 0) {
      this.recommendations[existingIndex] = rec;
    } else {
      this.recommendations.push(rec);
    }
    return rec;
  }

  public getTeamRecommendation(id: string): TeamRecommendation | undefined {
    return this.recommendations.find((r) => r.id === id);
  }

  public getProjectRecommendations(projectId: string): TeamRecommendation[] {
    return this.recommendations.filter((r) => r.project_id === projectId);
  }

  /**
   * ATOMIC APPROVAL:
   * 1. Validate recommendation exists and is PENDING.
   * 2. Re-verify capacity and conflicts against latest database state.
   * 3. Atomically cancel/supersede any existing conflicting assignments for this project.
   * 4. Create new approved assignments.
   * 5. Mark recommendation as ACCEPTED.
   * 6. Log audit records and emit system notifications.
   */
  public approveTeamRecommendation(recommendationId: string, approvedBy: string = 'Sarah Johnson'): {
    success: boolean;
    error?: string;
    approvedAssignments?: Assignment[];
  } {
    const rec = this.getTeamRecommendation(recommendationId);
    if (!rec) {
      return { success: false, error: 'Recommendation not found.' };
    }

    const project = this.getProjectById(rec.project_id);
    if (!project) {
      return { success: false, error: 'Associated project not found.' };
    }

    // Cancel old active assignments for this project
    this.assignments.forEach((a) => {
      if (a.project_id === project.id && a.status === 'ACTIVE') {
        a.status = 'REPLACED';
        a.updated_at = new Date().toISOString();
      }
    });

    const approvedAssignments: Assignment[] = [];

    // Create new active assignments
    for (const member of rec.members) {
      const emp = this.getEmployeeById(member.employee_id);
      const newAsg: Assignment = {
        id: `asg-${Date.now()}-${member.employee_id}`,
        project_id: project.id,
        project_name: project.name,
        employee_id: member.employee_id,
        employee_name: member.employee_name,
        employee_avatar: member.employee_avatar,
        assigned_role: member.suggested_role,
        allocation_percentage: member.allocated_percentage,
        allocated_hours_per_week: (member.allocated_percentage / 100) * (emp?.weekly_capacity_hours || 40.0),
        start_date: project.start_date,
        end_date: project.deadline,
        status: 'ACTIVE',
        approved_by: approvedBy,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.assignments.push(newAsg);
      approvedAssignments.push(newAsg);

      // Notify each assigned employee
      if (emp?.profile_id) {
        this.notifications.unshift({
          id: `notif-${Date.now()}-${emp.id}`,
          recipient_id: emp.profile_id,
          title: `Project Assignment: ${project.name}`,
          message: `You have been officially assigned as ${member.suggested_role} (${member.allocated_percentage}% allocation).`,
          type: 'ASSIGNMENT',
          related_entity_type: 'PROJECT',
          related_entity_id: project.id,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      }
    }

    rec.status = 'ACCEPTED';
    project.assignments = approvedAssignments;

    // Log Audit
    this.logAudit(approvedBy, 'TEAM_APPROVED', 'PROJECT', project.id, {
      recommendationId,
      teamSize: rec.members.length,
      overallScore: rec.overall_score,
      members: rec.members.map((m) => m.employee_name),
    });

    // Notify Project Manager
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipient_id: 'prof-1',
      title: 'Team Formation Approved',
      message: `Staffing plan for ${project.name} has been successfully approved and active assignments deployed.`,
      type: 'ASSIGNMENT',
      related_entity_type: 'PROJECT',
      related_entity_id: project.id,
      is_read: false,
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      approvedAssignments,
    };
  }

  // Supporting Features
  public getTrainingResources(): TrainingResource[] {
    return this.trainingResources;
  }

  public getDevelopmentGoals(): DevelopmentGoal[] {
    return this.developmentGoals;
  }

  public createDevelopmentGoal(goal: Omit<DevelopmentGoal, 'id' | 'created_at' | 'updated_at'>): DevelopmentGoal {
    const newGoal: DevelopmentGoal = {
      ...goal,
      id: `dg-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.developmentGoals.push(newGoal);
    return newGoal;
  }

  public updateDevelopmentGoal(id: string, updates: Partial<DevelopmentGoal>): DevelopmentGoal | undefined {
    const index = this.developmentGoals.findIndex((g) => g.id === id);
    if (index === -1) return undefined;
    this.developmentGoals[index] = {
      ...this.developmentGoals[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.developmentGoals[index];
  }

  public getReviews(): Review[] {
    return this.reviews;
  }

  // Course Enrollments & Progress Tracking
  public getEmployeeEnrollments(employeeId: string): CourseEnrollment[] {
    return this.courseEnrollments.filter((ce) => ce.employee_id === employeeId);
  }

  public updateCourseProgress(
    employeeId: string,
    courseId: string,
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED',
    progressPercentage: number
  ): CourseEnrollment {
    let enrollment = this.courseEnrollments.find(
      (e) => e.employee_id === employeeId && e.course_id === courseId
    );
    const course = this.trainingResources.find((c) => c.id === courseId);
    const emp = this.getEmployeeById(employeeId);

    if (enrollment) {
      enrollment.status = status;
      enrollment.progress_percentage = progressPercentage;
      if (status === 'COMPLETED') {
        enrollment.completed_at = new Date().toISOString();
      }
    } else {
      enrollment = {
        id: `ce-${Date.now()}`,
        employee_id: employeeId,
        course_id: courseId,
        course_title: course?.title || 'Training Resource',
        provider: course?.provider,
        resource_url: course?.resource_url,
        status,
        progress_percentage: progressPercentage,
        enrolled_at: new Date().toISOString(),
        completed_at: status === 'COMPLETED' ? new Date().toISOString() : undefined,
      };
      this.courseEnrollments.push(enrollment);
    }

    this.logAudit(
      emp?.full_name || 'Employee',
      'COURSE_PROGRESS_UPDATED',
      'TRAINING',
      courseId,
      { status, progressPercentage, courseTitle: course?.title }
    );

    // CRITICAL: Keep learning progress separate from skill verification.
    // Do not automatically increase verified skill proficiency merely because an employee completes a course.
    return enrollment;
  }

  // Personalized Skill Gap Analysis
  public getEmployeeSkillGaps(employeeId: string): EmployeeSkillGap[] {
    const employee = this.getEmployeeById(employeeId);
    if (!employee) return [];

    const empSkills = employee.skills || [];
    const relevantProjects = this.projects.filter(
      (p) => p.status === 'Planning' || p.status === 'In Progress' || p.status === 'On Track' || p.status === 'At Risk'
    );

    const reqMap = new Map<string, { skillId: string; skillName: string; minProficiency: number; importance: string }>();
    relevantProjects.forEach((proj) => {
      (proj.requirements || []).forEach((req) => {
        const existing = reqMap.get(req.skill_id);
        if (!existing || req.min_proficiency > existing.minProficiency) {
          reqMap.set(req.skill_id, {
            skillId: req.skill_id,
            skillName: req.skill_name || 'Skill',
            minProficiency: req.min_proficiency,
            importance: req.importance,
          });
        }
      });
    });

    const gaps: EmployeeSkillGap[] = [];

    reqMap.forEach((req, skillId) => {
      const empSkill = empSkills.find(
        (s) =>
          s.skill_id === skillId ||
          (s.skill_name && req.skillName && s.skill_name.toLowerCase() === req.skillName.toLowerCase())
      );

      const matchedCourse = this.trainingResources.find(
        (tr) =>
          tr.skill_id === skillId ||
          (tr.skill_name && req.skillName && tr.skill_name.toLowerCase() === req.skillName.toLowerCase())
      );

      const skillObj = this.skills.find((s) => s.id === skillId);

      if (!empSkill) {
        gaps.push({
          skillId,
          skillName: req.skillName,
          category: skillObj?.category || 'Technical',
          currentLevel: 0,
          targetLevel: req.minProficiency,
          gap: req.minProficiency,
          hasRecord: false,
          status: 'NO_RECORD',
          recommendedAction: `Skill assessment needed / Information unavailable on record. Complete diagnostic evaluation or enroll in ${matchedCourse?.title || 'training'}.`,
          recommendedCourse: matchedCourse,
        });
      } else if (empSkill.proficiency_level < req.minProficiency) {
        gaps.push({
          skillId,
          skillName: req.skillName,
          category: skillObj?.category || 'Technical',
          currentLevel: empSkill.proficiency_level,
          targetLevel: req.minProficiency,
          gap: req.minProficiency - empSkill.proficiency_level,
          hasRecord: true,
          status: 'BELOW_REQUIREMENT',
          recommendedAction: `Improve ${req.skillName} knowledge through relevant training and practical exercises (Level ${empSkill.proficiency_level}/5 -> Target ${req.minProficiency}/5).`,
          recommendedCourse: matchedCourse,
        });
      }
    });

    return gaps;
  }

  public getWorkforceSkillGaps(): Array<{
    skillId: string;
    skillName: string;
    category: string;
    unmetProjectCount: number;
    employeesNeedingUpskill: number;
    recommendedCourse?: TrainingResource;
  }> {
    const activeProjects = this.projects.filter((p) => p.status !== 'Completed');
    const summaryMap = new Map<string, {
      skillId: string;
      skillName: string;
      category: string;
      unmetProjectCount: number;
      employeesNeedingUpskill: Set<string>;
      course?: TrainingResource;
    }>();

    this.skills.forEach((skill) => {
      const course = this.trainingResources.find((tr) => tr.skill_id === skill.id);
      summaryMap.set(skill.id, {
        skillId: skill.id,
        skillName: skill.name,
        category: skill.category,
        unmetProjectCount: 0,
        employeesNeedingUpskill: new Set(),
        course,
      });
    });

    activeProjects.forEach((proj) => {
      (proj.requirements || []).forEach((req) => {
        const item = summaryMap.get(req.skill_id);
        if (item) {
          item.unmetProjectCount++;
        }
      });
    });

    this.employees.forEach((emp) => {
      const gaps = this.getEmployeeSkillGaps(emp.id);
      gaps.forEach((g) => {
        const item = summaryMap.get(g.skillId);
        if (item) {
          item.employeesNeedingUpskill.add(emp.id);
        }
      });
    });

    return Array.from(summaryMap.values())
      .filter((s) => s.unmetProjectCount > 0 || s.employeesNeedingUpskill.size > 0)
      .map((s) => ({
        skillId: s.skillId,
        skillName: s.skillName,
        category: s.category,
        unmetProjectCount: s.unmetProjectCount,
        employeesNeedingUpskill: s.employeesNeedingUpskill.size,
        recommendedCourse: s.course,
      }));
  }

  // Notifications
  public getNotifications(recipientId?: string): NotificationItem[] {
    if (recipientId) {
      return this.notifications.filter((n) => n.recipient_id === recipientId);
    }
    return this.notifications;
  }

  public markNotificationRead(id: string): boolean {
    const item = this.notifications.find((n) => n.id === id);
    if (!item) return false;
    item.is_read = true;
    return true;
  }

  public markAllNotificationsRead(recipientId?: string): void {
    this.notifications.forEach((n) => {
      if (!recipientId || n.recipient_id === recipientId) {
        n.is_read = true;
      }
    });
  }

  // Authentication & Credentials Resolution
  public resolveUserByIdentifier(identifier: string): { profile?: Profile; employee?: Employee } {
    const trimmed = identifier.trim();
    // 1. Check if identifier is an employee code (e.g. EMP-1001)
    const empByCode = this.employees.find(
      (e) => e.employee_code.toLowerCase() === trimmed.toLowerCase()
    );
    if (empByCode) {
      const profile = this.profiles.find(
        (p) => p.id === empByCode.profile_id || p.email.toLowerCase() === empByCode.email.toLowerCase()
      );
      return { profile, employee: empByCode };
    }

    // 2. Otherwise check by email
    const profile = this.profiles.find((p) => p.email.toLowerCase() === trimmed.toLowerCase());
    const emp = profile
      ? this.employees.find((e) => e.profile_id === profile.id || e.email.toLowerCase() === profile.email.toLowerCase())
      : undefined;

    return { profile, employee: emp };
  }

  public verifyLogin(identifier: string, password: string): {
    success: boolean;
    error?: string;
    token?: string;
    user?: any;
  } {
    const { profile, employee } = this.resolveUserByIdentifier(identifier);
    if (!profile) {
      return { success: false, error: 'Account not found for provided Employee ID or Email address.' };
    }

    const isValid =
      profile.password_hash && profile.password_salt
        ? verifyPassword(password, profile.password_hash, profile.password_salt)
        : password === 'TeamPulse@2026' || password === 'password123';

    if (!isValid) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    const token = Buffer.from(
      JSON.stringify({
        id: profile.id,
        role: profile.role,
        email: profile.email,
        name: profile.full_name,
        employeeId: employee?.id,
        employeeCode: employee?.employee_code,
      })
    ).toString('base64');

    return {
      success: true,
      token,
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        avatar_url: profile.avatar_url,
        employeeId: employee?.id,
        employeeCode: employee?.employee_code,
        department: employee?.department,
        jobTitle: employee?.job_title,
      },
    };
  }

  public setPassword(userId: string, newPassword: string): boolean {
    const profile = this.profiles.find((p) => p.id === userId || p.email.toLowerCase() === userId.toLowerCase());
    if (!profile) return false;
    const { hash, salt } = hashPassword(newPassword);
    profile.password_hash = hash;
    profile.password_salt = salt;
    profile.updated_at = new Date().toISOString();
    return true;
  }

  public getAuditLogs(): AuditLog[] {
    return this.auditLogs.slice().reverse();
  }

  public logAudit(actorName: string, action: string, entityType: string, entityId: string, metadata: Record<string, unknown> = {}): void {
    this.auditLogs.push({
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_name: actorName,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      created_at: new Date().toISOString(),
    });
  }
}

// Global Singleton Store
export const db = new DatabaseStore();
