import { useParams, useNavigate, useLocation } from "react-router";

/**
 * Supported language codes
 */
export type Language = "en" | "fr";

/**
 * Translation options
 */
interface TranslationOptions {
  /** Override the current language */
  langCode?: Language;
}

/**
 * Bilingual content structure
 */
interface BilingualContent<T = React.ReactNode> {
  en: T;
  fr?: T;
}

/**
 * Enhanced i18n hook with better TypeScript support and cleaner API
 */
export function useI18n() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Get the current language from the URL params
   * Default to "en" if no language param is present
   */
  const currentLanguage: Language = getCurrentLanguage(params.lang);

  /**
   * Translate string content
   *
   * @param enStr - English string
   * @param frStr - French string (optional, falls back to English)
   * @param options - Translation options
   * @returns Translated string
   *
   * @example
   * const title = t("Welcome", "Bienvenue");
   * const customTitle = t("Welcome", "Bienvenue", { langCode: "fr" });
   */
  const t = <EN extends string, FR extends string = EN>(
    enStr: EN,
    frStr?: FR,
    options?: TranslationOptions
  ): EN | FR => {
    const targetLang = options?.langCode || currentLanguage;

    if (targetLang === "fr" && frStr) {
      return frStr;
    }

    return enStr;
  };

  /**
   * Translate React component content
   *
   * @param content - Bilingual content object
   * @param options - Translation options
   * @returns Translated React node
   *
   * @example
   * const title = tc({ en: <h1>Welcome</h1>, fr: <h1>Bienvenue</h1> });
   */
  const tc = <T extends React.ReactNode>(content: BilingualContent<T>, options?: TranslationOptions): T => {
    const targetLang = options?.langCode || currentLanguage;

    if (targetLang === "fr" && content.fr) {
      return content.fr;
    }

    return content.en;
  };

  /**
   * Switch to a different language while preserving the current path
   *
   * @param newLanguage - Target language
   *
   * @example
   * switchLanguage("fr"); // Navigate to French version
   * switchLanguage("en"); // Navigate to English version
   */
  const switchLanguage = (newLanguage: Language): void => {
    if (currentLanguage === newLanguage) {
      return; // No change needed
    }

    const newPath = buildLanguagePath(location.pathname, newLanguage);
    const fullPath = `${newPath}${location.search}${location.hash}`;

    navigate(fullPath, { replace: true });
  };

  /**
   * Get the alternate language (opposite of current)
   */
  const alternateLanguage: Language = currentLanguage === "en" ? "fr" : "en";

  /**
   * Check if current language is French
   */
  const isFrench = currentLanguage === "fr";

  /**
   * Check if current language is English
   */
  const isEnglish = currentLanguage === "en";

  return {
    // Core translation functions
    t,
    tc,

    // Language state
    language: currentLanguage,
    alternateLanguage,
    isFrench,
    isEnglish,

    // Navigation
    switchLanguage,

    // Legacy compatibility (deprecated - use 'language' instead)
    /** @deprecated Use 'language' instead */
    lang: currentLanguage,
    /** @deprecated Use 'language' instead */
    langCode: currentLanguage,
    /** @deprecated Use 't' instead */
    l: t,
    /** @deprecated Use 'tc' instead */
    lc: tc,
  };
}

/**
 * Parse language from URL params
 */
function getCurrentLanguage(langParam: string | undefined): Language {
  if (langParam === "fr") {
    return "fr";
  }

  // Default to English for any other case (including "en" or undefined)
  return "en";
}

/**
 * Build the correct path for a given language
 */
function buildLanguagePath(currentPath: string, targetLanguage: Language): string {
  let cleanPath = currentPath;

  // Remove trailing slash (except for root)
  if (cleanPath.endsWith("/") && cleanPath !== "/") {
    cleanPath = cleanPath.slice(0, -1);
  }

  // Remove existing language prefixes
  if (cleanPath.startsWith("/fr/") || cleanPath.startsWith("/en/")) {
    cleanPath = cleanPath.slice(3);
  }

  // Remove language-only paths
  if (cleanPath === "/fr" || cleanPath === "/en") {
    cleanPath = "/";
  }

  // Add language prefix for French (English is the default with no prefix)
  if (targetLanguage === "fr") {
    return `/fr${cleanPath}`;
  }

  return cleanPath;
}

/**
 * Type guard to check if a string is a valid language code
 */
export function isValidLanguage(value: string): value is Language {
  return value === "en" || value === "fr";
}

/**
 * Get language from any URL path
 */
export function getLanguageFromPath(path: string): Language {
  const normalizedPath = path.toLowerCase();

  if (normalizedPath === "/fr" || normalizedPath.startsWith("/fr/")) {
    return "fr";
  }

  return "en";
}
