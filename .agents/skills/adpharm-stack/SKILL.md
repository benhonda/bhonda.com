---
name: adpharm-stack
description: >-
  Build and extend Adpharm's React Router 7 + Vercel + AWS web-app stack the way
  Adpharm builds it. Use this skill WHENEVER working in (or bootstrapping) an
  Adpharm / RR7-stack app — anything touching server actions, type-safe routing or
  search params, inline en/fr i18n, the Drizzle DB layer, Google OAuth, AWS access
  (S3 / OIDC), env-var validation, dark/light theming or tweakcn themes,
  the Taskfile, or Terraform/Terragrunt infra. Reach for it even when the
  user doesn't name the stack: "add a login", "set up infra", "make a new action",
  "add a French version", "add a table", "wire up S3", "fix the theme flash", or
  "scaffold a new app" should all trigger it. It encodes the conventions to follow
  and the dead patterns to avoid. For analytics/event instrumentation, defer to the
  silo-analytics skill (HOW to fire events with @adpharm/silo-analytics) and the
  product-tracking skill (WHAT to track and why) — this skill does not cover tracking.
---

# Adpharm Stack

Replaces the old `adpharm-shad` component registry. The registry shipped frozen files
that drifted across every consuming project and needed a republish + re-pull on every
change — a maintenance nightmare. This skill exists to escape that, so **keeping the
skill itself low-maintenance is the point**: lean files, one fact in one place, and
edits that replace a unit rather than pile on top of it.

The stack: **React Router 7 (SSR) on Vercel, Drizzle + Postgres, AWS for
storage/compute, Terraform/Terragrunt for infra, Silo for analytics.**

## Doctrine: structured flexibility, in two tiers

The conventions and nuances in the reference files are **fixed** — they're what Adpharm
has deliberately chosen, and they must survive whatever you build. *How* you satisfy
them splits into two tiers, and telling them apart is the core skill:

- **Engine — copy faithfully.** Bespoke machinery with no best-practice equivalent (the
  generouted route-type generator, the action framework core, the i18n path logic, the
  blocking theme script, the codegen generators). An agent cannot rederive these from a
  snippet, so they ship as real code in `assets/`. **Copy them in verbatim — do not
  refactor, "improve", or re-architect them.** The only permitted edit is a minimal one
  forced by a changed dependency API. If an engine looks wrong, or a non-negotiable seems
  to demand a design change to it, STOP and ask the user — never silently rewrite an
  engine to fit your interpretation; that reintroduces the per-project drift this skill
  exists to kill.
- **Shape — write fresh at current best practice.** Pieces that *do* have a 2026
  best-practice form (a zod env schema, an S3 client, the OAuth HTTP calls, a Drizzle
  table). The reference shows a **Representative shape** — illustration, *not gospel*.
  Verify the current library API and write it yourself; don't paste the snippet as a
  template, and don't reproduce code from training-data memory.

If best practice fights a *how*, follow best practice. If it seems to fight a
*non-negotiable*, stop and ask — don't silently revert to a framework default.

**Don't re-litigate decided conventions.** These choices are already made — apply the
default and keep moving rather than turning them into questions for the user (the DB
driver defaults to Neon; the component base is Base UI). Ask only when the task is
genuinely ambiguous in a way the conventions don't resolve.

## The four pillars (apply to everything)

1. **Simple** — simple is often harder than easy; pay that cost; eliminate code smell.
2. **Best-practice-following** — no cheap wins, no "fix it later"; research the current
   standard before using any library/pattern.
3. **DRY** — single source of truth; minimize duplication.
4. **Type-safe** — let TypeScript carry the burden. No `as any` without explicit
   permission; casting is a last resort.

## Always use the latest dependencies

Nothing in this skill pins a version — deliberately, so you always reach for current
and there's no version churn to maintain. Add deps with `bun add <pkg>@latest` (Bun
repo; never hand-edit `package.json`). After adding a dep, confirm its current API from
its docs rather than assuming the shape you remember.

## Using the engines (`assets/`)

`assets/` mirrors a consuming app where the `~/` alias means `app/`:

- `assets/lib/**` → `app/lib/**`, `assets/hooks/**` → `app/hooks/**`
- `assets/{Taskfile.yml, drizzle.config.ts, vite.config.ts, tsconfig.json,
  react-router.config.ts, components.json}` → **project root** (the build/config shell —
  see `references/project-setup.md`)

Copy the engine files for the subsystems the app uses, install their deps at latest,
then run `task generate` to produce the generated companions the engines import — the
route types (`app/lib/router/routes.ts`), action map (`app/lib/actions/_core/action-map.ts`),
consolidated env, and DB schema barrel. Those generated files are per-project output,
not engine code — never hand-edit them. (The Vite `auto-generators` plugin also runs them
on dev/build — see `references/project-setup.md`; `task generate` is the typecheck/CI path,
owned by `references/taskfile.md`.)

## How the reference files are structured (and how to keep them that way)

Every file in `references/` follows one fixed schema so a new rule has exactly one
home: **Read when · Contract · Non-negotiables · Engine · Shape · Verify at latest.**
Non-negotiables are a table whose rows are atomic and keyed, e.g. `| avatar-base64 |
… | … |`.

When you (a future agent) change how something works: **edit the owning unit in place**
— replace the keyed row, don't append a parallel rule that quietly contradicts it. And
keep **one fact in one place**: each cross-cutting fact has a single owner file and
others link to it (AWS identity → `aws-oidc.md`; deployed env-var ownership →
`terraform.md`; the `task generate` pipeline → `taskfile.md`; global guardrails here in
SKILL.md). Never restate a fact in two files — that's how the registry rotted.

## Routing map — read only what you're touching

| Working on… | Read | Engine in `assets/`? |
| --- | --- | --- |
| Bootstrapping / build config — vite, tsconfig, the `~/*` alias, auto-generators | `references/project-setup.md` | ✓ (configs) |
| Writing data — server actions (typed mutations) | `references/actions.md` | ✓ |
| Reading data — loaders vs useSWR + resource routes | `references/data-fetching.md` | — (shape) |
| Type-safe routing (generouted) + type-safe search params | `references/routing.md` | ✓ |
| Bilingual UI, the `/fr` URL convention, inline en/fr content | `references/i18n.md` | ✓ |
| Env-var validation / fail-fast config | `references/env.md` | ✓ (generator) |
| Drizzle DB — client, schemas, the generate/push flow | `references/db.md` | ✓ |
| Google sign-in | `references/auth-google-oauth.md` | — (shape) |
| AWS access — S3 client, local-SSO-vs-Vercel-OIDC credentials | `references/aws-oidc.md` | — (shape) |
| Event tracking, Silo, identify/page/track | `references/analytics-silo.md` | — (shape) |
| Dark/light theme, no-flash blocking script, tweakcn themes | `references/theming.md` | ✓ |
| Adding UI components / shadcn init (Base UI) | `references/components.md` | ✓ (components.json) |
| The Taskfile — `task generate`, guardrails, adding tasks | `references/taskfile.md` | ✓ (Taskfile) |
| Provisioning infra, Vercel + AWS, env-var ownership | `references/terraform.md` | — (shape) |

**Bootstrapping a new app?** First settle two things (`references/project-setup.md`): app at
the repo root vs a subdir, and the project name (recommend `.devcontainer/devcontainer.json`'s
`name`). Then scaffold only the pieces it needs, roughly: `project-setup` +
`taskfile` + `env` → `routing` → `db` → `theming` → (auth + `aws-oidc` if accounts/uploads) →
`actions`/`data-fetching` → `i18n`/`analytics` as required → `terraform` when it's time
to deploy.

## Parallelize multi-subsystem work (it's slow done serially)

Reading references + copying engines + writing shape code for several subsystems one at a
time is the slow path. When a task spans **multiple independent subsystems** (bootstrapping,
or adding several features at once), fan the work out to subagents:

- **One subagent per subsystem** (env, routing, db, theming, auth, …), each handed just
  its reference file and the assets to copy. The subsystems are mostly independent, so they
  run concurrently — launch them in a single batch.
- **Partition writes so agents don't collide.** Each subagent owns a disjoint file set —
  its own `app/lib/<subsystem>/` (+ its `app/hooks/*`). The **orchestrator owns the shared
  integration files**: `app/root.tsx`, `app/routes.ts`, `app/app.css`, `package.json`
  (dependency installs), `Taskfile.yml`, the **cross-cutting foundation modules**
  (`app/lib/logger`, `readable-error`, `types/type-utils`, `utils`/`cn`) — place these in
  Phase 0 so subagents import rather than recreate them — **and the route tree
  `app/routes/**` + shared `app/components/**`** (where auth/i18n/theming integration lands).
- **Fix cross-subsystem contracts before fanning out.** When a shape subsystem imports
  another (auth → `usersTable` from db, auth/db → env modules), write the exact export name
  + path into each subagent's brief so concurrently-written files line up. Subagents don't
  `bun add` — they report their deps (`@latest`, runtime/dev) for the orchestrator's single install.
- **Then sequence the integration phase yourself**: wire the shared files, install all
  deps once, and run `task generate` then `task typecheck` **once** at the end — not per
  subagent.
- **Don't fan out a single-subsystem task** — the coordination overhead isn't worth it;
  just do it directly.

## Why these abstractions exist (don't revert them to defaults)

They're **AI-shaped**: designed so an agent writes correct code first try. A good one is
**local** (everything at the call site), **explicit** (no hidden magic), **constraining**
(the wrong thing won't type-check), **self-teaching** (signatures guide you), and
**loud** (failures surface immediately). When you extend the stack, redesign along these
properties rather than collapsing to a framework default — a raw `<a href>`, a bare
`process.env.FOO`, or an untyped `fetch('/api/...')` is a regression even though it
"works". Each reference file names the properties its abstraction protects.

## Deliberately NOT in this stack

- **No custom form config/generator.** Build forms with React Router's native form
  handling + the actions framework (`references/actions.md`) + zod. Compose plain inputs.
- **Components use shadcn defaults — the one place defaults are correct.** No custom CVA
  variants; add components with the current shadcn CLI on the **Base UI** base and style
  via theme variables — see `references/components.md` (CSS in `references/theming.md`),
  don't fork component source. (The "don't revert to defaults" rule is about the *stack
  abstractions* above — components are the exception.)
- **No EventBridge.** The event-bus machinery is gone — no module, no env vars, no
  `generate-jobs`. If async/event work is genuinely needed, ask the user.

## Global guardrails (owned here)

- Typecheck before done: `task typecheck` (it runs `task generate` first), else
  `bun run typecheck`. Match existing tooling (`Taskfile.yml` → `task`, `bun.lock` → bun).
- Infra: verify with `task tfplan` / `terragrunt plan`; a clean plan is the only "done".
  **Never** run `apply`.
- **Never** start a dev server (`task dev`/`bun run dev`/etc.) without explicit permission.
- **Never** run a Drizzle migration or `db:push` without explicit permission
  (see `references/db.md`).
- One-offs are tasks too — never hand over a bare `bun run …`/`terragrunt …` for a throwaway;
  use the dated `tmp-<slug>` convention (owned by `references/taskfile.md`).
