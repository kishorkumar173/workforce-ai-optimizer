import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock fetch for API calls
global.fetch = vi.fn().mockImplementation((url: string) => {
  if (url.includes('/analytics/dashboard')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          metrics: {
            totalEmployees: 152,
            activeProjects: 24,
            resourceUtilizationRate: 87,
            projectSuccessRate: 98,
            departmentAllocation: [
              { name: 'Development', percentage: 35, count: 53, color: '#3B82F6' },
              { name: 'Design', percentage: 15, count: 23, color: '#10B981' },
            ],
            progressOverview: [
              { month: 'Jan', planning: 20, inProgress: 40, completed: 30 },
            ],
            aiInsights: [
              {
                id: '1',
                category: 'Resource Optimization',
                title: 'Resource Optimization',
                description: '2 projects are over-resourced.',
                badgeColor: 'teal',
              },
            ],
          },
        }),
    });
  }

  if (url.includes('/projects')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          projects: [
            {
              id: 'proj-1',
              name: 'E-Commerce Platform',
              department: 'Development',
              priority: 'HIGH',
              status: 'On Track',
              deadline: 'May 30, 2026',
              requested_team_size: 4,
              progress_percentage: 75,
            },
          ],
        }),
    });
  }

  if (url.includes('/notifications')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          notifications: [],
          unreadCount: 3,
        }),
    });
  }

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
});

describe('TeamPulse Intelligence Web Application', () => {
  it('renders application navigation and brand title', async () => {
    render(<App />);
    expect(screen.getByText(/WorkForceAI/i)).toBeInTheDocument();
    expect(screen.getByText(/People • Projects • Productivity/i)).toBeInTheDocument();
  });

  it('renders welcome message and KPI stat cards on Dashboard', async () => {
    render(<App />);
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Employees/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Active Projects/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Resource Utilization/i)).toBeInTheDocument();
    expect(screen.getByText(/Project Success Rate/i)).toBeInTheDocument();
  });

  it('renders AI Assistant companion widget and quick prompts', async () => {
    render(<App />);
    expect(screen.getByText(/AI Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Suggest optimal team for a new project/i)).toBeInTheDocument();
  });
});
