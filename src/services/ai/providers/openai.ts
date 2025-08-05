import OpenAI from 'openai';
import { AIProvider, AIResponse, AIOptions, ModelInfo, AIProviderError } from '../types';
import { 
  ADHD_BRAIN_DUMP_SYSTEM_PROMPT, 
  createUserPrompt, 
  providerSpecificPrompts,
  validateAIResponse,
  preprocessBrainDump
} from '../prompts';
import { Task, Habit, CalendarEvent, SleepSchedule } from '../../../types';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  
  private models: ModelInfo[] = [
    { 
      id: 'gpt-4o', 
      name: 'GPT-4o', 
      description: 'Most capable GPT-4 model, optimized for chat',
      maxTokens: 128000,
      costPer1kTokens: { input: 0.0025, output: 0.01 }
    },
    { 
      id: 'gpt-4o-mini', 
      name: 'GPT-4o Mini', 
      description: 'Affordable and fast model for simple tasks',
      maxTokens: 128000,
      costPer1kTokens: { input: 0.000075, output: 0.0003 }
    },
    { 
      id: 'gpt-4', 
      name: 'GPT-4', 
      description: 'High-intelligence flagship model for complex, multi-step tasks',
      maxTokens: 8192,
      costPer1kTokens: { input: 0.03, output: 0.06 }
    },
    { 
      id: 'gpt-3.5-turbo', 
      name: 'GPT-3.5 Turbo', 
      description: 'Fast, inexpensive model for simple tasks',
      maxTokens: 16385,
      costPer1kTokens: { input: 0.0005, output: 0.0015 }
    },
  ];

  isConfigured(): boolean {
    return !!process.env.REACT_APP_OPENAI_API_KEY;
  }

  getAvailableModels(): ModelInfo[] {
    return this.models;
  }

  async processText(
    text: string, 
    apiKey: string, 
    model: string, 
    options: AIOptions
  ): Promise<AIResponse> {
    if (!apiKey) {
      throw new AIProviderError('openai', 'OpenAI API key is not configured');
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    });

    try {
      const processedText = preprocessBrainDump(text);
      const systemPrompt = `${ADHD_BRAIN_DUMP_SYSTEM_PROMPT}\n\n${providerSpecificPrompts.openai.additionalInstructions}`;
      
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: createUserPrompt(processedText, {
            tasks: true,
            habits: true,
            events: true,
            sleep: true
          }) }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0].message.content || '{}';
      const parsedResponse = JSON.parse(responseText);

      if (!validateAIResponse(parsedResponse)) {
        throw new AIProviderError('openai', 'Invalid response format from OpenAI');
      }

      // Transform the response into our app's format
      const tasks: Task[] = parsedResponse.tasks.map((task: any) => ({
        id: generateId(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        timeEstimate: task.timeEstimate,
        energyLevel: task.energyLevel,
        status: 'not_started',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const habits: Habit[] = parsedResponse.habits.map((habit: any) => ({
        id: generateId(),
        title: habit.title,
        description: habit.description,
        frequency: habit.frequency,
        scheduledTime: habit.scheduledTime,
        isActive: true,
        streak: 0,
        completedDates: [],
        createdAt: new Date(),
      }));

      const events: CalendarEvent[] = parsedResponse.events.map((event: any) => ({
        id: generateId(),
        title: event.title,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime),
        type: event.type || 'appointment',
        isFixed: event.isFixed !== false,
      }));

      const sleepSchedules: SleepSchedule[] = parsedResponse.sleepSchedules.map((schedule: any) => ({
        id: generateId(),
        bedtime: schedule.bedtime,
        wakeTime: schedule.wakeTime,
        date: schedule.date ? new Date(schedule.date) : new Date(),
        sleepQuality: undefined,
      }));

      return {
        tasks,
        habits,
        events,
        sleepSchedules,
        rawResponse: responseText,
        usage: completion.usage ? {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens,
        } : undefined
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new AIProviderError('openai', 'Invalid OpenAI API key', 401, error);
      } else if (error.response?.status === 429) {
        throw new AIProviderError('openai', 'OpenAI rate limit exceeded. Please try again later.', 429, error);
      } else if (error.response?.status === 503) {
        throw new AIProviderError('openai', 'OpenAI service is temporarily unavailable', 503, error);
      }
      
      throw new AIProviderError(
        'openai', 
        `OpenAI error: ${error.message || 'Unknown error'}`,
        error.response?.status,
        error
      );
    }
  }
}