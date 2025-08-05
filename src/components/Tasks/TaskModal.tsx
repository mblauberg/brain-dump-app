import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  CalendarDaysIcon,
  ClockIcon,
  BoltIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import { Task, Priority, Category, TimeEstimate, EnergyLevel } from '../../types';
import { format } from 'date-fns';
import FocusManager from '../Accessibility/FocusManager';
import LiveRegion from '../Accessibility/LiveRegion';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTask?: Task | null;
  selectedDate?: Date;
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  editingTask, 
  selectedDate 
}) => {
  const { addTask, updateTask } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    category: 'personal' as Category,
    timeEstimate: '30min' as TimeEstimate,
    energyLevel: 'medium' as EnergyLevel,
    dueDate: '',
    scheduledDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [announceMessage, setAnnounceMessage] = useState('');

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority,
        category: editingTask.category,
        timeEstimate: editingTask.timeEstimate,
        energyLevel: editingTask.energyLevel,
        dueDate: editingTask.dueDate ? format(new Date(editingTask.dueDate), 'yyyy-MM-dd') : '',
        scheduledDate: editingTask.scheduledDate ? format(new Date(editingTask.scheduledDate), 'yyyy-MM-dd') : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'personal',
        timeEstimate: '30min',
        energyLevel: 'medium',
        dueDate: '',
        scheduledDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      });
    }
    setErrors({});
  }, [editingTask, selectedDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      category: formData.category,
      timeEstimate: formData.timeEstimate,
      energyLevel: formData.energyLevel,
      status: editingTask?.status || 'not_started' as const,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
      dependencies: editingTask?.dependencies,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setAnnounceMessage(`Task "${taskData.title}" has been updated successfully.`);
    } else {
      addTask(taskData);
      setAnnounceMessage(`New task "${taskData.title}" has been created successfully.`);
    }

    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const priorityColors = {
    high: 'text-red-700 bg-red-50 border-red-200',
    medium: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    low: 'text-green-700 bg-green-50 border-green-200',
  };

  const energyColors = {
    high: 'text-orange-700 bg-orange-50',
    medium: 'text-blue-700 bg-blue-50',
    low: 'text-gray-700 bg-gray-50',
  };

  return (
    <>
      <LiveRegion message={announceMessage} />
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg">
            <FocusManager autoFocus restoreFocus>
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <Dialog.Title as="h2" className="text-lg font-semibold text-gray-900">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close dialog"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
            {/* Title */}
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                id="task-title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`input ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500 error' : ''}`}
                placeholder="Enter task title..."
                aria-describedby={errors.title ? 'title-error' : undefined}
                aria-invalid={!!errors.title}
                aria-required="true"
              />
              {errors.title && (
                <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="task-description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="input resize-none"
                placeholder="Add more details about this task..."
                aria-describedby="description-help"
              />
              <p id="description-help" className="mt-1 text-xs text-gray-500">
                Optional: Add context or steps for this task
              </p>
            </div>

            {/* Priority and Category Row */}
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <legend className="sr-only">Task Priority and Category</legend>
              <div>
                <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-2">
                  <FlagIcon className="h-4 w-4 inline mr-1" aria-hidden="true" />
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="input"
                  aria-describedby="priority-indicator"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <div 
                  id="priority-indicator"
                  className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[formData.priority]}`}
                  role="status"
                  aria-live="polite"
                >
                  {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
                </div>
              </div>

              <div>
                <label htmlFor="task-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="task-category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="input"
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                  <option value="communication">Communication</option>
                  <option value="home">Home</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </fieldset>

            {/* Time Estimate and Energy Level Row */}
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <legend className="sr-only">Task Duration and Energy Requirements</legend>
              <div>
                <label htmlFor="task-time-estimate" className="block text-sm font-medium text-gray-700 mb-2">
                  <ClockIcon className="h-4 w-4 inline mr-1" aria-hidden="true" />
                  Time Estimate
                </label>
                <select
                  id="task-time-estimate"
                  value={formData.timeEstimate}
                  onChange={(e) => handleChange('timeEstimate', e.target.value)}
                  className="input"
                >
                  <option value="15min">15 minutes</option>
                  <option value="30min">30 minutes</option>
                  <option value="45min">45 minutes</option>
                  <option value="1hr">1 hour</option>
                  <option value="2hr">2 hours</option>
                  <option value="3hr+">3+ hours</option>
                </select>
              </div>

              <div>
                <label htmlFor="task-energy-level" className="block text-sm font-medium text-gray-700 mb-2">
                  <BoltIcon className="h-4 w-4 inline mr-1" aria-hidden="true" />
                  Energy Level Required
                </label>
                <select
                  id="task-energy-level"
                  value={formData.energyLevel}
                  onChange={(e) => handleChange('energyLevel', e.target.value)}
                  className="input"
                  aria-describedby="energy-indicator"
                >
                  <option value="high">High Energy</option>
                  <option value="medium">Medium Energy</option>
                  <option value="low">Low Energy</option>
                </select>
                <div 
                  id="energy-indicator"
                  className={`mt-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${energyColors[formData.energyLevel]}`}
                  role="status"
                  aria-live="polite"
                >
                  {formData.energyLevel.charAt(0).toUpperCase() + formData.energyLevel.slice(1)} Energy
                </div>
              </div>
            </fieldset>

            {/* Due Date and Scheduled Date Row */}
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <legend className="sr-only">Task Dates</legend>
              <div>
                <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarDaysIcon className="h-4 w-4 inline mr-1" aria-hidden="true" />
                  Due Date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="input"
                  aria-describedby="due-date-help"
                />
                <p id="due-date-help" className="mt-1 text-xs text-gray-500">
                  When this task needs to be completed
                </p>
              </div>

              <div>
                <label htmlFor="task-scheduled-date" className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarDaysIcon className="h-4 w-4 inline mr-1" aria-hidden="true" />
                  Scheduled Date
                </label>
                <input
                  id="task-scheduled-date"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => handleChange('scheduledDate', e.target.value)}
                  className="input"
                  aria-describedby="scheduled-date-help"
                />
                <p id="scheduled-date-help" className="mt-1 text-xs text-gray-500">
                  When you plan to work on this task
                </p>
              </div>
            </fieldset>

            {/* ADHD-friendly tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" role="complementary" aria-labelledby="adhd-tips-heading">
              <h4 id="adhd-tips-heading" className="text-sm font-medium text-blue-800 mb-2">
                <span aria-hidden="true">💡</span> ADHD Task Tips
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>Break large tasks into smaller, specific steps</li>
                <li>Schedule high-energy tasks when you're most focused</li>
                <li>Set realistic time estimates (add buffer time)</li>
                <li>Use due dates to create urgency, scheduled dates for planning</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
              </form>
            </FocusManager>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default TaskModal;