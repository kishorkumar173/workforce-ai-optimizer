import React, { useEffect, useState } from 'react';
import { StatCards } from '../components/dashboard/StatCards';
import { ProjectProgressChart } from '../components/dashboard/ProjectProgressChart';
import { WorkforceAllocationDonut } from '../components/dashboard/WorkforceAllocationDonut';
import { ActiveProjectsTable } from '../components/dashboard/ActiveProjectsTable';
import { AiInsightsList } from '../components/dashboard/AiInsightsList';
import { AiAssistantCard } from '../components/dashboard/AiAssistantCard';
import { UpcomingTasksList } from '../components/dashboard/UpcomingTasksList';
import { TeamStatusList } from '../components/dashboard/TeamStatusList';
import { AiBanner } from '../components/dashboard/AiBanner';
import { EmployeePersonalDashboard } from '../components/dashboard/EmployeePersonalDashboard';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardMetrics, Project } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | undefined>(undefined);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [metricData, projectData] = await Promise.all([
          api.getDashboardMetrics(),
          api.getProjects(),
        ]);
        setMetrics(metricData);
        setProjects(projectData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Dedicated personalized dashboard for employees (Features 2, 3, 5)
  if (user.role === 'EMPLOYEE') {
    return <EmployeePersonalDashboard />;
  }

  const todayStr = 'Monday, 27 May 2026';

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Welcome back, {user.full_name.split(' ')[0]}!</span>
            <span>👋</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Here's what's happening with your teams and projects today.
          </p>
        </div>

        <div className="text-xs font-semibold text-cyan-300 bg-white/[0.04] px-4 py-2 rounded-xl border border-white/10 shadow-sm self-start sm:self-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{todayStr}</span>
        </div>
      </div>

      {/* KPI Cards (4 cards across) */}
      <StatCards metrics={metrics} />

      {/* Main Grid: Left Content (2 Cols) + Right Sidebar (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Charts & Tables (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Row 1: Line Chart + Donut */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <ProjectProgressChart data={metrics?.progressOverview} />
            </div>
            <div className="md:col-span-5">
              <WorkforceAllocationDonut
                data={metrics?.departmentAllocation}
                totalEmployees={metrics?.totalEmployees}
              />
            </div>
          </div>

          {/* Row 2: Active Projects Table + AI Insights */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <ActiveProjectsTable projects={projects} />
            </div>
            <div className="md:col-span-5">
              <AiInsightsList insights={metrics?.aiInsights} />
            </div>
          </div>

          {/* Row 3: Futuristic AI Banner */}
          <AiBanner />
        </div>

        {/* Right Rail: AI Assistant, Upcoming Tasks, Team Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <AiAssistantCard />
          <UpcomingTasksList />
          <TeamStatusList />
        </div>
      </div>
    </div>
  );
};
