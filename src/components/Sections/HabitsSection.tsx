import React, { useState } from 'react';
import { BoltIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { GlassCard, GlassButton } from '../Glass';
import { useAppStore } from '../../stores/useAppStore';
import { Habit } from '../../types';

interface HabitsSectionProps {
  energyLevel?: 'high' | 'medium' | 'low';
  cognitiveLoad?: 'minimal' | 'standard' | 'detailed';
  onHabitEdit?: (habit: Habit) => void;
}

const HabitsSection: React.FC<HabitsSectionProps> = ({
  energyLevel = 'medium',
  cognitiveLoad = 'standard',
  onHabitEdit,
}) => {
  const { habits, completeHabit } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all');

  // Filter habits
  const filteredHabits = habits
    .filter(habit => {
      if (filter === 'daily') return habit.frequency === 'daily';
      if (filter === 'weekly') return habit.frequency === 'weekly';
      return true;
    })
    .slice(0, cognitiveLoad === 'minimal' ? 4 : cognitiveLoad === 'standard' ? 8 : 16);

  const getTodayCompletion = (habit: Habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return habit.completedDates.some(date => {
      const completedDate = new Date(date);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '🌟';
    if (streak >= 7) return '⚡';
    if (streak >= 3) return '🌱';
    return '💫';
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'text-blue-600 bg-blue-50';
      case 'weekly': return 'text-purple-600 bg-purple-50';
      case 'monthly': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const HabitCard: React.FC<{ habit: Habit }> = ({ habit }) => {
    const isCompletedToday = getTodayCompletion(habit);
    const progressPercentage = habit.frequency === 'daily' 
      ? Math.min((habit.streak / 30) * 100, 100)
      : Math.min((habit.streak / 4) * 100, 100);

    return (
      <GlassCard
        variant="light"
        cognitiveLoad={cognitiveLoad}
        energyLevel={energyLevel}
        className="transition-all duration-200 hover:scale-[1.01]"
        onClick={() => onHabitEdit?.(habit)}
        isClickable={true}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isCompletedToday) {
                    completeHabit(habit.id, new Date());
                  }
                }}
                className={`flex-shrink-0 mt-0.5 transition-colors ${
                  isCompletedToday 
                    ? 'text-green-600' 
                    : 'text-gray-400 hover:text-green-600'
                }`}
                disabled={isCompletedToday}
                aria-label={`${isCompletedToday ? 'Completed' : 'Mark complete'}: ${habit.title}`}
              >
                <CheckCircleIcon className="h-6 w-6" />
              </button>

              <div className="flex-1 min-w-0">
                <h4 className={`font-medium truncate ${
                  isCompletedToday ? 'text-green-700' : 'text-gray-900'
                }`}>
                  {habit.title}
                </h4>
                
                {cognitiveLoad !== 'minimal' && habit.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {habit.description}
                  </p>
                )}
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <span className="text-lg" aria-hidden="true">
                {getStreakEmoji(habit.streak)}
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {habit.streak}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          {cognitiveLoad !== 'minimal' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCompletedToday ? 'bg-green-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(habit.frequency)}`}>
              {habit.frequency}
            </span>

            {isCompletedToday && (
              <span className="flex items-center text-xs text-green-600 font-medium">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Done today
              </span>
            )}
          </div>
        </div>
      </GlassCard>
    );
  };

  const todayStats = {
    completed: habits.filter(h => getTodayCompletion(h)).length,
    total: habits.filter(h => h.frequency === 'daily').length,
    streaks: habits.filter(h => h.streak >= 7).length,
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Habits</h3>
          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
            {filteredHabits.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {(['all', 'daily', 'weekly'] as const).map((filterOption) => (
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
      </div>

      {/* Today's Progress */}
      {cognitiveLoad !== 'minimal' && (
        <GlassCard
          variant="light"
          cognitiveLoad="minimal"
          energyLevel={energyLevel}
          className="bg-gradient-to-r from-blue-50/50 to-purple-50/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BoltIcon className="h-8 w-8 text-primary-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Today's Progress</h4>
                <p className="text-sm text-gray-600">
                  {todayStats.completed} of {todayStats.total} daily habits completed
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {todayStats.total > 0 ? Math.round((todayStats.completed / todayStats.total) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500">completion</div>
            </div>
          </div>
          
          {todayStats.total > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(todayStats.completed / todayStats.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* Habits Grid */}
      {filteredHabits.length > 0 ? (
        <div className={`grid gap-4 ${
          cognitiveLoad === 'minimal' 
            ? 'grid-cols-1' 
            : 'grid-cols-1 md:grid-cols-2'
        }`}>
          {filteredHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
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
            <BoltIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium mb-1">No habits yet</p>
            <p className="text-sm">
              Start building healthy routines by brain dumping your goals above.
            </p>
          </div>
        </GlassCard>
      )}

      {/* Quick Stats */}
      {cognitiveLoad === 'detailed' && habits.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50/50 rounded-lg border border-green-200/30">
            <div className="text-lg font-semibold text-green-700">
              {todayStats.completed}
            </div>
            <div className="text-xs text-green-600">Completed Today</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50/50 rounded-lg border border-orange-200/30">
            <div className="text-lg font-semibold text-orange-700">
              {todayStats.streaks}
            </div>
            <div className="text-xs text-orange-600">Active Streaks</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50/50 rounded-lg border border-purple-200/30">
            <div className="text-lg font-semibold text-purple-700">
              {Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / habits.length) || 0}
            </div>
            <div className="text-xs text-purple-600">Avg Streak</div>
          </div>
        </div>
      )}

      {/* View All Button */}
      {filteredHabits.length === (cognitiveLoad === 'minimal' ? 4 : cognitiveLoad === 'standard' ? 8 : 16) && habits.length > filteredHabits.length && (
        <div className="text-center">
          <GlassButton
            variant="secondary"
            size="md"
            energyLevel={energyLevel}
            onClick={() => {/* TODO: Navigate to full habits view */}}
          >
            View All {habits.length} Habits
          </GlassButton>
        </div>
      )}
    </div>
  );
};

export default HabitsSection;