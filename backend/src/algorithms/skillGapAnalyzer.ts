import { Project, Employee, Skill, TrainingResource, ProjectRequirement } from '../types';

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  requiredProficiency: number;
  availableProficiency: number;
  gap: number;
  importance: 'NICE_TO_HAVE' | 'IMPORTANT' | 'CRITICAL';
  status: 'FULLY_COVERED' | 'PARTIALLY_COVERED' | 'UNCOVERED';
  qualifiedEmployeeCount: number;
  recommendedTraining?: TrainingResource;
  actionRecommendation: string;
}

export interface ProjectSkillGapReport {
  projectId: string;
  projectName: string;
  totalRequirements: number;
  coveredRequirementsCount: number;
  criticalGapsCount: number;
  coveragePercentage: number;
  gaps: SkillGapItem[];
  suggestedActionPlan: string;
}

export class SkillGapAnalyzer {
  public static analyzeProjectGaps(
    project: Project,
    assignedOrProposedEmployees: Employee[],
    allTrainingResources: TrainingResource[] = []
  ): ProjectSkillGapReport {
    const requirements = project.requirements || [];
    const gaps: SkillGapItem[] = [];

    let coveredCount = 0;
    let criticalGaps = 0;

    for (const req of requirements) {
      let maxAvailableProficiency = 0;
      let qualifiedEmployees = 0;

      for (const emp of assignedOrProposedEmployees) {
        const empSkill = (emp.skills || []).find(
          (s) =>
            s.skill_id === req.skill_id ||
            (s.skill_name && req.skill_name && s.skill_name.toLowerCase() === req.skill_name.toLowerCase())
        );

        if (empSkill) {
          if (empSkill.proficiency_level > maxAvailableProficiency) {
            maxAvailableProficiency = empSkill.proficiency_level;
          }
          if (empSkill.proficiency_level >= req.min_proficiency) {
            qualifiedEmployees++;
          }
        }
      }

      const diff = req.min_proficiency - maxAvailableProficiency;
      let status: SkillGapItem['status'] = 'UNCOVERED';
      let actionRecommendation = '';

      if (maxAvailableProficiency >= req.min_proficiency) {
        status = 'FULLY_COVERED';
        coveredCount++;
        actionRecommendation = 'Adequately staffed with qualified personnel.';
      } else if (maxAvailableProficiency > 0) {
        status = 'PARTIALLY_COVERED';
        actionRecommendation = `Upskill team member (current level ${maxAvailableProficiency} vs required ${req.min_proficiency}).`;
      } else {
        status = 'UNCOVERED';
        actionRecommendation = 'No team member currently possesses this competency. Assign specialist or recruit.';
        if (req.importance === 'CRITICAL') {
          criticalGaps++;
        }
      }

      // Find matching training resource
      const matchedTraining = allTrainingResources.find(
        (tr) =>
          tr.skill_id === req.skill_id ||
          (tr.skill_name && req.skill_name && tr.skill_name.toLowerCase() === req.skill_name.toLowerCase())
      );

      gaps.push({
        skillId: req.skill_id,
        skillName: req.skill_name || 'Skill',
        category: 'Technical',
        requiredProficiency: req.min_proficiency,
        availableProficiency: maxAvailableProficiency,
        gap: Math.max(0, diff),
        importance: req.importance,
        status,
        qualifiedEmployeeCount: qualifiedEmployees,
        recommendedTraining: matchedTraining,
        actionRecommendation,
      });
    }

    const total = Math.max(1, requirements.length);
    const coveragePercentage = Math.round((coveredCount / total) * 100);

    let suggestedActionPlan = 'Team satisfies key skill requirements.';
    if (criticalGaps > 0) {
      suggestedActionPlan = `Urgent: ${criticalGaps} critical skills missing. Pair with external contractors or allocate specialist engineers before sprint kickoff.`;
    } else if (coveragePercentage < 80) {
      suggestedActionPlan = 'Recommend enrolling assigned junior engineers in curated upskilling modules.';
    }

    return {
      projectId: project.id,
      projectName: project.name,
      totalRequirements: requirements.length,
      coveredRequirementsCount: coveredCount,
      criticalGapsCount: criticalGaps,
      coveragePercentage,
      gaps,
      suggestedActionPlan,
    };
  }
}
