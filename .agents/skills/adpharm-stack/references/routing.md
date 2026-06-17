# Type-safe routing (generouted) + type-safe search params

Compile-time-checked navigation and URL state. No raw string paths, no manual
`URLSearchParams`.

**Read when:** adding routes, navigating/redirecting, or reading/writing query params.

## Routing

### Contract
- **Foundation:** `app/routes.ts` = `flatRoutes()` from `@react-router/fs-routes` is what
  turns the `routes/` file tree into RR7 routes. generouted sits *on top* as a type
  layer — it does not replace this.
- The generouted generator emits `app/lib/router/routes.ts` — a **different file** from
  the `app/routes.ts` config above — exposing a typed `Path` union + `Params` map and
  typed `Link`/`NavLink`/`useNavigate`/`useParams`/`redirect`/`generatePath`.
- Every navigation is compile-checked; an unknown path or wrong param is a type error.

### Non-negotiables
| key | rule | why |
| --- | --- | --- |
| fs-routes-foundation | `app/routes.ts` exports `flatRoutes()` from `@react-router/fs-routes`; the `routes/` tree only becomes routes through it | generouted is just the type layer on top — without this there are no routes |
| generated-types | `app/lib/router/routes.ts` (the generouted type file, distinct from `app/routes.ts`) is generated (`task generate`), never hand-edited | regen scans `routes/`; manual edits get clobbered |
| typed-nav-only | navigate only via the generated wrappers — never `<a href>`/string paths | makes wrong URLs unrepresentable (constraining) |
| file-naming | `$param`→`:param`, `.`→`/`, `(_grp)`=layout/group, `($lang)`=i18n segment | the generator depends on this exact convention |
| i18n-paths | path building respects the en-unprefixed / `/fr` rule | owned by `references/i18n.md`; don't concat `/fr` by hand |

## Search params

### Contract
- A zod schema is the single source of truth for query-param shape + types.
- `parseSearchParams`/`stringifySearchParams` round-trip losslessly (arrays survive);
  `useSearchParams()` exposes typed read + update helpers.

### Non-negotiables
| key | rule | why |
| --- | --- | --- |
| schema-ssot | one zod schema defines params (`SearchParams = z.infer<…>`); read the parsed object, not `.get("x")` | typed, validated access |
| lossless-roundtrip | (de)serialize only via the parse/stringify pair; arrays survive | URL state stays type-correct |
| hook-api | mutate via `updateSearchParams(partial)` (merges, drops null) / `toggleSearchParam(key,val)` | don't mutate the URL directly |

## Engine — copy faithfully
- Routing: `assets/lib/router/{generouted-components.tsx, generouted-generate-routes.ts,
  router-utils.ts, server-responses.server.ts}`. `task generate` produces
  `app/lib/router/routes.ts` (per-project; never hand-edit). Also wire the RR7 route
  config — `app/routes.ts` = `export default flatRoutes() satisfies RouteConfig` (from
  `@react-router/fs-routes` + `@react-router/dev/routes`) — required boilerplate, not
  generouted output.
- Search params: `assets/hooks/use-search-params.ts` + `assets/lib/search-params-utils.ts`
  + `assets/lib/search-params.defaults.ts` (the schema — **edit this per app**) +
  `assets/lib/types/type-utils.ts`.

Placement + deps: SKILL.md. Adjust only if a current dep API forces it.

## Shape — write fresh (illustration, not gospel)
```ts
// routes/(_app).t.$teamSlug.jobs.tsx  → "/t/:teamSlug/jobs"
<Link to="/t/:teamSlug/jobs" params={{ teamSlug }}>Jobs</Link>
throw redirect("/login");                 // in a loader/action
// per-app schema in search-params.defaults.ts
export const searchParamsSchema = z.object({ filters: z.array(z.string()).optional() });
const { searchParamsObj, updateSearchParams, toggleSearchParam } = useSearchParams();
```

## Verify at latest
- **react-router v7** — `useNavigate`/`useParams`/`redirect`/`Link` + `setSearchParams`.
- **@react-router/fs-routes** + **@react-router/dev** — the `flatRoutes()` foundation +
  `RouteConfig` type (install both at latest).
- **generouted approach** — confirm the project's current route-type generation; if a
  better-maintained RR7 type-safe routing approach is now standard, evaluate it but keep
  generated-types + typed-wrappers + no-raw-paths.
- **zod**, and the generator's `prettier`/`glob` deps.
