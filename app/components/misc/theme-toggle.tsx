import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useTheme } from "~/hooks/use-theme";
import type { Theme } from "~/lib/preferences/preference-types";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "~/components/ui/dropdown-menu";

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

/**
 * Color scheme dropdown for form pages.
 * Shows current scheme icon, opens dropdown to select light/dark/system.
 */
export function ColorSchemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-8 px-2.5 rounded-full",
            "bg-card border border-border",
            "flex items-center justify-center gap-1",
            "hover:bg-accent active:scale-95",
            "transition-all duration-200 ease-out",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            className
          )}
          aria-label="Change color scheme"
        >
          <div className="relative w-5 h-5">
            <Sun
              className={cn(
                "absolute inset-0 w-5 h-5 transition-all duration-300",
                theme === "light" ? "opacity-100 rotate-0 scale-100 text-amber-500" : "opacity-0 -rotate-90 scale-50"
              )}
            />
            <Moon
              className={cn(
                "absolute inset-0 w-5 h-5 transition-all duration-300",
                theme === "dark" ? "opacity-100 rotate-0 scale-100 text-indigo-400" : "opacity-0 rotate-90 scale-50"
              )}
            />
            <Monitor
              className={cn(
                "absolute inset-0 w-5 h-5 transition-all duration-300",
                theme === "system"
                  ? "opacity-100 rotate-0 scale-100 text-muted-foreground"
                  : "opacity-0 rotate-90 scale-50"
              )}
            />
            {/* Overlapping resolved theme indicator for system mode */}
            {theme === "system" && (
              <span
                className={cn(
                  "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full",
                  "border-2 border-card flex items-center justify-center",
                  resolvedTheme === "dark" ? "bg-indigo-400" : "bg-amber-500"
                )}
              >
                {resolvedTheme === "light" ? (
                  <Sun className="w-2 h-2 text-white" />
                ) : (
                  <Moon className="w-2 h-2 text-white" />
                )}
              </span>
            )}
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as Theme)}>
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value} className="cursor-pointer">
              <Icon
                className={cn(
                  "w-4 h-4 mr-1",
                  value === "light" && "text-amber-500",
                  value === "dark" && "text-indigo-400",
                  value === "system" && "text-muted-foreground"
                )}
              />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
