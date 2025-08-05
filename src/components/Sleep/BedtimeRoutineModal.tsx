import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { useAppStore } from '../../stores/useAppStore';
import { format, isToday } from 'date-fns';

interface BedtimeRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BedtimeRoutineModal: React.FC<BedtimeRoutineModalProps> = ({ isOpen, onClose }) => {
  const { bedtimeRoutineItems, bedtimeRoutineCompletions, completeBedtimeRoutine, updateBedtimeRoutineCompletion } = useAppStore();
  
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  // Check if routine was already completed today
  const todaysCompletion = bedtimeRoutineCompletions.find(completion => 
    isToday(new Date(completion.date))
  );

  useEffect(() => {
    if (todaysCompletion) {
      setCompletedItems(new Set(todaysCompletion.completedItems));
      setNotes(todaysCompletion.notes || '');
      setIsActive(false);
    } else {
      setCompletedItems(new Set());
      setNotes('');
      setIsActive(false);
      setStartTime(null);
      setCurrentStep(0);
    }
  }, [todaysCompletion, isOpen]);

  const handleStartRoutine = () => {
    setIsActive(true);
    setStartTime(new Date());
    setCurrentStep(0);
  };

  const handlePauseRoutine = () => {
    setIsActive(false);
  };

  const handleCompleteItem = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);

    // Auto-advance to next incomplete required item
    if (!newCompleted.has(itemId)) return; // If unchecking, don't advance

    const nextIncompleteRequired = bedtimeRoutineItems
      .filter(item => item.isRequired && !newCompleted.has(item.id))
      .sort((a, b) => a.order - b.order)[0];

    if (nextIncompleteRequired) {
      const nextIndex = bedtimeRoutineItems.findIndex(item => item.id === nextIncompleteRequired.id);
      setCurrentStep(nextIndex);
    }
  };

  const handleFinishRoutine = () => {
    const endTime = new Date();
    
    if (todaysCompletion) {
      // Update existing completion
      updateBedtimeRoutineCompletion(todaysCompletion.id, {
        completedItems: Array.from(completedItems),
        endTime,
        notes: notes.trim() || undefined,
      });
    } else {
      // Create new completion
      completeBedtimeRoutine({
        date: new Date(),
        completedItems: Array.from(completedItems),
        startTime: startTime || new Date(),
        endTime,
        notes: notes.trim() || undefined,
      });
    }
    
    setIsActive(false);
    onClose();
  };

  const totalItems = bedtimeRoutineItems.length;
  const completedCount = completedItems.size;
  const requiredItems = bedtimeRoutineItems.filter(item => item.isRequired);
  const completedRequiredCount = requiredItems.filter(item => completedItems.has(item.id)).length;
  
  const totalEstimatedTime = bedtimeRoutineItems
    .filter(item => completedItems.has(item.id))
    .reduce((sum, item) => sum + item.estimatedDuration, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hygiene': return '🚿';
      case 'mental': return '🧠';
      case 'physical': return '🧘';
      case 'environment': return '🏠';
      case 'digital': return '📱';
      default: return '✨';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hygiene': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'mental': return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'physical': return 'bg-green-50 border-green-200 text-green-700';
      case 'environment': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'digital': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <MoonIcon className="h-6 w-6 text-indigo-600 mr-3" />
              <div>
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Bedtime Routine
                </Dialog.Title>
                <p className="text-sm text-gray-500">
                  {format(new Date(), 'EEEE, MMMM d')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-indigo-900">
                  {completedCount}/{totalItems} Complete
                </div>
                <div className="text-sm text-indigo-700">
                  Required: {completedRequiredCount}/{requiredItems.length} • Est. {totalEstimatedTime} min
                </div>
              </div>
              
              {!isActive && !todaysCompletion && (
                <button
                  onClick={handleStartRoutine}
                  className="btn btn-primary flex items-center"
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Start Routine
                </button>
              )}
              
              {isActive && (
                <div className="flex space-x-2">
                  <button
                    onClick={handlePauseRoutine}
                    className="btn btn-secondary flex items-center"
                  >
                    <PauseIcon className="h-4 w-4 mr-2" />
                    Pause
                  </button>
                  <button
                    onClick={handleFinishRoutine}
                    className="btn btn-primary flex items-center"
                  >
                    <StopIcon className="h-4 w-4 mr-2" />
                    Finish
                  </button>
                </div>
              )}
              
              {todaysCompletion && (
                <div className="flex items-center text-green-600">
                  <CheckCircleIconSolid className="h-5 w-5 mr-2" />
                  <span className="font-medium">Completed Today!</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${totalItems > 0 ? (completedCount / totalItems) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Routine Items */}
          <div className="p-6 space-y-3">
            {bedtimeRoutineItems.map((item, index) => {
              const isCompleted = completedItems.has(item.id);
              const isCurrent = isActive && index === currentStep;
              
              return (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : isCurrent 
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => handleCompleteItem(item.id)}
                      className={`flex-shrink-0 mt-1 transition-colors ${
                        isCompleted 
                          ? 'text-green-600' 
                          : 'text-gray-400 hover:text-green-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircleIconSolid className="h-6 w-6" />
                      ) : (
                        <CheckCircleIcon className="h-6 w-6" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-medium ${
                          isCompleted ? 'text-green-800' : 'text-gray-900'
                        }`}>
                          {item.title}
                          {item.isRequired && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Required
                            </span>
                          )}
                        </h3>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                            {getCategoryIcon(item.category)} {item.category}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {item.estimatedDuration}m
                          </div>
                        </div>
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notes Section */}
          <div className="px-6 pb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="How did your routine go? Any thoughts or observations..."
              disabled={!!todaysCompletion}
            />
          </div>

          {/* ADHD Tips */}
          <div className="px-6 pb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">💡 ADHD Sleep Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Set a consistent bedtime routine to signal your brain it's time to wind down</li>
                <li>• Complete required items first, then add optional ones as you have energy</li>
                <li>• Use the timer to stay focused on each step</li>
                <li>• Don't aim for perfection - completing some items is better than none</li>
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          {!todaysCompletion && (
            <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={onClose}
                className="btn btn-secondary"
              >
                Save & Close
              </button>
              <button
                onClick={handleFinishRoutine}
                className="btn btn-primary"
                disabled={completedRequiredCount < requiredItems.length}
              >
                Complete Routine
              </button>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BedtimeRoutineModal;