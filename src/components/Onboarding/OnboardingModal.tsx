import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  CpuChipIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  BoltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { setIsBrainDumpOpen } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Your ADHD Brain Organiser! 🧠",
      content: (
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
            <CpuChipIcon className="w-12 h-12 text-primary-600" />
          </div>
          <p className="text-gray-600">
            This app is specifically designed for ADHD minds - to help transform overwhelming thoughts 
            into organized, actionable tasks.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">🎯 Built for ADHD Success</h4>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Reduces cognitive overload with clear visual organization</li>
              <li>• Breaks down complex projects into manageable steps</li>
              <li>• Provides immediate feedback and progress tracking</li>
              <li>• Works offline so you never lose your thoughts</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Brain Dump: Your Digital Mind Sweep 🌊",
      content: (
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <SparklesIcon className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-gray-600">
            The Brain Dump is your starting point. Just type everything that's swirling in your mind - 
            our AI will help organize it into tasks and habits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">✅ Perfect for:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Racing thoughts</li>
                <li>• Project planning</li>
                <li>• Daily overwhelm</li>
                <li>• Random ideas</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">💡 How it works:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>1. Write freely</li>
                <li>2. AI extracts tasks</li>
                <li>3. You review & organize</li>
                <li>4. Start taking action</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Task Management Made Simple 📋",
      content: (
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircleIcon className="w-10 h-10 text-yellow-600" />
          </div>
          <p className="text-gray-600">
            View your tasks in whatever way works best for your brain - list view for linear thinkers, 
            Kanban board for visual processors.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
              <div className="text-xs font-medium text-red-700">High Priority</div>
              <div className="text-xs text-red-600">Urgent tasks</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
              <div className="text-xs font-medium text-yellow-700">Medium Priority</div>
              <div className="text-xs text-yellow-600">Important tasks</div>
            </div>
            <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <div className="text-xs font-medium text-green-700">Low Priority</div>
              <div className="text-xs text-green-600">Nice to have</div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">🎨 ADHD-Friendly Features:</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Color-coded priorities reduce decision fatigue</li>
              <li>• Energy level matching helps you work with your natural rhythms</li>
              <li>• Time estimates prevent over-scheduling</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Habit Tracking & Sleep Schedule 🏃‍♀️",
      content: (
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <BoltIcon className="w-10 h-10 text-purple-600" />
          </div>
          <p className="text-gray-600">
            Build positive habits and maintain healthy sleep patterns - both crucial for ADHD management.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">🔥 Habit Streaks</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-700">Morning Exercise</span>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">7 days 🔥</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-700">Drink Water</span>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">3 days 💪</span>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h4 className="font-medium text-indigo-800 mb-2">🌙 Sleep Quality</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-700">Last Night</span>
                  <span className="text-indigo-600">8.5/10 ⭐</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-700">Average</span>
                  <span className="text-indigo-600">7.2/10</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">🧠 Why This Matters for ADHD:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Consistent habits reduce daily decision-making</li>
              <li>• Good sleep improves focus and emotional regulation</li>
              <li>• Visual progress tracking provides motivation</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Calendar & Scheduling 📅",
      content: (
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4">
            <CalendarDaysIcon className="w-10 h-10 text-teal-600" />
          </div>
          <p className="text-gray-600">
            Schedule tasks for specific dates and see your habits progress on the calendar. 
            Perfect for time-blind ADHD brains!
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-7 gap-1 mb-4">
              <div className="text-xs text-gray-500 text-center font-medium py-1">S</div>
              <div className="text-xs text-gray-500 text-center font-medium py-1">M</div>
              <div className="text-xs text-gray-500 text-center font-medium py-1">T</div>
              <div className="text-xs text-gray-500 text-center font-medium py-1">W</div>
              <div className="text-xs text-gray-500 text-center font-medium py-1">T</div>
              <div className="text-xs text-gray-500 text-center font-medium py-1">F</div>
              <div className="text-xs text-gray-500 text-center font-medium py-1">S</div>
              
              {/* Sample calendar days */}
              {[1,2,3,4,5,6,7].map(day => (
                <div key={day} className="aspect-square bg-white border border-gray-200 rounded flex flex-col items-center justify-center text-xs">
                  <span className="font-medium">{day}</span>
                  {day === 3 && <div className="w-1 h-1 bg-blue-500 rounded-full mt-1"></div>}
                  {day === 5 && <div className="w-1 h-1 bg-green-500 rounded-full mt-1"></div>}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">⏰ Smart Scheduling Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Schedule high-energy tasks when you're most focused</li>
              <li>• Use due dates for deadlines, scheduled dates for planning</li>
              <li>• Break large tasks into smaller, daily steps</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Get Started? 🚀",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mb-6">
            <SparklesIcon className="w-12 h-12 text-white" />
          </div>
          <p className="text-gray-600 text-lg">
            You're all set! Let's start by doing your first Brain Dump to get all those thoughts 
            organized and actionable.
          </p>
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg p-6">
            <h4 className="font-semibold text-primary-800 mb-3">💡 Pro Tips for Success:</h4>
            <ul className="text-sm text-primary-700 space-y-2 text-left">
              <li>• Start with just 5-10 minutes of brain dumping</li>
              <li>• Don't worry about perfect organization - that's what the AI is for!</li>
              <li>• Focus on one task at a time to avoid overwhelm</li>
              <li>• Celebrate small wins - they add up to big changes!</li>
              <li>• The app works offline, so capture thoughts anytime</li>
            </ul>
          </div>
          
          <button
            onClick={() => {
              onClose();
              setIsBrainDumpOpen(true);
            }}
            className="btn btn-primary btn-lg w-full"
          >
            Start Your First Brain Dump! 🧠✨
          </button>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding-completed', 'true');
    onClose();
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboarding-completed', 'true');
    onClose();
    setIsBrainDumpOpen(true);
  };

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-900">
                  Step {currentStep + 1} of {steps.length}
                </div>
                <div className="flex space-x-1">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={skipOnboarding}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                Skip
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {steps[currentStep].title}
            </h2>
            {steps[currentStep].content}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                Previous
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  onClick={completeOnboarding}
                  className="btn btn-primary"
                >
                  Let's Start! 🚀
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  Next
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default OnboardingModal;