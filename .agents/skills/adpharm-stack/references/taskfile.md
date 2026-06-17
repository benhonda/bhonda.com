# The Taskfile (core)

`task` is the command surface. The project `Taskfile.yml` is **assembled**: this **core**
(cross-cutting tasks) plus each domain's own task block. **This file owns the codegen
pipeline + the cross-cutting tasks**; domain operational tasks live with their domain.

**Read when:** running stack commands, adding a task, or assembling a project's Taskfile.

## Contract
- The project Taskfile = **core** (here) + appended domain task blocks: `tf*` from
  `references/terraform.md`, `db-push` from `references/db.md`. Names stay flat.
- `task generate` runs every code generator; `task typecheck` depends on it, so types
  always reflect fresh routes/actions/env/db.
- AWS-touching tasks gate on an identity check first.

## Non-negotiables
| key | rule | why |
| --- | --- | --- |
| assembled-flat | the project Taskfile = this core + each scaffolded domain's task block, kept **flat** | **do not** use go-task `includes:` — it namespaces (`tfplan` → `tf:plan`) and breaks the documented command surface |
| domain-owns-ops | a domain's *operational* tasks live in its reference (`tf*` → terraform.md, `db-push` → db.md), not here | dropping a domain takes its tasks with it; no cross-file drift |
| generate-pipeline | `generate` runs `generate-actions/-routes/-env/-db` (each guarded `if [ -f ]`); `typecheck` deps on `generate` | the engines import generated files; guards make trimming a subsystem a zero-edit no-op |
| no-jobs | there is no `generate-jobs` task | EventBridge is cut (SKILL.md) |
| aws-identity-gate | `check-aws-identity` + `login` live here; AWS/TF tasks `deps: [check-aws-identity]` | fail early with a clear message (AWS identity owned by `references/aws-oidc.md`) |
| prompt-on-destructive | destructive tasks are `interactive` with a `prompt:` (e.g. `db-push`, in db.md) | a human confirms before damage |
| alias-convention | tasks carry `desc` + both kebab and `colon:` aliases; helpers `internal: true` | discoverable via `task --list-all`, consistent surface |
| one-offs-are-tasks | a throwaway/one-off script is **still** a `task` — never hand the user a bare `bun run …`/`terragrunt …`; add a dated `tmp-<slug>` block (script in gitignored `scripts/tmp/`), then delete block+script after it runs | one-offs need the same env/AWS/dotenv loading; quarantining + dating them stops scratch code rotting in the tree |

## Engine — copy faithfully (`assets/Taskfile.yml` → project root)
The **core** Taskfile. Then append the task blocks from the domain references you
scaffolded (terraform, db). The codegen generators stay here and are guarded, so you never
edit them when trimming a subsystem. Placement: SKILL.md.

## Shape — adding a task (illustration, not gospel)
```yaml
backfill:
  desc: Backfill X
  aliases: [back-fill]
  deps: [check-aws-identity]        # if it touches AWS
  interactive: true                 # + prompt: "…" if destructive
  cmds:
    - bun run scripts/backfill.ts {{.CLI_ARGS}}
```

## One-offs (temp tasks) — the convention
Agents reach for bare `bun run scratch.ts` / `terragrunt …` on throwaways because a full
task block feels heavy. It isn't optional: a one-off is **still** a task, just a *quarantined,
dated, short-lived* one. The `tmp-sweep` task + commented template ship in `assets/Taskfile.yml`.

**Recipe**
1. Script → `scripts/tmp/<slug>.ts`. Ensure `scripts/tmp/` is **gitignored** (one-offs are
   never committed) — add `scripts/tmp/` to `.gitignore` once.
2. Add a `tmp-<slug>` block, dated, with a `# added <date> — DELETE AFTER RUN` banner and a
   `desc: '[ONE-OFF <date>] … then remove this task + its script'`. `colon:` alias + `deps:
   [check-aws-identity]` if it touches AWS — same rules as any task.
3. Run it: `task tmp-<slug>` (args via `{{.CLI_ARGS}}` → `task tmp-<slug> -- --dry-run`).
4. **Clean up:** delete the block **and** the script. `task tmp-sweep` lists every lingering
   `tmp-*` block + `scripts/tmp/` file (read-only radar) so nothing rots — a non-empty sweep
   is a TODO, not a steady state.

```yaml
tmp-backfill-foo:        # added 2026-01-01 — DELETE AFTER RUN
  desc: '[ONE-OFF 2026-01-01] backfill foo, then remove this task + its script'
  aliases: [tmp:backfill-foo]
  cmds:
    - bun run scripts/tmp/backfill-foo.ts {{.CLI_ARGS}}
```

## Verify at latest
- **go-task v3** — confirm current schema for `requires`/`prompt`/`dir`/`dotenv`/aliases.

## Agent guardrails
The destructive/interactive tasks on this surface — `apply`, the dev server, `db-push`/
migrations — are governed by **SKILL.md → Global guardrails**. See there; not restated here.
