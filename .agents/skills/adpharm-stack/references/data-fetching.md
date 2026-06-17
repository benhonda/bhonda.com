# Reading data — loaders vs useSWR (writes → actions)

How to **read/list** data. SSR-first as the baseline, but client loading with `useSWR` +
a dedicated resource route is a first-class path, not an exception. Writes never go here —
they use `references/actions.md`.

**Read when:** fetching or listing data for a page or component.

## Contract
- Three lanes, chosen by *what the data needs* (not just speed):
  - **Server HTML (SEO / shareable / above-the-fold / critical) → RR7 `loader`.**
  - **Client-interactive / non-critical / live / post-mount → `useSWR` + a resource route.**
  - **Any write → the action framework.**
- "API routes" here means **RR7 resource routes** (a route module with a `loader`, no
  default export) returning JSON, consumed by SWR.

## Non-negotiables
| key | rule | why |
| --- | --- | --- |
| ssr-data-loader | data that must be in the server HTML (SEO, shareable, critical/above-the-fold) is fetched in a route `loader` | SSR'd, no client waterfall, auto-revalidated after writes |
| slow-defer | if a loader is slow, `defer`/stream it (`Await` + `Suspense`) — don't drop to client fetch just because it's slow | keeps SSR; "slow" is not the trigger to abandon it |
| client-data-swr | client-interactive / non-critical / live / post-mount data (lists, filters, polling, infinite scroll, dashboards behind auth) → `useSWR` + a resource route | snappy shell, free caching/dedup/revalidation; this is a common path, not a fallback |
| typed-fetcher | SWR reads go through a typed fetcher that shares the resource route's loader return type | reads stay type-safe — don't regress the type-safety pillar |
| resource-route | "API routes" are RR7 resource routes (loader-only module returning JSON); reuse the same auth/session/env helpers as page loaders | one server-data path, consistent auth |
| writes-not-here | never write through a read path; mutations go through `references/actions.md` | reads and writes are separate by design |

## Engine
None — this is Shape. **Don't build a bespoke read cache**; `useSWR` is a maintained
library (install `swr@latest`). Consider TanStack Query only as a deliberate alternative.

## Shape — write fresh (illustration, not gospel)
```ts
// app/routes/api.projects.ts — a resource route (loader only, returns JSON)
export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);                 // same auth helper as page loaders
  return Response.json(await listProjects()); // its return type is the read's contract
}
export type ProjectsResponse = Awaited<ReturnType<typeof loader>>; // share for typing

// app/hooks/use-projects.ts — typed SWR read
import useSWR from "swr";
const fetcher = <T>(url: string) => fetch(url).then((r) => r.json() as Promise<T>);
export const useProjects = () => useSWR("/api/projects", fetcher<Project[]>);

// SSR + live: seed SWR from a page loader so first paint is server-rendered
useSWR("/api/projects", fetcher, { fallbackData: loaderData.projects });
```

## Verify at latest
- **swr** — current `useSWR`/`mutate` API + `fallbackData`. (TanStack Query if chosen.)
- **react-router v7** — resource-route shape, and `defer`/`Await`/`Suspense` for streaming
  slow loader data.
