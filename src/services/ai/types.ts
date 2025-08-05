import { Task, Habit, CalendarEvent, SleepSchedule } from '../../types';

export interface AIProvider {
  name: string;
  processText(text: string, apiKey: string, model: string, options: AIOptions): Promise<AIResponse>;
  isConfigured(): boolean;
  getAvailableModels(): ModelInfo[];
}

export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIResponse {
  tasks: Task[];
  habits: Habit[];
  events: CalendarEvent[];
  sleepSchedules: SleepSchedule[];
  rawResponse?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  processingTime?: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  costPer1kTokens?: {
    input: number;
    output: number;
  };
}

export interface AIError extends Error {
  provider: string;
  statusCode?: number;
  originalError?: any;
}

export class AIProviderError extends Error implements AIError {
  constructor(
    public provider: string,
    message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AIProviderError';
  }
}

// Cache interface for reducing API calls
export interface CacheEntry {
  key: string;
  response: AIResponse;
  timestamp: number;
}

export interface AICache {
  get(key: string): CacheEntry | null;
  set(key: string, response: AIResponse): void;
  clear(): void;
}