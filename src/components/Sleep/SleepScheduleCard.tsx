import React from 'react';
import {
  MoonIcon,
  SunIcon,
  ClockIcon,
  StarIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { SleepSchedule } from '../../types';
import { format, parseISO } from 'date-fns';

interface SleepScheduleCardProps {
  schedule: SleepSchedule;
  onEdit?: (schedule: SleepSchedule) => void;
}

const SleepScheduleCard: React.FC<SleepScheduleCardProps> = ({ schedule, onEdit }) => {
  const getSleepQualityColor = (quality?: number) => {
    if (!quality) return 'text-gray-400';
    if (quality >= 8) return 'text-green-600';
    if (quality >= 6) return 'text-yellow-600';
    if (quality >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSleepQualityText = (quality?: number) => {
    if (!quality) return 'Not rated';
    if (quality >= 8) return 'Excellent';
    if (quality >= 6) return 'Good';
    if (quality >= 4) return 'Fair';
    return 'Poor';
  };

  const renderStars = (quality?: number) => {
    if (!quality) return null;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <StarIcon
            key={star}
            className={`h-3 w-3 ${
              star <= quality 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const calculateSleepDuration = () => {
    const bedtime = parseISO(`1970-01-01T${schedule.actualBedtime || schedule.bedtime}:00`);
    let wakeTime = parseISO(`1970-01-01T${schedule.actualWakeTime || schedule.wakeTime}:00`);
    
    // If wake time is before bedtime, it's the next day
    if (wakeTime <= bedtime) {
      wakeTime = parseISO(`1970-01-02T${schedule.actualWakeTime || schedule.wakeTime}:00`);
    }
    
    const duration = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
    return duration.toFixed(1);
  };

  const isActualDataAvailable = schedule.actualBedtime || schedule.actualWakeTime;

  return (
    <div className="card hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">😴</div>
          <div>
            <h3 className="font-medium text-gray-900">
              {format(new Date(schedule.date), 'EEEE, MMM d')}
            </h3>
            <p className="text-sm text-gray-500">
              {calculateSleepDuration()} hours of sleep
            </p>
          </div>
        </div>
        
        {onEdit && (
          <button
            onClick={() => onEdit(schedule)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-gray-600 transition-opacity"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Bedtime */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-purple-50">
            <MoonIcon className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">BEDTIME</p>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {schedule.bedtime}
              </span>
              {schedule.actualBedtime && schedule.actualBedtime !== schedule.bedtime && (
                <span className="text-xs text-gray-500">
                  Actually: {schedule.actualBedtime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Wake Time */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-yellow-50">
            <SunIcon className="h-4 w-4 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">WAKE TIME</p>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {schedule.wakeTime}
              </span>
              {schedule.actualWakeTime && schedule.actualWakeTime !== schedule.wakeTime && (
                <span className="text-xs text-gray-500">
                  Actually: {schedule.actualWakeTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sleep Quality */}
      {schedule.sleepQuality && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sleep Quality:</span>
              <span className={`text-sm font-medium ${getSleepQualityColor(schedule.sleepQuality)}`}>
                {getSleepQualityText(schedule.sleepQuality)} ({schedule.sleepQuality}/10)
              </span>
            </div>
            {renderStars(schedule.sleepQuality)}
          </div>
        </div>
      )}

      {/* Adherence Indicator */}
      {isActualDataAvailable && (
        <div className="mt-3">
          <div className="flex items-center space-x-2 text-xs">
            <ClockIcon className="h-3 w-3 text-gray-400" />
            <span className="text-gray-500">
              {schedule.actualBedtime === schedule.bedtime && 
               schedule.actualWakeTime === schedule.wakeTime 
                ? 'Perfect adherence to schedule! 🎯'
                : 'Schedule adjusted based on actual times'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepScheduleCard;