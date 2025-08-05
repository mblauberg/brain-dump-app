import React, { useState } from 'react';
import { 
  CheckCircleIcon,
  TrashIcon,
  FlagIcon,
  CalendarDaysIcon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import { Task, Priority, TaskStatus } from '../../types';
import { format, addDays } from 'date-fns';

interface BulkTaskActionsProps {
  selectedTasks: Set<string>;
  onClearSelection: () => void;
  tasks: Task[];
}

const BulkTaskActions: React.FC<BulkTaskActionsProps> = ({ 
  selectedTasks, 
  onClearSelection, 
  tasks 
}) => {
  const { updateTask, deleteTask } = useAppStore();
  const [showActions, setShowActions] = useState(false);

  const selectedTasksList = tasks.filter(task => selectedTasks.has(task.id));
  const selectedCount = selectedTasks.size;

  if (selectedCount === 0) return null;

  const handleBulkComplete = () => {
    selectedTasksList.forEach(task => {
      if (task.status !== 'completed') {
        updateTask(task.id, { status: 'completed' as TaskStatus });
      }
    });
    onClearSelection();
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCount} task${selectedCount > 1 ? 's' : ''}?`)) {
      selectedTasksList.forEach(task => {
        deleteTask(task.id);
      });
      onClearSelection();
    }
  };

  const handleBulkPriority = (priority: Priority) => {
    selectedTasksList.forEach(task => {
      updateTask(task.id, { priority });
    });
    onClearSelection();
  };

  const handleBulkStatus = (status: TaskStatus) => {
    selectedTasksList.forEach(task => {
      updateTask(task.id, { status });
    });
    onClearSelection();
  };

  const handleBulkSchedule = (daysFromNow: number) => {
    const scheduledDate = addDays(new Date(), daysFromNow);
    selectedTasksList.forEach(task => {
      updateTask(task.id, { scheduledDate });
    });
    onClearSelection();
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 hover:bg-red-50';
      case 'medium': return 'text-yellow-600 hover:bg-yellow-50';
      case 'low': return 'text-green-600 hover:bg-green-50';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'not_started': return 'text-gray-600 hover:bg-gray-50';
      case 'in_progress': return 'text-blue-600 hover:bg-blue-50';
      case 'completed': return 'text-green-600 hover:bg-green-50';
      case 'cancelled': return 'text-red-600 hover:bg-red-50';
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3">
        <div className="flex items-center space-x-4">
          {/* Selection Count */}
          <div className="flex items-center text-sm font-medium text-gray-900">
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs mr-2">
              {selectedCount}
            </span>
            {selectedCount} task{selectedCount > 1 ? 's' : ''} selected
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBulkComplete}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Mark as completed"
            >
              <CheckCircleIcon className="h-4 w-4" />
            </button>

            <button
              onClick={handleBulkDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete tasks"
            >
              <TrashIcon className="h-4 w-4" />
            </button>

            {/* More Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                title="More actions"
              >
                <ChevronDownIcon className="h-4 w-4" />
              </button>

              {showActions && (
                <div className="absolute bottom-full mb-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48">
                  {/* Priority Actions */}
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                    Set Priority
                  </div>
                  <button
                    onClick={() => handleBulkPriority('high')}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${getPriorityColor('high')}`}
                  >
                    <FlagIcon className="h-4 w-4 inline mr-2" />
                    High Priority
                  </button>
                  <button
                    onClick={() => handleBulkPriority('medium')}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${getPriorityColor('medium')}`}
                  >
                    <FlagIcon className="h-4 w-4 inline mr-2" />
                    Medium Priority
                  </button>
                  <button
                    onClick={() => handleBulkPriority('low')}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${getPriorityColor('low')}`}
                  >
                    <FlagIcon className="h-4 w-4 inline mr-2" />
                    Low Priority
                  </button>

                  {/* Status Actions */}
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100 mt-2">
                    Set Status
                  </div>
                  <button
                    onClick={() => handleBulkStatus('not_started')}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${getStatusColor('not_started')}`}
                  >
                    Not Started
                  </button>
                  <button
                    onClick={() => handleBulkStatus('in_progress')}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${getStatusColor('in_progress')}`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleBulkStatus('completed')}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${getStatusColor('completed')}`}
                  >
                    Completed
                  </button>

                  {/* Schedule Actions */}
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100 mt-2">
                    Schedule For
                  </div>
                  <button
                    onClick={() => handleBulkSchedule(0)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <CalendarDaysIcon className="h-4 w-4 inline mr-2" />
                    Today
                  </button>
                  <button
                    onClick={() => handleBulkSchedule(1)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <CalendarDaysIcon className="h-4 w-4 inline mr-2" />
                    Tomorrow
                  </button>
                  <button
                    onClick={() => handleBulkSchedule(7)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <CalendarDaysIcon className="h-4 w-4 inline mr-2" />
                    Next Week ({format(addDays(new Date(), 7), 'MMM d')})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            title="Clear selection"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Selected Tasks Preview (when many selected) */}
        {selectedCount > 3 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-2">Selected tasks:</div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {selectedTasksList.slice(0, 5).map(task => (
                <div key={task.id} className="text-xs text-gray-700 truncate">
                  • {task.title}
                </div>
              ))}
              {selectedCount > 5 && (
                <div className="text-xs text-gray-500">
                  ...and {selectedCount - 5} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* ADHD Tip */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            💡 Use bulk actions to quickly organize multiple tasks without getting overwhelmed
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkTaskActions;