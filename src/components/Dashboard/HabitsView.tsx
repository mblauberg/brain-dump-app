import React, { useState } from 'react';
import HabitList from '../Habits/HabitList';
import HabitModal from '../Habits/HabitModal';
import HabitScheduler from '../Habits/HabitScheduler';
import { Habit } from '../../types';

const HabitsView: React.FC = () => {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [schedulingHabit, setSchedulingHabit] = useState<Habit | null>(null);

  const handleCreateHabit = () => {
    setEditingHabit(null);
    setIsHabitModalOpen(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleScheduleHabit = (habit: Habit) => {
    setSchedulingHabit(habit);
    setIsSchedulerOpen(true);
  };

  const handleCloseModal = () => {
    setIsHabitModalOpen(false);
    setEditingHabit(null);
  };

  const handleCloseScheduler = () => {
    setIsSchedulerOpen(false);
    setSchedulingHabit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Habits</h1>
      </div>

      <HabitList 
        onCreateHabit={handleCreateHabit} 
        onEditHabit={handleEditHabit}
        onScheduleHabit={handleScheduleHabit}
      />

      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={handleCloseModal}
        editingHabit={editingHabit}
      />

      {schedulingHabit && (
        <HabitScheduler
          isOpen={isSchedulerOpen}
          onClose={handleCloseScheduler}
          habit={schedulingHabit}
        />
      )}
    </div>
  );
};

export default HabitsView;