import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  Task, 
  Habit, 
  SleepSchedule, 
  BrainDumpEntry, 
  CalendarEvent, 
  UserPreferences,
  TaskStatus,
  BedtimeRoutineItem,
  BedtimeRoutineCompletion,
  AISettings
} from '../types';

interface AppState {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;

  // Habits
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completedDates'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string, date: Date) => void;

  // Sleep Schedule
  sleepSchedules: SleepSchedule[];
  addSleepSchedule: (schedule: Omit<SleepSchedule, 'id'>) => void;
  updateSleepSchedule: (id: string, updates: Partial<SleepSchedule>) => void;

  // Bedtime Routine
  bedtimeRoutineItems: BedtimeRoutineItem[];
  bedtimeRoutineCompletions: BedtimeRoutineCompletion[];
  addBedtimeRoutineItem: (item: Omit<BedtimeRoutineItem, 'id'>) => void;
  updateBedtimeRoutineItem: (id: string, updates: Partial<BedtimeRoutineItem>) => void;
  deleteBedtimeRoutineItem: (id: string) => void;
  completeBedtimeRoutine: (completion: Omit<BedtimeRoutineCompletion, 'id'>) => void;
  updateBedtimeRoutineCompletion: (id: string, updates: Partial<BedtimeRoutineCompletion>) => void;

  // Brain Dump
  brainDumpEntries: BrainDumpEntry[];
  addBrainDumpEntry: (entry: Omit<BrainDumpEntry, 'id' | 'createdAt' | 'isProcessed' | 'extractedTasks' | 'extractedHabits' | 'extractedEvents' | 'extractedSleepSchedules'>) => void;
  processBrainDumpEntry: (id: string, extractedTasks: Task[], extractedHabits: Habit[], extractedEvents: CalendarEvent[], extractedSleepSchedules: SleepSchedule[]) => void;
  setBrainDumpProcessingError: (id: string, error: string) => void;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  // User Preferences
  userPreferences: UserPreferences;
  updateUserPreferences: (updates: Partial<UserPreferences>) => void;

  // UI State
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedTask: string | null;
  setSelectedTask: (taskId: string | null) => void;
  isBrainDumpOpen: boolean;
  setIsBrainDumpOpen: (isOpen: boolean) => void;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const defaultAISettings: AISettings = {
  provider: (process.env.REACT_APP_DEFAULT_AI_PROVIDER as any) || 'none',
  apiKey: process.env.REACT_APP_OPENAI_API_KEY || process.env.REACT_APP_CLAUDE_API_KEY || process.env.REACT_APP_GEMINI_API_KEY || undefined,
  model: (process.env.REACT_APP_DEFAULT_AI_MODEL as string) || 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2000,
  enableCache: true,
  extractionTypes: {
    tasks: true,
    habits: true,
    events: true,
    sleep: true,
  },
};

const defaultUserPreferences: UserPreferences = {
  energyPeakHours: [9, 10, 11],
  workingHours: { start: '09:00', end: '17:00' },
  breakDuration: 15,
  notifications: {
    tasks: true,
    habits: true,
    sleep: true,
  },
  theme: 'light',
  aiSettings: defaultAISettings,
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Tasks
        tasks: [],
        addTask: (taskData) => {
          const task: Task = {
            ...taskData,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set(
            (state) => ({ tasks: [...state.tasks, task] }),
            false,
            'addTask'
          );
        },
        updateTask: (id, updates) => {
          set(
            (state) => ({
              tasks: state.tasks.map((task) =>
                task.id === id
                  ? { ...task, ...updates, updatedAt: new Date() }
                  : task
              ),
            }),
            false,
            'updateTask'
          );
        },
        deleteTask: (id) => {
          set(
            (state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }),
            false,
            'deleteTask'
          );
        },
        completeTask: (id) => {
          set(
            (state) => ({
              tasks: state.tasks.map((task) =>
                task.id === id
                  ? { ...task, status: 'completed' as TaskStatus, updatedAt: new Date() }
                  : task
              ),
            }),
            false,
            'completeTask'
          );
        },

        // Habits
        habits: [],
        addHabit: (habitData) => {
          const habit: Habit = {
            ...habitData,
            id: generateId(),
            createdAt: new Date(),
            streak: 0,
            completedDates: [],
          };
          set(
            (state) => ({ habits: [...state.habits, habit] }),
            false,
            'addHabit'
          );
        },
        updateHabit: (id, updates) => {
          set(
            (state) => ({
              habits: state.habits.map((habit) =>
                habit.id === id ? { ...habit, ...updates } : habit
              ),
            }),
            false,
            'updateHabit'
          );
        },
        deleteHabit: (id) => {
          set(
            (state) => ({ habits: state.habits.filter((habit) => habit.id !== id) }),
            false,
            'deleteHabit'
          );
        },
        completeHabit: (id, date) => {
          set(
            (state) => ({
              habits: state.habits.map((habit) =>
                habit.id === id
                  ? {
                      ...habit,
                      completedDates: [...habit.completedDates, date],
                      streak: habit.streak + 1,
                    }
                  : habit
              ),
            }),
            false,
            'completeHabit'
          );
        },

        // Sleep Schedule
        sleepSchedules: [],
        addSleepSchedule: (scheduleData) => {
          const schedule: SleepSchedule = {
            ...scheduleData,
            id: generateId(),
          };
          set(
            (state) => ({ sleepSchedules: [...state.sleepSchedules, schedule] }),
            false,
            'addSleepSchedule'
          );
        },
        updateSleepSchedule: (id, updates) => {
          set(
            (state) => ({
              sleepSchedules: state.sleepSchedules.map((schedule) =>
                schedule.id === id ? { ...schedule, ...updates } : schedule
              ),
            }),
            false,
            'updateSleepSchedule'
          );
        },

        // Bedtime Routine
        bedtimeRoutineItems: [
          // Default routine items
          { id: 'br-1', title: 'Turn off screens', description: 'No phones, tablets, or TV for better sleep', estimatedDuration: 5, isRequired: true, category: 'digital', order: 1 },
          { id: 'br-2', title: 'Brush teeth', description: 'Complete dental hygiene routine', estimatedDuration: 3, isRequired: true, category: 'hygiene', order: 2 },
          { id: 'br-3', title: 'Wash face', description: 'Remove makeup and cleanse face', estimatedDuration: 3, isRequired: false, category: 'hygiene', order: 3 },
          { id: 'br-4', title: 'Prepare clothes for tomorrow', description: 'Lay out clothes to reduce morning decisions', estimatedDuration: 5, isRequired: false, category: 'environment', order: 4 },
          { id: 'br-5', title: 'Write 3 gratitudes', description: 'Journal three things you\'re grateful for', estimatedDuration: 5, isRequired: false, category: 'mental', order: 5 },
          { id: 'br-6', title: 'Deep breathing exercise', description: '5 minutes of mindful breathing', estimatedDuration: 5, isRequired: false, category: 'mental', order: 6 },
          { id: 'br-7', title: 'Gentle stretching', description: 'Light stretches to relax muscles', estimatedDuration: 10, isRequired: false, category: 'physical', order: 7 },
          { id: 'br-8', title: 'Check tomorrow\'s schedule', description: 'Review appointments and tasks', estimatedDuration: 3, isRequired: false, category: 'mental', order: 8 },
        ],
        bedtimeRoutineCompletions: [],
        addBedtimeRoutineItem: (itemData) => {
          const item: BedtimeRoutineItem = {
            ...itemData,
            id: generateId(),
          };
          set(
            (state) => ({ bedtimeRoutineItems: [...state.bedtimeRoutineItems, item].sort((a, b) => a.order - b.order) }),
            false,
            'addBedtimeRoutineItem'
          );
        },
        updateBedtimeRoutineItem: (id, updates) => {
          set(
            (state) => ({
              bedtimeRoutineItems: state.bedtimeRoutineItems.map((item) =>
                item.id === id ? { ...item, ...updates } : item
              ).sort((a, b) => a.order - b.order),
            }),
            false,
            'updateBedtimeRoutineItem'
          );
        },
        deleteBedtimeRoutineItem: (id) => {
          set(
            (state) => ({
              bedtimeRoutineItems: state.bedtimeRoutineItems.filter((item) => item.id !== id),
            }),
            false,
            'deleteBedtimeRoutineItem'
          );
        },
        completeBedtimeRoutine: (completionData) => {
          const completion: BedtimeRoutineCompletion = {
            ...completionData,
            id: generateId(),
          };
          set(
            (state) => ({ bedtimeRoutineCompletions: [...state.bedtimeRoutineCompletions, completion] }),
            false,
            'completeBedtimeRoutine'
          );
        },
        updateBedtimeRoutineCompletion: (id, updates) => {
          set(
            (state) => ({
              bedtimeRoutineCompletions: state.bedtimeRoutineCompletions.map((completion) =>
                completion.id === id ? { ...completion, ...updates } : completion
              ),
            }),
            false,
            'updateBedtimeRoutineCompletion'
          );
        },

        // Brain Dump
        brainDumpEntries: [],
        addBrainDumpEntry: (entryData) => {
          const entry: BrainDumpEntry = {
            ...entryData,
            id: generateId(),
            createdAt: new Date(),
            isProcessed: false,
            extractedTasks: [],
            extractedHabits: [],
            extractedEvents: [],
            extractedSleepSchedules: [],
          };
          set(
            (state) => ({ brainDumpEntries: [...state.brainDumpEntries, entry] }),
            false,
            'addBrainDumpEntry'
          );
        },
        processBrainDumpEntry: (id, extractedTasks, extractedHabits, extractedEvents, extractedSleepSchedules) => {
          set(
            (state) => ({
              brainDumpEntries: state.brainDumpEntries.map((entry) =>
                entry.id === id
                  ? {
                      ...entry,
                      isProcessed: true,
                      processedAt: new Date(),
                      extractedTasks,
                      extractedHabits,
                      extractedEvents,
                      extractedSleepSchedules,
                      processingError: undefined,
                    }
                  : entry
              ),
              tasks: [...state.tasks, ...extractedTasks],
              habits: [...state.habits, ...extractedHabits],
              calendarEvents: [...state.calendarEvents, ...extractedEvents],
              sleepSchedules: [...state.sleepSchedules, ...extractedSleepSchedules],
            }),
            false,
            'processBrainDumpEntry'
          );
        },
        setBrainDumpProcessingError: (id, error) => {
          set(
            (state) => ({
              brainDumpEntries: state.brainDumpEntries.map((entry) =>
                entry.id === id
                  ? {
                      ...entry,
                      processingError: error,
                      isProcessed: false,
                    }
                  : entry
              ),
            }),
            false,
            'setBrainDumpProcessingError'
          );
        },

        // Calendar
        calendarEvents: [],
        addCalendarEvent: (eventData) => {
          const event: CalendarEvent = {
            ...eventData,
            id: generateId(),
          };
          set(
            (state) => ({ calendarEvents: [...state.calendarEvents, event] }),
            false,
            'addCalendarEvent'
          );
        },
        updateCalendarEvent: (id, updates) => {
          set(
            (state) => ({
              calendarEvents: state.calendarEvents.map((event) =>
                event.id === id ? { ...event, ...updates } : event
              ),
            }),
            false,
            'updateCalendarEvent'
          );
        },
        deleteCalendarEvent: (id) => {
          set(
            (state) => ({
              calendarEvents: state.calendarEvents.filter((event) => event.id !== id),
            }),
            false,
            'deleteCalendarEvent'
          );
        },

        // User Preferences
        userPreferences: defaultUserPreferences,
        updateUserPreferences: (updates) => {
          set(
            (state) => ({
              userPreferences: { ...state.userPreferences, ...updates },
            }),
            false,
            'updateUserPreferences'
          );
        },

        // UI State
        currentDate: new Date(),
        setCurrentDate: (date) => {
          set({ currentDate: date }, false, 'setCurrentDate');
        },
        selectedTask: null,
        setSelectedTask: (taskId) => {
          set({ selectedTask: taskId }, false, 'setSelectedTask');
        },
        isBrainDumpOpen: false,
        setIsBrainDumpOpen: (isOpen) => {
          set({ isBrainDumpOpen: isOpen }, false, 'setIsBrainDumpOpen');
        },
      }),
      {
        name: 'adhd-brain-organiser-storage',
        partialize: (state) => ({
          tasks: state.tasks,
          habits: state.habits,
          sleepSchedules: state.sleepSchedules,
          brainDumpEntries: state.brainDumpEntries,
          calendarEvents: state.calendarEvents,
          userPreferences: state.userPreferences,
        }),
      }
    )
  )
);