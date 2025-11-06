import React, { useState, useMemo } from 'react';
import {
  MoonIcon,
  ChartBarIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import GlassContainer from '../Glass/GlassContainer';
import { format, isToday, subDays, startOfDay } from 'date-fns';

interface SleepSectionProps {
  className?: string;
  collapsible?: boolean;
  initiallyExpanded?: boolean;
  cognitiveWeight?: 'light' | 'medium' | 'heavy';
  adaptiveHeight?: boolean;
  lazyLoad?: boolean;
  minimalDisplay?: boolean;
}

const SleepSection: React.FC<SleepSectionProps> = ({
  className = '',
  collapsible = true,
  initiallyExpanded = false,
  cognitiveWeight = 'light',
  adaptiveHeight = true,
  lazyLoad = false,
  minimalDisplay = true
}) => {
  const { sleepSchedules, addSleepSchedule } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Get recent sleep data
  const recentSleepData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      const schedule = sleepSchedules.find(s => 
        startOfDay(new Date(s.date)).getTime() === startOfDay(date).getTime()
      );
      return {
        date,
        schedule,
        hasData: !!schedule
      };
    }).reverse();

    return last7Days;
  }, [sleepSchedules]);

  // Calculate sleep stats
  const sleepStats = useMemo(() => {
    const recentSchedules = sleepSchedules
      .filter(s => new Date(s.date) >= subDays(new Date(), 7))
      .filter(s => s.sleepQuality !== undefined);

    if (recentSchedules.length === 0) {
      return {
        averageQuality: 0,
        averageBedtime: null,
        averageWakeTime: null,
        consistency: 0,
        streak: 0
      };
    }

    const averageQuality = recentSchedules.reduce((sum, s) => sum + (s.sleepQuality || 0), 0) / recentSchedules.length;
    
    // Calculate consistency (how often sleep schedule is followed)
    const schedulesWithTimes = recentSchedules.filter(s => s.actualBedtime && s.actualWakeTime);
    const consistency = (schedulesWithTimes.length / 7) * 100;

    // Calculate current streak
    let streak = 0;
    const sortedSchedules = [...sleepSchedules]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const schedule of sortedSchedules) {
      if (schedule.sleepQuality && schedule.sleepQuality >= 6) {
        streak++;
      } else {
        break;
      }
    }

    return {
      averageQuality: Math.round(averageQuality * 10) / 10,
      averageBedtime: null, // Could calculate if needed
      averageWakeTime: null, // Could calculate if needed
      consistency: Math.round(consistency),
      streak
    };
  }, [sleepSchedules]);

  // Get today's sleep data
  const todaysSleep = sleepSchedules.find(s => isToday(new Date(s.date)));

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return 'text-green-600 bg-green-50';
    if (quality >= 6) return 'text-yellow-600 bg-yellow-50';
    if (quality >= 4) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getQualityEmoji = (quality: number) => {
    if (quality >= 8) return '😴';
    if (quality >= 6) return '😊';
    if (quality >= 4) return '😐';
    return '😵';
  };

  const handleQuickSleepLog = (quality: number) => {
    const today = new Date();
    addSleepSchedule({
      bedtime: '22:00',
      wakeTime: '07:00',
      sleepQuality: quality,
      date: today,
      actualBedtime: format(new Date(), 'HH:mm'),
      actualWakeTime: undefined
    });
  };

  if (!isExpanded && collapsible) {
    return (
      <GlassContainer
        variant="light"
        cognitiveLoad="minimal"
        energyLevel="low"
        elevation="flat"
        className={`transition-all duration-300 ${className}`}
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between p-2 hover:bg-white/20 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <MoonIcon className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Sleep</h3>
              <p className="text-xs text-gray-600">
                {sleepStats.averageQuality > 0 ? `${sleepStats.averageQuality}/10 avg` : 'No data yet'}
                {sleepStats.streak > 0 && ` • ${sleepStats.streak} day streak`}
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
      variant="light"
      cognitiveLoad={minimalDisplay ? 'minimal' : 'standard'}
      energyLevel="low"
      elevation="floating"
      className={`transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <MoonIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Sleep Insights</h2>
            <p className="text-sm text-gray-600">
              {sleepStats.consistency}% consistency this week
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!minimalDisplay && (
            <button
              onClick={() => setShowDetailedView(!showDetailedView)}
              className="p-2 rounded-lg hover:bg-white/30 text-gray-600 hover:text-gray-800 transition-colors"
              title="Toggle detailed view"
            >
              <ChartBarIcon className="h-5 w-5" />
            </button>
          )}

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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 bg-indigo-50/50 rounded-lg border border-indigo-200/30">
          <div className="text-lg font-semibold text-indigo-700">
            {sleepStats.averageQuality || '—'}
          </div>
          <div className="text-xs text-indigo-600">Avg Quality</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50/50 rounded-lg border border-purple-200/30">
          <div className="text-lg font-semibold text-purple-700">
            {sleepStats.streak}
          </div>
          <div className="text-xs text-purple-600">Day Streak</div>
        </div>
        
        <div className="text-center p-3 bg-blue-50/50 rounded-lg border border-blue-200/30">
          <div className="text-lg font-semibold text-blue-700">
            {sleepStats.consistency}%
          </div>
          <div className="text-xs text-blue-600">Weekly Goal</div>
        </div>

        <div className="text-center p-3 bg-green-50/50 rounded-lg border border-green-200/30">
          <div className="text-lg font-semibold text-green-700">
            {recentSleepData.filter(d => d.hasData).length}
          </div>
          <div className="text-xs text-green-600">Logged Days</div>
        </div>
      </div>

      {/* Today's Sleep */}
      {!todaysSleep && (
        <div className="mb-4 p-4 bg-yellow-50/50 rounded-lg border border-yellow-200/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-yellow-800">Log Today's Sleep</h4>
              <p className="text-sm text-yellow-700">How did you sleep last night?</p>
            </div>
            <div className="flex space-x-1">
              {[6, 7, 8, 9, 10].map((quality) => (
                <button
                  key={quality}
                  onClick={() => handleQuickSleepLog(quality)}
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-yellow-300 hover:border-yellow-400 text-sm font-medium text-yellow-700 hover:text-yellow-800 transition-all"
                  title={`Rate sleep quality: ${quality}/10`}
                >
                  {quality}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Sleep Pattern (Minimal) */}
      {minimalDisplay && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Last 7 Days</h4>
          <div className="flex space-x-1">
            {recentSleepData.map((day, index) => (
              <div
                key={index}
                className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-medium ${
                  day.hasData && day.schedule?.sleepQuality
                    ? getQualityColor(day.schedule.sleepQuality)
                    : 'bg-gray-100 text-gray-400'
                }`}
                title={`${format(day.date, 'MMM d')}: ${
                  day.schedule?.sleepQuality ? `${day.schedule.sleepQuality}/10` : 'No data'
                }`}
              >
                {day.hasData && day.schedule?.sleepQuality 
                  ? getQualityEmoji(day.schedule.sleepQuality)
                  : '—'
                }
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{format(recentSleepData[0].date, 'MMM d')}</span>
            <span>Today</span>
          </div>
        </div>
      )}

      {/* Detailed View */}
      {showDetailedView && !minimalDisplay && (
        <div className="space-y-4">
          <div className="border-t border-white/20 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Sleep Logs</h4>
            <div className="space-y-2">
              {recentSleepData
                .filter(d => d.hasData)
                .slice(0, 3)
                .map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <MoonIcon className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {format(day.date, 'MMM d')}
                        </div>
                        {day.schedule?.actualBedtime && (
                          <div className="text-xs text-gray-600">
                            Bed: {day.schedule.actualBedtime}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {day.schedule?.sleepQuality && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getQualityColor(day.schedule.sleepQuality)
                      }`}>
                        {day.schedule.sleepQuality}/10
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {sleepSchedules.length === 0 && (
        <div className="text-center py-6">
          <MoonIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">No sleep data yet</p>
          <p className="text-xs text-gray-500">
            Start tracking your sleep quality to see insights here
          </p>
        </div>
      )}
    </GlassContainer>
  );
};

export default SleepSection;