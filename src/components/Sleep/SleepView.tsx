import React, { useState, useMemo } from 'react';
import { 
  MoonIcon, 
  PlusIcon, 
  ChartBarIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import SleepScheduleCard from './SleepScheduleCard';
import SleepModal from './SleepModal';
import BedtimeRoutineModal from './BedtimeRoutineModal';
import { SleepSchedule } from '../../types';
import { format, startOfWeek, endOfWeek, isWithinInterval, isToday } from 'date-fns';

const SleepView: React.FC = () => {
  const { sleepSchedules, bedtimeRoutineCompletions } = useAppStore();
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [isBedtimeRoutineOpen, setIsBedtimeRoutineOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<SleepSchedule | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleCreateSleep = () => {
    setEditingSchedule(null);
    setSelectedDate(new Date());
    setIsSleepModalOpen(true);
  };

  const handleEditSleep = (schedule: SleepSchedule) => {
    setEditingSchedule(schedule);
    setIsSleepModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSleepModalOpen(false);
    setEditingSchedule(null);
  };

  // Calculate sleep statistics
  const sleepStats = useMemo(() => {
    const recentSchedules = sleepSchedules
      .filter(s => s.sleepQuality !== undefined)
      .slice(-7); // Last 7 entries with quality ratings

    const avgQuality = recentSchedules.length > 0 
      ? recentSchedules.reduce((sum, s) => sum + (s.sleepQuality || 0), 0) / recentSchedules.length
      : 0;

    const thisWeek = sleepSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      return isWithinInterval(scheduleDate, { start: weekStart, end: weekEnd });
    });

    const consistentSchedule = sleepSchedules
      .slice(-7)
      .filter(s => {
        const bedtimeVariance = s.actualBedtime 
          ? Math.abs(parseInt(s.actualBedtime.split(':')[0]) - parseInt(s.bedtime.split(':')[0]))
          : 0;
        return bedtimeVariance <= 1; // Within 1 hour of planned bedtime
      }).length;

    return {
      avgQuality: Math.round(avgQuality * 10) / 10,
      thisWeekCount: thisWeek.length,
      totalEntries: sleepSchedules.length,
      consistencyRate: sleepSchedules.length > 0 ? Math.round((consistentSchedule / Math.min(7, sleepSchedules.length)) * 100) : 0,
    };
  }, [sleepSchedules]);

  // Calculate bedtime routine statistics
  const bedtimeRoutineStats = useMemo(() => {
    const todaysCompletion = bedtimeRoutineCompletions.find(completion => 
      isToday(new Date(completion.date))
    );

    const thisWeekCompletions = bedtimeRoutineCompletions.filter(completion => {
      const completionDate = new Date(completion.date);
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      return isWithinInterval(completionDate, { start: weekStart, end: weekEnd });
    });

    const recentCompletions = bedtimeRoutineCompletions.slice(-7);
    const avgCompletionRate = recentCompletions.length > 0
      ? recentCompletions.reduce((sum, c) => sum + c.completedItems.length, 0) / recentCompletions.length
      : 0;

    return {
      completedToday: !!todaysCompletion,
      thisWeekCount: thisWeekCompletions.length,
      totalCompletions: bedtimeRoutineCompletions.length,
      avgItemsCompleted: Math.round(avgCompletionRate * 10) / 10,
    };
  }, [bedtimeRoutineCompletions]);

  // Group schedules by week for display
  const groupedSchedules = useMemo(() => {
    const sortedSchedules = [...sleepSchedules]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const groups: { [key: string]: SleepSchedule[] } = {};
    
    sortedSchedules.forEach(schedule => {
      const scheduleDate = new Date(schedule.date);
      const weekStart = startOfWeek(scheduleDate);
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      
      if (!groups[weekKey]) {
        groups[weekKey] = [];
      }
      groups[weekKey].push(schedule);
    });

    return Object.entries(groups).map(([weekKey, schedules]) => ({
      weekStart: new Date(weekKey),
      schedules,
    }));
  }, [sleepSchedules]);

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return 'text-green-600';
    if (quality >= 6) return 'text-yellow-600';
    if (quality >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sleep Schedule</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsBedtimeRoutineOpen(true)}
            className={`btn ${bedtimeRoutineStats.completedToday ? 'btn-secondary' : 'btn-primary'}`}
          >
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            {bedtimeRoutineStats.completedToday ? 'Routine Complete' : 'Bedtime Routine'}
          </button>
          <button
            onClick={handleCreateSleep}
            className="btn btn-secondary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Log Sleep
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <StarIcon className={`h-6 w-6 ${getQualityColor(sleepStats.avgQuality)}`} />
          </div>
          <div className={`text-2xl font-bold ${getQualityColor(sleepStats.avgQuality)}`}>
            {sleepStats.avgQuality > 0 ? sleepStats.avgQuality.toFixed(1) : '--'}
          </div>
          <div className="text-sm text-gray-600">Avg Quality</div>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <ChartBarIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{sleepStats.thisWeekCount}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <ClockIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{sleepStats.consistencyRate}%</div>
          <div className="text-sm text-gray-600">Consistency</div>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <MoonIcon className="h-6 w-6 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-600">{sleepStats.totalEntries}</div>
          <div className="text-sm text-gray-600">Total Logs</div>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircleIcon className={`h-6 w-6 ${bedtimeRoutineStats.completedToday ? 'text-green-600' : 'text-indigo-600'}`} />
          </div>
          <div className={`text-2xl font-bold ${bedtimeRoutineStats.completedToday ? 'text-green-600' : 'text-indigo-600'}`}>
            {bedtimeRoutineStats.completedToday ? '✓' : bedtimeRoutineStats.thisWeekCount}
          </div>
          <div className="text-sm text-gray-600">
            {bedtimeRoutineStats.completedToday ? 'Done Today' : 'Routine This Week'}
          </div>
        </div>
      </div>

      {/* Sleep Schedule History */}
      {groupedSchedules.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
            <MoonIcon className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sleep logs yet</h3>
          <p className="text-gray-500 mb-4">
            Start tracking your sleep schedule to improve your ADHD management and overall well-being.
          </p>
          <button
            onClick={handleCreateSleep}
            className="btn btn-primary"
          >
            Log Your First Sleep Schedule
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedSchedules.map(({ weekStart, schedules }) => (
            <div key={weekStart.toISOString()}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Week of {format(weekStart, 'MMM d, yyyy')} ({schedules.length} days)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules.map((schedule) => (
                  <SleepScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={handleEditSleep}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADHD Sleep Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <MoonIcon className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-blue-800">Sleep & ADHD</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">Why Sleep Matters:</h4>
            <ul className="space-y-1">
              <li>• Improves focus and attention</li>
              <li>• Reduces hyperactivity and impulsivity</li>
              <li>• Enhances emotional regulation</li>
              <li>• Supports memory consolidation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">ADHD Sleep Challenges:</h4>
            <ul className="space-y-1">
              <li>• Difficulty winding down at night</li>
              <li>• Racing thoughts before bed</li>
              <li>• Irregular sleep-wake cycles</li>
              <li>• Medication effects on sleep</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Motivational Messages */}
      {sleepStats.avgQuality >= 7 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-600 mr-3 text-2xl">🌟</div>
            <div>
              <h3 className="font-medium text-green-800">Excellent sleep quality!</h3>
              <p className="text-sm text-green-700">
                Your average sleep quality of {sleepStats.avgQuality} is helping optimize your ADHD management.
              </p>
            </div>
          </div>
        </div>
      )}

      {sleepStats.consistencyRate >= 80 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-purple-600 mr-3 text-2xl">🎯</div>
            <div>
              <h3 className="font-medium text-purple-800">Great sleep consistency!</h3>
              <p className="text-sm text-purple-700">
                {sleepStats.consistencyRate}% consistency rate shows you're building a strong sleep routine.
              </p>
            </div>
          </div>
        </div>
      )}

      <SleepModal
        isOpen={isSleepModalOpen}
        onClose={handleCloseModal}
        editingSchedule={editingSchedule}
        selectedDate={selectedDate}
      />

      <BedtimeRoutineModal
        isOpen={isBedtimeRoutineOpen}
        onClose={() => setIsBedtimeRoutineOpen(false)}
      />
    </div>
  );
};

export default SleepView;