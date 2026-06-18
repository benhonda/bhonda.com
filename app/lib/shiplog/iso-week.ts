/**
 * Pure, client-safe ISO week ↔ date helpers (no `Date.now()` — deterministic given year+week).
 * Shared SSOT for the week-ending date that shiplogs display/sort by; the server-only
 * `date-utils.server.ts` re-exports `getDateRangeFromISOWeek` from here.
 */

/** Monday (start) and Sunday (end) dates of an ISO week. */
export function getDateRangeFromISOWeek(year: number, week: number): { start: Date; end: Date } {
  // January 4th is always in ISO week 1
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7; // Sunday = 7
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1);

  const start = new Date(week1Monday);
  start.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  return { start, end };
}

/** Sunday (week-ending) date of an ISO week, as `"YYYY-MM-DD"`. The shiplog's canonical content date. */
export function isoWeekEndDateString(year: number, week: number): string {
  return getDateRangeFromISOWeek(year, week).end.toISOString().split("T")[0];
}
