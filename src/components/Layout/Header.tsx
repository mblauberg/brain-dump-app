import React from 'react';
import { CpuChipIcon, CalendarIcon, ChartBarIcon, CogIcon, BoltIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { setIsBrainDumpOpen } = useAppStore();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'habits', label: 'Habits', icon: BoltIcon },
    { id: 'sleep', label: 'Sleep', icon: MoonIcon },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8" role="banner">
      <div className="flex items-center justify-between h-16">
        {/* Logo - Hidden on mobile to save space */}
        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CpuChipIcon className="h-8 w-8 text-primary-600" aria-hidden="true" />
            <h1 className="text-xl font-bold text-gray-900">ADHD Brain Organiser</h1>
          </div>
        </div>

        {/* Mobile Logo - Simplified */}
        <div className="sm:hidden flex items-center space-x-2">
          <CpuChipIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
          <h1 className="text-lg font-bold text-gray-900">Brain Organiser</h1>
        </div>

        {/* Navigation - Responsive */}
        <nav className="flex space-x-1 overflow-x-auto" role="navigation" aria-label="Main navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                aria-label={`Navigate to ${tab.label}`}
              >
                <Icon className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sr-only sm:hidden">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Brain Dump Button - Responsive */}
        <button
          onClick={() => setIsBrainDumpOpen(true)}
          className="btn btn-primary text-xs sm:text-sm px-2 sm:px-4"
          aria-label="Open Brain Dump to capture quick thoughts"
        >
          <CpuChipIcon className="h-4 w-4 sm:mr-2" aria-hidden="true" />
          <span className="hidden sm:inline">Brain Dump</span>
          <span className="sm:hidden">Dump</span>
        </button>
      </div>
    </header>
  );
};

export default Header;