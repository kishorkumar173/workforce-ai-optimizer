import { describe, it, expect } from 'vitest';
import { MatchingEngine } from '../src/algorithms/matchingEngine';
import { CompositionOptimizer } from '../src/algorithms/compositionOptimizer';
import { WorkloadCalculator } from '../src/algorithms/workloadCalculator';
import { SkillGapAnalyzer } from '../src/algorithms/skillGapAnalyzer';
import { SimulationEngine } from '../src/algorithms/simulationEngine';
import { Employee, Project, Assignment } from '../src/types';

describe('Workforce Intelligence Algorithm Suite', () => {
  const mockSkills = [
    { id: 'sk-1', name: 'React.js', category: 'Frontend' },
    { id: 'sk-2', name: 'TypeScript', category: 'Frontend' },
    { id: 'sk-3', name: 'Python', category: 'Backend' },
  ];

  const mockEmployee1: Employee = {
    id: 'emp-test-1',
    employee_code: 'EMP-T1',
    full_name: 'Alice Wonder',
    email: 'alice@test.com',
    job_title: 'Senior Frontend Engineer',
    department: 'Development',
    years_of_experience: 6.0,
    weekly_capacity_hours: 40.0,
    current_status: 'Available',
    employment_status: 'ACTIVE',
    skills: [
      { id: 'es-1', employee_id: 'emp-test-1', skill_id: 'sk-1', skill_name: 'React.js', proficiency_level: 5, is_verified: true },
      { id: 'es-2', employee_id: 'emp-test-1', skill_id: 'sk-2', skill_name: 'TypeScript', proficiency_level: 4, is_verified: true },
    ],
    created_at: '',
    updated_at: '',
  };

  const mockEmployee2: Employee = {
    id: 'emp-test-2',
    employee_code: 'EMP-T2',
    full_name: 'Bob Builder',
    email: 'bob@test.com',
    job_title: 'Junior Backend Engineer',
    department: 'Development',
    years_of_experience: 1.5,
    weekly_capacity_hours: 40.0,
    current_status: 'Available',
    employment_status: 'ACTIVE',
    skills: [
      { id: 'es-3', employee_id: 'emp-test-2', skill_id: 'sk-3', skill_name: 'Python', proficiency_level: 3, is_verified: false },
    ],
    created_at: '',
    updated_at: '',
  };

  const mockProject: Project = {
    id: 'proj-test-1',
    name: 'Frontend Modernization',
    department: 'Development',
    priority: 'HIGH',
    status: 'Planning',
    start_date: '2026-03-01',
    deadline: '2026-06-01',
    requested_team_size: 2,
    progress_percentage: 0,
    requirements: [
      { id: 'req-1', project_id: 'proj-test-1', skill_id: 'sk-1', skill_name: 'React.js', min_proficiency: 4, importance: 'CRITICAL', min_employee_count: 1 },
      { id: 'req-2', project_id: 'proj-test-1', skill_id: 'sk-2', skill_name: 'TypeScript', min_proficiency: 3, importance: 'IMPORTANT', min_employee_count: 1 },
    ],
    created_at: '',
    updated_at: '',
  };

  it('MatchingEngine: correctly scores candidate with matching skills and high availability', () => {
    const engine = new MatchingEngine();
    const result = engine.evaluateCandidate(mockEmployee1, mockProject, 0);

    expect(result.overallScore).toBeGreaterThan(80);
    expect(result.matchedSkills).toHaveLength(2);
    expect(result.missingSkills).toHaveLength(0);
    expect(result.recommendationReasons.length).toBeGreaterThan(0);
  });

  it('MatchingEngine: penalizes missing critical skills and generates capacity warnings when overloaded', () => {
    const engine = new MatchingEngine();
    const result = engine.evaluateCandidate(mockEmployee2, mockProject, 100);

    expect(result.skillMatchScore).toBeLessThan(40);
    expect(result.missingSkills.length).toBeGreaterThanOrEqual(1);
    expect(result.capacityWarnings.length).toBeGreaterThan(0);
  });

  it('CompositionOptimizer: generates balanced team satisfying critical requirements', () => {
    const optimizer = new CompositionOptimizer();
    const rec = optimizer.generateRecommendation(mockProject, [mockEmployee1, mockEmployee2]);

    expect(rec.members.length).toBeGreaterThanOrEqual(1);
    expect(rec.critical_skills_covered).toBe(1);
    expect(rec.skill_coverage_score).toBe(100);
    expect(rec.explanation_summary).toContain('covers');
  });

  it('WorkloadCalculator: detects overcapacity employees correctly (>100%)', () => {
    const assignments: Assignment[] = [
      {
        id: 'asg-test-1',
        project_id: 'p1',
        employee_id: 'emp-test-1',
        assigned_role: 'Lead',
        allocation_percentage: 80,
        allocated_hours_per_week: 32,
        start_date: '2026-01-01',
        end_date: '2026-05-01',
        status: 'ACTIVE',
        created_at: '',
        updated_at: '',
      },
      {
        id: 'asg-test-2',
        project_id: 'p2',
        employee_id: 'emp-test-1',
        assigned_role: 'Advisor',
        allocation_percentage: 40,
        allocated_hours_per_week: 16,
        start_date: '2026-01-01',
        end_date: '2026-05-01',
        status: 'ACTIVE',
        created_at: '',
        updated_at: '',
      },
    ];

    const result = WorkloadCalculator.calculateWorkload([mockEmployee1, mockEmployee2], assignments);
    const aliceWorkload = result.employees.find((e) => e.employeeId === 'emp-test-1');

    expect(aliceWorkload?.utilizationPercentage).toBe(120);
    expect(aliceWorkload?.status).toBe('OVERLOADED');
    expect(result.overloadedEmployeesCount).toBe(1);
  });

  it('SkillGapAnalyzer: flags critical missing skill as UNCOVERED', () => {
    const gapReport = SkillGapAnalyzer.analyzeProjectGaps(mockProject, [mockEmployee2]);

    expect(gapReport.criticalGapsCount).toBe(1);
    expect(gapReport.coveragePercentage).toBe(0);
    expect(gapReport.gaps[0].status).toBe('UNCOVERED');
  });

  it('SimulationEngine: correctly calculates score and coverage deltas in sandbox mode', () => {
    const simResult = SimulationEngine.evaluateSimulation(
      mockProject,
      [mockEmployee1, mockEmployee2],
      [],
      {
        projectId: mockProject.id,
        proposedMembers: [
          { employeeId: mockEmployee1.id, role: 'Lead Frontend', allocationPercentage: 50 },
        ],
      }
    );

    expect(simResult.simulated.skillCoverage).toBe(100);
    expect(simResult.isFeasibleForApproval).toBe(true);
    expect(simResult.approvalBlockers).toHaveLength(0);
  });
});
