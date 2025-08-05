import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, MoonIcon, SunIcon, StarIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import { SleepSchedule } from '../../types';
import { format } from 'date-fns';

interface SleepModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSchedule?: SleepSchedule | null;
  selectedDate?: Date;
}

const SleepModal: React.FC<SleepModalProps> = ({ 
  isOpen, 
  onClose, 
  editingSchedule, 
  selectedDate = new Date() 
}) => {
  const { addSleepSchedule, updateSleepSchedule } = useAppStore();
  
  const [formData, setFormData] = useState({
    bedtime: '22:00',
    wakeTime: '07:00',
    actualBedtime: '',
    actualWakeTime: '',
    sleepQuality: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-populate form when editing
  useEffect(() => {
    if (editingSchedule) {
      setFormData({
        bedtime: editingSchedule.bedtime,
        wakeTime: editingSchedule.wakeTime,
        actualBedtime: editingSchedule.actualBedtime || '',
        actualWakeTime: editingSchedule.actualWakeTime || '',
        sleepQuality: editingSchedule.sleepQuality || 0,
      });
    } else {
      // Reset form for new schedule
      setFormData({
        bedtime: '22:00',
        wakeTime: '07:00',
        actualBedtime: '',
        actualWakeTime: '',
        sleepQuality: 0,
      });
    }
    setErrors({});
  }, [editingSchedule, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic time validation
    if (!formData.bedtime) {
      newErrors.bedtime = 'Bedtime is required';
    }

    if (!formData.wakeTime) {
      newErrors.wakeTime = 'Wake time is required';
    }

    if (formData.sleepQuality < 0 || formData.sleepQuality > 10) {
      newErrors.sleepQuality = 'Sleep quality must be between 0 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const scheduleData = {
      bedtime: formData.bedtime,
      wakeTime: formData.wakeTime,
      actualBedtime: formData.actualBedtime || undefined,
      actualWakeTime: formData.actualWakeTime || undefined,
      sleepQuality: formData.sleepQuality > 0 ? formData.sleepQuality : undefined,
      date: editingSchedule ? editingSchedule.date : selectedDate,
    };

    if (editingSchedule) {
      // Update existing schedule
      updateSleepSchedule(editingSchedule.id, scheduleData);
    } else {
      // Create new schedule
      addSleepSchedule(scheduleData);
    }

    onClose();
  };

  const handleClose = () => {
    setFormData({
      bedtime: '22:00',
      wakeTime: '07:00',
      actualBedtime: '',
      actualWakeTime: '',
      sleepQuality: 0,
    });
    setErrors({});
    onClose();
  };

  const renderQualityStars = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setFormData({ ...formData, sleepQuality: i })}
          className={`p-1 rounded transition-colors ${
            i <= formData.sleepQuality 
              ? 'text-yellow-400' 
              : 'text-gray-300 hover:text-yellow-300'
          }`}
        >
          <StarIcon className="h-5 w-5 fill-current" />
        </button>
      );
    }
    return stars;
  };

  const sleepTips = [
    "Keep consistent sleep and wake times, even on weekends",
    "Create a relaxing bedtime routine 30-60 minutes before sleep",
    "Avoid screens 1 hour before bedtime",
    "Keep your bedroom cool, dark, and quiet",
    "Avoid caffeine after 2 PM",
    "Get natural sunlight exposure in the morning",
  ];

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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <MoonIcon className="h-6 w-6 text-purple-600" />
                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                      {editingSchedule ? 'Edit Sleep Schedule' : 'Log Sleep Schedule'}
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Date:</strong> {format(editingSchedule ? new Date(editingSchedule.date) : selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Planned Times */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Planned Schedule</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                          <MoonIcon className="h-4 w-4" />
                          <span>Bedtime</span>
                        </label>
                        <input
                          type="time"
                          value={formData.bedtime}
                          onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                          className={`input ${errors.bedtime ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {errors.bedtime && (
                          <p className="mt-1 text-sm text-red-600">{errors.bedtime}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                          <SunIcon className="h-4 w-4" />
                          <span>Wake Time</span>
                        </label>
                        <input
                          type="time"
                          value={formData.wakeTime}
                          onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                          className={`input ${errors.wakeTime ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {errors.wakeTime && (
                          <p className="mt-1 text-sm text-red-600">{errors.wakeTime}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actual Times */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Actual Times (Optional)</h3>
                    <p className="text-xs text-gray-500">Leave blank if you followed your planned schedule</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Actual Bedtime
                        </label>
                        <input
                          type="time"
                          value={formData.actualBedtime}
                          onChange={(e) => setFormData({ ...formData, actualBedtime: e.target.value })}
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Actual Wake Time
                        </label>
                        <input
                          type="time"
                          value={formData.actualWakeTime}
                          onChange={(e) => setFormData({ ...formData, actualWakeTime: e.target.value })}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sleep Quality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sleep Quality (0-10)
                    </label>
                    <div className="flex items-center space-x-1">
                      {renderQualityStars()}
                      <span className="ml-2 text-sm text-gray-600">
                        {formData.sleepQuality > 0 ? `${formData.sleepQuality}/10` : 'Not rated'}
                      </span>
                    </div>
                    {errors.sleepQuality && (
                      <p className="mt-1 text-sm text-red-600">{errors.sleepQuality}</p>
                    )}
                  </div>

                  {/* Sleep Tips */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">💤 Sleep Tips for ADHD</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      {sleepTips.slice(0, 3).map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
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
                      <MoonIcon className="h-4 w-4 mr-2" />
                      {editingSchedule ? 'Update Schedule' : 'Log Sleep'}
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

export default SleepModal;