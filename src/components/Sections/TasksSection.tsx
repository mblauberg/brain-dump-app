import React, { useState } from 'react';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { GlassCard, GlassButton } from '../Glass';
import { useAppStore } from '../../stores/useAppStore';
import { Task } from '../../types';
import { format } from 'date-fns';

interface TasksSectionProps {
  energyLevel?: 'high' | 'medium' | 'low';
  cognitiveLoad?: 'minimal' | 'standard' | 'detailed';
  onTaskEdit?: (task: Task) => void;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  energyLevel = 'medium',
  cognitiveLoad = 'standard',
  onTaskEdit,
}) => {
  const { tasks, completeTask } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [sortBy, setSortBy] = useState<'priority' | 'created' | 'dueDate'>('priority');

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'active') return task.status !== 'completed' && task.status !== 'cancelled';
      if (filter === 'completed') return task.status === 'completed';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'dueDate' && a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    })
    .slice(0, cognitiveLoad === 'minimal' ? 3 : cognitiveLoad === 'standard' ? 6 : 12);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEnergyEmoji = (energy: string) => {
    switch (energy) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌱';
      default: return '⚡';
    }
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <GlassCard
      variant="light"
      cognitiveLoad={cognitiveLoad}
      energyLevel={energyLevel}
      className="transition-all duration-200 hover:scale-[1.01]"
      onClick={() => onTaskEdit?.(task)}
      isClickable={true}
    >
      <div className="flex items-start space-x-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            completeTask(task.id);
          }}
          className={`flex-shrink-0 mt-1 transition-colors ${
            task.status === 'completed' 
              ? 'text-green-600' 
              : 'text-gray-400 hover:text-green-600'
          }`}
          aria-label={`Mark "${task.title}" as complete`}
        >
          <CheckCircleIcon className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <h4 className={`font-medium truncate ${
            task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {task.title}
          </h4>
          
          {cognitiveLoad !== 'minimal' && task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center space-x-2 mt-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            
            <span className="flex items-center text-xs text-gray-500">
              {getEnergyEmoji(task.energyLevel)}
              <ClockIcon className="h-3 w-3 ml-1 mr-1" />
              {task.timeEstimate}
            </span>

            {task.dueDate && (
              <span className="text-xs text-gray-500">
                📅 {format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );

  return (
    <div className="space-y-6">
      {/* Section Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
            {filteredTasks.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter Buttons */}
          <div className="flex items-center space-x-1">
            {(['active', 'completed', 'all'] as const).map((filterOption) => (
              <GlassButton
                key={filterOption}
                variant={filter === filterOption ? 'primary' : 'ghost'}
                size="sm"
                energyLevel={energyLevel}
                onClick={() => setFilter(filterOption)}
              >
                {filterOption}
              </GlassButton>
            ))}
          </div>

          {/* Sort Dropdown */}
          {cognitiveLoad !== 'minimal' && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm bg-white/70 border border-white/30 rounded-lg px-2 py-1 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Sort tasks by"
            >
              <option value="priority">Priority</option>
              <option value="created">Created</option>
              <option value="dueDate">Due Date</option>
            </select>
          )}
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length > 0 ? (
        <div className={`grid gap-4 ${
          cognitiveLoad === 'minimal' 
            ? 'grid-cols-1' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <GlassCard
          variant="light"
          cognitiveLoad="minimal"
          energyLevel={energyLevel}
          className="text-center py-8"
        >
          <div className="text-gray-500">
            <CheckCircleIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium mb-1">No tasks found</p>
            <p className="text-sm">
              {filter === 'active' ? 'All caught up! ' : 'No tasks match your filter. '}
              Brain dump some thoughts above to get started.
            </p>
          </div>
        </GlassCard>
      )}

      {/* Quick Stats */}
      {cognitiveLoad !== 'minimal' && tasks.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50/50 rounded-lg border border-blue-200/30">
            <div className="text-lg font-semibold text-blue-700">
              {tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length}
            </div>
            <div className="text-xs text-blue-600">Active</div>
          </div>
          
          <div className="text-center p-3 bg-green-50/50 rounded-lg border border-green-200/30">
            <div className="text-lg font-semibold text-green-700">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          
          <div className="text-center p-3 bg-red-50/50 rounded-lg border border-red-200/30">
            <div className="text-lg font-semibold text-red-700">
              {tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length}
            </div>
            <div className="text-xs text-red-600">High Priority</div>
          </div>
          
          <div className="text-center p-3 bg-yellow-50/50 rounded-lg border border-yellow-200/30">
            <div className="text-lg font-semibold text-yellow-700">
              {tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length}
            </div>
            <div className="text-xs text-yellow-600">Overdue</div>
          </div>
        </div>
      )}

      {/* View All Button */}
      {filteredTasks.length === (cognitiveLoad === 'minimal' ? 3 : cognitiveLoad === 'standard' ? 6 : 12) && tasks.length > filteredTasks.length && (
        <div className="text-center">
          <GlassButton
            variant="secondary"
            size="md"
            energyLevel={energyLevel}
            onClick={() => {/* TODO: Navigate to full task view */}}
          >
            View All {tasks.length} Tasks
          </GlassButton>
        </div>
      )}
    </div>
  );
};

export default TasksSection;