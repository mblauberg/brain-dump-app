import React from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { Task } from '../../types';
import { useAppStore } from '../../stores/useAppStore';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  isSelectable = false, 
  isSelected = false, 
  onSelect 
}) => {
  const { completeTask, deleteTask } = useAppStore();

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

  return (
    <div 
      className={`card hover:shadow-md transition-all duration-200 ${
        task.status === 'completed' ? 'opacity-75' : ''
      } ${isSelectable ? 'cursor-pointer' : ''} ${
        isSelected ? 'ring-2 ring-primary-300 bg-primary-50' : ''
      }`}
      onClick={isSelectable ? handleCardClick : handleComplete}
    >
      <div className="flex items-start space-x-3">
        {isSelectable && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect?.(task.id)}
            className="flex-shrink-0 mt-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <button
          onClick={handleComplete}
          className={`flex-shrink-0 mt-1 ${
            task.status === 'completed' 
              ? 'text-green-600' 
              : 'text-gray-400 hover:text-green-600'
          } transition-colors`}
        >
          {task.status === 'completed' ? (
            <CheckCircleIconSolid className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`text-sm sm:text-base font-medium ${
            task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{task.description}</p>
          )}

          {/* Mobile-first tag layout */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
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

            {task.dueDate && (
              <div className="flex items-center text-xs text-gray-500">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            )}
          </div>
        </div>

        {/* Mobile-friendly action buttons */}
        <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-2 sm:p-1 rounded text-gray-400 hover:text-gray-600 touch-manipulation"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 sm:p-1 rounded text-gray-400 hover:text-red-600 touch-manipulation"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;