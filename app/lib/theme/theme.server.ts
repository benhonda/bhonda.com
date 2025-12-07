import { getPreferencesFromRequest } from "~/lib/preferences/preference-cookie.server";
import type { Theme } from "~/lib/preferences/preference-types";

/**
 * Get theme preference from request cookie
 */
export function getThemeFromRequest(request: Request): Theme {
  const preferences = getPreferencesFromRequest(request);
  return preferences.theme;
}

/**
 * Get the class name to apply to <html> based on theme preference
 * - "light" -> "light" (forces light mode)
 * - "dark" -> "dark" (forces dark mode)
 * - "system" -> "" (no class, CSS media query handles it)
 */
export function getThemeClass(theme: Theme): string {
  if (theme === "light") return "light";
  if (theme === "dark") return "dark";
  return "";
}
