import React, { useState, useMemo } from 'react';
import { FunnelIcon, MagnifyingGlassIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import TaskCard from './TaskCard';
import BulkTaskActions from './BulkTaskActions';
import { Priority, Category, TaskStatus } from '../../types';

const TaskList: React.FC = () => {
  const { tasks } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;

      return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
    });
  }, [tasks, searchTerm, filterPriority, filterCategory, filterStatus]);

  const groupedTasks = useMemo(() => {
    const groups = {
      'High Priority': filteredTasks.filter(task => task.priority === 'high' && task.status !== 'completed'),
      'Medium Priority': filteredTasks.filter(task => task.priority === 'medium' && task.status !== 'completed'),
      'Low Priority': filteredTasks.filter(task => task.priority === 'low' && task.status !== 'completed'),
      'Completed': filteredTasks.filter(task => task.status === 'completed'),
    };

    // Remove empty groups
    return Object.entries(groups).filter(([_, tasks]) => tasks.length > 0);
  }, [filteredTasks]);

  const handleTaskSelect = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map(task => task.id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedTasks(new Set());
    setIsBulkMode(false);
  };

  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    if (!isBulkMode) {
      setSelectedTasks(new Set());
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <button
            onClick={toggleBulkMode}
            className={`btn text-sm ${isBulkMode ? 'btn-primary' : 'btn-secondary'}`}
          >
            <RectangleStackIcon className="h-4 w-4 mr-2" />
            {isBulkMode ? 'Exit Bulk' : 'Bulk Select'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
              className="input"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
              className="input"
            >
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="health">Health</option>
              <option value="communication">Communication</option>
              <option value="home">Home</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
              className="input"
            >
              <option value="all">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bulk Mode Controls */}
        {isBulkMode && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTasks.size === filteredTasks.length && filteredTasks.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Select all ({filteredTasks.length} tasks)
              </span>
            </label>
            {selectedTasks.size > 0 && (
              <div className="text-sm text-gray-600">
                {selectedTasks.size} selected
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Groups */}
      {groupedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 mb-4">
            {tasks.length === 0 
              ? "Get started by using the Brain Dump feature to add your first tasks!"
              : "Try adjusting your search or filter criteria."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedTasks.map(([groupName, groupTasks]) => (
            <div key={groupName}>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {groupName} ({groupTasks.length})
              </h2>
              <div className="space-y-3">
                {groupTasks.map((task) => (
                  <div key={task.id} className="group">
                    <TaskCard 
                      task={task} 
                      isSelectable={isBulkMode}
                      isSelected={selectedTasks.has(task.id)}
                      onSelect={handleTaskSelect}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bulk Task Actions */}
      <BulkTaskActions
        selectedTasks={selectedTasks}
        onClearSelection={handleClearSelection}
        tasks={tasks}
      />
    </div>
  );
};

export default TaskList;