/**
 * Reconcile the shiplog repo whitelist against reality on GitHub.
 *
 * Answers two questions the opt-in whitelist can't answer on its own:
 *   1. Which repos have I committed to recently that AREN'T in PROJECTS_CONFIG yet?
 *      (their commits are being silently dropped from shiplogs)
 *   2. Which repos in PROJECTS_CONFIG are now archived or deleted on GitHub?
 *      (stale entries worth pruning)
 *
 * It never edits config — it prints a report plus ready-to-paste PROJECTS_CONFIG
 * entries so you stay in control. Opt-in safety is preserved.
 *
 * Usage:
 *   bun run scripts/reconcile-shiplog-repos.ts [--weeks N]   (default: 12)
 *
 * Requires in env (.env or .env.vercel): GITHUB_PAT, GITHUB_AUTHOR_EMAIL
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.vercel" });

import {
  fetchAllCommitsForDateRange,
  groupCommitsByRepo,
  getRepoStatus,
  type RepoStatus,
} from "~/lib/shiplog/github-service.server";
import { PROJECTS_CONFIG } from "~/lib/projects/projects-config";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
function getArg(flag: string): string | null {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

const weeksArg = getArg("--weeks");
const weeks = weeksArg ? parseInt(weeksArg, 10) : 12;
if (isNaN(weeks) || weeks < 1) {
  console.error("Invalid --weeks value. Must be a positive integer.");
  process.exit(1);
}

const { GITHUB_AUTHOR_EMAIL: AUTHOR_EMAIL } = shiplogEnv;

// ---------------------------------------------------------------------------
// Config-derived lookups (SSOT = PROJECTS_CONFIG)
// ---------------------------------------------------------------------------
/** Every repo identifier known to config (whitelisted or not). */
const configuredRepos = new Map<string, { whitelisted: boolean; project: string }>(
  PROJECTS_CONFIG.flatMap((p) =>
    p.repos.map((r) => [r.identifier, { whitelisted: Boolean(r.shiplogWhitelisted), project: p.slug }] as const)
  )
);

/** Turn "adpharm/foo-bar-api" into a scaffolded PROJECTS_CONFIG entry. */
function scaffoldEntry(identifier: string, commitCount: number): string {
  const repoName = identifier.split("/")[1] ?? identifier;
  const slug = repoName.replace(/\./g, "-").toLowerCase();
  const displayName = repoName
    .replace(/[-_.]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return `  {
    slug: "${slug}",
    name: "${displayName}",
    description: "TODO", // ${commitCount} commit(s) in the last ${weeks} weeks
    repos: [
      {
        identifier: "${identifier}",
        displayName: "${displayName}",
        description: "TODO",
        shiplogWhitelisted: true,
      },
    ],
  },`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - weeks * 7);

  console.log(`\n=== reconcile-shiplog-repos ===`);
  console.log(`Window: ${start.toISOString().split("T")[0]} → ${end.toISOString().split("T")[0]} (${weeks} weeks)`);
  console.log(`Author: ${AUTHOR_EMAIL}\n`);

  // 1. What have I actually committed to?
  const commits = await fetchAllCommitsForDateRange(AUTHOR_EMAIL, start, end);
  const byRepo = groupCommitsByRepo(commits);

  const untrackedRaw: { id: string; count: number }[] = []; // committed to, not in config at all
  const notWhitelisted: { id: string; count: number; project: string }[] = []; // in config, flag off

  for (const [id, repoCommits] of byRepo) {
    const cfg = configuredRepos.get(id);
    if (!cfg) {
      untrackedRaw.push({ id, count: repoCommits.length });
    } else if (!cfg.whitelisted) {
      notWhitelisted.push({ id, count: repoCommits.length, project: cfg.project });
    }
  }
  untrackedRaw.sort((a, b) => b.count - a.count);
  notWhitelisted.sort((a, b) => b.count - a.count);

  // 2. Resolve GitHub status for configured repos (stale check) AND untracked repos
  // (so archived ones don't masquerade as "commits being dropped"). One pooled lookup,
  // batched to avoid bursting into GitHub's secondary rate limit.
  const idsToCheck = [...new Set([...configuredRepos.keys(), ...untrackedRaw.map((r) => r.id)])];
  const statusById = new Map<string, RepoStatus>();
  const BATCH = 5;
  for (let i = 0; i < idsToCheck.length; i += BATCH) {
    const batch = idsToCheck.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(async (id) => [id, await getRepoStatus(id)] as const));
    results.forEach(([id, status]) => statusById.set(id, status));
  }

  // Untracked → active (real signal: add these) vs archived/deleted (informational, ignore).
  const untracked = untrackedRaw.filter((r) => statusById.get(r.id) === "active");
  const untrackedDead = untrackedRaw
    .filter((r) => statusById.get(r.id) !== "active")
    .map((r) => ({ ...r, status: statusById.get(r.id)! }));

  const stale = Array.from(configuredRepos.entries())
    .filter(([id]) => statusById.get(id) !== "active")
    .map(([id, cfg]) => ({ id, status: statusById.get(id)!, ...cfg }));

  // -------------------------------------------------------------------------
  // Report
  // -------------------------------------------------------------------------
  console.log("─".repeat(72));
  console.log(`\n📥 UNTRACKED — committed to, not in PROJECTS_CONFIG (commits being dropped):\n`);
  if (untracked.length === 0) {
    console.log("   none — every active repo is tracked ✓\n");
  } else {
    untracked.forEach((r) => console.log(`   • ${r.id}  (${r.count} commits)`));
    console.log(`\n   Paste into PROJECTS_CONFIG (fill in slug/name/description):\n`);
    console.log(untracked.map((r) => scaffoldEntry(r.id, r.count)).join("\n"));
    console.log();
  }

  if (untrackedDead.length > 0) {
    console.log(`   (ignoring ${untrackedDead.length} archived/deleted untracked repo(s) — no action needed:`);
    untrackedDead.forEach((r) => console.log(`      · ${r.id} [${r.status}], ${r.count} commits`));
    console.log("   )\n");
  }

  console.log("─".repeat(72));
  console.log(`\n⚪ IN CONFIG, NOT WHITELISTED — flip shiplogWhitelisted: true to include:\n`);
  if (notWhitelisted.length === 0) {
    console.log("   none\n");
  } else {
    notWhitelisted.forEach((r) => console.log(`   • ${r.id}  (${r.count} commits, project: ${r.project})`));
    console.log();
  }

  console.log("─".repeat(72));
  console.log(`\n🗑️  STALE — in config but archived/deleted on GitHub (candidates to prune):\n`);
  if (stale.length === 0) {
    console.log("   none — all configured repos are live ✓\n");
  } else {
    stale.forEach((r) =>
      console.log(`   • ${r.id}  [${r.status}]  project: ${r.project}${r.whitelisted ? "" : " (not whitelisted)"}`)
    );
    console.log();
  }

  console.log("─".repeat(72));
  console.log(
    `\nSummary: ${untracked.length} untracked · ${notWhitelisted.length} not-whitelisted · ${stale.length} stale\n`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ Reconcile failed:", err);
  process.exit(1);
});
