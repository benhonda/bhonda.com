import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTheme } from "~/hooks/use-theme";
import type { Theme } from "~/lib/preferences/preference-types";

const NEXT_THEME: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };
const THEME_ICON = { system: MonitorIcon, light: SunIcon, dark: MoonIcon } satisfies Record<Theme, unknown>;

/** One button that cycles system → light → dark. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = THEME_ICON[theme];
  const label = `Theme: ${theme}. Switch to ${NEXT_THEME[theme]}.`;

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(NEXT_THEME[theme])} aria-label={label} title={label}>
      <Icon />
    </Button>
  );
}
