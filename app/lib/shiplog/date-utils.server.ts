/**
 * ISO week date utilities for shiplog generation.
 * `getDateRangeFromISOWeek` lives in the client-safe `./iso-week` module (SSOT) and is
 * re-exported here so existing server-side importers keep their import path.
 */

export { getDateRangeFromISOWeek } from "./iso-week";

/**
 * Calculates the ISO week number for a given date
 */
export function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Gets the year that an ISO week belongs to
 * (Week 1 of a year can start in December of the previous year)
 */
export function getISOWeekYear(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
}

/**
 * Formats a date range filename with ISO week number
 * Format: YYYY-WNN-MM-DD.md (e.g., 2025-W49-12-05.md)
 * Uses the end date (Friday/Sunday) for the filename
 */
export function formatShiplogFilename(endDate: Date): string {
  const year = getISOWeekYear(endDate);
  const week = getISOWeekNumber(endDate);
  const dateStr = endDate.toISOString().split("T")[0]; // YYYY-MM-DD
  const monthDay = dateStr.substring(5); // MM-DD

  return `${year}-W${week.toString().padStart(2, "0")}-${monthDay}.md`;
}
