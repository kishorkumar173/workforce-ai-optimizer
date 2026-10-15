import { Project, Employee, Assignment, SimulationRequest, SimulationResult } from '../types';
import { CompositionOptimizer } from './compositionOptimizer';
import { SkillGapAnalyzer } from './skillGapAnalyzer';
import { WorkloadCalculator } from './workloadCalculator';

export class SimulationEngine {
  /**
   * Run a what-if workforce staffing simulation against a project's current baseline.
   */
  public static evaluateSimulation(
    project: Project,
    allEmployees: Employee[],
    allAssignments: Assignment[],
    simulationReq: SimulationRequest
  ): SimulationResult {
    const requirements = project.requirements || [];
    const activeAssignments = allAssignments.filter(
      (a) => a.project_id === project.id && a.status === 'ACTIVE'
    );

    // 1. Calculate Baseline metrics from currently approved assignments
    const baselineEmployees = allEmployees.filter((e) =>
      activeAssignments.some((a) => a.employee_id === e.id)
    );
    const baselineGapReport = SkillGapAnalyzer.analyzeProjectGaps(project, baselineEmployees);

    // Calculate baseline capacity violations across current assignments
    const baselineWorkload = WorkloadCalculator.calculateWorkload(allEmployees, allAssignments);
    const baselineViolations = baselineEmployees.filter((e) => {
      const summary = baselineWorkload.employees.find((s) => s.employeeId === e.id);
      return summary && summary.utilizationPercentage > 100;
    }).length;

    const baselineScore = Math.round(
      baselineGapReport.coveragePercentage * 0.6 +
      Math.max(0, 100 - baselineViolations * 25) * 0.4
    );

    // 2. Build Simulated Team
    const proposedMembers = simulationReq.proposedMembers || [];
    const simulatedEmployees = proposedMembers.map((pm) => {
      const emp = allEmployees.find((e) => e.id === pm.employeeId);
      return {
        proposed: pm,
        employee: emp,
      };
    }).filter((item): item is { proposed: SimulationRequest['proposedMembers'][0]; employee: Employee } => !!item.employee);

    const simulatedEmployeesList = simulatedEmployees.map((s) => s.employee);
    const simulatedGapReport = SkillGapAnalyzer.analyzeProjectGaps(project, simulatedEmployeesList);

    // 3. Calculate Projected Workload in simulated state
    // Replace project's existing assignments with proposed allocations to avoid double-counting
    const simulatedAssignments: Assignment[] = [
      ...allAssignments.filter((a) => a.project_id !== project.id),
      ...simulatedEmployees.map((s, idx) => ({
        id: `sim-assign-${idx}`,
        project_id: project.id,
        project_name: project.name,
        employee_id: s.employee.id,
        employee_name: s.employee.full_name,
        assigned_role: s.proposed.role || s.employee.job_title,
        allocation_percentage: s.proposed.allocationPercentage,
        allocated_hours_per_week: (s.proposed.allocationPercentage / 100) * (s.employee.weekly_capacity_hours || 40),
        start_date: project.start_date,
        end_date: project.deadline,
        status: 'ACTIVE' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    ];

    const simulatedWorkload = WorkloadCalculator.calculateWorkload(allEmployees, simulatedAssignments);

    let simulatedViolations = 0;
    const memberAnalysis = simulatedEmployees.map((s) => {
      const summary = simulatedWorkload.employees.find((w) => w.employeeId === s.employee.id);
      const util = summary ? summary.utilizationPercentage : s.proposed.allocationPercentage;
      const isOverloaded = util > 100;
      if (isOverloaded) simulatedViolations++;

      return {
        employeeId: s.employee.id,
        name: s.employee.full_name,
        role: s.proposed.role || s.employee.job_title,
        allocatedPercentage: s.proposed.allocationPercentage,
        projectedUtilization: util,
        isOverloaded,
        status: isOverloaded ? 'Overcapacity Warning' : 'Optimal Allocation',
      };
    });

    const simulatedScore = Math.round(
      simulatedGapReport.coveragePercentage * 0.6 +
      Math.max(0, 100 - simulatedViolations * 25) * 0.4
    );

    // 4. Calculate Deltas
    const baselineCoveredSkills = new Set(
      baselineGapReport.gaps.filter((g) => g.status === 'FULLY_COVERED').map((g) => g.skillName)
    );
    const simulatedCoveredSkills = new Set(
      simulatedGapReport.gaps.filter((g) => g.status === 'FULLY_COVERED').map((g) => g.skillName)
    );

    const newlyCoveredSkills = [...simulatedCoveredSkills].filter((s) => !baselineCoveredSkills.has(s));
    const newlyUncoveredSkills = [...baselineCoveredSkills].filter((s) => !simulatedCoveredSkills.has(s));
    const newOverloadedEmployees = memberAnalysis
      .filter((m) => m.isOverloaded)
      .map((m) => `${m.name} (${m.projectedUtilization}%)`);

    // 5. Check Feasibility for Approval
    const approvalBlockers: string[] = [];
    if (simulatedGapReport.criticalGapsCount > 0) {
      approvalBlockers.push(`${simulatedGapReport.criticalGapsCount} critical skill requirement(s) are unsatisfied.`);
    }
    if (simulatedViolations > 0) {
      approvalBlockers.push(`${simulatedViolations} team member(s) exceed 100% maximum capacity.`);
    }
    if (simulatedEmployees.length === 0) {
      approvalBlockers.push('Proposed team cannot be empty.');
    }

    const isFeasibleForApproval = approvalBlockers.length === 0;

    return {
      simulationId: `sim-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      baseline: {
        overallScore: baselineScore,
        skillCoverage: baselineGapReport.coveragePercentage,
        teamSize: baselineEmployees.length,
        capacityViolations: baselineViolations,
      },
      simulated: {
        overallScore: simulatedScore,
        skillCoverage: simulatedGapReport.coveragePercentage,
        teamSize: simulatedEmployees.length,
        capacityViolations: simulatedViolations,
        coveredRequirements: simulatedGapReport.gaps
          .filter((g) => g.status === 'FULLY_COVERED')
          .map((g) => ({
            skillName: g.skillName,
            satisfiedBy: simulatedEmployees
              .filter((e) => (e.employee.skills || []).some((s) => s.skill_id === g.skillId))
              .map((e) => e.employee.full_name),
            isCritical: g.importance === 'CRITICAL',
          })),
        uncoveredRequirements: simulatedGapReport.gaps
          .filter((g) => g.status !== 'FULLY_COVERED')
          .map((g) => ({
            skillName: g.skillName,
            importance: g.importance,
            gapDescription: g.actionRecommendation,
          })),
        memberAnalysis,
      },
      delta: {
        scoreChange: simulatedScore - baselineScore,
        skillCoverageChange: simulatedGapReport.coveragePercentage - baselineGapReport.coveragePercentage,
        newlyCoveredSkills,
        newlyUncoveredSkills,
        newOverloadedEmployees,
      },
      isFeasibleForApproval,
      approvalBlockers,
    };
  }
}
