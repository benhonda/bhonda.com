import { useCallback, useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router";
import type { Theme } from "~/lib/preferences/preference-types";
import type { loader as rootLoader } from "~/root";

const PREFERENCE_COOKIE_NAME = "user_preferences";

/**
 * Hook for managing theme preference (light/dark/system)
 *
 * - Reads initial theme from root loader data
 * - Updates cookie and DOM when theme changes
 * - Listens for system preference changes when in "system" mode
 */
export function useTheme() {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const [theme, setThemeState] = useState<Theme>(rootData?.theme ?? "system");

  // Update DOM class based on theme
  const updateDOMClass = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = newTheme === "dark" || (newTheme === "system" && prefersDark);
    // Always toggle both so the resolved class is always present (mirrors root.tsx + blocking script).
    // "system" must resolve to a concrete class, not clear both — else <html> has no theme class.
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
  }, []);

  // Set theme and persist to cookie
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      updateDOMClass(newTheme);

      // Update cookie - merge with existing preferences
      const existingCookie = document.cookie.split("; ").find((row) => row.startsWith(`${PREFERENCE_COOKIE_NAME}=`));

      let preferences: Record<string, unknown> = {};
      if (existingCookie) {
        try {
          // slice past "name=" rather than split("=")[1] — safe when the value contains "=" (encoded JSON)
          preferences = JSON.parse(decodeURIComponent(existingCookie.slice(PREFERENCE_COOKIE_NAME.length + 1)));
        } catch {
          // ignore parse errors
        }
      }

      preferences.theme = newTheme;
      document.cookie = `${PREFERENCE_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(preferences))}; Path=/; SameSite=Lax; Max-Age=31536000`;
    },
    [updateDOMClass]
  );

  // Sync with root loader data when it changes (e.g., after navigation)
  useEffect(() => {
    if (rootData?.theme && rootData.theme !== theme) {
      setThemeState(rootData.theme);
      updateDOMClass(rootData.theme);
    }
  }, [rootData?.theme]);

  // Compute resolved theme (what's actually displayed)
  const resolvedTheme = useResolvedTheme(theme);

  return {
    theme, // The preference: "light" | "dark" | "system"
    resolvedTheme, // What's actually shown: "light" | "dark"
    setTheme,
  };
}

/**
 * Returns the actual theme being displayed ("light" or "dark")
 * For "system" preference, this reflects the OS setting
 */
function useResolvedTheme(theme: Theme): "light" | "dark" {
  // Use consistent initial state for SSR - actual value set in useEffect
  const [systemPreference, setSystemPreference] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Set initial value from system preference after hydration
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPreference(mediaQuery.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (theme === "system") {
    return systemPreference;
  }
  return theme;
}
