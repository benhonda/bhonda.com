/**
 * Generate a weekly shiplog TSX file from git commits.
 *
 * Usage:
 *   bun run scripts/generate-shiplog.ts [--week N] [--year YYYY]
 *
 * Defaults to the current ISO week/year if --week/--year are omitted.
 *
 * Requires in env (.env or .env.vercel):
 *   GITHUB_PAT, CLAUDE_CODE_OAUTH_TOKEN, GITHUB_AUTHOR_EMAIL
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.vercel" });

import fs from "fs/promises";
import path from "path";
import { fetchCommitsForDateRange } from "~/lib/shiplog/github-service.server";
import { buildShiplogPrompt } from "~/lib/shiplog/shiplog-prompt.server";
import { codeWithClaude } from "~/lib/claude/claude-service.server";
import { getDateRangeFromISOWeek, getISOWeekNumber, getISOWeekYear } from "~/lib/shiplog/date-utils.server";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";

// ---------------------------------------------------------------------------
// Parse CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
function getArg(flag: string): string | null {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

const now = new Date();
const weekArg = getArg("--week");
const yearArg = getArg("--year");
const week = weekArg ? parseInt(weekArg, 10) : getISOWeekNumber(now);
const year = yearArg ? parseInt(yearArg, 10) : getISOWeekYear(now);

if (isNaN(week) || week < 1 || week > 53) {
  console.error("Invalid --week value. Must be 1-53.");
  process.exit(1);
}
if (isNaN(year) || year < 2020) {
  console.error("Invalid --year value.");
  process.exit(1);
}

const MODEL_ID = "claude-sonnet-4-5-20250929";
const { GITHUB_AUTHOR_EMAIL: AUTHOR_EMAIL } = shiplogEnv;
const slug = `${year}-W${String(week).padStart(2, "0")}`;
const outPath = path.resolve(`app/lib/shiplogs/entries/${slug}.tsx`);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\n=== generate-shiplog: ${slug} ===`);

  const { start, end } = getDateRangeFromISOWeek(year, week);
  const publishedAt = end.toISOString().split("T")[0]; // Sunday YYYY-MM-DD

  console.log(`Date range: ${start.toISOString().split("T")[0]} to ${publishedAt}`);
  console.log(`Author: ${AUTHOR_EMAIL}\n`);

  // Check if file already exists
  try {
    await fs.access(outPath);
    console.warn(`⚠️  File already exists: ${outPath}`);
    console.warn("    Delete it first if you want to regenerate.");
    process.exit(1);
  } catch {
    // File doesn't exist — proceed
  }

  // 1. Fetch commits
  console.log("[1/2] Fetching commits from GitHub...");
  const repoCommits = await fetchCommitsForDateRange(AUTHOR_EMAIL, start, end);
  const totalCommits = repoCommits.reduce((n, r) => n + r.commits.length, 0);
  console.log(`    ✓ ${repoCommits.length} repos, ${totalCommits} commits\n`);

  // 2. Synthesize + write via Claude
  console.log("[2/2] Synthesizing and writing with Claude...");
  const prompt = buildShiplogPrompt({ repoCommits, startDate: start, endDate: end, outPath, slug, week, year, publishedAt });
  const claudeOutput = await codeWithClaude(prompt, {
    model: MODEL_ID,
    maxTurns: 10,
    allowedTools: [
      `Bash(task typecheck)`,
      `Read(${outPath})`,
      `Write(${outPath})`,
      `Edit(${outPath})`,
    ],
  });

  console.log("[Claude output]\n", claudeOutput);

  // Verify Claude actually wrote the file
  try {
    await fs.access(outPath);
  } catch {
    throw new Error(`Claude did not write the file to ${outPath}. Check the prompt or tool permissions.`);
  }

  console.log(`    ✓ Written to ${outPath}\n`);
  console.log("Done! Review the file, add projectTags, and set status to 'published' when ready.");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ Generation failed:", err);
  process.exit(1);
});
