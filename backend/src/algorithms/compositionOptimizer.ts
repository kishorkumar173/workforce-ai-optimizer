import { Employee, Project, TeamRecommendation, TeamRecommendationMember, ProjectRequirement } from '../types';
import { MatchingEngine } from './matchingEngine';

export class CompositionOptimizer {
  private matchingEngine: MatchingEngine;

  constructor() {
    this.matchingEngine = new MatchingEngine();
  }

  /**
   * Optimize team composition for a project considering requirements, team size, and workload.
   */
  public generateRecommendation(
    project: Project,
    allEmployees: Employee[],
    employeeCurrentAllocations: Record<string, number> = {}
  ): TeamRecommendation {
    const targetTeamSize = Math.max(1, project.requested_team_size || 3);
    const requirements = project.requirements || [];

    // Filter eligible active employees
    const candidates = allEmployees.filter(
      (e) => e.employment_status === 'ACTIVE' && e.current_status !== 'On Leave'
    );

    // Evaluate each candidate individually
    const scoredCandidates = candidates.map((candidate) => {
      const currentAlloc = employeeCurrentAllocations[candidate.id] || 0;
      const evalResult = this.matchingEngine.evaluateCandidate(candidate, project, currentAlloc);
      return { candidate, evalResult };
    });

    // Sort candidates by match score descending
    scoredCandidates.sort((a, b) => b.evalResult.overallScore - a.evalResult.overallScore);

    // Heuristic Multi-Objective Selection:
    // 1. First ensure all critical project requirements are covered by the most qualified individuals.
    // 2. Then fill remaining slots with highest overall scorers having complementary skills and low workload.
    const selectedMembers: TeamRecommendationMember[] = [];
    const coveredSkillIds = new Set<string>();
    const usedEmployeeIds = new Set<string>();

    // Step 1: Cover critical skills first
    const criticalReqs = requirements.filter((r) => r.importance === 'CRITICAL');
    for (const req of criticalReqs) {
      if (selectedMembers.length >= targetTeamSize) break;

      // Find best available candidate with this critical skill
      const bestForSkill = scoredCandidates.find(
        (sc) =>
          !usedEmployeeIds.has(sc.candidate.id) &&
          sc.evalResult.matchedSkills.some(
            (m) =>
              m.skillId === req.skill_id &&
              m.employeeLevel >= req.min_proficiency
          )
      );

      if (bestForSkill) {
        usedEmployeeIds.add(bestForSkill.candidate.id);
        bestForSkill.evalResult.matchedSkills.forEach((m) => coveredSkillIds.add(m.skillId));
        
        selectedMembers.push({
          id: `rec-mem-${selectedMembers.length + 1}`,
          employee_id: bestForSkill.candidate.id,
          employee_name: bestForSkill.candidate.full_name,
          employee_avatar: bestForSkill.candidate.avatar_url,
          job_title: bestForSkill.candidate.job_title,
          suggested_role: this.determineRole(bestForSkill.candidate, req),
          match_score: bestForSkill.evalResult.overallScore,
          matched_skills: bestForSkill.evalResult.matchedSkills.map((m) => m.skillName),
          missing_skills: bestForSkill.evalResult.missingSkills.map((m) => m.skillName),
          allocated_percentage: Math.min(100, Math.max(25, Math.round(100 / targetTeamSize))),
          match_reasons: [
            `Selected to satisfy critical requirement: ${req.skill_name || 'Core Skill'}`,
            ...bestForSkill.evalResult.recommendationReasons,
          ],
          capacity_warnings: bestForSkill.evalResult.capacityWarnings,
        });
      }
    }

    // Step 2: Fill remaining positions with top complementary candidates
    for (const sc of scoredCandidates) {
      if (selectedMembers.length >= targetTeamSize) break;
      if (usedEmployeeIds.has(sc.candidate.id)) continue;

      usedEmployeeIds.add(sc.candidate.id);
      sc.evalResult.matchedSkills.forEach((m) => coveredSkillIds.add(m.skillId));

      selectedMembers.push({
        id: `rec-mem-${selectedMembers.length + 1}`,
        employee_id: sc.candidate.id,
        employee_name: sc.candidate.full_name,
        employee_avatar: sc.candidate.avatar_url,
        job_title: sc.candidate.job_title,
        suggested_role: sc.candidate.job_title,
        match_score: sc.evalResult.overallScore,
        matched_skills: sc.evalResult.matchedSkills.map((m) => m.skillName),
        missing_skills: sc.evalResult.missingSkills.map((m) => m.skillName),
        allocated_percentage: Math.min(100, Math.max(25, Math.round(100 / targetTeamSize))),
        match_reasons: sc.evalResult.recommendationReasons,
        capacity_warnings: sc.evalResult.capacityWarnings,
      });
    }

    // Calculate collective team metrics
    const criticalReqCount = criticalReqs.length;
    let criticalCoveredCount = 0;
    for (const req of criticalReqs) {
      if (coveredSkillIds.has(req.skill_id)) {
        criticalCoveredCount++;
      }
    }

    const totalReqCount = Math.max(1, requirements.length);
    let totalCovered = 0;
    for (const req of requirements) {
      if (coveredSkillIds.has(req.skill_id)) {
        totalCovered++;
      }
    }

    const skillCoverageScore = Math.round((totalCovered / totalReqCount) * 100);

    // Calculate collective experience and workload scores
    const avgExpScore = selectedMembers.length > 0
      ? Math.round(selectedMembers.reduce((acc, m) => acc + m.match_score, 0) / selectedMembers.length)
      : 0;

    const hasCapacityViolation = selectedMembers.some((m) => m.capacity_warnings.length > 0);
    const workloadSafetyScore = hasCapacityViolation ? 65 : 95;

    const overallScore = Math.round(
      skillCoverageScore * 0.50 +
      avgExpScore * 0.30 +
      workloadSafetyScore * 0.20
    );

    // Track unmet critical/mandatory requirements
    const unmetCriticalRequirements: string[] = [];
    for (const req of criticalReqs) {
      if (!coveredSkillIds.has(req.skill_id)) {
        unmetCriticalRequirements.push(req.skill_name || 'Core Skill');
      }
    }

    // Generate explainable summaries
    let explanationSummary = `Recommended team covers ${totalCovered}/${totalReqCount} total requirements (${criticalCoveredCount}/${criticalReqCount} critical).`;
    if (unmetCriticalRequirements.length > 0) {
      explanationSummary += ` UNMET MANDATORY REQUIREMENTS: [${unmetCriticalRequirements.join(', ')}]. No available personnel meet the required proficiency.`;
    } else {
      explanationSummary += ` Team provides balanced senior oversight and execution capacity.`;
    }
    
    let tradeoffsSummary = 'High delivery velocity with optimal workload balance across team members.';
    if (unmetCriticalRequirements.length > 0) {
      tradeoffsSummary = `Critical Deficit: Mandatory project requirements [${unmetCriticalRequirements.join(', ')}] are currently unmet. Recommend targeted upskilling or recruiting before project kickoff.`;
    } else if (hasCapacityViolation) {
      tradeoffsSummary = 'Trade-off: Fast-track delivery relies on members near full capacity. Monitor milestone burn rate.';
    }

    return {
      id: `rec-${Date.now()}`,
      project_id: project.id,
      project_name: project.name,
      algorithm_version: 'v2.4-explainable-hybrid',
      overall_score: Math.min(100, overallScore),
      skill_coverage_score: skillCoverageScore,
      workload_safety_score: workloadSafetyScore,
      experience_score: avgExpScore,
      critical_skills_covered: criticalCoveredCount,
      critical_skills_total: criticalReqCount,
      has_capacity_violation: hasCapacityViolation,
      explanation_summary: explanationSummary,
      tradeoffs_summary: tradeoffsSummary,
      unmet_requirements: unmetCriticalRequirements,
      status: 'PENDING',
      members: selectedMembers,
      created_at: new Date().toISOString(),
    };
  }

  private determineRole(employee: Employee, requirement: ProjectRequirement): string {
    if (employee.job_title.toLowerCase().includes('lead') || employee.years_of_experience >= 6) {
      return `Technical Lead (${requirement.skill_name || 'Core Domain'})`;
    }
    return `Core Engineer (${requirement.skill_name || 'Domain'})`;
  }
}
