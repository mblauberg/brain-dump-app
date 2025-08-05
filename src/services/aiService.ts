import { Task, Habit, CalendarEvent, SleepSchedule } from '../types';
import { getAIService } from './ai';
import { useAppStore } from '../stores/useAppStore';

// Helper function for generating unique IDs (not currently used but available for future features)
// const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// AI-powered comprehensive brain dump processing (No Fallbacks)
export const processBrainDumpText = async (text: string): Promise<{ 
  tasks: Task[], 
  habits: Habit[], 
  events: CalendarEvent[], 
  sleepSchedules: SleepSchedule[]
}> => {
  const userPreferences = useAppStore.getState().userPreferences;
  const aiSettings = userPreferences.aiSettings;
  
  // Check if AI is configured
  if (aiSettings.provider === 'none' || !aiSettings.apiKey) {
    throw new Error('AI processing is required but not configured. Please configure an AI provider in settings.');
  }

  const aiService = getAIService();
  const response = await aiService.processText(text, aiSettings, aiSettings.extractionTypes);
  
  return {
    tasks: response.tasks,
    habits: response.habits,
    events: response.events,
    sleepSchedules: response.sleepSchedules
  };
};

// No fallbacks - AI processing only