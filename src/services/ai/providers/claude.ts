import Anthropic from '@anthropic-ai/sdk';
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

export class ClaudeProvider implements AIProvider {
  name = 'Claude';
  
  private models: ModelInfo[] = [
    { 
      id: 'claude-opus-4', 
      name: 'Claude Opus 4', 
      description: 'Most powerful model for complex coding and AI agents with hybrid reasoning',
      maxTokens: 500000,
      costPer1kTokens: { input: 0.025, output: 0.125 }
    },
    { 
      id: 'claude-sonnet-4', 
      name: 'Claude Sonnet 4', 
      description: 'High-performance workhorse balancing quality, cost, and speed',
      maxTokens: 200000,
      costPer1kTokens: { input: 0.003, output: 0.015 }
    },
    { 
      id: 'claude-3-5-sonnet-20241022', 
      name: 'Claude 3.5 Sonnet (Legacy)', 
      description: 'Previous generation, still excellent for most tasks',
      maxTokens: 200000,
      costPer1kTokens: { input: 0.003, output: 0.015 }
    },
  ];

  isConfigured(): boolean {
    return !!process.env.REACT_APP_CLAUDE_API_KEY;
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
      throw new AIProviderError('claude', 'Claude API key is not configured');
    }

    // Note: In production, use a backend proxy to avoid exposing API key
    const anthropic = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    try {
      const processedText = preprocessBrainDump(text);
      const systemPrompt = `${ADHD_BRAIN_DUMP_SYSTEM_PROMPT}\n\n${providerSpecificPrompts.claude.additionalInstructions}`;
      
      const message = await anthropic.messages.create({
        model: model,
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: createUserPrompt(processedText, {
              tasks: true,
              habits: true,
              events: true,
              sleep: true
            }) + '\n\nPlease respond with valid JSON only.'
          }
        ]
      });

      // Extract JSON from Claude's response
      const content = message.content[0];
      if (content.type !== 'text') {
        throw new AIProviderError('claude', 'Unexpected response type from Claude');
      }

      // Claude might include explanation text, so we need to extract JSON
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new AIProviderError('claude', 'Could not find JSON in Claude response');
      }

      const responseText = jsonMatch[0];
      const parsedResponse = JSON.parse(responseText);

      if (!validateAIResponse(parsedResponse)) {
        throw new AIProviderError('claude', 'Invalid response format from Claude');
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
        usage: message.usage ? {
          promptTokens: message.usage.input_tokens,
          completionTokens: message.usage.output_tokens,
          totalTokens: message.usage.input_tokens + message.usage.output_tokens,
        } : undefined
      };
    } catch (error: any) {
      if (error.status === 401) {
        throw new AIProviderError('claude', 'Invalid Claude API key', 401, error);
      } else if (error.status === 429) {
        throw new AIProviderError('claude', 'Claude rate limit exceeded. Please try again later.', 429, error);
      } else if (error.status === 500) {
        throw new AIProviderError('claude', 'Claude service error. Please try again.', 500, error);
      }
      
      throw new AIProviderError(
        'claude', 
        `Claude error: ${error.message || 'Unknown error'}`,
        error.status,
        error
      );
    }
  }
}