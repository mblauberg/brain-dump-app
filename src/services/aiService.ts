import { Task, Habit } from '../types';
import { getAIService } from './ai';
import { useAppStore } from '../stores/useAppStore';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// AI-powered brain dump processing
export const processBrainDumpText = async (text: string): Promise<{ tasks: Task[], habits: Habit[] }> => {
  const userPreferences = useAppStore.getState().userPreferences;
  const aiSettings = userPreferences.aiSettings;
  
  // Check if AI is configured
  if (aiSettings.provider === 'none' || !aiSettings.apiKey) {
    // Fall back to mock processing
    return mockProcessBrainDump(text);
  }

  try {
    const aiService = getAIService();
    const response = await aiService.processText(text, aiSettings);
    
    return {
      tasks: response.tasks,
      habits: response.habits
    };
  } catch (error) {
    console.error('AI processing failed, falling back to mock:', error);
    // Fall back to mock processing if AI fails
    return mockProcessBrainDump(text);
  }
};

// Mock processing as fallback
const mockProcessBrainDump = async (text: string): Promise<{ tasks: Task[], habits: Habit[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const tasks: Task[] = [];
  const habits: Habit[] = [];

  // Simple keyword-based extraction for fallback
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);

  for (const sentence of sentences) {
    const cleanSentence = sentence.trim().toLowerCase();
    
    // Task detection patterns
    const taskPatterns = [
      /need to (.+)/,
      /have to (.+)/,
      /must (.+)/,
      /should (.+)/,
      /finish (.+)/,
      /complete (.+)/,
      /call (.+)/,
      /email (.+)/,
      /buy (.+)/,
      /get (.+)/,
      /do (.+)/,
      /write (.+)/,
      /prepare (.+)/,
      /schedule (.+)/,
      /book (.+)/,
      /pay (.+)/,
      /submit (.+)/,
    ];

    for (const pattern of taskPatterns) {
      const match = cleanSentence.match(pattern);
      if (match) {
        const taskTitle = match[1].trim();
        if (taskTitle && taskTitle.length > 2) {
          const task: Task = {
            id: generateId(),
            title: capitalizeFirst(taskTitle),
            priority: inferPriority(cleanSentence),
            category: inferCategory(cleanSentence),
            timeEstimate: inferTimeEstimate(cleanSentence),
            energyLevel: inferEnergyLevel(cleanSentence),
            status: 'not_started',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          tasks.push(task);
          break;
        }
      }
    }

    // Habit detection patterns
    const habitPatterns = [
      /want to start (.+)/,
      /need to exercise/,
      /should meditate/,
      /want to read/,
      /need to sleep/,
      /should drink more water/,
      /want to journal/,
      /should wake up earlier/,
      /need to go to bed earlier/,
    ];

    for (const pattern of habitPatterns) {
      const match = cleanSentence.match(pattern);
      if (match || habitPatterns.some(p => p.test(cleanSentence))) {
        let habitTitle = '';
        
        if (match && match[1]) {
          habitTitle = match[1].trim();
        } else if (cleanSentence.includes('exercise')) {
          habitTitle = 'daily exercise';
        } else if (cleanSentence.includes('meditate')) {
          habitTitle = 'daily meditation';
        } else if (cleanSentence.includes('read')) {
          habitTitle = 'daily reading';
        } else if (cleanSentence.includes('water')) {
          habitTitle = 'drink more water';
        } else if (cleanSentence.includes('journal')) {
          habitTitle = 'daily journaling';
        } else if (cleanSentence.includes('wake up earlier')) {
          habitTitle = 'wake up earlier';
        } else if (cleanSentence.includes('bed earlier')) {
          habitTitle = 'go to bed earlier';
        }

        if (habitTitle && habitTitle.length > 2) {
          const habit: Habit = {
            id: generateId(),
            title: capitalizeFirst(habitTitle),
            frequency: 'daily',
            isActive: true,
            streak: 0,
            completedDates: [],
            createdAt: new Date(),
          };
          habits.push(habit);
          break;
        }
      }
    }
  }

  // If no tasks found, create a default one
  if (tasks.length === 0 && text.trim().length > 0) {
    tasks.push({
      id: generateId(),
      title: 'Review brain dump notes',
      priority: 'medium',
      category: 'personal',
      timeEstimate: '15min',
      energyLevel: 'low',
      status: 'not_started',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return { tasks, habits };
};

// Helper functions
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function inferPriority(text: string): Task['priority'] {
  const urgentWords = ['urgent', 'asap', 'immediately', 'deadline', 'due', 'emergency'];
  const importantWords = ['important', 'critical', 'must', 'need', 'essential'];
  
  if (urgentWords.some(word => text.includes(word))) return 'high';
  if (importantWords.some(word => text.includes(word))) return 'high';
  if (text.includes('should') || text.includes('want to')) return 'medium';
  return 'low';
}

function inferCategory(text: string): Task['category'] {
  if (text.includes('work') || text.includes('project') || text.includes('meeting') || text.includes('presentation')) return 'work';
  if (text.includes('doctor') || text.includes('exercise') || text.includes('health') || text.includes('medicine')) return 'health';
  if (text.includes('call') || text.includes('email') || text.includes('text') || text.includes('message')) return 'communication';
  if (text.includes('clean') || text.includes('groceries') || text.includes('home') || text.includes('house')) return 'home';
  return 'personal';
}

function inferTimeEstimate(text: string): Task['timeEstimate'] {
  if (text.includes('quick') || text.includes('brief')) return '15min';
  if (text.includes('long') || text.includes('detailed') || text.includes('thorough')) return '2hr';
  if (text.includes('meeting') || text.includes('call')) return '1hr';
  return '30min';
}

function inferEnergyLevel(text: string): Task['energyLevel'] {
  const highEnergyWords = ['creative', 'think', 'plan', 'design', 'write', 'analyze'];
  const lowEnergyWords = ['clean', 'organize', 'file', 'sort', 'routine'];
  
  if (highEnergyWords.some(word => text.includes(word))) return 'high';
  if (lowEnergyWords.some(word => text.includes(word))) return 'low';
  return 'medium';
}