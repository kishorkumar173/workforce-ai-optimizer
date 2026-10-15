import { Employee, Assignment } from '../types';

export interface EmployeeWorkloadSummary {
  employeeId: string;
  employeeName: string;
  jobTitle: string;
  department: string;
  avatarUrl?: string;
  weeklyCapacityHours: number;
  totalAllocatedHours: number;
  utilizationPercentage: number;
  status: 'OPTIMAL' | 'NEAR_CAPACITY' | 'OVERLOADED' | 'UNDERUTILIZED';
  activeAssignmentsCount: number;
  assignments: Array<{
    projectId: string;
    projectName: string;
    role: string;
    allocationPercentage: number;
    allocatedHours: number;
  }>;
}

export interface OrganizationWorkloadOverview {
  totalEmployees: number;
  totalCapacityHours: number;
  totalAllocatedHours: number;
  averageUtilizationPercentage: number;
  overloadedEmployeesCount: number;
  underutilizedEmployeesCount: number;
  departmentUtilization: Array<{
    department: string;
    employeeCount: number;
    averageUtilization: number;
    allocatedHours: number;
    capacityHours: number;
  }>;
  employees: EmployeeWorkloadSummary[];
}

export class WorkloadCalculator {
  /**
   * Calculate exact utilization percentage and allocations for employees.
   */
  public static calculateWorkload(
    employees: Employee[],
    assignments: Assignment[]
  ): OrganizationWorkloadOverview {
    const activeAssignments = assignments.filter((a) => a.status === 'ACTIVE');

    let totalCapacityHours = 0;
    let totalAllocatedHours = 0;
    let overloadedCount = 0;
    let underutilizedCount = 0;

    const deptMap: Record<
      string,
      { employeeCount: number; totalAllocated: number; totalCapacity: number }
    > = {};

    const employeeSummaries: EmployeeWorkloadSummary[] = employees.map((emp) => {
      const capacity = emp.weekly_capacity_hours || 40.0;
      totalCapacityHours += capacity;

      const empAssignments = activeAssignments.filter((a) => a.employee_id === emp.id);
      
      let allocatedHours = 0;
      const formattedAssignments = empAssignments.map((a) => {
        const hours = (a.allocation_percentage / 100) * capacity;
        allocatedHours += hours;
        return {
          projectId: a.project_id,
          projectName: a.project_name || 'Project',
          role: a.assigned_role,
          allocationPercentage: a.allocation_percentage,
          allocatedHours: Math.round(hours * 10) / 10,
        };
      });

      totalAllocatedHours += allocatedHours;
      const utilPercent = Math.round((allocatedHours / capacity) * 100);

      let status: EmployeeWorkloadSummary['status'] = 'OPTIMAL';
      if (utilPercent > 100) {
        status = 'OVERLOADED';
        overloadedCount++;
      } else if (utilPercent >= 80) {
        status = 'NEAR_CAPACITY';
      } else if (utilPercent < 50) {
        status = 'UNDERUTILIZED';
        underutilizedCount++;
      }

      // Department aggregation
      const dept = emp.department || 'General';
      if (!deptMap[dept]) {
        deptMap[dept] = { employeeCount: 0, totalAllocated: 0, totalCapacity: 0 };
      }
      deptMap[dept].employeeCount++;
      deptMap[dept].totalAllocated += allocatedHours;
      deptMap[dept].totalCapacity += capacity;

      return {
        employeeId: emp.id,
        employeeName: emp.full_name,
        jobTitle: emp.job_title,
        department: emp.department,
        avatarUrl: emp.avatar_url,
        weeklyCapacityHours: capacity,
        totalAllocatedHours: Math.round(allocatedHours * 10) / 10,
        utilizationPercentage: utilPercent,
        status,
        activeAssignmentsCount: empAssignments.length,
        assignments: formattedAssignments,
      };
    });

    const averageUtilizationPercentage =
      totalCapacityHours > 0
        ? Math.round((totalAllocatedHours / totalCapacityHours) * 100)
        : 0;

    const departmentUtilization = Object.entries(deptMap).map(([department, data]) => ({
      department,
      employeeCount: data.employeeCount,
      allocatedHours: Math.round(data.totalAllocated * 10) / 10,
      capacityHours: data.totalCapacity,
      averageUtilization:
        data.totalCapacity > 0
          ? Math.round((data.totalAllocated / data.totalCapacity) * 100)
          : 0,
    }));

    return {
      totalEmployees: employees.length,
      totalCapacityHours,
      totalAllocatedHours: Math.round(totalAllocatedHours * 10) / 10,
      averageUtilizationPercentage,
      overloadedEmployeesCount: overloadedCount,
      underutilizedEmployeesCount: underutilizedCount,
      departmentUtilization,
      employees: employeeSummaries,
    };
  }
}
