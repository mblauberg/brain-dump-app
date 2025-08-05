import { AICache, CacheEntry, AIResponse } from './types';

export class InMemoryAICache implements AICache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize: number = 100;
  private ttl: number;

  constructor(ttlMinutes: number = 60) {
    this.ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
  }

  get(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry;
  }

  set(key: string, response: AIResponse): void {
    // Implement simple LRU by removing oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.findOldestEntry();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      key,
      response,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  private findOldestEntry(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    });

    return oldestKey;
  }
}

// Helper to create cache keys from request parameters
export const createCacheKey = (
  text: string,
  provider: string,
  model: string,
  options: any
): string => {
  const data = JSON.stringify({ text, provider, model, options });
  // Simple hash function for browser compatibility
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

// Singleton cache instance
let cacheInstance: InMemoryAICache | null = null;

export const getAICache = (): InMemoryAICache => {
  if (!cacheInstance) {
    const cacheDuration = process.env.REACT_APP_AI_CACHE_DURATION
      ? parseInt(process.env.REACT_APP_AI_CACHE_DURATION) / 60000 // Convert ms to minutes
      : 60;
    cacheInstance = new InMemoryAICache(cacheDuration);
  }
  return cacheInstance;
};