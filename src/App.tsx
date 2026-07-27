import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { ReportProblemForm } from './components/ReportProblemForm';
import { AIProblemAnalyzer } from './components/AIProblemAnalyzer';
import { IssueHistory } from './components/IssueHistory';
import { CommunityMap } from './components/CommunityMap';
import { EmergencyContacts } from './components/EmergencyContacts';
import { AIChatbot } from './components/AIChatbot';
import { SettingsPage } from './components/SettingsPage';
import { StorageService } from './services/storage';
import { Issue, IssueStatus, AppSettings, AIAnalysisResult } from './types';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  const [issues, setIssues] = useState<Issue[]>(() => StorageService.getIssues());
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [darkMode, setDarkMode] = useState<boolean>(settings.darkMode);

  // Apply dark mode class to root HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    const updated = StorageService.saveSettings({ darkMode: nextVal });
    setSettings(updated);
  };

  const handleSaveIssue = (issueData: Omit<Issue, 'id' | 'updatedAt'> & { id?: string }): Issue => {
    const saved = StorageService.saveIssue(issueData);
    setIssues(StorageService.getIssues());
    return saved;
  };

  const handleUpdateStatus = (id: string, status: IssueStatus) => {
    StorageService.updateIssueStatus(id, status);
    setIssues(StorageService.getIssues());
  };

  const handleDeleteIssue = (id: string) => {
    StorageService.deleteIssue(id);
    setIssues(StorageService.getIssues());
  };

  const handleUpdateIssueAnalysis = (issueId: string, analysis: AIAnalysisResult) => {
    const existing = issues.find((i) => i.id === issueId);
    if (existing) {
      existing.aiAnalysis = analysis;
      existing.priority = analysis.priority;
      StorageService.saveIssue(existing);
      setIssues(StorageService.getIssues());
    }
  };

  const handleSaveSettings = (newSettings: Partial<AppSettings>) => {
    const updated = StorageService.saveSettings(newSettings);
    setSettings(updated);
  };

  const handleResetData = () => {
    const defaultIssues = StorageService.resetToDefaults();
    setIssues(defaultIssues);
  };

  const handleOpenDashboardTab = (tab = 'dashboard', issueId?: string) => {
    setIsLandingPage(false);
    setCurrentTab(tab);
    if (issueId) {
      setSelectedIssueId(issueId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0d9488] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black transition-colors duration-200 relative overflow-x-hidden">
      {/* Background Frosted Glass Ambient Lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-0" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -z-0" />

      {/* Top Navbar Header */}
      <div className="relative z-10">
        <Navbar
          currentTab={currentTab}
          onTabChange={(tab) => handleOpenDashboardTab(tab)}
          isLandingPage={isLandingPage}
          setIsLandingPage={setIsLandingPage}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
      </div>

      {/* Main Content Area */}
      {isLandingPage ? (
        <LandingPage onOpenDashboard={(tab) => handleOpenDashboardTab(tab)} />
      ) : (
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Mobile Sidebar Toggle Header */}
          <div className="md:hidden fixed bottom-4 right-4 z-40">
            <button
              onClick={() => setIsOpenMobileSidebar(!isOpenMobileSidebar)}
              className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-2xl flex items-center justify-center gap-2 font-bold text-xs"
            >
              {isOpenMobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span>Menu</span>
            </button>
          </div>

          {/* Desktop & Mobile Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onTabChange={(tab) => {
              setCurrentTab(tab);
              setSelectedIssueId(null);
            }}
            isOpenMobile={isOpenMobileSidebar}
            onCloseMobile={() => setIsOpenMobileSidebar(false)}
          />

          {/* Dashboard View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden">
            {currentTab === 'dashboard' && (
              <DashboardOverview
                issues={issues}
                onNavigate={(tab, issueId) => handleOpenDashboardTab(tab, issueId)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {currentTab === 'report' && (
              <ReportProblemForm
                onSaveIssue={handleSaveIssue}
                onNavigateToAnalyzer={(id) => handleOpenDashboardTab('analyzer', id)}
                userGroqKey={settings.groqApiKey}
              />
            )}

            {currentTab === 'analyzer' && (
              <AIProblemAnalyzer
                issues={issues}
                selectedIssueId={selectedIssueId}
                userGroqKey={settings.groqApiKey}
                onUpdateIssueAnalysis={handleUpdateIssueAnalysis}
              />
            )}

            {currentTab === 'history' && (
              <IssueHistory
                issues={issues}
                onUpdateStatus={handleUpdateStatus}
                onDeleteIssue={handleDeleteIssue}
                onSaveIssue={handleSaveIssue}
                onNavigateToAnalyzer={(id) => handleOpenDashboardTab('analyzer', id)}
              />
            )}

            {currentTab === 'map' && (
              <CommunityMap
                issues={issues}
                onNavigateToAnalyzer={(id) => handleOpenDashboardTab('analyzer', id)}
                onNavigateToReport={() => handleOpenDashboardTab('report')}
              />
            )}

            {currentTab === 'emergency' && <EmergencyContacts />}

            {currentTab === 'chatbot' && (
              <AIChatbot
                userGroqKey={settings.groqApiKey}
                onNavigateToReport={() => handleOpenDashboardTab('report')}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsPage
                settings={settings}
                onSaveSettings={handleSaveSettings}
                onResetData={handleResetData}
                darkMode={darkMode}
                onToggleDarkMode={handleToggleDarkMode}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
