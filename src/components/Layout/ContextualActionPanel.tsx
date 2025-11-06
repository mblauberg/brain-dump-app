import React, { useState, useMemo } from 'react';
import {
  PlusIcon,
  SparklesIcon,
  BoltIcon,
  ClockIcon,
  CheckCircleIcon,
  CogIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import GlassContainer from '../Glass/GlassContainer';

interface ContextualActionPanelProps {
  currentSection: string;
  energyLevel: 'high' | 'medium' | 'low';
  cognitiveLoad: 'minimal' | 'standard' | 'detailed';
  className?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  action: () => void;
  energyRequired?: 'high' | 'medium' | 'low';
  cognitiveRequired?: 'minimal' | 'standard' | 'detailed';
  badge?: string;
  disabled?: boolean;
}

const ContextualActionPanel: React.FC<ContextualActionPanelProps> = ({
  currentSection,
  energyLevel,
  cognitiveLoad,
  className = ''
}) => {
  const { 
    setIsBrainDumpOpen,
    tasks,
    habits,
    completeTask,
    addTask,
    addHabit
  } = useAppStore();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Context-aware actions based on current section
  const contextualActions = useMemo((): QuickAction[] => {
    const baseActions: QuickAction[] = [];

    switch (currentSection) {
      case 'brain-dump':
        baseActions.push(
          {
            id: 'quick-brain-dump',
            label: 'Quick Thought',
            icon: SparklesIcon,
            color: 'from-primary-500 to-secondary-500',
            action: () => setIsBrainDumpOpen(true),
            energyRequired: 'low'
          },
          {
            id: 'voice-input',
            label: 'Voice Input',
            icon: SparklesIcon,
            color: 'from-blue-500 to-purple-500',
            action: () => {
              // TODO: Implement voice input functionality
              console.log('Voice input not yet implemented');
            },
            energyRequired: 'medium',
            disabled: true
          }
        );
        break;

      case 'tasks':
        const incompleteTasks = tasks.filter(t => t.status !== 'completed');
        const highPriorityTasks = incompleteTasks.filter(t => t.priority === 'high');
        
        baseActions.push(
          {
            id: 'add-task',
            label: 'New Task',
            icon: PlusIcon,
            color: 'from-blue-500 to-blue-600',
            action: () => {
              // TODO: Replace with actual modal or form
              const title = prompt('Enter task title:');
              if (title) {
                addTask({
                  title,
                  description: '',
                  priority: 'medium',
                  category: 'other',
                  timeEstimate: '30min',
                  energyLevel: 'medium',
                  status: 'not_started'
                });
              }
            },
            energyRequired: 'medium'
          },
          {
            id: 'quick-complete',
            label: 'Quick Complete',
            icon: CheckCircleIcon,
            color: 'from-green-500 to-green-600',
            action: () => {
              const nextTask = incompleteTasks.find(t => t.priority === 'high') || incompleteTasks[0];
              if (nextTask) completeTask(nextTask.id);
            },
            badge: incompleteTasks.length > 0 ? `${incompleteTasks.length}` : undefined,
            disabled: incompleteTasks.length === 0
          }
        );

        if (highPriorityTasks.length > 0) {
          baseActions.push({
            id: 'focus-high-priority',
            label: 'Focus Mode',
            icon: BoltIcon,
            color: 'from-orange-500 to-red-500',
            action: () => {
              // TODO: Implement focus mode (filter to high priority only)
              console.log('Focus mode not yet implemented');
            },
            badge: `${highPriorityTasks.length}`,
            energyRequired: 'high'
          });
        }
        break;

      case 'habits':
        const todayHabits = habits.filter(h => h.isActive);
        const completedToday = todayHabits.filter(h => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return h.completedDates.some(date => {
            const completedDate = new Date(date);
            completedDate.setHours(0, 0, 0, 0);
            return completedDate.getTime() === today.getTime();
          });
        });

        baseActions.push(
          {
            id: 'add-habit',
            label: 'New Habit',
            icon: PlusIcon,
            color: 'from-purple-500 to-purple-600',
            action: () => {
              // TODO: Replace with actual modal or form
              const title = prompt('Enter habit title:');
              if (title) {
                addHabit({
                  title,
                  description: '',
                  frequency: 'daily',
                  isActive: true
                });
              }
            },
            energyRequired: 'medium'
          },
          {
            id: 'habit-check-in',
            label: 'Quick Check-in',
            icon: CheckCircleIcon,
            color: 'from-green-500 to-emerald-500',
            action: () => {
              // TODO: Open habit check-in modal
              console.log('Habit check-in not yet implemented');
            },
            badge: `${completedToday.length}/${todayHabits.length}`,
            disabled: todayHabits.length === 0
          }
        );
        break;

      case 'sleep':
        baseActions.push(
          {
            id: 'log-sleep',
            label: 'Log Sleep',
            icon: ClockIcon,
            color: 'from-indigo-500 to-purple-500',
            action: () => {
              // TODO: Open sleep logging modal
              console.log('Sleep logging not yet implemented');
            },
            energyRequired: 'low'
          },
          {
            id: 'bedtime-routine',
            label: 'Start Routine',
            icon: CheckCircleIcon,
            color: 'from-blue-500 to-indigo-500',
            action: () => {
              // TODO: Start bedtime routine
              console.log('Bedtime routine not yet implemented');
            },
            energyRequired: 'low'
          }
        );
        break;

      case 'calendar':
        baseActions.push(
          {
            id: 'schedule-time',
            label: 'Block Time',
            icon: ClockIcon,
            color: 'from-green-500 to-teal-500',
            action: () => {
              // TODO: Open time blocking interface
              console.log('Time blocking not yet implemented');
            },
            energyRequired: 'medium'
          },
          {
            id: 'energy-schedule',
            label: 'Energy Planning',
            icon: BoltIcon,
            color: 'from-orange-500 to-yellow-500',
            action: () => {
              // TODO: Open energy-based scheduling
              console.log('Energy planning not yet implemented');
            },
            energyRequired: 'high',
            cognitiveRequired: 'standard'
          }
        );
        break;

      default:
        baseActions.push({
          id: 'brain-dump',
          label: 'Brain Dump',
          icon: SparklesIcon,
          color: 'from-primary-500 to-secondary-500',
          action: () => setIsBrainDumpOpen(true),
          energyRequired: 'low'
        });
    }

    // Add global actions
    baseActions.push(
      {
        id: 'refresh',
        label: 'Refresh',
        icon: ArrowPathIcon,
        color: 'from-gray-500 to-gray-600',
        action: () => window.location.reload(),
        energyRequired: 'low'
      }
    );

    // Filter based on energy and cognitive load
    return baseActions.filter(action => {
      // Energy filtering
      if (action.energyRequired === 'high' && energyLevel === 'low') return false;
      if (action.energyRequired === 'medium' && energyLevel === 'low') return showAdvanced;
      
      // Cognitive load filtering
      if (action.cognitiveRequired === 'detailed' && cognitiveLoad === 'minimal') return showAdvanced;
      if (action.cognitiveRequired === 'standard' && cognitiveLoad === 'minimal') return showAdvanced;
      
      return true;
    });
  }, [currentSection, energyLevel, cognitiveLoad, tasks, habits, showAdvanced, setIsBrainDumpOpen, completeTask, addTask, addHabit]);

  const getEnergyColor = () => {
    switch (energyLevel) {
      case 'high': return 'from-orange-100 to-red-100 border-orange-200';
      case 'medium': return 'from-blue-100 to-purple-100 border-blue-200';
      case 'low': return 'from-green-100 to-teal-100 border-green-200';
      default: return 'from-gray-100 to-gray-200 border-gray-200';
    }
  };

  const getEnergyEmoji = () => {
    switch (energyLevel) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌱';
      default: return '⚡';
    }
  };

  if (isCollapsed) {
    return (
      <GlassContainer
        variant="medium"
        cognitiveLoad="minimal"
        energyLevel={energyLevel}
        elevation="elevated"
        className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${className}`}
      >
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-3 hover:bg-white/20 rounded-lg transition-colors"
          title="Expand action panel"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
      </GlassContainer>
    );
  }

  return (
    <GlassContainer
      variant="medium"
      cognitiveLoad={cognitiveLoad === 'minimal' ? 'minimal' : 'standard'}
      energyLevel={energyLevel}
      elevation="elevated"
      className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 w-64 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getEnergyEmoji()}</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Quick Actions</h3>
            <p className="text-xs text-gray-600 capitalize">
              {currentSection.replace('-', ' ')} • {energyLevel} energy
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          title="Collapse panel"
        >
          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Energy Level Indicator */}
      <div className={`mb-4 p-2 rounded-lg border ${getEnergyColor()}`}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">Energy Level</span>
          <span className="capitalize">{energyLevel}</span>
        </div>
        <div className="mt-1 w-full bg-white/50 rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              energyLevel === 'high' ? 'bg-orange-500 w-full' :
              energyLevel === 'medium' ? 'bg-blue-500 w-2/3' :
              'bg-green-500 w-1/3'
            }`}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {contextualActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              disabled={action.disabled}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 
                ${action.disabled 
                  ? 'opacity-50 cursor-not-allowed bg-gray-50/50' 
                  : 'hover:bg-white/30 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              title={action.disabled ? 'Not available' : `${action.label} (${action.energyRequired || 'any'} energy)`}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} flex-shrink-0`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
              
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm text-gray-900 truncate">
                    {action.label}
                  </span>
                  {action.badge && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                      {action.badge}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Advanced Actions Toggle */}
      {(energyLevel === 'low' || cognitiveLoad === 'minimal') && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-white/20 transition-colors text-sm text-gray-600 hover:text-gray-800"
          >
            {showAdvanced ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
          </button>
        </div>
      )}

      {/* Settings Quick Access */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <button
          onClick={() => {
            // TODO: Open settings modal or navigate to settings
            console.log('Settings not yet implemented');
          }}
          className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-white/20 transition-colors text-sm text-gray-600 hover:text-gray-800"
        >
          <CogIcon className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>
    </GlassContainer>
  );
};

export default ContextualActionPanel;