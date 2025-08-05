import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import { processBrainDumpText } from '../../services/aiService';
import BrainDumpConfirmation from './BrainDumpConfirmation';
import FocusManager from '../Accessibility/FocusManager';
import LiveRegion from '../Accessibility/LiveRegion';
import { Task, Habit, CalendarEvent, SleepSchedule } from '../../types';

interface BrainDumpModalProps {
  asPage?: boolean;
}

const BrainDumpModal: React.FC<BrainDumpModalProps> = ({ asPage = false }) => {
  const { 
    isBrainDumpOpen, 
    setIsBrainDumpOpen, 
    addBrainDumpEntry, 
    processBrainDumpEntry,
    userPreferences 
  } = useAppStore();
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState('');
  const [extractionTypes, setExtractionTypes] = useState({
    tasks: true,
    habits: true,
    events: true,
    sleep: true,
  });
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [extractedResults, setExtractedResults] = useState<{
    tasks: Task[];
    habits: Habit[];
    events: CalendarEvent[];
    sleepSchedules: SleepSchedule[];
  } | null>(null);
  const [originalText, setOriginalText] = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsProcessing(true);
    setProcessingError(null);
    setAnnounceMessage('Processing your brain dump with AI...');
    
    try {
      // Process the content with AI
      const result = await processBrainDumpText(content);
      
      // Store results and original text for confirmation
      setExtractedResults(result);
      setOriginalText(content);
      
      const totalItems = result.tasks.length + result.habits.length + result.events.length + result.sleepSchedules.length;
      
      if (totalItems === 0) {
        setProcessingError('No items were extracted from your brain dump. Try being more specific about tasks, habits, events, or sleep goals.');
        setAnnounceMessage('No items found. Try being more specific.');
      } else {
        setAnnounceMessage(`Found ${totalItems} items: ${result.tasks.length} tasks, ${result.habits.length} habits, ${result.events.length} events, and ${result.sleepSchedules.length} sleep schedules. Please review.`);
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error('Error processing brain dump:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setProcessingError(errorMessage);
      setAnnounceMessage(`Error processing brain dump: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmItems = (confirmedItems: {
    tasks: Task[];
    habits: Habit[];
    events: CalendarEvent[];
    sleepSchedules: SleepSchedule[];
  }) => {
    // Add the brain dump entry
    const entryId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    addBrainDumpEntry({ content: originalText });
    
    // Add confirmed items to the store
    processBrainDumpEntry(
      entryId, 
      confirmedItems.tasks, 
      confirmedItems.habits, 
      confirmedItems.events, 
      confirmedItems.sleepSchedules
    );

    const totalConfirmed = confirmedItems.tasks.length + confirmedItems.habits.length + 
                          confirmedItems.events.length + confirmedItems.sleepSchedules.length;
    
    setAnnounceMessage(`Successfully added ${totalConfirmed} items to your organizer!`);
    
    // Reset form
    setContent('');
    setShowConfirmation(false);
    setExtractedResults(null);
    setOriginalText('');
    setProcessingError(null);
    
    if (!asPage) {
      setIsBrainDumpOpen(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing && !showConfirmation) {
      setContent('');
      setProcessingError(null);
      setExtractedResults(null);
      setOriginalText('');
      if (!asPage) {
        setIsBrainDumpOpen(false);
      }
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setExtractedResults(null);
    setOriginalText('');
  };

  const isAIConfigured = userPreferences.aiSettings.provider !== 'none' && !!userPreferences.aiSettings.apiKey;
  const activeExtractionCount = Object.values(extractionTypes).filter(Boolean).length;

  // If used as a page component, don't show the modal wrapper
  if (asPage) {
    return (
      <div className="max-w-5xl mx-auto">
        <LiveRegion message={announceMessage} />
        
        {/* Confirmation Modal */}
        {showConfirmation && extractedResults && (
          <BrainDumpConfirmation
            isOpen={showConfirmation}
            onClose={handleCloseConfirmation}
            onConfirm={handleConfirmItems}
            extractedItems={extractedResults}
            originalText={originalText}
          />
        )}

        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl border border-blue-100">
          {/* Main Brain Dump Interface */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl">
                <SparklesIcon className="h-12 w-12 text-white" aria-hidden="true" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              What's on your mind?
            </h2>
            <p className="text-lg text-gray-600">
              Pour out your thoughts, tasks, worries, and ideas. I'll organize them for you.
            </p>
          </div>
          
          {/* AI Configuration Status */}
          <div className={`mb-6 p-4 rounded-xl border-2 ${
            isAIConfigured 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                isAIConfigured ? 'bg-green-500' : 'bg-red-500'
              }`} aria-hidden="true" />
              <span className="font-medium">
                {isAIConfigured 
                  ? `AI Ready (${userPreferences.aiSettings.provider})` 
                  : 'AI Not Configured - Required for processing'}
              </span>
            </div>
            <p className="mt-1 text-sm">
              {isAIConfigured 
                ? 'Your thoughts will be processed with advanced AI for organization.' 
                : 'Please configure an AI provider in settings to use brain dump processing.'}
            </p>
          </div>

          {isAIConfigured && (
            <>
              {/* Extraction Types Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What should I look for?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'tasks', label: 'Tasks', icon: '✓', color: 'blue' },
                    { key: 'habits', label: 'Habits', icon: '🔄', color: 'green' },
                    { key: 'events', label: 'Events', icon: '📅', color: 'purple' },
                    { key: 'sleep', label: 'Sleep', icon: '😴', color: 'indigo' },
                  ].map(({ key, label, icon, color }) => (
                    <button
                      key={key}
                      onClick={() => setExtractionTypes(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        extractionTypes[key as keyof typeof extractionTypes]
                          ? `bg-${color}-100 border-${color}-300 text-${color}-800`
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                      type="button"
                    >
                      <div className="text-2xl mb-1">{icon}</div>
                      <div className="font-medium text-sm">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea and controls */}
              <div className="mb-4">
                <div className="relative">
                  <textarea
                    id="brain-dump-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="I need to call mom about dinner plans. Work presentation next Tuesday is stressing me out. Want to start going to bed earlier, maybe 10 PM? Should buy groceries: milk, bread, apples. Doctor appointment sometime next week..."
                    className="w-full h-72 p-6 text-base leading-relaxed border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 resize-none bg-white/70 backdrop-blur-sm placeholder-gray-400"
                    disabled={isProcessing}
                    aria-describedby="brain-dump-description character-count"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">Processing your thoughts...</p>
                          <p className="text-sm text-gray-600 mt-1">Finding {activeExtractionCount} types of items</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {processingError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 text-sm font-medium">Processing Error:</p>
                  <p className="text-red-700 text-sm mt-1">{processingError}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    {content.length.toLocaleString()} characters
                  </div>
                  <div className="text-sm text-gray-500">
                    {content.trim().split(/\s+/).filter(word => word.length > 0).length} words
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setContent('')}
                    disabled={isProcessing || !content.trim()}
                    className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium hover:scale-105 disabled:opacity-50 disabled:scale-100"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!content.trim() || isProcessing || activeExtractionCount === 0}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center space-x-2">
                      <SparklesIcon className="h-5 w-5" aria-hidden="true" />
                      <span>Process Thoughts</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Preview sections */}
              {content.trim() && !isProcessing && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-5">
                    <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center">
                      <SparklesIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                      AI Processing
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-0.5">✓</span>
                        Advanced reasoning with 2025 AI models
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-0.5">✓</span>
                        ADHD-optimized understanding
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-0.5">✓</span>
                        Review before adding to organizer
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-5">
                    <h3 className="text-base font-bold text-green-900 mb-3">
                      Will Extract ({activeExtractionCount} types)
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {extractionTypes.tasks && <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">✓ Tasks</div>}
                      {extractionTypes.habits && <div className="bg-green-100 text-green-800 px-2 py-1 rounded-lg">🔄 Habits</div>}
                      {extractionTypes.events && <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg">📅 Events</div>}
                      {extractionTypes.sleep && <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-lg">😴 Sleep</div>}
                    </div>
                    <p className="text-sm text-green-700 mt-3">
                      Edit everything before final approval!
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Modal version for non-page usage
  return (
    <>
      <LiveRegion message={announceMessage} />
      
      {/* Confirmation Modal */}
      {showConfirmation && extractedResults && (
        <BrainDumpConfirmation
          isOpen={showConfirmation}
          onClose={handleCloseConfirmation}
          onConfirm={handleConfirmItems}
          extractedItems={extractedResults}
          originalText={originalText}
        />
      )}

      <Transition appear show={isBrainDumpOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-white to-blue-50 p-6 sm:p-8 text-left align-middle shadow-2xl transition-all border border-blue-100">
                  <FocusManager autoFocus restoreFocus>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl">
                          <SparklesIcon className="h-8 w-8 text-white" aria-hidden="true" />
                        </div>
                        <div>
                          <Dialog.Title as="h2" className="text-2xl font-bold text-gray-900">
                            Brain Dump
                          </Dialog.Title>
                          <p className="text-sm text-gray-600 mt-1">
                            Turn your scattered thoughts into organized action
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleClose}
                        disabled={isProcessing || showConfirmation}
                        className="p-3 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                        aria-label="Close brain dump"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Rest of the modal content - same as page version but condensed */}
                    <div className="space-y-6">
                      {/* AI Status */}
                      <div className={`p-4 rounded-xl border-2 ${
                        isAIConfigured 
                          ? 'bg-green-50 border-green-200 text-green-800' 
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            isAIConfigured ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium">
                            {isAIConfigured 
                              ? `AI Ready (${userPreferences.aiSettings.provider})` 
                              : 'AI Required - Configure in Settings'}
                          </span>
                        </div>
                      </div>

                      {isAIConfigured && (
                        <>
                          {/* Textarea */}
                          <div className="relative">
                            <textarea
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              placeholder="I need to call mom, work presentation Tuesday, want to sleep earlier at 10 PM, buy groceries..."
                              className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                              disabled={isProcessing}
                            />
                            {isProcessing && (
                              <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                                <div className="text-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto mb-2"></div>
                                  <p className="font-semibold text-gray-900">Processing...</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Error */}
                          {processingError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-red-800 text-sm">{processingError}</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              {content.length} characters
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={handleClose}
                                disabled={isProcessing}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSubmit}
                                disabled={!content.trim() || isProcessing}
                                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50"
                              >
                                <SparklesIcon className="h-4 w-4 inline mr-2" />
                                Process
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </FocusManager>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default BrainDumpModal;