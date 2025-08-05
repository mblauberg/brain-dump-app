export type Priority = 'high' | 'medium' | 'low';
export type Category = 'work' | 'personal' | 'health' | 'communication' | 'home' | 'other';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled';
export type EnergyLevel = 'high' | 'medium' | 'low';
export type TimeEstimate = '15min' | '30min' | '45min' | '1hr' | '2hr' | '3hr+';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  timeEstimate: TimeEstimate;
  energyLevel: EnergyLevel;
  status: TaskStatus;
  dueDate?: Date;
  scheduledDate?: Date;
  dependencies?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  scheduledTime?: string;
  streak: number;
  completedDates: Date[];
  createdAt: Date;
  isActive: boolean;
}

export interface SleepSchedule {
  id: string;
  bedtime: string;
  wakeTime: string;
  sleepQuality?: number;
  date: Date;
  actualBedtime?: string;
  actualWakeTime?: string;
}

export interface BedtimeRoutineItem {
  id: string;
  title: string;
  description?: string;
  estimatedDuration: number; // minutes
  isRequired: boolean;
  category: 'hygiene' | 'mental' | 'physical' | 'environment' | 'digital';
  order: number;
}

export interface BedtimeRoutineCompletion {
  id: string;
  date: Date;
  completedItems: string[]; // array of BedtimeRoutineItem IDs
  startTime?: Date;
  endTime?: Date;
  notes?: string;
}

export interface BrainDumpEntry {
  id: string;
  content: string;
  processedAt?: Date;
  isProcessed: boolean;
  extractedTasks: Task[];
  extractedHabits: Habit[];
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: 'task' | 'habit' | 'sleep' | 'appointment' | 'break';
  relatedId?: string;
  isFixed: boolean;
}

export type AIProvider = 'openai' | 'claude' | 'gemini' | 'none';

export interface AIModelConfig {
  openai: {
    models: string[];
    defaultModel: string;
  };
  claude: {
    models: string[];
    defaultModel: string;
  };
  gemini: {
    models: string[];
    defaultModel: string;
  };
}

export interface AISettings {
  provider: AIProvider;
  apiKey?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  enableCache: boolean;
}

export interface UserPreferences {
  energyPeakHours: number[];
  workingHours: { start: string; end: string };
  breakDuration: number;
  notifications: {
    tasks: boolean;
    habits: boolean;
    sleep: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  aiSettings: AISettings;
}