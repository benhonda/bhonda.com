import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useRouteLoaderData } from "react-router";
import { THEME_VALUES, type Theme } from "~/lib/preferences/preference-types";
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

/** The preference cookie's JSON, or `{}` when it's absent or unreadable. */
function readPreferencesCookie(): Record<string, unknown> {
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(`${PREFERENCE_COOKIE_NAME}=`));
  if (!cookie) return {};
  try {
    // slice past "name=" rather than split("=")[1] — safe when value contains "=" (e.g. encoded JSON)
    const parsed: unknown = JSON.parse(decodeURIComponent(cookie.slice(PREFERENCE_COOKIE_NAME.length + 1)));
    return typeof parsed === "object" && parsed !== null ? Object.fromEntries(Object.entries(parsed)) : {};
  } catch {
    return {};
  }
}

function isTheme(value: unknown): value is Theme {
  return THEME_VALUES.some((theme) => theme === value);
}

/**
 * Every `useTheme()` caller reads the one preference in the cookie — the same cookie the
 * server renders from — and `setTheme` notifies them all. Per-call `useState` let each
 * caller keep its own copy, so a second consumer (the sonner Toaster) went stale the
 * moment another component toggled the theme.
 */
const listeners = new Set<() => void>();
function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function useTheme() {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  // What SSR rendered from the same cookie — hydration reads this, so it matches.
  const serverTheme = rootData?.preferences?.theme ?? "system";
  const theme = useSyncExternalStore(
    subscribe,
    () => {
      const cookieTheme = readPreferencesCookie().theme;
      return isTheme(cookieTheme) ? cookieTheme : serverTheme;
    },
    () => serverTheme
  );

  const setTheme = useCallback((newTheme: Theme) => {
    applyDOMClass(newTheme);
    // Persist to cookie — merge with existing preferences
    const preferences = { ...readPreferencesCookie(), theme: newTheme };
    document.cookie = `${PREFERENCE_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(preferences))}; Path=/; SameSite=Lax; Max-Age=31536000`;
    listeners.forEach((notify) => notify());
  }, []);

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
