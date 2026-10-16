import React, { useState } from 'react';
import { SkillGapProvider, useSkillGap } from './context/SkillGapContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SkillDetailModal } from './components/SkillDetailModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { CareerSelectionPage } from './pages/CareerSelectionPage';
import { SkillAssessmentPage } from './pages/SkillAssessmentPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { JobAnalyzerPage } from './pages/JobAnalyzerPage';
import { DashboardPage } from './pages/DashboardPage';
import { SkillGapsPage } from './pages/SkillGapsPage';
import { SkillDependencyGraphPage } from './pages/SkillDependencyGraphPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { CareerMatchingPage } from './pages/CareerMatchingPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProgressPage } from './pages/ProgressPage';
import { FAIExplanationPage } from './pages/FAIExplanationPage';
import { AlgorithmPage } from './pages/AlgorithmPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { AdminPage } from './pages/AdminPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { currentView } = useSkillGap();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'profile':
        return <ProfilePage />;
      case 'career-select':
        return <CareerSelectionPage />;
      case 'assess-skills':
        return <SkillAssessmentPage />;
      case 'resume-upload':
        return <ResumeAnalyzerPage />;
      case 'job-analyzer':
        return <JobAnalyzerPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'skill-gaps':
        return <SkillGapsPage />;
      case 'skill-graph':
        return <SkillDependencyGraphPage />;
      case 'roadmap':
        return <RoadmapPage />;
      case 'career-match':
        return <CareerMatchingPage />;
      case 'resources':
        return <ResourcesPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'progress':
        return <ProgressPage />;
      case 'fai-works':
        return <FAIExplanationPage />;
      case 'algorithm':
        return <AlgorithmPage />;
      case 'data-sources':
        return <DataSourcesPage />;
      case 'admin':
        return <AdminPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LandingPage />;
    }
  };

  const isLanding = currentView === 'landing';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex">
        {/* Render Sidebar on all views except Landing Page to maximize hero presentation */}
        {!isLanding && (
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 transition-all ${!isLanding ? 'md:ml-64' : ''}`}>
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <SkillDetailModal />
      <AIAssistantDrawer />
    </div>
  );
};

export function App() {
  return (
    <SkillGapProvider>
      <AppContent />
    </SkillGapProvider>
  );
}

export default App;
