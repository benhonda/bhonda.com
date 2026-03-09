# AI Code Assistant Guidelines

YOUR GUIDING PRINCIPLE: You are an expert who double-checks things, you are skeptical, and you do research. I am not always right. Neither are you, but we both strive for accuracy

**CRITICAL: Every instruction in this document is important. Read & understand them deeply. Do not assume or hallucinate.**

---

## 🚨 Core Principles - YOUR HOLY COMMANDMENTS

1. **Default to Planning mode (where appropriate):** Do not implement code until you have presented a plan and received explicit approval from the user.
2. **When implementing a plan, be smart:** Don't do anything you're not supposed to. Be typesafe and always follow the DRY principle where you can.
3. **Ask Clarifying Questions:** It is always better to ask questions to resolve ambiguity than to guess and be wrong - But before you ask clarifying questions, make sure you have tried to find the answer to your question yourself in the code base.
4. **BE CONCISE:** SACRAFICE GRAMMER FOR CONCISION.
5. **Inline comments are encouraged:** Always consider using inline and jsdoc-style comments where appropriate.
6. ALWAYS opt for the solution that eliminates the most code smell.

---

## ⚙️ Technical Guidelines & Rules

### General Tooling

- **Infer, Don't Assume:** Be project-agnostic. **Determine the correct tooling by inspecting the project's context.**
  - If `Taskfile.yml` exists, use `task`.
  - If `bun.lock` exists, use `bun` for all package management (`bun install`, `bun run`, `bunx`).
  - If `package-lock.json` or `yarn.lock` exists, use `npm` or `yarn` respectively.

### Coding Style & Best Practices

- **Research Current Standards:** For any new technology, library, or pattern, perform a web search to ensure you are using modern, best practices for the current year (2026).

### TypeScript

- **No `as any`:** Never use `as any` in TypeScript without explicit user permission.
- **Type Checking:** After making any code changes, always run the project's type-checking script (e.g., `task typecheck` (if available) / `bun run typecheck`).

### Infrastructure as Code (IaC)

- **ALWAYS verify any IaC changes:** Verify your IaC code changes with `task tfplan` (if available) / `terragrunt plan` / `terraform plan`
- **AWS Policies:** When creating IAM policies, **always use ALLOW policies.** Never create a DENY policy.

---

## DO NOT DO THESE EVER

1. **Never Hallucinate:** If you are uncertain about any detail, ask the user for clarification. Do not invent information.
2. **Never Assume User Intent:** Always confirm your understanding of the user's goal before taking action or writing code.
3. **NO BACKWARDS COMPATIBILITY, NO FALLBACKS:** Unless explicitly told to do otherwise, never maintain backwards compatibility in development, and don't add fallbacks.
4. **NEVER RUN:**
   - ❌ Infra "apply" commands like `task tfapply` / `terraform apply` / `terragrunt apply`
   - ❌ Dev server commands like `task start` / `bun run dev` / `npm start` / `npm run dev`
5. **No `as any`:** Never use `as any` in TypeScript without explicit user permission.
6. **NO DRIZZLE MIGRATIONS OR SCHEMA PUSHING:** Never create an SQL migration or push a drizzle schema directly without explicit permission.

---

# Project-specific settings

Reference [./CLAUDE-rr7-stack.md](./CLAUDE-rr7-stack.md) for details on how the stack works and UI development.

We use Bun. Not NPM.

This is a public repo. Do not include and private information anywhere in the codebase.

No migrations, no backwords compatibility. Don't ask. I will tell you directly if I ever want those.

## Notable commands

- Verify infra changes with `task tfplan ENV=staging` where `ENV` can be `staging` or `production`

## Weekly Shiplog System

Automated system that generates weekly "shiplogs" (development summaries) from git commits.

**How it works:**

- Vercel cron hits `/api/cron/weekly-shiplog` every Sunday 2pm ET
- Fetches commits for the full ISO week (Monday-Sunday) across all repos by author (bhonda89@gmail.com)
- Filters repos using whitelist from `app/lib/shiplog/repo-whitelist.ts`
- Sends commits to Claude for synthesis into blog post with titleText/previewText/introText
- Uploads to S3 as markdown with frontmatter

**ISO Week Numbering (ISO 8601):**

- Weeks run **Monday (start) to Sunday (end)**
- Week 1 contains the first Thursday of the year
- Weeks can span year boundaries (e.g., Dec 29, 2025 might be in 2026-W01)
- Example: `2025-W50` = Monday Dec 8 to Sunday Dec 14, 2025

**Filename format:** `YYYY-WNN.md` (e.g., `2025-W50.md`)
**Slug format:** `YYYY-WNN` (e.g., `2025-W50`)
**Routes:** `/ships/2025-W50`

**Key files:**

- `app/routes/api.cron.weekly-shiplog.ts` - Main cron handler
- `app/lib/shiplog/repo-whitelist.ts` - Editable whitelist with repo display names
- `app/lib/shiplog/github-service.server.ts` - GitHub API integration
- `app/lib/shiplog/claude-service.server.ts` - Claude synthesis
- `app/lib/shiplog/s3-service.server.ts` - S3 upload
- `app/lib/shiplog/date-utils.server.ts` - ISO week calculations
- `app/lib/shiplog/fetcher.server.ts` - CDN fetching
- `vercel.json` - Cron schedule config

**Environment variables:**

- `GITHUB_PAT` - GitHub personal access token
- `CLAUDE_CODE_OAUTH_TOKEN` - Claude Code OAuth token (uses print mode subprocess)
- `S3_BUCKET_NAME` - S3 bucket for shiplogs
- `S3_BUCKET_KEY_PREFIX_NO_SLASHES` - S3 key prefix (environment name: production/staging)
- `CRON_SECRET` - Auth secret for cron endpoint
- `PUBLIC_CDN_URL` - BunnyNet CDN URL (environment-specific)

**Output:**

- Public: `${prefix}/public/ships/2025-W50.md` (frontmatter + content, CDN accessible)
- Internal: `${prefix}/internal/ships/2025-W50.md` (metadata + raw commits, NOT CDN accessible)
- Frontmatter `published_at` field: Sunday (end of ISO week) in YYYY-MM-DD format

**Frontend:**

- List view: Client-side fetch via action (`fetch-shiplogs`) with 5min cache
- Detail view: SSR for SEO via `/ships/2025-W50` route
