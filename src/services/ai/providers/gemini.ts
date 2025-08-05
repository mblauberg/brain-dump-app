import { GoogleGenerativeAI } from '@google/generative-ai';
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

export class GeminiProvider implements AIProvider {
  name = 'Gemini';
  
  private models: ModelInfo[] = [
    { 
      id: 'gemini-2.5-pro', 
      name: 'Gemini 2.5 Pro', 
      description: 'Most intelligent model with thinking capabilities, 1M+ token context',
      maxTokens: 1000000,
      costPer1kTokens: { input: 0.002, output: 0.008 }
    },
    { 
      id: 'gemini-2.5-flash', 
      name: 'Gemini 2.5 Flash', 
      description: 'Cost-efficient with adaptive thinking, #2 on LMarena leaderboard',
      maxTokens: 1000000,
      costPer1kTokens: { input: 0.0001, output: 0.0004 }
    },
    { 
      id: 'gemini-2.5-pro-deep-think', 
      name: 'Gemini 2.5 Pro Deep Think', 
      description: 'Experimental enhanced reasoning mode for highly complex problems',
      maxTokens: 1000000,
      costPer1kTokens: { input: 0.005, output: 0.02 }
    },
    { 
      id: 'gemini-2.0-flash', 
      name: 'Gemini 2.0 Flash', 
      description: 'Production-ready workhorse model for developers',
      maxTokens: 1000000,
      costPer1kTokens: { input: 0.000075, output: 0.0003 }
    },
    { 
      id: 'gemini-2.0-pro', 
      name: 'Gemini 2.0 Pro', 
      description: 'Experimental with strongest coding performance, 2M token context',
      maxTokens: 2000000,
      costPer1kTokens: { input: 0.00125, output: 0.005 }
    },
  ];

  isConfigured(): boolean {
    return !!process.env.REACT_APP_GEMINI_API_KEY;
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
      throw new AIProviderError('gemini', 'Gemini API key is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    try {
      const processedText = preprocessBrainDump(text);
      const fullPrompt = `${ADHD_BRAIN_DUMP_SYSTEM_PROMPT}\n\n${providerSpecificPrompts.gemini.additionalInstructions}\n\n${createUserPrompt(processedText, {
        tasks: true,
        habits: true,
        events: true,
        sleep: true
      })}\n\nIMPORTANT: Respond with valid JSON only, no additional text or markdown.`;
      
      // Configure generation parameters
      const generationConfig = {
        temperature: options.temperature || 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: options.maxTokens || 2000,
      };

      const result = await geminiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig,
      });

      const response = await result.response;
      const responseText = response.text();

      // Gemini might include markdown or explanation, extract JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new AIProviderError('gemini', 'Could not find JSON in Gemini response');
      }

      const cleanedResponse = jsonMatch[0];
      const parsedResponse = JSON.parse(cleanedResponse);

      if (!validateAIResponse(parsedResponse)) {
        throw new AIProviderError('gemini', 'Invalid response format from Gemini');
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
        rawResponse: cleanedResponse,
        // Gemini provides usage information in newer versions
        usage: response.usageMetadata ? {
          promptTokens: response.usageMetadata.promptTokenCount || 0,
          completionTokens: response.usageMetadata.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata.totalTokenCount || 0,
        } : undefined
      };
    } catch (error: any) {
      if (error.message?.includes('API_KEY_INVALID')) {
        throw new AIProviderError('gemini', 'Invalid Gemini API key', 401, error);
      } else if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
        throw new AIProviderError('gemini', 'Gemini rate limit exceeded. Please try again later.', 429, error);
      } else if (error.message?.includes('SAFETY')) {
        throw new AIProviderError('gemini', 'Content was blocked by Gemini safety filters. Please rephrase your input.', 400, error);
      }
      
      throw new AIProviderError(
        'gemini', 
        `Gemini error: ${error.message || 'Unknown error'}`,
        error.status,
        error
      );
    }
  }
}