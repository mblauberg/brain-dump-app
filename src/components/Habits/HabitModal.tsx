import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, BoltIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import { Habit } from '../../types';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingHabit?: Habit | null;
}

const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, editingHabit }) => {
  const { addHabit, updateHabit } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'custom',
    scheduledTime: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-populate form when editing
  useEffect(() => {
    if (editingHabit) {
      setFormData({
        title: editingHabit.title,
        description: editingHabit.description || '',
        frequency: editingHabit.frequency,
        scheduledTime: editingHabit.scheduledTime || '',
        isActive: editingHabit.isActive,
      });
    } else {
      // Reset form for new habit
      setFormData({
        title: '',
        description: '',
        frequency: 'daily',
        scheduledTime: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [editingHabit, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Habit title is required';
    }

    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 300) {
      newErrors.description = 'Description must be less than 300 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingHabit) {
      // Update existing habit
      updateHabit(editingHabit.id, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        frequency: formData.frequency,
        scheduledTime: formData.scheduledTime || undefined,
        isActive: formData.isActive,
      });
    } else {
      // Create new habit
      addHabit({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        frequency: formData.frequency,
        scheduledTime: formData.scheduledTime || undefined,
        isActive: formData.isActive,
      });
    }

    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      frequency: 'daily',
      scheduledTime: '',
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  const habitSuggestions = [
    { title: 'Daily meditation', description: '10 minutes of mindfulness', time: '07:00' },
    { title: 'Morning exercise', description: '30 minutes of physical activity', time: '06:30' },
    { title: 'Read for 20 minutes', description: 'Personal development or fiction', time: '21:00' },
    { title: 'Drink 8 glasses of water', description: 'Stay hydrated throughout the day', time: '' },
    { title: 'Take vitamins', description: 'Daily supplements', time: '08:00' },
    { title: 'Write in journal', description: 'Reflect on the day', time: '22:00' },
    { title: 'Practice gratitude', description: 'List 3 things you\'re grateful for', time: '07:30' },
    { title: 'Clean workspace', description: 'Organize desk and surroundings', time: '17:00' },
  ];

  const applySuggestion = (suggestion: typeof habitSuggestions[0]) => {
    setFormData({
      ...formData,
      title: suggestion.title,
      description: suggestion.description,
      scheduledTime: suggestion.time,
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <BoltIcon className="h-6 w-6 text-primary-600" />
                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                      {editingHabit ? 'Edit Habit' : 'Create New Habit'}
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Habit Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Daily meditation, Morning exercise, Read for 20 minutes"
                      className={`input ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      autoFocus
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add more details about this habit..."
                      rows={3}
                      className={`textarea ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  {/* Frequency and Schedule */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                      </label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                        className="input"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Scheduled Time (Optional)
                      </label>
                      <input
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Start this habit immediately
                    </label>
                  </div>

                  {/* Habit Suggestions */}
                  {!editingHabit && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Habits</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {habitSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => applySuggestion(suggestion)}
                            className="text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                          >
                            <div className="font-medium text-sm text-gray-900">{suggestion.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{suggestion.description}</div>
                            {suggestion.time && (
                              <div className="text-xs text-primary-600 mt-1">⏰ {suggestion.time}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ADHD Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 mb-2">💡 ADHD-Friendly Habit Tips</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Start with tiny habits (2-5 minutes) to build momentum</li>
                      <li>• Link new habits to existing routines (habit stacking)</li>
                      <li>• Set specific times to create automatic triggers</li>
                      <li>• Focus on one habit at a time to avoid overwhelm</li>
                      <li>• Celebrate small wins - every day counts!</li>
                    </ul>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      <BoltIcon className="h-4 w-4 mr-2" />
                      {editingHabit ? 'Update Habit' : 'Create Habit'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default HabitModal;