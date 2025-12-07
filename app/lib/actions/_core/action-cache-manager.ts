import { logDebug } from "~/lib/logger";

/**
 * Cache configuration for an action
 */
export type ActionCacheConfig = {
  /**
   * Enable caching for this action (default: false - opt-in)
   */
  enabled?: boolean;
  /**
   * Time in ms before cached data is considered stale (default: 0)
   * Stale data is returned immediately while revalidating in background
   */
  staleTime?: number;
  /**
   * Time in ms before cached data is garbage collected (default: 5 minutes)
   * Data older than this is removed from cache
   */
  cacheTime?: number;
  /**
   * Revalidate when window regains focus (default: true)
   */
  revalidateOnFocus?: boolean;
  /**
   * Revalidate when network reconnects (default: false)
   */
  revalidateOnReconnect?: boolean;
};

/**
 * Cache entry with metadata
 */
type CacheEntry<T = any> = {
  data: T;
  timestamp: number;
  config: ActionCacheConfig;
};

/**
 * In-flight request tracking
 */
type InFlightRequest = {
  promise: Promise<any>;
  timestamp: number;
};

/**
 * Global action cache manager singleton
 * Implements SWR (stale-while-revalidate) caching pattern
 */
class ActionCacheManager {
  private cache = new Map<string, CacheEntry>();
  private inFlight = new Map<string, InFlightRequest>();
  private gcInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start garbage collection interval (every 60 seconds)
    if (typeof window !== "undefined") {
      this.gcInterval = setInterval(() => this.garbageCollect(), 60000);
    }
  }

  /**
   * Generate cache key from action name and input data
   */
  private generateKey(actionName: string, inputData: unknown): string {
    const dataHash = JSON.stringify(inputData);
    return `${actionName}:${dataHash}`;
  }

  /**
   * Get cached data if available
   * Returns { data, isStale } or null if not cached
   */
  get<T = any>(actionName: string, inputData: unknown): { data: T; isStale: boolean } | null {
    const key = this.generateKey(actionName, inputData);
    const entry = this.cache.get(key);

    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    const staleTime = entry.config.staleTime ?? 0;
    const isStale = age > staleTime;

    logDebug(`[Cache] GET ${key}`, { age, isStale });

    return {
      data: entry.data,
      isStale,
    };
  }

  /**
   * Set cached data
   */
  set<T = any>(actionName: string, inputData: unknown, data: T, config: ActionCacheConfig): void {
    const key = this.generateKey(actionName, inputData);

    // Store cache entry
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      config,
    });

    logDebug(`[Cache] SET ${key}`, { size: this.cache.size });
  }

  /**
   * Check if request is in-flight
   * Returns the promise if exists, null otherwise
   */
  getInFlight(actionName: string, inputData: unknown): Promise<any> | null {
    const key = this.generateKey(actionName, inputData);
    const inFlight = this.inFlight.get(key);

    if (!inFlight) return null;

    // Check if in-flight request is too old (5 seconds) - clean it up
    const age = Date.now() - inFlight.timestamp;
    if (age > 5000) {
      this.inFlight.delete(key);
      return null;
    }

    logDebug(`[Cache] IN-FLIGHT ${key}`);
    return inFlight.promise;
  }

  /**
   * Register an in-flight request
   */
  setInFlight(actionName: string, inputData: unknown, promise: Promise<any>): void {
    const key = this.generateKey(actionName, inputData);

    this.inFlight.set(key, {
      promise,
      timestamp: Date.now(),
    });

    // Clean up when promise resolves/rejects
    promise.finally(() => {
      this.inFlight.delete(key);
      logDebug(`[Cache] IN-FLIGHT COMPLETE ${key}`);
    });
  }

  /**
   * Invalidate cache entries by action name
   * If inputData is provided, invalidates only that specific entry
   * Otherwise, invalidates ALL entries for the action
   */
  invalidate(actionName: string, inputData?: unknown): void {
    if (inputData) {
      // Invalidate specific entry
      const key = this.generateKey(actionName, inputData);
      this.cache.delete(key);
      logDebug(`[Cache] INVALIDATE ${key}`);
    } else {
      // Invalidate all entries for this action
      const prefix = `${actionName}:`;
      let removed = 0;
      for (const key of Array.from(this.cache.keys())) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key);
          removed++;
        }
      }
      logDebug(`[Cache] INVALIDATE ALL ${actionName}`, { removed });
    }
  }

  /**
   * Invalidate all cache entries
   */
  invalidateAll(): void {
    this.cache.clear();
    logDebug(`[Cache] INVALIDATE ALL`);
  }

  /**
   * Garbage collect expired entries
   */
  private garbageCollect(): void {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of Array.from(this.cache.entries())) {
      const age = now - entry.timestamp;
      const cacheTime = entry.config.cacheTime ?? 300000; // Default 5 minutes

      if (age > cacheTime) {
        this.cache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      logDebug(`[Cache] GC removed ${removed} entries, ${this.cache.size} remaining`);
    }
  }

  /**
   * Get cache statistics (for debugging)
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      inFlightSize: this.inFlight.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        config: entry.config,
      })),
    };
  }

  /**
   * Cleanup on unmount
   */
  destroy(): void {
    if (this.gcInterval) {
      clearInterval(this.gcInterval);
      this.gcInterval = null;
    }
    this.cache.clear();
    this.inFlight.clear();
  }
}

// Export singleton instance
export const actionCacheManager = new ActionCacheManager();

// Export for debugging in browser console
if (typeof window !== "undefined") {
  (window as any).__actionCache = actionCacheManager;
}
