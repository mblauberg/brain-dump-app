import React, { useState } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { Task, EnergyLevel } from '../../types';
import { useAppStore } from '../../stores/useAppStore';
import { format } from 'date-fns';
import GlassContainer from '../Glass/GlassContainer';

export type ViewLevel = 'minimal' | 'standard' | 'detailed';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (taskId: string) => void;
  defaultView?: ViewLevel;
  autoCollapse?: boolean;
  energyAdaptive?: boolean;
  contextualActions?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  isSelectable = false, 
  isSelected = false, 
  onSelect,
  defaultView = 'standard',
  autoCollapse = false,
  energyAdaptive = true,
  contextualActions = true
}) => {
  const { completeTask, deleteTask } = useAppStore();
  const [currentView, setCurrentView] = useState<ViewLevel>(defaultView);
  const [isExpanded, setIsExpanded] = useState(!autoCollapse);

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'work': return 'category-work';
      case 'personal': return 'category-personal';
      case 'health': return 'category-health';
      case 'communication': return 'category-communication';
      case 'home': return 'category-home';
      default: return 'category-other';
    }
  };

  const getEnergyIcon = (energy: string) => {
    switch (energy) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌱';
      default: return '⚡';
    }
  };

  const getEnergyGlowClasses = (energy: EnergyLevel) => {
    if (!energyAdaptive) return '';
    
    switch (energy) {
      case 'high':
        return 'ring-1 ring-orange-200 shadow-orange-100';
      case 'medium':
        return 'ring-1 ring-blue-200 shadow-blue-100';
      case 'low':
        return 'ring-1 ring-green-200 shadow-green-100';
      default:
        return '';
    }
  };

  const getGlassVariant = () => {
    if (task.status === 'completed') return 'light';
    if (task.priority === 'high') return 'medium';
    return 'medium';
  };

  const getCognitiveLoad = (): 'minimal' | 'standard' | 'detailed' => {
    switch (currentView) {
      case 'minimal': return 'minimal';
      case 'standard': return 'standard';
      case 'detailed': return 'detailed';
      default: return 'standard';
    }
  };

  const toggleView = () => {
    const viewCycle: ViewLevel[] = ['minimal', 'standard', 'detailed'];
    const currentIndex = viewCycle.indexOf(currentView);
    const nextIndex = (currentIndex + 1) % viewCycle.length;
    setCurrentView(viewCycle[nextIndex]);
  };

  const handleComplete = () => {
    if (task.status !== 'completed') {
      completeTask(task.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(task);
  };

  const handleCardClick = () => {
    if (isSelectable && onSelect) {
      onSelect(task.id);
    }
  };

  const renderMinimalView = () => (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleComplete}
        className={`flex-shrink-0 ${
          task.status === 'completed' 
            ? 'text-green-600' 
            : 'text-gray-400 hover:text-green-600'
        } transition-colors`}
      >
        {task.status === 'completed' ? (
          <CheckCircleIconSolid className="h-5 w-5" />
        ) : (
          <CheckCircleIcon className="h-5 w-5" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-medium truncate ${
          task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
        }`}>
          {task.title}
        </h3>
      </div>
      
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityClass(task.priority)}`}>
        {task.priority.charAt(0).toUpperCase()}
      </span>
    </div>
  );

  const renderStandardView = () => (
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        {isSelectable && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect?.(task.id)}
            className="flex-shrink-0 mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <button
          onClick={handleComplete}
          className={`flex-shrink-0 ${
            task.status === 'completed' 
              ? 'text-green-600' 
              : 'text-gray-400 hover:text-green-600'
          } transition-colors`}
        >
          {task.status === 'completed' ? (
            <CheckCircleIconSolid className="h-6 w-6" />
          ) : (
            <CheckCircleIcon className="h-6 w-6" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-medium ${
            task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
            
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryClass(task.category)}`}>
              {task.category}
            </span>

            <div className="flex items-center text-xs text-gray-500">
              <ClockIcon className="h-3 w-3 mr-1" />
              {task.timeEstimate}
            </div>

            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-1">{getEnergyIcon(task.energyLevel)}</span>
              <span className="hidden sm:inline">{task.energyLevel}</span>
            </div>
          </div>
        </div>

        {contextualActions && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={toggleView}
              className="p-1 rounded text-gray-400 hover:text-gray-600"
              title="Toggle view"
            >
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleEdit}
              className="p-1 rounded text-gray-400 hover:text-gray-600"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded text-gray-400 hover:text-red-600"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderDetailedView = () => (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        {isSelectable && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect?.(task.id)}
            className="flex-shrink-0 mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <button
          onClick={handleComplete}
          className={`flex-shrink-0 ${
            task.status === 'completed' 
              ? 'text-green-600' 
              : 'text-gray-400 hover:text-green-600'
          } transition-colors`}
        >
          {task.status === 'completed' ? (
            <CheckCircleIconSolid className="h-6 w-6" />
          ) : (
            <CheckCircleIcon className="h-6 w-6" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold ${
            task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-gray-600 mt-2">{task.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityClass(task.priority)}`}>
                  {task.priority} priority
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryClass(task.category)}`}>
                  {task.category}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>Est. {task.timeEstimate}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <BoltIcon className="h-4 w-4 mr-2" />
                <span>{getEnergyIcon(task.energyLevel)} {task.energyLevel} energy</span>
              </div>

              {task.dueDate && (
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Due {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
          </div>

          {task.dependencies && task.dependencies.length > 0 && (
            <div className="mt-3">
              <span className="text-xs text-gray-500">Dependencies: {task.dependencies.length}</span>
            </div>
          )}
        </div>

        {contextualActions && (
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={toggleView}
              className="p-1 rounded text-gray-400 hover:text-gray-600"
              title="Toggle view"
            >
              <ChevronUpIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleEdit}
              className="p-1 rounded text-gray-400 hover:text-gray-600"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded text-gray-400 hover:text-red-600"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'minimal':
        return renderMinimalView();
      case 'standard':
        return renderStandardView();
      case 'detailed':
        return renderDetailedView();
      default:
        return renderStandardView();
    }
  };

  return (
    <GlassContainer
      variant={getGlassVariant()}
      cognitiveLoad={getCognitiveLoad()}
      energyLevel={task.energyLevel}
      adaptiveOpacity={energyAdaptive}
      elevation="floating"
      className={`group transition-all duration-300 hover:elevation-elevated ${
        task.status === 'completed' ? 'opacity-75' : ''
      } ${isSelectable ? 'cursor-pointer' : ''} ${
        isSelected ? 'ring-2 ring-primary-400 bg-primary-50/30' : ''
      } ${getEnergyGlowClasses(task.energyLevel)}`}
      onClick={isSelectable ? handleCardClick : undefined}
      data-testid={`task-card-${task.id}`}
    >
      {renderCurrentView()}
    </GlassContainer>
  );
};

export default TaskCard;