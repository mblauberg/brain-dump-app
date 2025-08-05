import React from 'react';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';

const Sidebar: React.FC = () => {
  const { tasks, habits } = useAppStore();

  const todaysTasks = tasks.filter(task => 
    task.scheduledDate && 
    new Date(task.scheduledDate).toDateString() === new Date().toDateString()
  );

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status !== 'completed');

  const activeHabits = habits.filter(habit => habit.isActive);

  const stats = [
    {
      label: "Today's Tasks",
      value: todaysTasks.length,
      icon: ClipboardDocumentListIcon,
      color: 'text-blue-600',
    },
    {
      label: 'Completed',
      value: completedTasks.length,
      icon: CheckCircleIcon,
      color: 'text-green-600',
    },
    {
      label: 'Pending',
      value: pendingTasks.length,
      icon: ClockIcon,
      color: 'text-yellow-600',
    },
    {
      label: 'Active Habits',
      value: activeHabits.length,
      icon: BoltIcon,
      color: 'text-purple-600',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 px-4 py-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              View Today's Schedule
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              Review Habits
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              Plan Tomorrow
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Energy Level</h3>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <span className="text-sm text-gray-600">High</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Perfect time for important tasks!</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;