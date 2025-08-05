import React, { useState } from 'react';
import { CalendarIcon, ClockIcon, PlusIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import CalendarGrid from './CalendarGrid';
import TaskModal from '../Tasks/TaskModal';
import TaskTemplates from '../Tasks/TaskTemplates';
import { useAppStore } from '../../stores/useAppStore';
import { Task } from '../../types';
import { format } from 'date-fns';

const Calendar: React.FC = () => {
  const { tasks, setIsBrainDumpOpen } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setSelectedDate(null);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setSelectedDate(null);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
    setSelectedDate(null);
  };

  const upcomingTasks = tasks
    .filter(task => task.scheduledDate && task.status !== 'completed')
    .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleCreateTask}
            className="btn btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Schedule Task
          </button>
          <button
            onClick={() => setIsTemplatesOpen(true)}
            className="btn btn-secondary"
          >
            <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
            Templates
          </button>
          <button
            onClick={() => setIsBrainDumpOpen(true)}
            className="btn btn-secondary"
          >
            Brain Dump
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <CalendarGrid onDateClick={handleDateClick} onTaskClick={handleTaskClick} />

      {/* Upcoming Tasks Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Future Features */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-blue-800">Smart Scheduling</h4>
                </div>
                <p className="text-sm text-blue-700">
                  AI will suggest optimal times for your tasks based on energy levels and priorities.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CalendarIcon className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-medium text-green-800">Calendar Sync</h4>
                </div>
                <p className="text-sm text-green-700">
                  Sync with Google, Outlook, and Apple calendars for a unified view.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Upcoming Tasks */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-6">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No scheduled tasks</p>
                <button
                  onClick={() => setIsBrainDumpOpen(true)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                >
                  Add some tasks to get started
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{task.title}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        task.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                        task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {format(new Date(task.scheduledDate!), 'MMM d, yyyy')}
                    </div>
                  </div>
                ))}
                {tasks.filter(t => t.scheduledDate && t.status !== 'completed').length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{tasks.filter(t => t.scheduledDate && t.status !== 'completed').length - 5} more scheduled tasks
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">
            Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h4>
          <p className="text-sm text-blue-700 mb-3">
            Click "Schedule Task" to add a new task for this date, or use the Brain Dump feature 
            to quickly capture multiple tasks and ideas.
          </p>
          <button
            onClick={() => {
              setIsTaskModalOpen(true);
            }}
            className="btn btn-sm btn-primary"
          >
            <PlusIcon className="h-3 w-3 mr-1" />
            Schedule Task for {format(selectedDate, 'MMM d')}
          </button>
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        editingTask={selectedTask}
        selectedDate={selectedDate || undefined}
      />

      {/* Task Templates Modal */}
      <TaskTemplates
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
      />
    </div>
  );
};

export default Calendar;