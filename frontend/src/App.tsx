import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { WorkforcePage } from './pages/WorkforcePage';
import { EmployeeDetailPage } from './pages/EmployeeDetailPage';
import { TeamRecommendationPage } from './pages/TeamRecommendationPage';
import { SimulationPage } from './pages/SimulationPage';
import { WorkloadPage } from './pages/WorkloadPage';
import { SkillsTrainingPage } from './pages/SkillsTrainingPage';
import { ReviewsGoalsPage } from './pages/ReviewsGoalsPage';
import { InsightsPage } from './pages/InsightsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/workforce" element={<WorkforcePage />} />
            <Route path="/workforce/:id" element={<EmployeeDetailPage />} />
            <Route path="/team-recommendations" element={<TeamRecommendationPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/workload" element={<WorkloadPage />} />
            <Route path="/skills-training" element={<SkillsTrainingPage />} />
            <Route path="/reviews" element={<ReviewsGoalsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
