import React, { useState, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  ClockIcon,
  CalendarDaysIcon,
  LightBulbIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import { Habit } from '../../types';
import { format, addDays, startOfWeek } from 'date-fns';

interface HabitSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit;
}

const HabitScheduler: React.FC<HabitSchedulerProps> = ({ isOpen, onClose, habit }) => {
  const { userPreferences, updateHabit } = useAppStore();
  const [selectedTimes, setSelectedTimes] = useState<string[]>(
    habit.scheduledTime ? [habit.scheduledTime] : []
  );
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>(habit.frequency);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
          hour: 'numeric', 
          minute: '2-digit' 
        });
        
        // Determine if this is during user's peak energy hours
        const isEnergyPeak = userPreferences.energyPeakHours.includes(hour);
        const isWorkingHours = hour >= parseInt(userPreferences.workingHours.start.split(':')[0]) && 
                              hour <= parseInt(userPreferences.workingHours.end.split(':')[0]);

        slots.push({
          value: time,
          display: displayTime,
          hour,
          isEnergyPeak,
          isWorkingHours,
        });
      }
    }
    return slots;
  }, [userPreferences]);

  const weekDays = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
  ];

  const recommendedTimes = useMemo(() => {
    return timeSlots.filter(slot => {
      // Recommend times during energy peaks for high-energy habits
      if (slot.isEnergyPeak) return true;
      
      // For morning routines, recommend early times
      if (habit.title.toLowerCase().includes('morning') && slot.hour >= 6 && slot.hour <= 9) {
        return true;
      }
      
      // For evening routines, recommend evening times
      if (habit.title.toLowerCase().includes('evening') && slot.hour >= 18 && slot.hour <= 21) {
        return true;
      }
      
      return false;
    }).slice(0, 6); // Limit to top 6 recommendations
  }, [timeSlots, habit.title]);

  const handleTimeToggle = (time: string) => {
    if (frequency === 'daily') {
      // For daily habits, only allow one time
      setSelectedTimes([time]);
    } else {
      // For weekly/custom, allow multiple times
      setSelectedTimes(prev => 
        prev.includes(time) 
          ? prev.filter(t => t !== time)
          : [...prev, time]
      );
    }
  };

  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = () => {
    const updates: Partial<Habit> = {
      frequency,
      scheduledTime: selectedTimes[0], // Primary scheduled time
    };

    updateHabit(habit.id, updates);
    onClose();
  };

  const getTimeSlotColor = (slot: any, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-primary-600 text-white border-primary-600';
    }
    
    if (slot.isEnergyPeak) {
      return 'bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100';
    }
    
    if (slot.isWorkingHours) {
      return 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100';
    }
    
    return 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100';
  };

  const currentWeekDays = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      return {
        date,
        dayOfWeek: date.getDay(),
        label: format(date, 'EEE'),
        dateLabel: format(date, 'd'),
        isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
      };
    });
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Schedule Habit: {habit.title}
              </Dialog.Title>
              <p className="text-sm text-gray-500 mt-1">
                Find the perfect time for your habit based on your energy and schedule
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Frequency Selection */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-900 mb-4">How often?</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'daily', label: 'Daily', desc: 'Every day' },
                  { value: 'weekly', label: 'Weekly', desc: 'Specific days' },
                  { value: 'custom', label: 'Custom', desc: 'Flexible schedule' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFrequency(option.value as any)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      frequency === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Day Selection */}
            {frequency === 'weekly' && (
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-900 mb-4">Which days?</h3>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map(day => (
                    <button
                      key={day.value}
                      onClick={() => handleDayToggle(day.value)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        selectedDays.includes(day.value)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xs font-medium">{day.short}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Times */}
            {recommendedTimes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="text-md font-medium text-gray-900">Recommended Times</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {recommendedTimes.map(slot => (
                    <button
                      key={slot.value}
                      onClick={() => handleTimeToggle(slot.value)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        selectedTimes.includes(slot.value)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
                      }`}
                    >
                      <div className="font-medium">{slot.display}</div>
                      <div className="text-xs mt-1">
                        {slot.isEnergyPeak ? '⚡ Energy Peak' : '💼 Work Hours'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Time Selection Grid */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                <ClockIcon className="h-5 w-5 inline mr-2" />
                Select Time{frequency !== 'daily' ? 's' : ''}
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                {timeSlots.map(slot => (
                  <button
                    key={slot.value}
                    onClick={() => handleTimeToggle(slot.value)}
                    className={`p-2 border rounded text-xs text-center transition-colors ${
                      getTimeSlotColor(slot, selectedTimes.includes(slot.value))
                    }`}
                  >
                    {slot.display}
                  </button>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-50 border border-yellow-300 rounded mr-1"></div>
                  <span>Energy Peak</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-50 border border-blue-300 rounded mr-1"></div>
                  <span>Work Hours</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-600 rounded mr-1"></div>
                  <span>Selected</span>
                </div>
              </div>
            </div>

            {/* Current Week Preview */}
            {selectedTimes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  <CalendarDaysIcon className="h-5 w-5 inline mr-2" />
                  This Week Preview
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {currentWeekDays.map(day => {
                    const isScheduled = frequency === 'daily' || 
                                      (frequency === 'weekly' && selectedDays.includes(day.dayOfWeek));
                    
                    return (
                      <div
                        key={day.date.toISOString()}
                        className={`p-3 border rounded-lg text-center ${
                          day.isToday 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200'
                        } ${isScheduled ? 'bg-green-50' : 'bg-gray-50'}`}
                      >
                        <div className="text-xs font-medium text-gray-600">{day.label}</div>
                        <div className="text-lg font-bold text-gray-900">{day.dateLabel}</div>
                        {isScheduled && (
                          <div className="text-xs text-green-600 mt-1">
                            <CheckIcon className="h-3 w-3 inline mr-1" />
                            {selectedTimes[0] && format(new Date(`2000-01-01T${selectedTimes[0]}`), 'h:mm a')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ADHD Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">💡 ADHD Habit Scheduling Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Schedule habits during your natural energy peaks for better consistency</li>
                <li>• Start with daily habits - they're easier to remember than weekly ones</li>
                <li>• Choose the same time each day to build automatic routines</li>
                <li>• Stack new habits after existing ones (habit stacking)</li>
                <li>• Use environmental cues (alarms, reminders) to trigger your habits</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={selectedTimes.length === 0}
              className="btn btn-primary"
            >
              Save Schedule
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default HabitScheduler;