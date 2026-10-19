import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import ScrollToTop from './components/common/ScrollToTop';
import PageTransition from './components/common/PageTransition';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import UploadResumePage from './pages/UploadResumePage';
import ResumeOverviewPage from './pages/ResumeOverviewPage';
import ChooseAnalysisPage from './pages/ChooseAnalysisPage';
import AnalysisDashboardPage from './pages/AnalysisDashboardPage';
import ProblemsSuggestionsPage from './pages/ProblemsSuggestionsPage';
import AICorrectionPage from './pages/AICorrectionPage';
import RecheckPage from './pages/RecheckPage';
import JobMatcherPage from './pages/JobMatcherPage';
import CareerDiscoveryIntroPage from './pages/CareerDiscoveryIntroPage';
import QuestionnairePage from './pages/QuestionnairePage';
import CareerResultsPage from './pages/CareerResultsPage';
import RoleDetailsPage from './pages/RoleDetailsPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import ResumeServicesPage from './pages/ResumeServicesPage';
import AIAssistantPage from './pages/AIAssistantPage';
import RecommendationsPage from './pages/RecommendationsPage';
import LearningPlanPage from './pages/LearningPlanPage';
import HistoryPage from './pages/HistoryPage';

import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Guard Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <PageTransition />
      <Routes>
        {/* Public Landing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

        {/* Protected Services & Dashboard Workspace */}
        <Route path="/resume-services" element={<ProtectedRoute><ResumeServicesPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/upload-resume" element={<ProtectedRoute><UploadResumePage /></ProtectedRoute>} />
        <Route path="/resume-overview" element={<ProtectedRoute><ResumeOverviewPage /></ProtectedRoute>} />
        <Route path="/choose-analysis" element={<ProtectedRoute><ChooseAnalysisPage /></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><AnalysisDashboardPage /></ProtectedRoute>} />
        <Route path="/issues" element={<ProtectedRoute><ProblemsSuggestionsPage /></ProtectedRoute>} />
        <Route path="/corrections" element={<ProtectedRoute><AICorrectionPage /></ProtectedRoute>} />
        <Route path="/recheck" element={<ProtectedRoute><RecheckPage /></ProtectedRoute>} />
        <Route path="/job-matcher" element={<ProtectedRoute><JobMatcherPage /></ProtectedRoute>} />

        {/* Career Discovery Flow */}
        <Route path="/career-discovery" element={<ProtectedRoute><CareerDiscoveryIntroPage /></ProtectedRoute>} />
        <Route path="/career-discovery/questionnaire" element={<ProtectedRoute><QuestionnairePage /></ProtectedRoute>} />
        <Route path="/career-discovery/results" element={<ProtectedRoute><CareerResultsPage /></ProtectedRoute>} />
        <Route path="/career-discovery/role/:id" element={<ProtectedRoute><RoleDetailsPage /></ProtectedRoute>} />

        {/* Builder, AI Assistant, Recommendations */}
        <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
        <Route path="/learning-plan" element={<ProtectedRoute><LearningPlanPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
