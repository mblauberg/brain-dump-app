import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import { processBrainDumpText } from '../../services/aiService';
import FocusManager from '../Accessibility/FocusManager';
import LiveRegion from '../Accessibility/LiveRegion';

const BrainDumpModal: React.FC = () => {
  const { isBrainDumpOpen, setIsBrainDumpOpen, addBrainDumpEntry, processBrainDumpEntry } = useAppStore();
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsProcessing(true);
    setAnnounceMessage('Processing your brain dump with AI...');
    
    try {
      // Add the brain dump entry
      const entryId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      addBrainDumpEntry({ content });

      // Process the content with AI (mock for now)
      const { tasks, habits } = await processBrainDumpText(content);
      
      // Update the entry with processed results
      processBrainDumpEntry(entryId, tasks, habits);

      // Reset form and close modal
      setContent('');
      setAnnounceMessage('Brain dump processed successfully! New tasks and habits have been added.');
      setIsBrainDumpOpen(false);
    } catch (error) {
      console.error('Error processing brain dump:', error);
      setAnnounceMessage('Error processing brain dump. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setContent('');
      setIsBrainDumpOpen(false);
    }
  };

  return (
    <>
      <LiveRegion message={announceMessage} />
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
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                  <FocusManager autoFocus restoreFocus>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <SparklesIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                        <Dialog.Title as="h2" className="text-xl font-semibold text-gray-900">
                          Brain Dump
                        </Dialog.Title>
                      </div>
                      <button
                        onClick={handleClose}
                        disabled={isProcessing}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Close brain dump"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4" id="brain-dump-description">
                    Let it all out! Write whatever's on your mind - tasks, ideas, worries, or plans. 
                    Our AI will help organize everything into actionable items.
                  </p>
                  
                  <label htmlFor="brain-dump-textarea" className="sr-only">
                    Brain dump content
                  </label>
                  <textarea
                    id="brain-dump-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start typing... Remember to call mom, need to finish the project report, feeling overwhelmed about next week's presentation, want to start exercising more, grocery list: milk, bread, apples..."
                    className="textarea h-48 sm:h-64 text-sm sm:text-base"
                    disabled={isProcessing}
                    aria-describedby="brain-dump-description character-count"
                  />
                  
                  <div className="flex items-center justify-between mt-4">
                    <div id="character-count" className="text-sm text-gray-500" aria-live="polite">
                      {content.length} characters
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={handleClose}
                        disabled={isProcessing}
                        className="btn btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!content.trim() || isProcessing}
                        className="btn btn-primary text-sm"
                        aria-describedby={isProcessing ? 'processing-status' : undefined}
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true"></div>
                            <span className="hidden sm:inline">Processing...</span>
                            <span className="sm:hidden">Processing</span>
                            <span id="processing-status" className="sr-only">
                              Processing your brain dump with AI, please wait
                            </span>
                          </>
                        ) : (
                          <>
                            <SparklesIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                            <span className="hidden sm:inline">Process with AI</span>
                            <span className="sm:hidden">Process</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {content.trim() && !isProcessing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" role="complementary" aria-labelledby="next-steps-heading">
                    <h3 id="next-steps-heading" className="text-sm font-medium text-blue-800 mb-2">
                      What happens next:
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>AI will identify tasks, habits, and ideas from your text</li>
                      <li>Items will be automatically categorized and prioritized</li>
                      <li>Tasks will be added to your schedule with time estimates</li>
                      <li>You can review and edit everything before finalizing</li>
                    </ul>
                  </div>
                )}
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