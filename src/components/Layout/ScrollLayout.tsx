import React, { useState, useEffect, useRef } from 'react';
import FloatingHeader from './FloatingHeader';
import ScrollSection from './ScrollSection';
import BrainDumpFixed from '../BrainDump/BrainDumpFixed';
import TasksSection from '../Sections/TasksSection';
import HabitsSection from '../Sections/HabitsSection';
import { GlassContainer } from '../Glass';
import { useAppStore } from '../../stores/useAppStore';
import { 
  BeakerIcon, 
  CheckCircleIcon, 
  BoltIcon, 
  MoonIcon, 
  CalendarDaysIcon, 
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface ScrollLayoutProps {
  energyLevel?: 'high' | 'medium' | 'low';
  cognitiveLoad?: 'minimal' | 'standard' | 'detailed';
}

const ScrollLayout: React.FC<ScrollLayoutProps> = ({
  energyLevel = 'medium',
  cognitiveLoad = 'standard',
}) => {
  const [currentSection, setCurrentSection] = useState('brain-dump');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollPositionRef = useRef<{ [key: string]: number }>({});
  
  const { tasks, habits } = useAppStore();

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!isAutoScrolling) {
        const position = window.scrollY;
        setScrollPosition(position);
        scrollPositionRef.current[currentSection] = position;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection, isAutoScrolling]);

  // Section visibility tracking
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    const observer = new IntersectionObserver(
      (entries) => {
        if (isAutoScrolling) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId && sectionId !== currentSection) {
              setCurrentSection(sectionId);
            }
          }
        });
      },
      {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '-80px 0px -50% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [currentSection, isAutoScrolling]);

  const handleSectionChange = (sectionId: string) => {
    setIsAutoScrolling(true);
    setCurrentSection(sectionId);
    
    // Restore previous scroll position if available
    setTimeout(() => {
      setIsAutoScrolling(false);
    }, 1000);
  };

  const handleProcessingComplete = (results: any) => {
    // Scroll to tasks section if tasks were created
    if (results.tasks.length > 0) {
      setTimeout(() => {
        const tasksSection = document.getElementById('section-tasks');
        if (tasksSection) {
          tasksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating Header */}
      <FloatingHeader
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        energyLevel={energyLevel}
      />

      {/* Main Content */}
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          
          
          {/* Brain Dump Section - Always Fixed at Top */}
          <ScrollSection
            id="brain-dump"
            title="Mind Palace"
            icon={BeakerIcon}
            cognitiveWeight={cognitiveLoad === 'minimal' ? 'light' : 'medium'}
            energyLevel={energyLevel}
            className="scroll-mt-20"
          >
            <BrainDumpFixed
              energyLevel={energyLevel}
              onProcessingComplete={handleProcessingComplete}
            />
          </ScrollSection>

          {/* Tasks Section */}
          <ScrollSection
            id="tasks"
            title="Active Tasks"
            icon={CheckCircleIcon}
            collapsible={cognitiveLoad === 'detailed'}
            initiallyExpanded={true}
            cognitiveWeight={cognitiveLoad === 'minimal' ? 'light' : cognitiveLoad === 'detailed' ? 'heavy' : 'medium'}
            energyLevel={energyLevel}
            lazyLoad={false}
          >
            <TasksSection
              energyLevel={energyLevel}
              cognitiveLoad={cognitiveLoad}
              onTaskEdit={(task) => {
                // TODO: Open task edit modal
                console.log('Edit task:', task);
              }}
            />
          </ScrollSection>

          {/* Habits Section */}
          <ScrollSection
            id="habits"
            title="Daily Habits"
            icon={BoltIcon}
            collapsible={cognitiveLoad === 'detailed'}
            initiallyExpanded={true}
            cognitiveWeight={cognitiveLoad === 'minimal' ? 'light' : cognitiveLoad === 'detailed' ? 'heavy' : 'medium'}
            energyLevel={energyLevel}
            lazyLoad={false}
          >
            <HabitsSection
              energyLevel={energyLevel}
              cognitiveLoad={cognitiveLoad}
              onHabitEdit={(habit) => {
                // TODO: Open habit edit modal
                console.log('Edit habit:', habit);
              }}
            />
          </ScrollSection>

          {/* Sleep Section - Simplified */}
          <ScrollSection
            id="sleep"
            title="Sleep & Recovery"
            icon={MoonIcon}
            collapsible={true}
            initiallyExpanded={cognitiveLoad !== 'minimal'}
            cognitiveWeight="light"
            energyLevel={energyLevel}
            lazyLoad={true}
          >
            <GlassContainer
              variant="light"
              cognitiveLoad="minimal"
              energyLevel={energyLevel}
              className="text-center py-8"
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <MoonIcon className="w-16 h-16 text-primary-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Sleep Tracking Coming Soon</h4>
                <p className="text-gray-600 max-w-md mx-auto">
                  Track your sleep quality, bedtime routines, and recovery patterns to optimize your ADHD management.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span>🌙 Bedtime Routines</span>
                  <span>📊 Sleep Quality</span>
                  <span>⏰ Smart Reminders</span>
                </div>
              </div>
            </GlassContainer>
          </ScrollSection>

          {/* Calendar Section - Simplified */}
          <ScrollSection
            id="calendar"
            title="Upcoming Events"
            icon={CalendarDaysIcon}
            collapsible={true}
            initiallyExpanded={cognitiveLoad === 'detailed'}
            cognitiveWeight="light"
            energyLevel={energyLevel}
            lazyLoad={true}
          >
            <GlassContainer
              variant="light"
              cognitiveLoad="minimal"
              energyLevel={energyLevel}
              className="text-center py-8"
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <CalendarDaysIcon className="w-16 h-16 text-primary-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Smart Calendar Integration</h4>
                <p className="text-gray-600 max-w-md mx-auto">
                  Sync with your existing calendars and get ADHD-optimized scheduling suggestions based on your energy levels.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span>🔄 Calendar Sync</span>
                  <span>⚡ Energy-Based Scheduling</span>
                  <span>🧠 Smart Reminders</span>
                </div>
              </div>
            </GlassContainer>
          </ScrollSection>

          {/* Quick Stats Footer */}
          {cognitiveLoad !== 'minimal' && (tasks.length > 0 || habits.length > 0) && (
            <ScrollSection
              id="stats"
              title="Your Progress"
              icon={ChartBarIcon}
              collapsible={false}
              cognitiveWeight="light"
              energyLevel={energyLevel}
              lazyLoad={true}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassContainer
                  variant="light"
                  cognitiveLoad="minimal"
                  energyLevel={energyLevel}
                  className="text-center p-4"
                >
                  <div className="text-2xl font-bold text-primary-600">{tasks.length}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </GlassContainer>

                <GlassContainer
                  variant="light"
                  cognitiveLoad="minimal"
                  energyLevel={energyLevel}
                  className="text-center p-4"
                >
                  <div className="text-2xl font-bold text-green-600">
                    {tasks.filter(t => t.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </GlassContainer>

                <GlassContainer
                  variant="light"
                  cognitiveLoad="minimal"
                  energyLevel={energyLevel}
                  className="text-center p-4"
                >
                  <div className="text-2xl font-bold text-purple-600">{habits.length}</div>
                  <div className="text-sm text-gray-600">Active Habits</div>
                </GlassContainer>

                <GlassContainer
                  variant="light"
                  cognitiveLoad="minimal"
                  energyLevel={energyLevel}
                  className="text-center p-4"
                >
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / (habits.length || 1))}
                  </div>
                  <div className="text-sm text-gray-600">Avg Streak</div>
                </GlassContainer>
              </div>
            </ScrollSection>
          )}

          {/* Settings Access */}
          <ScrollSection
            id="settings"
            title="Preferences"
            icon={CogIcon}
            collapsible={true}
            initiallyExpanded={false}
            cognitiveWeight="light"
            energyLevel={energyLevel}
            lazyLoad={true}
          >
            <GlassContainer
              variant="light"
              cognitiveLoad="minimal"
              energyLevel={energyLevel}
              className="text-center py-6"
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <CogIcon className="w-12 h-12 text-primary-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Customize Your Experience</h4>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  Adjust energy levels, cognitive load, AI settings, and accessibility preferences.
                </p>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Open Settings →
                </button>
              </div>
            </GlassContainer>
          </ScrollSection>
        </div>
      </main>

      {/* Scroll Progress Indicator */}
      <div className="fixed bottom-4 right-4 z-30">
        <GlassContainer
          variant="light"
          cognitiveLoad="minimal"
          energyLevel={energyLevel}
          className="px-3 py-2"
        >
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span className="capitalize">{currentSection.replace('-', ' ')}</span>
            <div className="w-12 h-1 bg-gray-200 rounded-full">
              <div
                className="h-1 bg-primary-500 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((scrollPosition / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </GlassContainer>
      </div>
    </div>
  );
};

export default ScrollLayout;