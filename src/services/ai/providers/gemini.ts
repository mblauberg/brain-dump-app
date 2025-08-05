import { GoogleGenerativeAI } from '@google/generative-ai';
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

export class GeminiProvider implements AIProvider {
  name = 'Gemini';
  
  private models: ModelInfo[] = [
    { 
      id: 'gemini-pro', 
      name: 'Gemini Pro', 
      description: 'Best for text-based tasks',
      maxTokens: 32768
    },
    { 
      id: 'gemini-pro-vision', 
      name: 'Gemini Pro Vision', 
      description: 'Multimodal model for text and images',
      maxTokens: 32768
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
      const fullPrompt = `${ADHD_BRAIN_DUMP_SYSTEM_PROMPT}\n\n${providerSpecificPrompts.gemini.additionalInstructions}\n\n${createUserPrompt(processedText)}\n\nIMPORTANT: Respond with valid JSON only, no additional text or markdown.`;
      
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

      return {
        tasks,
        habits,
        rawResponse: cleanedResponse,
        // Gemini doesn't provide token usage in the same way
        usage: undefined
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