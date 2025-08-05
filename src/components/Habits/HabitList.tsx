import React, { useState, useMemo } from 'react';
import { FunnelIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import HabitCard from './HabitCard';
import { Habit } from '../../types';
import { isToday } from 'date-fns';

interface HabitListProps {
  onCreateHabit?: () => void;
  onEditHabit?: (habit: Habit) => void;
  onScheduleHabit?: (habit: Habit) => void;
}

const HabitList: React.FC<HabitListProps> = ({ onCreateHabit, onEditHabit, onScheduleHabit }) => {
  const { habits } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFrequency, setFilterFrequency] = useState<'all' | 'daily' | 'weekly' | 'custom'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed_today' | 'pending_today'>('all');

  const filteredHabits = useMemo(() => {
    return habits.filter(habit => {
      const matchesSearch = habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (habit.description && habit.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFrequency = filterFrequency === 'all' || habit.frequency === filterFrequency;
      
      let matchesStatus = true;
      if (filterStatus === 'active') {
        matchesStatus = habit.isActive;
      } else if (filterStatus === 'completed_today') {
        matchesStatus = habit.completedDates.some(date => isToday(new Date(date)));
      } else if (filterStatus === 'pending_today') {
        matchesStatus = habit.isActive && !habit.completedDates.some(date => isToday(new Date(date)));
      }

      return matchesSearch && matchesFrequency && matchesStatus;
    });
  }, [habits, searchTerm, filterFrequency, filterStatus]);

  const groupedHabits = useMemo(() => {
    const groups = {
      'Pending Today': filteredHabits.filter(habit => 
        habit.isActive && !habit.completedDates.some(date => isToday(new Date(date)))
      ),
      'Completed Today': filteredHabits.filter(habit => 
        habit.completedDates.some(date => isToday(new Date(date)))
      ),
      'Inactive': filteredHabits.filter(habit => !habit.isActive),
    };

    // Remove empty groups
    return Object.entries(groups).filter(([_, habits]) => habits.length > 0);
  }, [filteredHabits]);

  const habitStats = useMemo(() => {
    const active = habits.filter(h => h.isActive).length;
    const completedToday = habits.filter(h => 
      h.completedDates.some(date => isToday(new Date(date)))
    ).length;
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    const avgStreak = habits.length > 0 ? Math.round(totalStreak / habits.length) : 0;

    return { active, completedToday, avgStreak, total: habits.length };
  }, [habits]);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{habitStats.active}</div>
          <div className="text-sm text-gray-600">Active Habits</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{habitStats.completedToday}</div>
          <div className="text-sm text-gray-600">Done Today</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{habitStats.avgStreak}</div>
          <div className="text-sm text-gray-600">Avg Streak</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-600">{habitStats.total}</div>
          <div className="text-sm text-gray-600">Total Habits</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search habits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          {onCreateHabit && (
            <button
              onClick={onCreateHabit}
              className="btn btn-primary"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Habit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value as any)}
              className="input"
            >
              <option value="all">All Frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="input"
            >
              <option value="all">All Habits</option>
              <option value="active">Active Only</option>
              <option value="completed_today">Completed Today</option>
              <option value="pending_today">Pending Today</option>
            </select>
          </div>
        </div>
      </div>

      {/* Habit Groups */}
      {groupedHabits.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No habits found</h3>
          <p className="text-gray-500 mb-4">
            {habits.length === 0 
              ? "Start building positive habits! Use the Brain Dump feature or create habits directly."
              : "Try adjusting your search or filter criteria."
            }
          </p>
          {onCreateHabit && habits.length === 0 && (
            <button
              onClick={onCreateHabit}
              className="btn btn-primary"
            >
              Create Your First Habit
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedHabits.map(([groupName, groupHabits]) => (
            <div key={groupName}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {groupName} ({groupHabits.length})
                </h2>
                {groupName === 'Pending Today' && groupHabits.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Complete these to maintain your streaks! 💪
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {groupHabits.map((habit) => (
                  <div key={habit.id} className="group">
                    <HabitCard habit={habit} onEdit={onEditHabit} onSchedule={onScheduleHabit} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Motivational Messages */}
      {habitStats.completedToday > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-600 mr-3 text-2xl">🎉</div>
            <div>
              <h3 className="font-medium text-green-800">Great job today!</h3>
              <p className="text-sm text-green-700">
                You've completed {habitStats.completedToday} habit{habitStats.completedToday > 1 ? 's' : ''} today. 
                Keep up the momentum!
              </p>
            </div>
          </div>
        </div>
      )}

      {habits.filter(h => h.streak >= 7).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3 text-2xl">🔥</div>
            <div>
              <h3 className="font-medium text-yellow-800">You're on fire!</h3>
              <p className="text-sm text-yellow-700">
                You have {habits.filter(h => h.streak >= 7).length} habit{habits.filter(h => h.streak >= 7).length > 1 ? 's' : ''} with a 7+ day streak. 
                Amazing consistency!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitList;