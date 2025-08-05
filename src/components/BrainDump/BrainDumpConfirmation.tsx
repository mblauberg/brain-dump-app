import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  XMarkIcon, 
  CheckIcon, 
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  BoltIcon,
  MoonIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Task, Habit, CalendarEvent, SleepSchedule } from '../../types';
import FocusManager from '../Accessibility/FocusManager';
import LiveRegion from '../Accessibility/LiveRegion';

interface BrainDumpConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmedItems: {
    tasks: Task[];
    habits: Habit[];
    events: CalendarEvent[];
    sleepSchedules: SleepSchedule[];
  }) => void;
  extractedItems: {
    tasks: Task[];
    habits: Habit[];
    events: CalendarEvent[];
    sleepSchedules: SleepSchedule[];
  };
  originalText: string;
}

interface EditableTask extends Task {
  isSelected: boolean;
  isEditing: boolean;
}

interface EditableHabit extends Habit {
  isSelected: boolean;
  isEditing: boolean;
}

interface EditableEvent extends CalendarEvent {
  isSelected: boolean;
  isEditing: boolean;
}

interface EditableSleepSchedule extends SleepSchedule {
  isSelected: boolean;
  isEditing: boolean;
}

const BrainDumpConfirmation: React.FC<BrainDumpConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  extractedItems,
  originalText
}) => {
  const [tasks, setTasks] = useState<EditableTask[]>(
    extractedItems.tasks.map(task => ({ ...task, isSelected: true, isEditing: false }))
  );
  const [habits, setHabits] = useState<EditableHabit[]>(
    extractedItems.habits.map(habit => ({ ...habit, isSelected: true, isEditing: false }))
  );
  const [events, setEvents] = useState<EditableEvent[]>(
    extractedItems.events.map(event => ({ ...event, isSelected: true, isEditing: false }))
  );
  const [sleepSchedules, setSleepSchedules] = useState<EditableSleepSchedule[]>(
    extractedItems.sleepSchedules.map(schedule => ({ ...schedule, isSelected: true, isEditing: false }))
  );
  const [announceMessage, setAnnounceMessage] = useState('');

  const totalItems = tasks.length + habits.length + events.length + sleepSchedules.length;
  const selectedItems = tasks.filter(t => t.isSelected).length + 
                       habits.filter(h => h.isSelected).length + 
                       events.filter(e => e.isSelected).length + 
                       sleepSchedules.filter(s => s.isSelected).length;

  const handleConfirm = () => {
    const confirmedItems = {
      tasks: tasks.filter(t => t.isSelected).map(({ isSelected, isEditing, ...task }) => task),
      habits: habits.filter(h => h.isSelected).map(({ isSelected, isEditing, ...habit }) => habit),
      events: events.filter(e => e.isSelected).map(({ isSelected, isEditing, ...event }) => event),
      sleepSchedules: sleepSchedules.filter(s => s.isSelected).map(({ isSelected, isEditing, ...schedule }) => schedule)
    };
    
    setAnnounceMessage(`Confirmed ${selectedItems} items. Adding to your organizer.`);
    onConfirm(confirmedItems);
  };

  const handleSelectAll = () => {
    setTasks(prev => prev.map(t => ({ ...t, isSelected: true })));
    setHabits(prev => prev.map(h => ({ ...h, isSelected: true })));
    setEvents(prev => prev.map(e => ({ ...e, isSelected: true })));
    setSleepSchedules(prev => prev.map(s => ({ ...s, isSelected: true })));
    setAnnounceMessage('Selected all items');
  };

  const handleDeselectAll = () => {
    setTasks(prev => prev.map(t => ({ ...t, isSelected: false })));
    setHabits(prev => prev.map(h => ({ ...h, isSelected: false })));
    setEvents(prev => prev.map(e => ({ ...e, isSelected: false })));
    setSleepSchedules(prev => prev.map(s => ({ ...s, isSelected: false })));
    setAnnounceMessage('Deselected all items');
  };

  const TaskCard: React.FC<{ task: EditableTask; index: number }> = ({ task, index }) => (
    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
      task.isSelected 
        ? 'bg-blue-50 border-blue-300 shadow-md' 
        : 'bg-gray-50 border-gray-200 opacity-60'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={task.isSelected}
            onChange={(e) => setTasks(prev => prev.map((t, i) => 
              i === index ? { ...t, isSelected: e.target.checked } : t
            ))}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            {task.isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => setTasks(prev => prev.map((t, i) => 
                    i === index ? { ...t, title: e.target.value } : t
                  ))}
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex space-x-2">
                  <select
                    value={task.priority}
                    onChange={(e) => setTasks(prev => prev.map((t, i) => 
                      i === index ? { ...t, priority: e.target.value as Task['priority'] } : t
                    ))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <select
                    value={task.timeEstimate}
                    onChange={(e) => setTasks(prev => prev.map((t, i) => 
                      i === index ? { ...t, timeEstimate: e.target.value as Task['timeEstimate'] } : t
                    ))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="15min">15 min</option>
                    <option value="30min">30 min</option>
                    <option value="45min">45 min</option>
                    <option value="1hr">1 hour</option>
                    <option value="2hr">2 hours</option>
                    <option value="3hr+">3+ hours</option>
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority} priority
                  </span>
                  <span className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {task.timeEstimate}
                  </span>
                  <span className="capitalize">{task.category}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => setTasks(prev => prev.map((t, i) => 
              i === index ? { ...t, isEditing: !t.isEditing } : t
            ))}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
            aria-label={task.isEditing ? "Save changes" : "Edit task"}
          >
            {task.isEditing ? <CheckIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setTasks(prev => prev.filter((_, i) => i !== index))}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
            aria-label="Delete task"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const HabitCard: React.FC<{ habit: EditableHabit; index: number }> = ({ habit, index }) => (
    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
      habit.isSelected 
        ? 'bg-green-50 border-green-300 shadow-md' 
        : 'bg-gray-50 border-gray-200 opacity-60'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={habit.isSelected}
            onChange={(e) => setHabits(prev => prev.map((h, i) => 
              i === index ? { ...h, isSelected: e.target.checked } : h
            ))}
            className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            {habit.isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={habit.title}
                  onChange={(e) => setHabits(prev => prev.map((h, i) => 
                    i === index ? { ...h, title: e.target.value } : h
                  ))}
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <select
                  value={habit.frequency}
                  onChange={(e) => setHabits(prev => prev.map((h, i) => 
                    i === index ? { ...h, frequency: e.target.value as Habit['frequency'] } : h
                  ))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            ) : (
              <div>
                <h4 className="font-medium text-gray-900">{habit.title}</h4>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                  <span className="flex items-center">
                    <BoltIcon className="h-4 w-4 mr-1" />
                    {habit.frequency}
                  </span>
                  {habit.scheduledTime && (
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {habit.scheduledTime}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => setHabits(prev => prev.map((h, i) => 
              i === index ? { ...h, isEditing: !h.isEditing } : h
            ))}
            className="p-1 text-gray-400 hover:text-green-600 rounded"
            aria-label={habit.isEditing ? "Save changes" : "Edit habit"}
          >
            {habit.isEditing ? <CheckIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setHabits(prev => prev.filter((_, i) => i !== index))}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
            aria-label="Delete habit"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const EventCard: React.FC<{ event: EditableEvent; index: number }> = ({ event, index }) => (
    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
      event.isSelected 
        ? 'bg-purple-50 border-purple-300 shadow-md' 
        : 'bg-gray-50 border-gray-200 opacity-60'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={event.isSelected}
            onChange={(e) => setEvents(prev => prev.map((ev, i) => 
              i === index ? { ...ev, isSelected: e.target.checked } : ev
            ))}
            className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{event.title}</h4>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              <span className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {new Date(event.startTime).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}
              </span>
              <span className="capitalize">{event.type}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => setEvents(prev => prev.filter((_, i) => i !== index))}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
            aria-label="Delete event"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const SleepCard: React.FC<{ sleep: EditableSleepSchedule; index: number }> = ({ sleep, index }) => (
    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
      sleep.isSelected 
        ? 'bg-indigo-50 border-indigo-300 shadow-md' 
        : 'bg-gray-50 border-gray-200 opacity-60'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={sleep.isSelected}
            onChange={(e) => setSleepSchedules(prev => prev.map((s, i) => 
              i === index ? { ...s, isSelected: e.target.checked } : s
            ))}
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">Sleep Schedule</h4>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              <span className="flex items-center">
                <MoonIcon className="h-4 w-4 mr-1" />
                Bedtime: {sleep.bedtime}
              </span>
              <span className="flex items-center">
                Wake: {sleep.wakeTime}
              </span>
              <span>{new Date(sleep.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => setSleepSchedules(prev => prev.filter((_, i) => i !== index))}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
            aria-label="Delete sleep schedule"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <LiveRegion message={announceMessage} />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-3xl bg-gradient-to-br from-white to-blue-50 p-6 sm:p-8 text-left align-middle shadow-2xl transition-all border border-blue-100 max-h-[90vh] overflow-y-auto">
                  <FocusManager autoFocus restoreFocus>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl">
                          <SparklesIcon className="h-8 w-8 text-white" aria-hidden="true" />
                        </div>
                        <div>
                          <Dialog.Title as="h2" className="text-2xl font-bold text-gray-900">
                            Review & Confirm
                          </Dialog.Title>
                          <p className="text-sm text-gray-600 mt-1">
                            AI found {totalItems} items. Review and edit before adding to your organizer.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-3 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-all duration-200 hover:scale-105"
                        aria-label="Close confirmation screen"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Original Text Preview */}
                    <div className="mb-6 p-4 bg-gray-100 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Original Brain Dump:</h3>
                      <p className="text-sm text-gray-700 italic line-clamp-3">"{originalText}"</p>
                    </div>

                    {/* Batch Actions */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-white/70 rounded-xl border border-gray-200">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{selectedItems}</span> of {totalItems} items selected
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handleSelectAll}
                          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Select All
                        </button>
                        <button
                          onClick={handleDeselectAll}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      {/* Tasks */}
                      {tasks.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
                              <CheckIcon className="h-4 w-4 text-white" />
                            </div>
                            Tasks ({tasks.length})
                          </h3>
                          <div className="space-y-3">
                            {tasks.map((task, index) => (
                              <TaskCard key={task.id} task={task} index={index} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Habits */}
                      {habits.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                              <BoltIcon className="h-4 w-4 text-white" />
                            </div>
                            Habits ({habits.length})
                          </h3>
                          <div className="space-y-3">
                            {habits.map((habit, index) => (
                              <HabitCard key={habit.id} habit={habit} index={index} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Events */}
                      {events.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mr-2">
                              <CalendarIcon className="h-4 w-4 text-white" />
                            </div>
                            Events ({events.length})
                          </h3>
                          <div className="space-y-3">
                            {events.map((event, index) => (
                              <EventCard key={event.id} event={event} index={index} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sleep Schedules */}
                      {sleepSchedules.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center mr-2">
                              <MoonIcon className="h-4 w-4 text-white" />
                            </div>
                            Sleep Schedules ({sleepSchedules.length})
                          </h3>
                          <div className="space-y-3">
                            {sleepSchedules.map((sleep, index) => (
                              <SleepCard key={sleep.id} sleep={sleep} index={index} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium hover:scale-105"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={selectedItems === 0}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-lg hover:shadow-xl"
                      >
                        Add {selectedItems} Items to Organizer
                      </button>
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

export default BrainDumpConfirmation;