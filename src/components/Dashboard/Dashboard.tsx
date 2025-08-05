import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  FireIcon, 
  ChartBarIcon,
  CalendarDaysIcon,
  BoltIcon,
  Squares2X2Icon,
  ListBulletIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import TaskList from '../Tasks/TaskList';
import TaskKanban from '../Tasks/TaskKanban';
import TaskModal from '../Tasks/TaskModal';
import TaskTemplates from '../Tasks/TaskTemplates';
import { isToday, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

const Dashboard: React.FC = () => {
  const { tasks, habits, setIsBrainDumpOpen } = useAppStore();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status !== 'completed').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && task.status !== 'completed').length;

  const todaysTasks = tasks.filter(task => 
    task.scheduledDate && isToday(new Date(task.scheduledDate))
  );

  const thisWeeksTasks = tasks.filter(task => {
    if (!task.scheduledDate) return false;
    const taskDate = new Date(task.scheduledDate);
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    return isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
  });

  const activeHabits = habits.filter(habit => habit.isActive);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: ChartBarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Pending',
      value: pendingTasks,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'High Priority',
      value: highPriorityTasks,
      icon: FireIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Your Brain Organiser!</h1>
        <p className="text-primary-100 mb-4">
          Ready to turn your thoughts into action? Let's organize your mind and boost your productivity.
        </p>
        {totalTasks === 0 ? (
          <button
            onClick={() => setIsBrainDumpOpen(true)}
            className="bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
          >
            Start Your First Brain Dump
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="font-semibold">{completionRate}%</span> completion rate
            </div>
            <div className="text-sm">
              <span className="font-semibold">{todaysTasks.length}</span> tasks today
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-4">
              <div className="flex flex-col sm:flex-row items-center">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} mb-2 sm:mb-0`}>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
                <div className="sm:ml-4 text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Today's Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
            <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
          </div>
          {todaysTasks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tasks scheduled for today.</p>
          ) : (
            <div className="space-y-2">
              {todaysTasks.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center space-x-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="flex-1 truncate">{task.title}</span>
                </div>
              ))}
              {todaysTasks.length > 3 && (
                <p className="text-xs text-gray-500">+{todaysTasks.length - 3} more tasks</p>
              )}
            </div>
          )}
        </div>

        {/* Active Habits */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Habits</h3>
            <BoltIcon className="h-5 w-5 text-gray-400" />
          </div>
          {activeHabits.length === 0 ? (
            <p className="text-gray-500 text-sm">No active habits yet.</p>
          ) : (
            <div className="space-y-2">
              {activeHabits.slice(0, 3).map(habit => (
                <div key={habit.id} className="flex items-center justify-between text-sm">
                  <span className="flex-1 truncate">{habit.title}</span>
                  <span className="text-primary-600 font-medium">{habit.streak} day streak</span>
                </div>
              ))}
              {activeHabits.length > 3 && (
                <p className="text-xs text-gray-500">+{activeHabits.length - 3} more habits</p>
              )}
            </div>
          )}
        </div>

        {/* Weekly Progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tasks Completed</span>
                <span>{thisWeeksTasks.filter(t => t.status === 'completed').length}/{thisWeeksTasks.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ 
                    width: `${thisWeeksTasks.length > 0 ? 
                      (thisWeeksTasks.filter(t => t.status === 'completed').length / thisWeeksTasks.length) * 100 : 0
                    }%` 
                  }}
                />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Keep up the great work! 🎉
            </div>
          </div>
        </div>
      </div>

      {/* Main Task Management */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-xl font-bold text-gray-900">All Tasks</h2>
          
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ListBulletIcon className="h-4 w-4 mr-1" />
                List
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Squares2X2Icon className="h-4 w-4 mr-1" />
                Board
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="btn btn-primary text-sm"
              >
                Create Task
              </button>
              <button
                onClick={() => setIsTemplatesOpen(true)}
                className="btn btn-secondary text-sm"
              >
                <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                Templates
              </button>
              <button
                onClick={() => setIsBrainDumpOpen(true)}
                className="btn btn-secondary text-sm"
              >
                Brain Dump
              </button>
            </div>
          </div>
        </div>
        
        {viewMode === 'list' ? <TaskList /> : <TaskKanban />}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        editingTask={null}
      />

      {/* Task Templates Modal */}
      <TaskTemplates
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
      />
    </div>
  );
};

export default Dashboard;