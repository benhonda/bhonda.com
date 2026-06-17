import { useCallback, useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router";
import type { Theme } from "~/lib/preferences/preference-types";
import type { loader as rootLoader } from "../root";

const PREFERENCE_COOKIE_NAME = "user_preferences";

/** Imperatively sets the "dark"/"light" classes on <html>, bypassing root.tsx's stale loader value. */
function applyDOMClass(newTheme: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = newTheme === "dark" || (newTheme === "system" && prefersDark);
  // Mirror root.tsx's behaviour — always toggle both so stale classes don't accumulate
  root.classList.toggle("dark", isDark);
  root.classList.toggle("light", !isDark);
}

export function useTheme() {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const [theme, setThemeState] = useState<Theme>(rootData?.preferences?.theme ?? "system");

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyDOMClass(newTheme);

    // Persist to cookie — merge with existing preferences
    const existingCookie = document.cookie.split("; ").find((row) => row.startsWith(`${PREFERENCE_COOKIE_NAME}=`));
    let preferences: Record<string, unknown> = {};
    if (existingCookie) {
      try {
        // slice past "name=" rather than split("=")[1] — safe when value contains "=" (e.g. encoded JSON)
        preferences = JSON.parse(decodeURIComponent(existingCookie.slice(PREFERENCE_COOKIE_NAME.length + 1)));
      } catch {
        // ignore parse errors
      }
    }
    preferences.theme = newTheme;
    document.cookie = `${PREFERENCE_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(preferences))}; Path=/; SameSite=Lax; Max-Age=31536000`;
  }, []);

  // Sync local state when loader data changes (e.g. after navigation re-runs the loader).
  // root.tsx will have already applied the correct class from the new loader value.
  const loaderTheme = rootData?.preferences?.theme;
  useEffect(() => {
    if (loaderTheme) setThemeState(loaderTheme);
  }, [loaderTheme]);

  const resolvedTheme = useResolvedTheme(theme);

  return {
    theme, // Preference: "light" | "dark" | "system"
    resolvedTheme, // What's actually rendered: "light" | "dark"
    setTheme,
  };
}

function useResolvedTheme(theme: Theme): "light" | "dark" {
  // Must match the server's initial value ("light") to avoid hydration mismatch.
  // The real OS preference is synced in useEffect after hydration.
  const [systemPreference, setSystemPreference] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    // Sync immediately after hydration, then listen for changes
    setSystemPreference(mediaQuery.matches ? "dark" : "light");
    const handler = (e: MediaQueryListEvent) => setSystemPreference(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return theme === "system" ? systemPreference : theme;
}
