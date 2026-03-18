import {
  DEFAULT_PREFERENCES,
  THEME_VALUES,
  SIDEBAR_WIDTH_CONSTRAINTS,
  type Theme,
  type UserPreferences,
} from "./preference-types";

const PREFERENCE_COOKIE_NAME = "user_preferences";

/**
 * Serializes a UserPreferences object into a Set-Cookie header value
 * for the user_preferences cookie.
 */
export function buildPreferencesCookieHeader(prefs: UserPreferences): string {
  const value = encodeURIComponent(JSON.stringify(prefs));
  return `${PREFERENCE_COOKIE_NAME}=${value}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function getPreferencesFromRequest(request: Request): UserPreferences {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return DEFAULT_PREFERENCES;

  const cookies = parseCookieHeader(cookieHeader);
  const preferencesStr = cookies[PREFERENCE_COOKIE_NAME];
  if (!preferencesStr) return DEFAULT_PREFERENCES;

  try {
    const parsed = JSON.parse(decodeURIComponent(preferencesStr));
    return {
      theme: parseTheme(parsed.theme),
      sidebarWidth: clampSidebarWidth(parsed.sidebarWidth ?? DEFAULT_PREFERENCES.sidebarWidth),
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function parseTheme(value: unknown): Theme {
  if (typeof value === "string" && THEME_VALUES.includes(value as Theme)) {
    return value as Theme;
  }
  return DEFAULT_PREFERENCES.theme;
}

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
