import {
  DEFAULT_PREFERENCES,
  SIDEBAR_WIDTH_CONSTRAINTS,
  THEME_VALUES,
  type Theme,
  type UserPreferences,
} from "./preference-types";

const PREFERENCE_COOKIE_NAME = "user_preferences";

/**
 * Parse preferences from cookie header
 */
export function getPreferencesFromRequest(request: Request): UserPreferences {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return DEFAULT_PREFERENCES;

  const cookies = parseCookieHeader(cookieHeader);
  const preferencesStr = cookies[PREFERENCE_COOKIE_NAME];
  if (!preferencesStr) return DEFAULT_PREFERENCES;

  try {
    const parsed = JSON.parse(decodeURIComponent(preferencesStr));
    return {
      sidebarWidth: clampSidebarWidth(parsed.sidebarWidth ?? DEFAULT_PREFERENCES.sidebarWidth),
      theme: parseTheme(parsed.theme),
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Parse and validate theme value
 */
function parseTheme(value: unknown): Theme {
  if (typeof value === "string" && THEME_VALUES.includes(value as Theme)) {
    return value as Theme;
  }
  return DEFAULT_PREFERENCES.theme;
}

/**
 * Helper to parse Cookie header into object
 */
function parseCookieHeader(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Clamp sidebar width to valid range
 */
function clampSidebarWidth(width: number): number {
  return Math.max(SIDEBAR_WIDTH_CONSTRAINTS.min, Math.min(SIDEBAR_WIDTH_CONSTRAINTS.max, width));
}
