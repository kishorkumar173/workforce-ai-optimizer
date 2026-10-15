import { Employee, Project, ProjectRequirement, EmployeeMatchResult, RequirementImportance } from '../types';

export interface MatchingWeights {
  skillMatch: number;      // default: 0.40
  experience: number;      // default: 0.20
  availability: number;    // default: 0.20
  workload: number;        // default: 0.10
  domainAffinity: number;  // default: 0.10
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  skillMatch: 0.40,
  experience: 0.20,
  availability: 0.20,
  workload: 0.10,
  domainAffinity: 0.10,
};

export class MatchingEngine {
  private weights: MatchingWeights;

  constructor(weights: Partial<MatchingWeights> = {}) {
    this.weights = { ...DEFAULT_WEIGHTS, ...weights };
  }

  /**
   * Score an employee against project requirements with deterministic calculations and transparent explanations.
   */
  public evaluateCandidate(
    employee: Employee,
    project: Project,
    currentAllocationsPercent: number = 0
  ): EmployeeMatchResult {
    const requirements = project.requirements || [];
    const empSkills = employee.skills || [];

    // 1. Skill Match Calculation (40% Weight)
    const matchedSkills: EmployeeMatchResult['matchedSkills'] = [];
    const missingSkills: EmployeeMatchResult['missingSkills'] = [];
    const proficiencyGaps: EmployeeMatchResult['proficiencyGaps'] = [];
    const verificationWarnings: string[] = [];
    const recommendationReasons: string[] = [];
    const capacityWarnings: string[] = [];

    let totalWeight = 0;
    let earnedSkillPoints = 0;

    for (const req of requirements) {
      const isCritical = req.importance === 'CRITICAL';
      const importanceWeight = isCritical ? 3.0 : req.importance === 'IMPORTANT' ? 2.0 : 1.0;
      totalWeight += importanceWeight;

      const found = empSkills.find(
        (s) =>
          s.skill_id === req.skill_id ||
          (s.skill_name && req.skill_name && s.skill_name.toLowerCase() === req.skill_name.toLowerCase())
      );

      if (found) {
        matchedSkills.push({
          skillId: req.skill_id,
          skillName: req.skill_name || found.skill_name || 'Skill',
          employeeLevel: found.proficiency_level,
          requiredLevel: req.min_proficiency,
          isVerified: found.is_verified,
        });

        // Proficiency ratio (capped at 1.25 for overqualified mastery)
        let profRatio = Math.min(1.25, found.proficiency_level / Math.max(1, req.min_proficiency));

        // Verification factor: verified skills get full credit; unverified gets slight discount
        if (!found.is_verified) {
          profRatio *= 0.90;
          verificationWarnings.push(`Notice: Skill "${req.skill_name || 'Required skill'}" is self-reported and pending verification.`);
        }

        if (found.proficiency_level < req.min_proficiency) {
          const gap = req.min_proficiency - found.proficiency_level;
          proficiencyGaps.push({
            skillName: req.skill_name || 'Skill',
            gap,
          });
          capacityWarnings.push(
            `Warning: Recorded ${req.skill_name || 'skill'} proficiency (${found.proficiency_level}/5) is below the project requirement (${req.min_proficiency}/5).`
          );
        }

        earnedSkillPoints += profRatio * importanceWeight;
      } else {
        missingSkills.push({
          skillId: req.skill_id,
          skillName: `${req.skill_name || 'Required Skill'} (Skill information unavailable)`,
          requiredLevel: req.min_proficiency,
          importance: req.importance,
        });
        if (isCritical) {
          capacityWarnings.push(`Missing mandatory requirement: ${req.skill_name || 'Core skill'} (Skill information unavailable on record).`);
        }
      }
    }

    const rawSkillScore = totalWeight > 0 ? (earnedSkillPoints / totalWeight) * 100 : 80;
    const skillMatchScore = Math.min(100, Math.round(rawSkillScore));

    // 2. Experience Score (20% Weight: normalized 1 to 10+ years)
    const expNormalized = Math.min(1.0, (employee.years_of_experience || 1.0) / 8.0);
    const experienceScore = Math.round(expNormalized * 100);

    // 3. Availability Score (20% Weight)
    let availabilityScore = 100;
    switch (employee.current_status) {
      case 'Available':
        availabilityScore = 100;
        break;
      case 'In a Meeting':
        availabilityScore = 80;
        break;
      case 'Busy':
        availabilityScore = 40;
        break;
      case 'On Leave':
        availabilityScore = 0;
        break;
      default:
        availabilityScore = 50;
    }

    // 4. Workload Suitability Score (10% Weight: based on weekly capacity hours)
    const currentUtil = currentAllocationsPercent;
    let workloadSuitabilityScore = 100;
    if (currentUtil >= 100) {
      workloadSuitabilityScore = 10;
      capacityWarnings.push(`Currently at ${currentUtil}% capacity — high risk of burnout.`);
    } else if (currentUtil >= 80) {
      workloadSuitabilityScore = 50;
      capacityWarnings.push(`Current allocation is ${currentUtil}% — limited headroom for new commitments.`);
    } else if (currentUtil >= 50) {
      workloadSuitabilityScore = 80;
    } else {
      workloadSuitabilityScore = 100;
    }

    // 5. Domain Project Experience / Department Affinity (10% Weight)
    let projectExperienceScore = 70;
    if (
      employee.department &&
      project.department &&
      employee.department.toLowerCase() === project.department.toLowerCase()
    ) {
      projectExperienceScore = 95;
      recommendationReasons.push(`Direct alignment with ${project.department} domain.`);
    }

    // Overall Weighted Deterministic Score
    const overallScore = Math.round(
      skillMatchScore * this.weights.skillMatch +
      experienceScore * this.weights.experience +
      availabilityScore * this.weights.availability +
      workloadSuitabilityScore * this.weights.workload +
      projectExperienceScore * this.weights.domainAffinity
    );

    const availableHours = Math.max(0, employee.weekly_capacity_hours * (1 - currentUtil / 100));

    // Synthesize human-readable explainable reasons from actual comparisons
    if (matchedSkills.length > 0) {
      const topMatched = matchedSkills.slice(0, 3).map((m) => m.skillName).join(', ');
      recommendationReasons.unshift(
        `Recommended because the employee has the required ${topMatched} proficiency and sufficient availability (${availableHours.toFixed(1)}h/week open capacity).`
      );
    } else {
      recommendationReasons.push(
        `Candidate evaluated based on general domain experience and open availability (${availableHours.toFixed(1)}h/week).`
      );
    }

    if (employee.years_of_experience >= 5) {
      recommendationReasons.push(`Senior track record with ${employee.years_of_experience} years of domain experience.`);
    }

    return {
      employeeId: employee.id,
      employeeName: employee.full_name,
      employeeAvatar: employee.avatar_url,
      jobTitle: employee.job_title,
      department: employee.department,
      overallScore: Math.min(100, Math.max(0, overallScore)),
      skillMatchScore,
      experienceScore,
      availabilityScore,
      workloadSuitabilityScore,
      projectExperienceScore,
      matchedSkills,
      missingSkills,
      proficiencyGaps,
      verificationWarnings,
      capacityWarnings,
      recommendationReasons,
      currentUtilization: currentUtil,
      availableCapacityHours: availableHours,
    };
  }
}
