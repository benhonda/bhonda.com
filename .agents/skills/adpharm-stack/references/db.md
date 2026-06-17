# Database — Drizzle + Postgres (Neon)

The data layer: a server-only Drizzle client, one schema file per domain, consolidated
by a generator, with schema changes applied via `db:push` (no migrations).

**Read when:** adding/changing a table, querying the DB, or wiring the DB client.

## Contract
- A single server-only `db` client (Drizzle over the Neon HTTP serverless driver),
  connection string from validated env.
- Tables are defined one file per domain under `lib/db/schemas/`; a generator
  consolidates them into a barrel that `drizzle-kit` and the app import.
- Schema changes are pushed with `drizzle-kit push` — there are no migration files.

## Non-negotiables
| key | rule | why |
| --- | --- | --- |
| server-singleton | the client is `*.server.ts`, instantiated once, imported only in server code | one connection path; never reaches the client bundle |
| env-validated-url | `DATABASE_URL` comes from validated env | fail-fast config — owned by `references/env.md` |
| neon-default | default to Neon (the engine ships `neon-http`); don't make the Postgres host a scaffolding question | it's a one-file driver swap if the project is *explicitly* not on Neon — not a decision worth interrupting the user for |
| one-file-per-domain | one schema file per domain in `lib/db/schemas/` (`auth-schema.ts`, …) | the generator scans this; keeps schemas local |
| generated-barrel | `lib/db/schema.ts` is generated (`task generate`), never hand-edited | SSOT for the consolidated schema |
| timestamps-helper | reuse the shared `timestamps` helper for `created_at`/`updated_at` | DRY across tables |
| push-not-migrations | apply schema with `task db:push` (drizzle-kit push); no migration files, no rollback | intentional simplicity for this stack |
| push-needs-permission | permission required before `db:push`/migrations — **global guardrail, owned by SKILL.md**; locally `db:push` prompts to confirm `DATABASE_URL` | the prohibition lives once (SKILL.md); this row adds only the db-local confirm mechanism |

## Engine — copy faithfully
`assets/lib/db/{index.server.ts, schema-utils.ts, schema.generate.ts}`,
`assets/lib/env/db-env.server.ts` (validated `DATABASE_URL` the client imports — satisfies
`env-validated-url`), and `assets/drizzle.config.ts` (→ project root).
`assets/lib/db/schemas/auth-schema.ts` ships as a worked example of the table convention —
adapt it. `task generate` produces `app/lib/db/schema.ts`. Placement + deps: SKILL.md;
pipeline: `references/taskfile.md`.

## Shape — write fresh per table (illustration, not gospel)
```ts
// lib/db/schemas/billing-schema.ts
import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { timestamps } from "~/lib/db/schema-utils";
export const invoicesTable = pgTable("invoices", {
  ...timestamps,
  id: uuid().defaultRandom().primaryKey(),
  status: text({ enum: ["draft", "paid"] }).notNull(),
});
// query in a server handler
import { db } from "~/lib/db/index.server";
const rows = await db.select().from(invoicesTable);
```

## Tasks — append to the project Taskfile (core lives in `references/taskfile.md`)
The schema-barrel generator runs via the core `task generate` pipeline (`generate-db`). The
one db-specific operational task is the schema push — interactive + prompted, never silent:
```yaml
db-push:
  desc: Push the Drizzle schema to the DB (drizzle-kit push) — NO migration files
  aliases: [push, db:push, drizzle-push]
  interactive: true
  prompt: "Before pushing schema changes, double-check DATABASE_URL — is it correct?"
  cmds:
    - bunx drizzle-kit push
```

## Verify at latest
- **drizzle-orm** + **drizzle-kit** — current `pg-core` builders and `defineConfig`.
- **@neondatabase/serverless** + `drizzle-orm/neon-http` — confirm the current Neon
  adapter wiring (if the app isn't on Neon, swap to the current driver for its Postgres
  host while keeping the server-singleton + env-validated contract).
