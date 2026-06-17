/**
 * Client-side consent for silo's first-party `analytics` capability.
 *
 * The property is opt-out (silo collects by default); this lets a visitor deny
 * collection. silo's gate reads `getAnalyticsCategories()` and, when analytics is
 * false, turns off the gateway POST for core events + holds time-on-page beacons.
 * GPC still denies unconditionally. ubid is left to its opt-in default (we don't
 * return it), so it's never collected — matching the "anonymous analytics" scope.
 *
 * localStorage is origin-scoped (not shared across subdomains like the apex
 * cookies), so the choice key needs no env namespacing.
 */

const STORAGE_KEY = "silo_analytics_opt_out";

/** silo's notify callback — fans out to the gate (+ consent-tools) on change. */
let notify: ((categories: Record<string, boolean>) => void) | undefined;

/** React subscribers (the dialog) so the UI reflects the current choice. */
const listeners = new Set<() => void>();

function readOptOut(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

/** Current per-category choice consumed by silo's `consent.getCategories`. */
export function getAnalyticsCategories(): Record<string, boolean> {
  return { analytics: !readOptOut() };
}

/** silo hands us its notify fn via `consent.onConsentChanged`; stash it. */
export function registerConsentChanged(n: (categories: Record<string, boolean>) => void): void {
  notify = n;
}

/** Whether the visitor has opted out of anonymous analytics. */
export function isAnalyticsOptedOut(): boolean {
  return readOptOut();
}

/** Persist the choice, push it live to silo's gate, and wake subscribers. */
export function setAnalyticsOptedOut(optedOut: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, String(optedOut));
  notify?.(getAnalyticsCategories());
  listeners.forEach((listener) => listener());
}

/** Subscribe to choice changes — for `useSyncExternalStore`. */
export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
