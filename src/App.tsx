import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { TopAppBar, BottomNavBar } from './components/Navigation';
import { DashboardScreen } from './components/DashboardScreen';
import { ScheduleScreen } from './components/ScheduleScreen';
import { TasksScreen } from './components/TasksScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { FlashcardsScreen } from './components/FlashcardsScreen';
import { TutorScreen } from './components/TutorScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';

function AppContent() {
  const { activeTab, setActiveTab } = useUser();
  
  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen key="dashboard" />;
      case 'schedule':
        return <ScheduleScreen key="schedule" />;
      case 'tasks':
        return <TasksScreen key="tasks" />;
      case 'flashcards':
        return <FlashcardsScreen key="flashcards" />;
      case 'tutor':
        return <TutorScreen key="tutor" />;
      case 'profile':
        return <ProfileScreen key="profile" />;
      case 'settings':
        return <SettingsScreen key="settings" />;
      default:
        return <DashboardScreen key="dashboard" />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary/30 selection:text-primary transition-colors">
      <TopAppBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
      
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-6 pt-12">
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </main>

      <BottomNavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}
