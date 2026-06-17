import type { LoaderFunctionArgs } from "react-router";

/**
 * Supported language codes
 */
export type Language = "en" | "fr";

/**
 * Parse language parameter from React Router params
 *
 * This function handles the language parameter that comes from the ($lang) route segment.
 * Since English URLs have no prefix (they're stripped), only French URLs will have
 * a language parameter.
 *
 * @param params - React Router params object
 * @returns Language code ("en" or "fr")
 */
export function parseLangParam(params: LoaderFunctionArgs["params"]): Language {
  const lang = params.lang;

  // If no lang param, it's English (since English prefixes are stripped)
  if (!lang) {
    return "en";
  }

  // Only "fr" should be present as a param
  if (lang === "fr") {
    return "fr";
  }

  // If somehow "en" is passed as a param, it should be treated as English
  // but this shouldn't happen in normal flow since English prefixes are stripped
  if (lang === "en") {
    return "en";
  }

  // Default to English for any other case
  return "en";
}

/**
 * Parse language from a URL path
 *
 * This function analyzes a URL path to determine the language.
 * Since English prefixes are stripped, only French paths will have /fr/ prefix.
 *
 * @param path - URL path to analyze
 * @returns Language code ("en" or "fr")
 */
export function parseLangFromPath(path: string): Language {
  // Normalize the path
  const normalizedPath = path.toLowerCase();

  // Check for French prefix
  if (normalizedPath === "/fr" || normalizedPath.startsWith("/fr/")) {
    return "fr";
  }

  // Everything else is English (since English prefixes are stripped)
  return "en";
}

/**
 * Get language utilities for server-side rendering
 *
 * This function provides language detection and translation utilities for use
 * in loaders and other server-side code.
 *
 * @param input - Either React Router params or a URL path string
 * @returns Object with language utilities
 */
export function langUtils(input: LoaderFunctionArgs["params"] | string) {
  let lang: Language;

  if (typeof input === "string") {
    // If input is a string, treat it as a URL path
    lang = parseLangFromPath(input);
  } else {
    // If input is params object, parse the language parameter
    lang = parseLangParam(input);
  }

  /**
   * Server-side translation function
   *
   * @param en - English content
   * @param fr - French content
   * @returns Appropriate content based on detected language
   */
  function t<T>(en: T, fr: T): T {
    return lang === "fr" ? fr : en;
  }

  return {
    /**
     * Current language code
     */
    lang,

    /**
     * Translation function (server-side equivalent of client-side t())
     */
    t,

    /**
     * Legacy translation function for backward compatibility
     * @deprecated Use 't' instead
     */
    l: t,

    /**
     * Check if current language is French
     */
    isFrench: lang === "fr",

    /**
     * Check if current language is English
     */
    isEnglish: lang === "en",
  };
}

/**
 * Build a language-aware path
 *
 * This function builds the correct path for a given language, following
 * the convention that English has no prefix and French has /fr/ prefix.
 *
 * @param basePath - Base path without language prefix
 * @param language - Target language
 * @returns Full path with appropriate language prefix
 */
export function buildLangPath(basePath: string, language: Language): string {
  // Ensure basePath starts with /
  const cleanPath = basePath.startsWith("/") ? basePath : `/${basePath}`;

  // French gets /fr prefix, English gets no prefix
  return language === "fr" ? `/fr${cleanPath}` : cleanPath;
}

/**
 * Extract base path from a language-aware path
 *
 * This function removes the language prefix from a path to get the base path.
 *
 * @param fullPath - Full path including language prefix
 * @returns Base path without language prefix
 */
export function extractBasePath(fullPath: string): string {
  // Remove French prefix if present
  if (fullPath.startsWith("/fr/")) {
    return fullPath.slice(3);
  }

  if (fullPath === "/fr") {
    return "/";
  }

  // English paths don't have prefixes, so return as-is
  return fullPath;
}

/**
 * Get alternate language path
 *
 * This function converts a path from one language to another.
 *
 * @param currentPath - Current path (with or without language prefix)
 * @param targetLanguage - Target language
 * @returns Path in target language
 */
export function getAlternateLangPath(currentPath: string, targetLanguage: Language): string {
  const basePath = extractBasePath(currentPath);
  return buildLangPath(basePath, targetLanguage);
}

/**
 * Type guard to check if a string is a valid language code
 */
export function isValidLanguage(value: string): value is Language {
  return value === "en" || value === "fr";
}
