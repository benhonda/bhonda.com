---
name: add-and-commit
description: Add and commit changes, update changelog & readme.
---

Quick add + commit of ALL pending changes (except out of scope below). **No typecheck, no fix, no lint** — this is a stenographer, not a reviewer. Keep it quick. Changes may be ongoing - be aware.

File locations: @CHANGELOG.md , @README.md

## What to do

1. `git status` + `git diff` to see what's pending (anywhere in the tree, not just cwd).
2. Group the diff into logical commits. **Break it up if the changes are unrelated** — separate concerns get separate commits. One commit if everything coheres.
3. For each commit: stage the relevant files by name (no `git add -A`), update the **nearest** CHANGELOG.md with a tight entry (see _Which changelog_ below), commit.
4. Update README.md only if a pending change makes it factually wrong. Don't polish it.

## Which changelog — nearest wins (monorepos)

A monorepo has a **root** CHANGELOG.md and often **per-project** ones (`apps/x/CHANGELOG.md`, `packages/y/CHANGELOG.md`). Route each entry to the **nearest** changelog walking up from the changed files:

- A commit's changes live under one project → log to **that project's** changelog, not the root.
- Changes span multiple projects → log to **each** affected project's changelog (and prefer splitting into per-project commits — see _Breaking up commits_).
- Changes are genuinely repo-wide (root tooling, `Taskfile.yml`, top-level config) or no nested changelog exists for that path → log to the **root** CHANGELOG.md.

Don't create new changelog files — only update ones that already exist; otherwise fall back to the root.

## CHANGELOG.md entries — tight, not novels

One sentence. Type prefix + what shipped. Skip the _why-it-matters_ essay; the diff and commit message carry the rest.

```markdown
## YYYY-MM-DD

- feat: `/v2` landing page composed from binder components.
- fix: `FlowStoryboard` skyline-packs branches so sibling sub-flows stop overlapping.
- refactor: `ImportPreview` always-editing — top bar reads `Cancel · EDITING · Save`.
```

**Prefixes:** `feat:` `fix:` `refactor:` `docs:` `chore:`

**Rules:**

- One line per change. ~120 chars max. If you need a second clause, you're writing a novel — cut it.
- Name the artifact (component, route, file, flag). No vague "improved X".
- Today's date as `## YYYY-MM-DD`. Append under today if the section exists.
- Skip pure styling/spacing/font tweaks. Skip internal renames. Skip anything a `git log` glance would cover.

**Test:** if the line wouldn't help future-Ben remember what changed in one scan, drop it.

## Breaking up commits

Examples of when to split:

- Design-system change + an unrelated docs update → two commits.
- Bug fix + a new feature on a different surface → two commits.
- Skill/tooling chore mixed with product code → split the chore out.
- Changes in two different projects of a monorepo → split per project, so each lands with its own changelog entry.

Don't split for the sake of it. A feature that touches 8 files is still one commit.

## Out of scope

- ❌ typechecking, lint, formatters, test runs
- ❌ "fixing things up while I'm here"
- ❌ pushing to remote
- ❌ creating PRs
- ❌ Untracked files that look like scratch/temp (`Untitled-*`, `*Write-up*.md`, cloned reference repos, personal notes) — leave them, note in the wrap-up. Ask only on genuinely ambiguous in-progress dirs.
