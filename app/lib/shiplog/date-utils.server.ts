/**
 * ISO week date utilities for shiplog generation
 */

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
 * Converts ISO week number to start and end dates (Monday-Sunday)
 * @param year - The ISO week year
 * @param week - The ISO week number (1-53)
 * @returns Object with start (Monday) and end (Sunday) dates
 */
export function getDateRangeFromISOWeek(
  year: number,
  week: number
): { start: Date; end: Date } {
  // January 4th is always in week 1
  const jan4 = new Date(Date.UTC(year, 0, 4));

  // Get the Monday of week 1
  const dayOfWeek = jan4.getUTCDay() || 7; // Sunday = 7
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1);

  // Calculate the Monday of the target week
  const targetMonday = new Date(week1Monday);
  targetMonday.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);

  // Calculate the Sunday of the target week
  const targetSunday = new Date(targetMonday);
  targetSunday.setUTCDate(targetMonday.getUTCDate() + 6);

  return {
    start: targetMonday,
    end: targetSunday,
  };
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
