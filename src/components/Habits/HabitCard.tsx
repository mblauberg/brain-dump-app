import React from 'react';
import {
  CheckCircleIcon,
  CalendarDaysIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { Habit } from '../../types';
import { useAppStore } from '../../stores/useAppStore';
import { isToday } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
  onSchedule?: (habit: Habit) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onSchedule }) => {
  const { completeHabit, deleteHabit } = useAppStore();

  const isCompletedToday = habit.completedDates.some(date => 
    isToday(new Date(date))
  );

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600 bg-purple-50';
    if (streak >= 14) return 'text-blue-600 bg-blue-50';
    if (streak >= 7) return 'text-green-600 bg-green-50';
    if (streak >= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⭐';
    if (streak >= 3) return '💪';
    return '🌱';
  };

  const handleComplete = () => {
    if (!isCompletedToday) {
      completeHabit(habit.id, new Date());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habit.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(habit);
  };

  const handleSchedule = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSchedule?.(habit);
  };

  // Future use for completion analytics
  // const completionRate = habit.completedDates.length > 0 
  //   ? Math.round((habit.streak / Math.max(habit.completedDates.length, 1)) * 100)
  //   : 0;

  return (
    <div 
      className={`card hover:shadow-md transition-all duration-200 cursor-pointer group ${
        isCompletedToday ? 'ring-2 ring-green-200 bg-green-50' : ''
      } ${!habit.isActive ? 'opacity-60' : ''}`}
      onClick={handleComplete}
    >
      <div className="flex items-start space-x-4">
        <button
          onClick={handleComplete}
          disabled={isCompletedToday}
          className={`flex-shrink-0 mt-1 transition-colors ${
            isCompletedToday 
              ? 'text-green-600' 
              : 'text-gray-400 hover:text-green-600'
          }`}
        >
          {isCompletedToday ? (
            <CheckCircleIconSolid className="h-6 w-6" />
          ) : (
            <CheckCircleIcon className="h-6 w-6" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-base font-medium ${
              isCompletedToday ? 'text-green-800' : 'text-gray-900'
            }`}>
              {habit.title}
            </h3>
            
            {habit.isActive && (
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStreakColor(habit.streak)}`}>
                <span className="mr-1">{getStreakIcon(habit.streak)}</span>
                {habit.streak} day streak
              </div>
            )}
          </div>
          
          {habit.description && (
            <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-3 w-3 mr-1" />
                {habit.frequency}
              </div>
              
              {habit.scheduledTime && (
                <div className="flex items-center">
                  <span className="mr-1">⏰</span>
                  {habit.scheduledTime}
                </div>
              )}

              <div className="flex items-center">
                <span className="mr-1">📊</span>
                {habit.completedDates.length} completed
              </div>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {habit.isActive && onSchedule && (
                <button
                  onClick={handleSchedule}
                  className="p-1 rounded text-gray-400 hover:text-blue-600"
                  title="Schedule habit"
                >
                  <ClockIcon className="h-4 w-4" />
                </button>
              )}
              {habit.isActive && onEdit && (
                <button
                  onClick={handleEdit}
                  className="p-1 rounded text-gray-400 hover:text-gray-600"
                  title="Edit habit"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-1 rounded text-gray-400 hover:text-red-600"
                title="Delete habit"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress bar for weekly habits */}
          {habit.frequency === 'weekly' && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Weekly Progress</span>
                <span>{Math.min(habit.streak, 7)}/7 days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-primary-600 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((habit.streak / 7) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Completion status for today */}
          {isCompletedToday && (
            <div className="mt-3 flex items-center text-sm text-green-700">
              <CheckCircleIconSolid className="h-4 w-4 mr-1" />
              Completed today! Great job! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitCard;