import { AIProvider, AIResponse, AIOptions, AIProviderError } from './types';
import { OpenAIProvider } from './providers/openai';
import { ClaudeProvider } from './providers/claude';
import { GeminiProvider } from './providers/gemini';
import { getAICache, createCacheKey } from './cache';
import { AISettings } from '../../types';

export class AIService {
  private providers: Map<string, AIProvider> = new Map();
  private cache = getAICache();

  constructor() {
    // Initialize providers
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('claude', new ClaudeProvider());
    this.providers.set('gemini', new GeminiProvider());
  }

  async processText(
    text: string,
    settings: AISettings,
    extractionTypes?: { tasks: boolean; habits: boolean; events: boolean; sleep: boolean }
  ): Promise<AIResponse> {
    // Check if AI is enabled
    if (settings.provider === 'none' || !settings.apiKey) {
      throw new Error('AI processing is not configured. Please configure an AI provider in settings.');
    }

    // Use extraction types from settings if not provided
    // Note: extractionTypes parameter available for future use

    // Get the provider
    const provider = this.providers.get(settings.provider);
    if (!provider) {
      throw new Error(`Unknown AI provider: ${settings.provider}`);
    }

    // Create cache key
    const cacheKey = createCacheKey(text, settings.provider, settings.model, {
      temperature: settings.temperature,
      maxTokens: settings.maxTokens
    });

    // Check cache if enabled
    if (settings.enableCache) {
      const cachedEntry = this.cache.get(cacheKey);
      if (cachedEntry) {
        console.log('Using cached AI response');
        return cachedEntry.response;
      }
    }

    // Process with the selected provider
    try {
      const options: AIOptions = {
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
      };

      const response = await provider.processText(
        text,
        settings.apiKey,
        settings.model,
        options
      );

      // Cache the response if caching is enabled
      if (settings.enableCache) {
        this.cache.set(cacheKey, response);
      }

      return response;
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      throw new Error(`AI processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getProvider(name: string): AIProvider | undefined {
    return this.providers.get(name);
  }

  getAllProviders(): Array<{ name: string; provider: AIProvider }> {
    return Array.from(this.providers.entries()).map(([name, provider]) => ({
      name,
      provider
    }));
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
let aiServiceInstance: AIService | null = null;

export const getAIService = (): AIService => {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService();
  }
  return aiServiceInstance;
};

// Export types and utilities
export * from './types';
export * from './prompts';