import React, { useState } from 'react';
import { CogIcon, BellIcon, MoonIcon, ClockIcon, AcademicCapIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import OnboardingModal from '../Onboarding/OnboardingModal';
import AISettings from './AISettings';

const Settings: React.FC = () => {
  const { userPreferences, updateUserPreferences } = useAppStore();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const handleNotificationChange = (type: 'tasks' | 'habits' | 'sleep', value: boolean) => {
    updateUserPreferences({
      notifications: {
        ...userPreferences.notifications,
        [type]: value,
      },
    });
  };

  const handleWorkingHoursChange = (field: 'start' | 'end', value: string) => {
    updateUserPreferences({
      workingHours: {
        ...userPreferences.workingHours,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="card">
          <div className="flex items-center mb-4">
            <BellIcon className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Task Reminders</label>
                <p className="text-xs text-gray-500">Get notified about upcoming tasks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPreferences.notifications.tasks}
                  onChange={(e) => handleNotificationChange('tasks', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Habit Reminders</label>
                <p className="text-xs text-gray-500">Get reminded about your daily habits</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPreferences.notifications.habits}
                  onChange={(e) => handleNotificationChange('habits', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Sleep Reminders</label>
                <p className="text-xs text-gray-500">Get bedtime and wake-up reminders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPreferences.notifications.sleep}
                  onChange={(e) => handleNotificationChange('sleep', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="card">
          <div className="flex items-center mb-4">
            <ClockIcon className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Working Hours</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={userPreferences.workingHours.start}
                onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={userPreferences.workingHours.end}
                onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Break Duration (minutes)</label>
              <input
                type="number"
                min="5"
                max="120"
                value={userPreferences.breakDuration}
                onChange={(e) => updateUserPreferences({ breakDuration: Number(e.target.value) })}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="card">
          <div className="flex items-center mb-4">
            <MoonIcon className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select
              value={userPreferences.theme}
              onChange={(e) => updateUserPreferences({ theme: e.target.value as 'light' | 'dark' | 'auto' })}
              className="input"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        {/* Energy Peak Hours */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-5 h-5 bg-yellow-500 rounded mr-2 flex items-center justify-center">
              <span className="text-white text-xs">⚡</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Energy Peak Hours</h2>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            When do you typically have the most energy? This helps us schedule your most important tasks.
          </p>
          
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i;
              const isSelected = userPreferences.energyPeakHours.includes(hour);
              return (
                <button
                  key={hour}
                  onClick={() => {
                    const newPeakHours = isSelected
                      ? userPreferences.energyPeakHours.filter(h => h !== hour)
                      : [...userPreferences.energyPeakHours, hour];
                    updateUserPreferences({ energyPeakHours: newPeakHours });
                  }}
                  className={`p-2 text-xs rounded ${
                    isSelected
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {hour === 0 ? '12 AM' : hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Configuration */}
      <div className="card">
        <div className="flex items-center mb-4">
          <CpuChipIcon className="h-5 w-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">AI Brain Dump Processing</h2>
        </div>
        <AISettings />
      </div>

      {/* ADHD-Specific Settings */}
      <div className="card">
        <div className="flex items-center mb-4">
          <CogIcon className="h-5 w-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">ADHD-Friendly Features</h2>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Coming Soon</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Gentle reminder styles to reduce overwhelm</li>
            <li>• Time blindness compensation with buffer time</li>
            <li>• Hyperfocus session management</li>
            <li>• Executive function assistance modes</li>
            <li>• Dopamine-friendly reward systems</li>
          </ul>
        </div>
      </div>

      {/* Help & Support */}
      <div className="card">
        <div className="flex items-center mb-4">
          <AcademicCapIcon className="h-5 w-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Help & Support</h2>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              localStorage.removeItem('onboarding-completed');
              setIsOnboardingOpen(true);
            }}
            className="w-full text-left p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-primary-600 text-lg">🎓</span>
              </div>
              <div>
                <h3 className="font-medium text-primary-800">Restart Onboarding</h3>
                <p className="text-sm text-primary-700">Go through the app tutorial again</p>
              </div>
            </div>
          </button>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">💡 Need Help?</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Check out the onboarding tour for a refresher</li>
              <li>• Try the Brain Dump feature when feeling overwhelmed</li>
              <li>• Start with small, manageable tasks</li>
              <li>• Remember: progress over perfection!</li>
            </ul>
          </div>
        </div>
      </div>

      <OnboardingModal 
        isOpen={isOnboardingOpen} 
        onClose={() => setIsOnboardingOpen(false)} 
      />
    </div>
  );
};

export default Settings;