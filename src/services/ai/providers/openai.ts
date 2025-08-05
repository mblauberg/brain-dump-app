import OpenAI from 'openai';
import { AIProvider, AIResponse, AIOptions, ModelInfo, AIProviderError } from '../types';
import { 
  ADHD_BRAIN_DUMP_SYSTEM_PROMPT, 
  createUserPrompt, 
  providerSpecificPrompts,
  validateAIResponse,
  preprocessBrainDump
} from '../prompts';
import { Task, Habit } from '../../../types';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  
  private models: ModelInfo[] = [
    { 
      id: 'gpt-4-turbo-preview', 
      name: 'GPT-4 Turbo', 
      description: 'Most capable model with 128k context',
      maxTokens: 4096
    },
    { 
      id: 'gpt-4', 
      name: 'GPT-4', 
      description: 'High quality, slower and more expensive',
      maxTokens: 8192
    },
    { 
      id: 'gpt-3.5-turbo', 
      name: 'GPT-3.5 Turbo', 
      description: 'Fast and cost-effective',
      maxTokens: 4096
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
          { role: 'user', content: createUserPrompt(processedText) }
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

      return {
        tasks,
        habits,
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