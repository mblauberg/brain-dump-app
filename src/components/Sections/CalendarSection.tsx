import React, { useState, useMemo } from 'react';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ClockIcon,
  CheckCircleIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import GlassContainer from '../Glass/GlassContainer';
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  isToday,
  isFuture,
  startOfDay,
  addWeeks,
  subWeeks
} from 'date-fns';

interface CalendarSectionProps {
  className?: string;
  collapsible?: boolean;
  initiallyExpanded?: boolean;
  cognitiveWeight?: 'light' | 'medium' | 'heavy';
  adaptiveHeight?: boolean;
  lazyLoad?: boolean;
  smartPreview?: boolean;
  maxEvents?: number;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({
  className = '',
  collapsible = true,
  initiallyExpanded = false,
  cognitiveWeight = 'medium',
  adaptiveHeight = true,
  lazyLoad = false,
  smartPreview = true,
  maxEvents = 5
}) => {
  const { tasks, habits, calendarEvents } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date()));
  const [viewMode, setViewMode] = useState<'week' | 'agenda'>('agenda');

  // Generate upcoming events from tasks, habits, and calendar events
  const upcomingItems = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      type: 'task' | 'habit' | 'event';
      date: Date;
      time?: string;
      priority?: string;
      status?: string;
      isOverdue?: boolean;
      energyLevel?: string;
    }> = [];

    // Add tasks with due dates
    tasks.forEach(task => {
      if (task.dueDate && task.status !== 'completed') {
        const dueDate = new Date(task.dueDate);
        items.push({
          id: task.id,
          title: task.title,
          type: 'task',
          date: dueDate,
          priority: task.priority,
          status: task.status,
          energyLevel: task.energyLevel,
          isOverdue: dueDate < startOfDay(new Date())
        });
      }
    });

    // Add scheduled tasks
    tasks.forEach(task => {
      if (task.scheduledDate && task.status !== 'completed') {
        items.push({
          id: `${task.id}-scheduled`,
          title: `📋 ${task.title}`,
          type: 'task',
          date: new Date(task.scheduledDate),
          priority: task.priority,
          status: task.status,
          energyLevel: task.energyLevel
        });
      }
    });

    // Add daily habits for the next 7 days
    const dailyHabits = habits.filter(h => h.frequency === 'daily' && h.isActive);
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i);
      dailyHabits.forEach(habit => {
        // Check if habit is already completed today
        const isCompleted = habit.completedDates.some(completedDate =>
          isSameDay(new Date(completedDate), date)
        );

        if (!isCompleted || isToday(date)) {
          items.push({
            id: `${habit.id}-${format(date, 'yyyy-MM-dd')}`,
            title: `🔄 ${habit.title}`,
            type: 'habit',
            date: date,
            time: habit.scheduledTime,
            status: isCompleted ? 'completed' : 'pending'
          });
        }
      });
    }

    // Add calendar events
    calendarEvents.forEach(event => {
      if (isFuture(event.startTime) || isToday(event.startTime)) {
        items.push({
          id: event.id,
          title: event.title,
          type: 'event',
          date: event.startTime,
          time: format(event.startTime, 'HH:mm')
        });
      }
    });

    // Sort by date and time
    return items
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, smartPreview ? maxEvents : items.length);
  }, [tasks, habits, calendarEvents, smartPreview, maxEvents]);

  // Generate week view data
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(currentWeek, i);
      const dayItems = upcomingItems.filter(item => isSameDay(item.date, date));
      
      return {
        date,
        items: dayItems.slice(0, 3), // Limit to 3 items per day for week view
        hasMore: dayItems.length > 3
      };
    });
  }, [currentWeek, upcomingItems]);

  // Calculate today's stats
  const todayStats = useMemo(() => {
    const todayItems = upcomingItems.filter(item => isToday(item.date));

    return {
      total: todayItems.length,
      completed: todayItems.filter(item => item.status === 'completed').length,
      overdue: todayItems.filter(item => item.isOverdue).length,
      highPriority: todayItems.filter(item => item.priority === 'high').length
    };
  }, [upcomingItems]);

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return '📋';
      case 'habit': return '🔄';
      case 'event': return '📅';
      default: return '📋';
    }
  };

  const getItemTypeColor = (type: string, priority?: string, isOverdue?: boolean) => {
    if (isOverdue) return 'text-red-600 bg-red-50 border-red-200';
    
    switch (type) {
      case 'task':
        if (priority === 'high') return 'text-orange-600 bg-orange-50 border-orange-200';
        if (priority === 'medium') return 'text-blue-600 bg-blue-50 border-blue-200';
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'habit':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'event':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!isExpanded && collapsible) {
    return (
      <GlassContainer
        variant="light"
        cognitiveLoad="minimal"
        energyLevel="medium"
        elevation="flat"
        className={`transition-all duration-300 ${className}`}
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between p-2 hover:bg-white/20 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Calendar</h3>
              <p className="text-xs text-gray-600">
                {todayStats.total} items today
                {todayStats.overdue > 0 && ` • ${todayStats.overdue} overdue`}
              </p>
            </div>
          </div>
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </button>
      </GlassContainer>
    );
  }

  return (
    <GlassContainer
      variant="medium"
      cognitiveLoad={cognitiveWeight === 'light' ? 'minimal' : 'standard'}
      energyLevel="medium"
      elevation="floating"
      className={`transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Upcoming</h2>
            <p className="text-sm text-gray-600">
              {todayStats.total} items today • {upcomingItems.length} this week
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Toggle */}
          <div className="flex items-center bg-white/30 rounded-lg p-1">
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'agenda' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Agenda
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'week' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Week
            </button>
          </div>

          {collapsible && (
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-lg hover:bg-white/30 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronUpIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Today's Quick Stats */}
      {todayStats.total > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-blue-50/50 rounded-lg border border-blue-200/30">
            <div className="text-sm font-semibold text-blue-700">{todayStats.total}</div>
            <div className="text-xs text-blue-600">Total</div>
          </div>
          <div className="text-center p-2 bg-green-50/50 rounded-lg border border-green-200/30">
            <div className="text-sm font-semibold text-green-700">{todayStats.completed}</div>
            <div className="text-xs text-green-600">Done</div>
          </div>
          <div className="text-center p-2 bg-orange-50/50 rounded-lg border border-orange-200/30">
            <div className="text-sm font-semibold text-orange-700">{todayStats.highPriority}</div>
            <div className="text-xs text-orange-600">High Pri</div>
          </div>
          <div className="text-center p-2 bg-red-50/50 rounded-lg border border-red-200/30">
            <div className="text-sm font-semibold text-red-700">{todayStats.overdue}</div>
            <div className="text-xs text-red-600">Overdue</div>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'agenda' ? (
        /* Agenda View */
        <div className="space-y-3">
          {upcomingItems.length === 0 ? (
            <div className="text-center py-6">
              <CalendarIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Nothing scheduled</p>
              <p className="text-xs text-gray-500">
                Your upcoming tasks and habits will appear here
              </p>
            </div>
          ) : (
            upcomingItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all hover:scale-[1.01] ${
                  getItemTypeColor(item.type, item.priority, item.isOverdue)
                }`}
              >
                <div className="flex-shrink-0">
                  <span className="text-lg">{getItemTypeIcon(item.type)}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-medium text-sm truncate ${
                      item.status === 'completed' ? 'line-through opacity-75' : ''
                    }`}>
                      {item.title}
                    </h4>
                    {item.status === 'completed' && (
                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-600">
                      {isToday(item.date) 
                        ? 'Today' 
                        : format(item.date, 'MMM d')}
                    </span>
                    {item.time && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600 flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {item.time}
                        </span>
                      </>
                    )}
                    {item.energyLevel && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600 flex items-center">
                          <BoltIcon className="h-3 w-3 mr-1" />
                          {item.energyLevel}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                {item.isOverdue && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Overdue
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Week View */
        <div className="space-y-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousWeek}
              className="p-2 rounded-lg hover:bg-white/30 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            
            <h3 className="font-medium text-gray-900">
              {format(currentWeek, 'MMM d')} - {format(addDays(currentWeek, 6), 'MMM d, yyyy')}
            </h3>
            
            <button
              onClick={handleNextWeek}
              className="p-2 rounded-lg hover:bg-white/30 text-gray-600 hover:text-gray-800"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg border transition-all ${
                  isToday(day.date) 
                    ? 'bg-primary-50 border-primary-200' 
                    : 'bg-white/30 border-white/40 hover:bg-white/50'
                }`}
              >
                <div className="text-center mb-2">
                  <div className="text-xs font-medium text-gray-700">
                    {format(day.date, 'EEE')}
                  </div>
                  <div className={`text-sm font-semibold ${
                    isToday(day.date) ? 'text-primary-700' : 'text-gray-900'
                  }`}>
                    {format(day.date, 'd')}
                  </div>
                </div>
                
                <div className="space-y-1">
                  {day.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-1 rounded text-xs font-medium bg-white/50 border border-white/60 truncate"
                      title={item.title}
                    >
                      {item.title}
                    </div>
                  ))}
                  {day.hasMore && (
                    <div className="text-xs text-gray-500 text-center">
                      +{day.items.length}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassContainer>
  );
};

export default CalendarSection;