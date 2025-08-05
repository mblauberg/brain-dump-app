import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from '../Dashboard/Dashboard';
import HabitsView from '../Dashboard/HabitsView';
import SleepView from '../Sleep/SleepView';
import Calendar from '../Calendar/Calendar';
import Settings from '../Settings/Settings';
import BrainDumpModal from '../BrainDump/BrainDumpModal';

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'habits':
        return <HabitsView />;
      case 'sleep':
        return <SleepView />;
      case 'calendar':
        return <Calendar />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, collapsible on tablet */}
        <nav id="navigation" className="hidden lg:block" aria-label="Main navigation">
          <Sidebar />
        </nav>
        <main id="main-content" className="flex-1 p-4 sm:p-6" role="main" tabIndex={-1}>
          <div className="sr-only">
            <h1>ADHD Brain Organiser - {activeTab === 'dashboard' ? 'Dashboard' : activeTab}</h1>
          </div>
          {renderContent()}
        </main>
      </div>
      <BrainDumpModal />
    </div>
  );
};

export default Layout;