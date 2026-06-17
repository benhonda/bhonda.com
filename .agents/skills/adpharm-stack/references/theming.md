# Dark/light theming (no-flash) + tweakcn themes

A three-mode (light/dark/system) theme system that is SSR-correct with **no flash of
the wrong theme**, cookie-persisted, expressed via the CSS `light-dark()` function.

**Read when:** adding theming, fixing a theme flash, building a theme toggle, or
applying a tweakcn color scheme.

## Contract
- Modes `light` / `dark` / `system` (default). Resolved theme is applied as a class on
  `<html>` and via `light-dark()` — no duplicated `.dark` variable blocks.
- The correct theme is present **before first paint** on every load, then stays reactive
  to OS changes and user toggles. Preference persists in a cookie the server reads for SSR.

## Non-negotiables
| key | rule | why |
| --- | --- | --- |
| blocking-script | a `<head>` inline script via `dangerouslySetInnerHTML`, **no defer/async**, sets the `dark`/`light` class on `<html>` before paint | kills the flash for system-dark users (the server can't know their OS pref); a `useEffect` runs too late |
| cookie-format | cookie `user_preferences`, JSON (theme under `.theme`), `Path=/; SameSite=Lax`, ~1yr; parse by slicing past `name=` (not `split("=")`) | encoded JSON can contain `=` |
| class-on-html | the theme class lives on `<html>` (set in the root layout from the loader) | SSR consistency |
| light-dark-single-source | values are `--x: light-dark(<light>, <dark>)`; keep `@custom-variant dark` + the force-mode rules; **no `.dark { --x: … }` override block** | one source per variable (DRY) |
| use-theme-return | `useTheme()` → `{ theme, resolvedTheme, setTheme }`; resolved system pref syncs in a `useEffect` after hydration | `theme`=preference, `resolvedTheme`=shown; avoids hydration mismatch |

## tweakcn → app
Convert tweakcn.com CSS (a `:root {}` light block + a `.dark {}` dark block) **into
`light-dark()`** in the app stylesheet: differing values → `light-dark(light, dark)`,
identical → the bare value; if a var already uses `light-dark()`, replace the whole
value; **delete the separate `.dark { … }` variable-override block** afterward (keep
only the force-mode `.dark`/`.light` utility rules + `@custom-variant dark`); add the
required infra if missing; then typecheck.

## Engine — copy faithfully
`assets/lib/theme/blocking-theme-script.ts`, `assets/hooks/use-theme.ts`,
`assets/lib/preferences/{preference-types.ts, preference-cookie.server.ts}`. Placement +
deps: SKILL.md. Adjust only if a current dep API forces it.

## Shape — write fresh (illustration, not gospel)
```tsx
// root: read pref in loader, render the blocking script in <head>
const prefs = getPreferencesFromRequest(request);   // from the engine
<html className={prefs.theme === "system" ? "" : prefs.theme}>
  <head><script dangerouslySetInnerHTML={{ __html: blockingThemeScript }} /></head>
```
```css
:root { color-scheme: light dark; --background: light-dark(oklch(1 0 0), oklch(0.2 0 0)); }
:root.light, .light { color-scheme: light only; }
:root.dark,  .dark  { color-scheme: dark only; }
@custom-variant dark { &:where(.dark, .dark *);
  @media (prefers-color-scheme: dark) { &:where(:not(.light, .light *)) } }
```

**Cold start (fresh app, `shadcn init` blocked / no tweakcn yet — the common
non-interactive case):** don't block on init. Author `app.css` directly from the shadcn
`baseColor` token set (`base-vega` / gray) in `light-dark()` form, and use a
dependency-free `<button>` toggle for bootstrap — upgrade to a shadcn dropdown-menu after
`shadcn add`.

## Verify at latest
- **`light-dark()` + `@custom-variant`** — current browser support + current Tailwind
  (v4+) custom-variant syntax.
- **Theme toggle UI** — current shadcn components (e.g. dropdown-menu) + `lucide-react`;
  don't fork component source (components use shadcn defaults — see SKILL.md).
