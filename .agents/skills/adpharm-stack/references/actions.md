# Server actions (writes only)

A typed pipeline from a client call to a server handler and back, for **writes
(mutations)**. Reads do **not** go here — see `references/data-fetching.md`.

**Read when:** adding a mutation, wiring a form submit, or any "write something" call.

## Contract
- `useAction(definition)` → `{ submit, data, error, isSubmitting }`, fully typed from the
  definition.
- `submit(input)` POSTs JSON to the **current route's** action; that action is the one
  shared dispatcher (`action_handler`), which looks the action up in a generated map by
  directory name and runs the matching server handler.
- The handler gets zod-validated input and returns a value whose type flows back to
  `data`. Errors return as `{ message_unsafe, message_safe }`, never an unhandled throw.
- After a successful write, RR7 auto-revalidates loaders; refresh SWR-cached reads via
  `mutate()` from `onSuccess` (see `references/data-fetching.md`).

## Non-negotiables
| key | rule | why |
| --- | --- | --- |
| writes-only | actions are for writes/mutations only — no `type:"query"` reads, no client cache here | reads are loaders or useSWR (`references/data-fetching.md`); keeps the action engine small |
| two-file-action | each action = `lib/actions/<name>/action-definition.ts` + `action-handler.server.ts`, co-located | everything about one action in one place (local, self-teaching) |
| dir-name-matches | the directory name equals the definition's `actionDirectoryName` | the filename is the contract; the generator keys off it |
| generated-map | the action map is generated, never hand-edited (run `task generate`) | a missing handler is caught at build, not runtime (loud) |
| single-dispatch | one dispatcher *function* (`action_handler`): `useAction` submits to `"."` and every route that hosts actions does `export const action = action_handler`. Do NOT invent a global `/api/action` endpoint or change the submit target | it's one shared *handler*, not one shared *URL* — no per-action API routes, no engine rewrite |
| revalidate-after-write | after success, let RR7 revalidate loaders automatically; for SWR-cached reads call `mutate(key)` in `onSuccess` | invalidation lives at the call site, not in a bespoke action cache |
| safe-unsafe-errors | server normalizes errors to `{ message_unsafe, message_safe }`: log unsafe, show safe | never leak raw errors; never swallow them |
| dev-loud-guards | keep the hook's dev warnings (e.g. suspected infinite submit loops) | failures surface immediately |

## Engine — copy faithfully (`assets/lib/actions/_core/*`, `assets/hooks/use-action.ts`)
`action-utils(.ts/.server.ts)`, `action-runner.server.ts`, `action-map.generate.ts`, and
the `use-action` hook. `task generate` produces the imported `action-map.ts` (per-project;
never hand-edit). Placement + deps: see SKILL.md; pipeline: `references/taskfile.md`.
Adjust only if a current dep API forces it.

## Shape — write fresh per action (illustration, not gospel)
```ts
// action-definition.ts — output type via phantom generic
export const updateProfile = defineAction<{ ok: true }>()({
  actionDirectoryName: "update-profile",
  inputDataSchema: z.object({ name: z.string().min(1) }),
});
// action-handler.server.ts — default export, typed in/out
export default createActionHandler(updateProfile, async ({ inputData }) => {
  const { name } = parseActionInput(updateProfile, inputData);
  // ...write to the DB...
  return { ok: true } as const;
});
// component
const { submit, data, error, isSubmitting } = useAction(updateProfile, {
  toastOnSuccess: { message: "Saved" },
  onSuccess: () => mutate("/api/profile"),  // refresh the SWR read, if any (loaders auto-revalidate)
});

// wiring: each route that hosts actions re-exports the one dispatcher as its action.
// app/routes/(_app).tsx
import { action_handler } from "~/lib/actions/_core/action-runner.server";
export const action = action_handler;   // useAction submits to "." → hits this
// GOTCHA: from an INDEX route, "." appends ?index and resolves to the index route
// itself — NOT the parent layout. An index route hosting useAction must export the
// dispatcher itself; the layout's action does not cover it.
```
Forms use this + RR7 native form handling — there is no form generator (see SKILL.md).

## Verify at latest
- **zod** — `infer` + current top-level helpers (e.g. `z.email()` vs `z.string().email()`).
- **react-router v7** — `ActionFunctionArgs`, `useFetcher` JSON submit, redirect/`Response`.
- **sonner / use-debounce** — current toast + debounce APIs (`leading` semantics).
