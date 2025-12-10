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
    root.classList.remove("light", "dark");

    if (newTheme === "light" || newTheme === "dark") {
      root.classList.add(newTheme);
    }
    // "system" mode: no class, CSS media query handles it
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
          preferences = JSON.parse(decodeURIComponent(existingCookie.split("=")[1]));
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
