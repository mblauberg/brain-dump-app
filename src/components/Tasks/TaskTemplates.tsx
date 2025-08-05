import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  RocketLaunchIcon,
  HomeIcon,
  BriefcaseIcon,
  HeartIcon,
  AcademicCapIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import { Priority, Category, TimeEstimate, EnergyLevel } from '../../types';

interface TaskTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: React.ComponentType<any>;
  color: string;
  tasks: {
    title: string;
    description?: string;
    priority: Priority;
    timeEstimate: TimeEstimate;
    energyLevel: EnergyLevel;
    order: number;
  }[];
}

const TaskTemplates: React.FC<TaskTemplatesProps> = ({ isOpen, onClose }) => {
  const { addTask } = useAppStore();
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());

  const templates: TaskTemplate[] = [
    {
      id: 'morning-routine',
      name: 'Morning Routine',
      description: 'Start your day with structure and energy',
      category: 'personal',
      icon: RocketLaunchIcon,
      color: 'from-orange-400 to-pink-400',
      tasks: [
        { title: 'Make bed', description: 'Quick 2-minute task to start the day with an accomplishment', priority: 'low', timeEstimate: '15min', energyLevel: 'low', order: 1 },
        { title: 'Drink a glass of water', description: 'Rehydrate after sleep', priority: 'medium', timeEstimate: '15min', energyLevel: 'low', order: 2 },
        { title: 'Take medication (if applicable)', description: 'Don\'t forget ADHD meds or other prescriptions', priority: 'high', timeEstimate: '15min', energyLevel: 'low', order: 3 },
        { title: 'Review today\'s priorities', description: 'Check calendar and task list for the day', priority: 'high', timeEstimate: '15min', energyLevel: 'medium', order: 4 },
        { title: 'Do 5-minute morning exercise', description: 'Light stretches or jumping jacks to wake up', priority: 'medium', timeEstimate: '15min', energyLevel: 'medium', order: 5 },
      ]
    },
    {
      id: 'work-project',
      name: 'Work Project Setup',
      description: 'Break down a new work project into manageable steps',
      category: 'work',
      icon: BriefcaseIcon,
      color: 'from-blue-400 to-indigo-400',
      tasks: [
        { title: 'Define project scope and goals', description: 'Write clear objectives and success criteria', priority: 'high', timeEstimate: '45min', energyLevel: 'high', order: 1 },
        { title: 'Research requirements and constraints', description: 'Gather all necessary information before starting', priority: 'high', timeEstimate: '1hr', energyLevel: 'high', order: 2 },
        { title: 'Create project timeline', description: 'Break into phases with realistic deadlines', priority: 'high', timeEstimate: '30min', energyLevel: 'medium', order: 3 },
        { title: 'Set up project workspace/files', description: 'Organize folders, documents, and tools', priority: 'medium', timeEstimate: '30min', energyLevel: 'medium', order: 4 },
        { title: 'Schedule regular check-ins', description: 'Block time for progress reviews', priority: 'medium', timeEstimate: '15min', energyLevel: 'low', order: 5 },
        { title: 'Identify potential roadblocks', description: 'Plan for common issues and delays', priority: 'medium', timeEstimate: '30min', energyLevel: 'medium', order: 6 },
      ]
    },
    {
      id: 'house-cleaning',
      name: 'House Cleaning Session',
      description: 'Systematic approach to cleaning without overwhelm',
      category: 'home',
      icon: HomeIcon,
      color: 'from-green-400 to-teal-400',
      tasks: [
        { title: 'Set timer for 15-minute pickup', description: 'Quick declutter of high-traffic areas', priority: 'high', timeEstimate: '15min', energyLevel: 'medium', order: 1 },
        { title: 'Load/start dishwasher', description: 'Clear sink and counters', priority: 'high', timeEstimate: '15min', energyLevel: 'low', order: 2 },
        { title: 'Make beds and tidy bedrooms', description: 'Quick bedroom refresh', priority: 'medium', timeEstimate: '15min', energyLevel: 'low', order: 3 },
        { title: 'Wipe down bathroom surfaces', description: 'Quick clean of sink, toilet, shower', priority: 'medium', timeEstimate: '15min', energyLevel: 'medium', order: 4 },
        { title: 'Vacuum/sweep main areas', description: 'Focus on living room and kitchen', priority: 'medium', timeEstimate: '30min', energyLevel: 'medium', order: 5 },
        { title: 'Take out trash', description: 'Empty bins and replace bags', priority: 'low', timeEstimate: '15min', energyLevel: 'low', order: 6 },
      ]
    },
    {
      id: 'meal-prep',
      name: 'Weekly Meal Prep',
      description: 'Plan and prepare meals to reduce daily decisions',
      category: 'health',
      icon: ShoppingCartIcon,
      color: 'from-purple-400 to-pink-400',
      tasks: [
        { title: 'Plan 3-4 meals for the week', description: 'Choose simple, ADHD-friendly recipes', priority: 'high', timeEstimate: '30min', energyLevel: 'medium', order: 1 },
        { title: 'Make grocery list', description: 'Check pantry and organize by store layout', priority: 'high', timeEstimate: '15min', energyLevel: 'low', order: 2 },
        { title: 'Go grocery shopping', description: 'Stick to the list to avoid overwhelm', priority: 'high', timeEstimate: '1hr', energyLevel: 'medium', order: 3 },
        { title: 'Wash and prep vegetables', description: 'Cut vegetables for easy cooking', priority: 'medium', timeEstimate: '30min', energyLevel: 'medium', order: 4 },
        { title: 'Cook 2-3 base proteins', description: 'Chicken, beans, or other versatile proteins', priority: 'medium', timeEstimate: '45min', energyLevel: 'medium', order: 5 },
        { title: 'Portion meals into containers', description: 'Ready-to-eat meals for busy days', priority: 'medium', timeEstimate: '30min', energyLevel: 'low', order: 6 },
      ]
    },
    {
      id: 'study-session',
      name: 'Effective Study Session',
      description: 'ADHD-friendly study techniques and breaks',
      category: 'personal',
      icon: AcademicCapIcon,
      color: 'from-yellow-400 to-orange-400',
      tasks: [
        { title: 'Gather all study materials', description: 'Books, notes, pens, water, snacks', priority: 'high', timeEstimate: '15min', energyLevel: 'low', order: 1 },
        { title: 'Review learning objectives', description: 'What do you need to accomplish?', priority: 'high', timeEstimate: '15min', energyLevel: 'medium', order: 2 },
        { title: 'Study session 1 (25 minutes)', description: 'Focused study with Pomodoro timer', priority: 'high', timeEstimate: '30min', energyLevel: 'high', order: 3 },
        { title: 'Take 5-minute break', description: 'Move, stretch, or drink water', priority: 'medium', timeEstimate: '15min', energyLevel: 'low', order: 4 },
        { title: 'Study session 2 (25 minutes)', description: 'Continue with next topic or review', priority: 'high', timeEstimate: '30min', energyLevel: 'high', order: 5 },
        { title: 'Summarize key points', description: 'Write brief notes of what you learned', priority: 'medium', timeEstimate: '15min', energyLevel: 'medium', order: 6 },
      ]
    },
    {
      id: 'self-care',
      name: 'Self-Care Reset',
      description: 'Recharge your mental and physical energy',
      category: 'health',
      icon: HeartIcon,
      color: 'from-pink-400 to-red-400',
      tasks: [
        { title: 'Take a shower or relaxing bath', description: 'Wash away stress and reset', priority: 'medium', timeEstimate: '30min', energyLevel: 'low', order: 1 },
        { title: 'Do 10 minutes of meditation', description: 'Use a guided app or just breathe deeply', priority: 'medium', timeEstimate: '15min', energyLevel: 'low', order: 2 },
        { title: 'Write 3 things you\'re grateful for', description: 'Shift focus to positive aspects', priority: 'low', timeEstimate: '15min', energyLevel: 'low', order: 3 },
        { title: 'Do something creative', description: 'Draw, write, play music, or craft', priority: 'low', timeEstimate: '45min', energyLevel: 'medium', order: 4 },
        { title: 'Call or text a supportive friend', description: 'Connect with your support network', priority: 'medium', timeEstimate: '30min', energyLevel: 'medium', order: 5 },
        { title: 'Prepare a nourishing meal', description: 'Cook something you enjoy eating', priority: 'medium', timeEstimate: '45min', energyLevel: 'medium', order: 6 },
      ]
    },
    {
      id: 'tech-maintenance',
      name: 'Digital Organization',
      description: 'Clean up digital spaces for better focus',
      category: 'other',
      icon: WrenchScrewdriverIcon,
      color: 'from-gray-400 to-blue-400',
      tasks: [
        { title: 'Clean up desktop', description: 'Organize files and remove clutter', priority: 'medium', timeEstimate: '15min', energyLevel: 'low', order: 1 },
        { title: 'Process email inbox', description: 'Delete, archive, or respond to emails', priority: 'high', timeEstimate: '30min', energyLevel: 'medium', order: 2 },
        { title: 'Update important apps', description: 'Check for security and feature updates', priority: 'low', timeEstimate: '15min', energyLevel: 'low', order: 3 },
        { title: 'Backup important files', description: 'Ensure your work is safely stored', priority: 'medium', timeEstimate: '15min', energyLevel: 'low', order: 4 },
        { title: 'Review and clean phone photos', description: 'Delete duplicates and organize', priority: 'low', timeEstimate: '30min', energyLevel: 'low', order: 5 },
        { title: 'Unsubscribe from unused services', description: 'Reduce digital overwhelm', priority: 'low', timeEstimate: '15min', energyLevel: 'medium', order: 6 },
      ]
    },
  ];

  const handleTemplateSelect = (template: TaskTemplate) => {
    setSelectedTemplate(template);
    setSelectedTasks(new Set(template.tasks.map((_, index) => index)));
  };

  const handleTaskToggle = (taskIndex: number) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskIndex)) {
      newSelected.delete(taskIndex);
    } else {
      newSelected.add(taskIndex);
    }
    setSelectedTasks(newSelected);
  };

  const handleCreateTasks = () => {
    if (!selectedTemplate) return;

    const tasksToCreate = selectedTemplate.tasks
      .filter((_, index) => selectedTasks.has(index))
      .sort((a, b) => a.order - b.order);

    tasksToCreate.forEach((taskTemplate, index) => {
      const now = new Date();
      const scheduledDate = new Date(now);
      scheduledDate.setMinutes(now.getMinutes() + (index * 5)); // Stagger by 5 minutes

      addTask({
        title: taskTemplate.title,
        description: taskTemplate.description,
        priority: taskTemplate.priority,
        category: selectedTemplate.category,
        timeEstimate: taskTemplate.timeEstimate,
        energyLevel: taskTemplate.energyLevel,
        status: 'not_started',
        scheduledDate,
      });
    });

    setSelectedTemplate(null);
    setSelectedTasks(new Set());
    onClose();
  };

  const handleBack = () => {
    setSelectedTemplate(null);
    setSelectedTasks(new Set());
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {selectedTemplate ? selectedTemplate.name : 'Task Templates'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {!selectedTemplate ? (
            /* Template Selection */
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Choose from these ADHD-friendly task templates to quickly set up common activities. 
                Each template breaks complex tasks into manageable steps.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="text-left p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="text-xs text-gray-500">
                        {template.tasks.length} tasks • {template.category}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ADHD Tips */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">💡 Using Task Templates</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Templates break overwhelming projects into bite-sized steps</li>
                  <li>• You can customize which tasks to include before creating them</li>
                  <li>• Tasks are automatically scheduled with small time gaps</li>
                  <li>• Energy levels help you plan when to tackle each task</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Task Selection */
            <div className="p-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBack}
                  className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  ←
                </button>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h3>
                  <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Select tasks to create:</h4>
                  <div className="text-sm text-gray-600">
                    {selectedTasks.size} of {selectedTemplate.tasks.length} selected
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedTemplate.tasks.map((task, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedTasks.has(index)
                          ? 'border-primary-300 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleTaskToggle(index)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedTasks.has(index)
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedTasks.has(index) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{task.title}</h5>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            <span className={`px-2 py-1 rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {task.priority} priority
                            </span>
                            <span className="text-gray-500">{task.timeEstimate}</span>
                            <span className="text-gray-500">{task.energyLevel} energy</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  className="btn btn-secondary"
                >
                  Back to Templates
                </button>
                <button
                  onClick={handleCreateTasks}
                  disabled={selectedTasks.size === 0}
                  className="btn btn-primary"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create {selectedTasks.size} Task{selectedTasks.size !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TaskTemplates;