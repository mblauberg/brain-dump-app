import React, { useState, useMemo } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import { Task } from '../../types';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';

interface CalendarGridProps {
  onDateClick?: (date: Date) => void;
  onTaskClick?: (task: Task) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ onDateClick, onTaskClick }) => {
  const { tasks, habits } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const tasksForDate = useMemo(() => {
    const taskMap = new Map<string, Task[]>();
    
    tasks.forEach(task => {
      if (task.scheduledDate) {
        const dateKey = format(new Date(task.scheduledDate), 'yyyy-MM-dd');
        if (!taskMap.has(dateKey)) {
          taskMap.set(dateKey, []);
        }
        taskMap.get(dateKey)!.push(task);
      }
    });

    return taskMap;
  }, [tasks]);

  const activeHabitsForDate = useMemo(() => {
    return habits.filter(habit => habit.isActive && habit.frequency === 'daily');
  }, [habits]);

  const habitCompletionsForDate = useMemo(() => {
    const completionMap = new Map<string, Set<string>>();
    
    habits.forEach(habit => {
      habit.completedDates.forEach(date => {
        const dateKey = format(new Date(date), 'yyyy-MM-dd');
        if (!completionMap.has(dateKey)) {
          completionMap.set(dateKey, new Set());
        }
        completionMap.get(dateKey)!.add(habit.id);
      });
    });

    return completionMap;
  }, [habits]);

  const getDayTasks = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return tasksForDate.get(dateKey) || [];
  };

  const getDayHabitCompletion = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const completedHabits = habitCompletionsForDate.get(dateKey) || new Set();
    const activeHabits = activeHabitsForDate.length;
    
    return {
      completed: completedHabits.size,
      total: activeHabits,
      percentage: activeHabits > 0 ? (completedHabits.size / activeHabits) * 100 : 0,
    };
  };

  // Future use for priority indicators
  // const getPriorityColor = (priority: string) => {
  //   switch (priority) {
  //     case 'high': return 'bg-red-500';
  //     case 'medium': return 'bg-yellow-500';
  //     case 'low': return 'bg-green-500';
  //     default: return 'bg-gray-500';
  //   }
  // };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-3 text-center">
            <span className="text-sm font-medium text-gray-500">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, dayIdx) => {
          const dayTasks = getDayTasks(day);
          const habitStats = getDayHabitCompletion(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={dayIdx}
              className={`min-h-24 sm:min-h-32 p-2 border-r border-b border-gray-200 ${
                !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
              } hover:bg-gray-50 cursor-pointer transition-colors`}
              onClick={() => onDateClick?.(day)}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-sm font-medium ${
                    isDayToday
                      ? 'bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                      : !isCurrentMonth
                      ? 'text-gray-400'
                      : 'text-gray-900'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                
                {/* Add button for current month days */}
                {isCurrentMonth && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateClick?.(day);
                    }}
                    className="opacity-0 hover:opacity-100 p-1 rounded text-gray-400 hover:text-gray-600 transition-opacity"
                  >
                    <PlusIcon className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Tasks */}
              <div className="space-y-1">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick?.(task);
                    }}
                    className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity border-l-2 ${
                      task.status === 'completed' 
                        ? 'bg-green-50 text-green-700 border-green-500' 
                        : 'bg-blue-50 text-blue-700 border-blue-500'
                    }`}
                  >
                    {task.title}
                  </div>
                ))}
                
                {/* More tasks indicator */}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-gray-500 font-medium">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>

              {/* Habit Progress */}
              {isCurrentMonth && habitStats.total > 0 && (
                <div className="mt-2">
                  <div className="flex items-center space-x-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${
                          habitStats.percentage === 100 
                            ? 'bg-green-500' 
                            : habitStats.percentage > 0 
                            ? 'bg-yellow-500' 
                            : 'bg-gray-300'
                        }`}
                        style={{ width: `${habitStats.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {habitStats.completed}/{habitStats.total}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded border-l-2 border-blue-600"></div>
              <span>Tasks</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded border-l-2 border-green-600"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-1 bg-green-500 rounded"></div>
              <span>Habits</span>
            </div>
          </div>
          <div className="text-gray-500">
            Click dates to add tasks • Click tasks to edit
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;