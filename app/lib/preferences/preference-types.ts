export type SidebarWidth = number;

export type Theme = "light" | "dark" | "system";

export type UserPreferences = {
  sidebarWidth: SidebarWidth;
  theme: Theme;
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  sidebarWidth: 240,
  theme: "system",
};

export const SIDEBAR_WIDTH_CONSTRAINTS = {
  min: 200,
  max: 400,
  default: 240,
} as const;

export const THEME_VALUES: Theme[] = ["light", "dark", "system"] as const;
