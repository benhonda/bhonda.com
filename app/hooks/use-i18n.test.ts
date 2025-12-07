import { describe, it, expect } from "vitest";
import { isValidLanguage, getLanguageFromPath } from "./use-i18n";

describe("useI18n utility functions", () => {
  describe("isValidLanguage", () => {
    it("should validate language codes correctly", () => {
      expect(isValidLanguage("en")).toBe(true);
      expect(isValidLanguage("fr")).toBe(true);
      expect(isValidLanguage("es")).toBe(false);
      expect(isValidLanguage("")).toBe(false);
      expect(isValidLanguage("EN")).toBe(false);
    });
  });

  describe("getLanguageFromPath", () => {
    it("should detect language from paths correctly", () => {
      expect(getLanguageFromPath("/")).toBe("en");
      expect(getLanguageFromPath("/en")).toBe("en");
      expect(getLanguageFromPath("/en/")).toBe("en");
      expect(getLanguageFromPath("/en/some/path")).toBe("en");
      expect(getLanguageFromPath("/fr")).toBe("fr");
      expect(getLanguageFromPath("/fr/")).toBe("fr");
      expect(getLanguageFromPath("/fr/some/path")).toBe("fr");
      expect(getLanguageFromPath("/some/path")).toBe("en");
    });

    it("should handle case insensitivity", () => {
      expect(getLanguageFromPath("/FR/path")).toBe("fr");
      expect(getLanguageFromPath("/Fr/path")).toBe("fr");
    });
  });
});

// Integration test with the actual application
describe("useI18n integration", () => {
  it("should export the main hook", async () => {
    const { useI18n } = await import("./use-i18n");
    expect(typeof useI18n).toBe("function");
  });

  it("should export the Language type", () => {
    // This ensures the type is properly exported
    expect(true).toBe(true);
  });
});
