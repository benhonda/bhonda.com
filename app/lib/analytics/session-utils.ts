/**
 * Session tracking utilities for analytics
 */

const SESSION_START_KEY = "analytics_session_start";

/**
 * Get or create a session start timestamp
 * Stored in sessionStorage to persist across page navigations
 */
export function getOrCreateStartTime(): number {
  if (typeof window === "undefined") return Date.now();

  const existing = sessionStorage.getItem(SESSION_START_KEY);
  if (existing) {
    return parseInt(existing, 10);
  }

  const now = Date.now();
  sessionStorage.setItem(SESSION_START_KEY, now.toString());
  return now;
}

/**
 * Get elapsed time in seconds since start timestamp
 */
export function getElapsedSeconds(startTime: number): number {
  return Math.round((Date.now() - startTime) / 1000);
}

/**
 * Clear all tracking data (e.g., on logout)
 */
export function clearAllTrackingData(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_START_KEY);
}
