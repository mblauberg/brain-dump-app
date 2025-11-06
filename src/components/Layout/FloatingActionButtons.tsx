import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  SparklesIcon,
  BoltIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import GlassContainer from '../Glass/GlassContainer';

interface FloatingActionButtonsProps {
  currentSection: string;
  energyLevel: 'high' | 'medium' | 'low';
  cognitiveLoad: 'minimal' | 'standard' | 'detailed';
  className?: string;
}

interface FloatingAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  action: () => void;
  priority: number; // 1 = highest priority, 5 = lowest
  energyOptimal?: 'high' | 'medium' | 'low';
  sections?: string[]; // Which sections this action is relevant for
  badge?: string;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  currentSection,
  energyLevel,
  cognitiveLoad,
  className = ''
}) => {
  const {
    setIsBrainDumpOpen,
    tasks,
    addTask,
    addHabit
  } = useAppStore();
  
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [expandedActions, setExpandedActions] = useState(false);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Define all possible floating actions
  const allActions: FloatingAction[] = [
    {
      id: 'brain-dump',
      label: 'Brain Dump',
      icon: SparklesIcon,
      color: 'from-primary-500 to-secondary-500',
      action: () => setIsBrainDumpOpen(true),
      priority: 1,
      energyOptimal: 'medium',
      sections: ['brain-dump', 'tasks', 'habits', 'calendar']
    },
    {
      id: 'add-task',
      label: 'New Task',
      icon: PlusIcon,
      color: 'from-blue-500 to-blue-600',
      action: () => {
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
      priority: 2,
      energyOptimal: 'medium',
      sections: ['tasks', 'calendar']
    },
    {
      id: 'complete-task',
      label: 'Complete Task',
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
      action: () => {
        const incompleteTasks = tasks.filter(t => t.status !== 'completed');
        const nextTask = incompleteTasks.find(t => t.priority === 'high') || incompleteTasks[0];
        if (nextTask) {
          // TODO: Implement quick complete functionality
          console.log('Quick complete:', nextTask.title);
        }
      },
      priority: 3,
      energyOptimal: 'high',
      sections: ['tasks'],
      badge: tasks.filter(t => t.status !== 'completed').length.toString()
    },
    {
      id: 'add-habit',
      label: 'New Habit',
      icon: BoltIcon,
      color: 'from-purple-500 to-purple-600',
      action: () => {
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
      priority: 4,
      energyOptimal: 'medium',
      sections: ['habits']
    },
    {
      id: 'sleep-mode',
      label: 'Sleep Mode',
      icon: MoonIcon,
      color: 'from-indigo-500 to-purple-600',
      action: () => {
        // TODO: Implement sleep mode (dimmed UI, bedtime routine)
        console.log('Sleep mode activated');
      },
      priority: 5,
      energyOptimal: 'low',
      sections: ['sleep']
    }
  ];

  // Filter actions based on current context
  const relevantActions = allActions
    .filter(action => {
      // Filter by current section relevance
      if (action.sections && !action.sections.includes(currentSection)) {
        return false;
      }
      
      // Filter by cognitive load (show fewer actions for minimal load)
      if (cognitiveLoad === 'minimal' && action.priority > 2) {
        return expandedActions;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by energy alignment first, then priority
      const aEnergyMatch = a.energyOptimal === energyLevel ? 0 : 1;
      const bEnergyMatch = b.energyOptimal === energyLevel ? 0 : 1;
      
      if (aEnergyMatch !== bEnergyMatch) {
        return aEnergyMatch - bEnergyMatch;
      }
      
      return a.priority - b.priority;
    });

  // Get the primary action (most relevant)
  const primaryAction = relevantActions[0];
  const secondaryActions = relevantActions.slice(1, expandedActions ? 4 : 2);

  const getPositionClasses = () => {
    // Energy-based positioning
    switch (energyLevel) {
      case 'high':
        return 'bottom-6 left-6'; // Bottom-left for high energy (easy thumb access)
      case 'medium':
        return 'bottom-6 right-6'; // Bottom-right for medium energy
      case 'low':
        return 'bottom-20 right-6'; // Higher up for low energy (less movement)
      default:
        return 'bottom-6 right-6';
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrimaryAction = () => {
    if (primaryAction) {
      primaryAction.action();
    }
  };

  const toggleExpanded = () => {
    setExpandedActions(!expandedActions);
  };

  if (!primaryAction) return null;

  return (
    <div className={`fixed z-40 ${getPositionClasses()} ${className}`}>
      {/* Secondary Actions (when expanded) */}
      {expandedActions && secondaryActions.length > 0 && (
        <div className="absolute bottom-20 right-0 space-y-3 mb-2">
          {secondaryActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <GlassContainer
                key={action.id}
                variant="medium"
                cognitiveLoad="minimal"
                energyLevel={energyLevel}
                elevation="elevated"
                className="transition-all duration-300 hover:scale-110"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.3s ease-out forwards'
                }}
              >
                <button
                  onClick={action.action}
                  className="p-3 hover:bg-white/20 rounded-xl transition-colors relative"
                  title={action.label}
                  aria-label={action.label}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  {action.badge && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {action.badge}
                    </span>
                  )}
                </button>
              </GlassContainer>
            );
          })}
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <div className="absolute -top-16 right-0">
          <GlassContainer
            variant="light"
            cognitiveLoad="minimal"
            energyLevel={energyLevel}
            elevation="floating"
            className="transition-all duration-300"
          >
            <button
              onClick={scrollToTop}
              className="p-3 hover:bg-white/20 rounded-xl transition-colors"
              title="Scroll to top"
              aria-label="Scroll to top"
            >
              <ArrowUpIcon className="h-5 w-5 text-gray-600" />
            </button>
          </GlassContainer>
        </div>
      )}

      {/* Primary Action Button */}
      <GlassContainer
        variant="heavy"
        cognitiveLoad="minimal"
        energyLevel={energyLevel}
        elevation="elevated"
        className="transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <div className="relative">
          {/* Main Action Button */}
          <button
            onClick={handlePrimaryAction}
            className="p-4 hover:bg-white/20 rounded-2xl transition-colors relative group"
            title={primaryAction.label}
            aria-label={primaryAction.label}
          >
            <div className={`p-3 rounded-xl bg-gradient-to-r ${primaryAction.color} shadow-lg group-hover:shadow-xl transition-shadow`}>
              <primaryAction.icon className="h-6 w-6 text-white" />
            </div>
            
            {primaryAction.badge && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {primaryAction.badge}
              </span>
            )}

            {/* Energy Level Indicator */}
            <div className="absolute -bottom-1 -right-1">
              <div className={`w-3 h-3 rounded-full border-2 border-white ${
                energyLevel === 'high' ? 'bg-orange-500' :
                energyLevel === 'medium' ? 'bg-blue-500' :
                'bg-green-500'
              }`} />
            </div>
          </button>

          {/* Expand Button (for secondary actions) */}
          {secondaryActions.length > 0 && (
            <button
              onClick={toggleExpanded}
              className={`absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                expandedActions ? 'rotate-45' : 'rotate-0'
              }`}
              title={expandedActions ? 'Collapse actions' : 'More actions'}
              aria-label={expandedActions ? 'Collapse actions' : 'More actions'}
            >
              <PlusIcon className="h-3 w-3 text-gray-600" />
            </button>
          )}
        </div>

        {/* Action Label (on hover) */}
        <div 
          className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
            energyLevel === 'high' ? 'right-full mr-2 left-auto transform-none' : ''
          }`}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
            {primaryAction.label}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

// Add the animation keyframes via CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

export default FloatingActionButtons;