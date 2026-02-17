/**
 * Seed script: populate projects table from REPO_CONFIG and backfill
 * the shiplog_projects join table from existing internal S3 files.
 *
 * Run with:
 *   bun run scripts/seed-projects.ts
 *
 * Requires:
 *   - DATABASE_URL in .env
 *   - AWS SSO profile "pharmer" (run `aws sso login --profile pharmer` first)
 *   - S3_BUCKET_NAME and S3_BUCKET_KEY_PREFIX_NO_SLASHES in .env
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env" });        // local overrides win
dotenv.config({ path: ".env.vercel" }); // fills in anything not in .env
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { fromSSO } from "@aws-sdk/credential-providers";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, isNull } from "drizzle-orm";
import {
  projectsTable,
  shiplogProjectsTable,
  shiplogsTable,
} from "~/lib/db/schemas/shiplog-schema";
import { REPO_CONFIG } from "~/lib/shiplog/repo-whitelist";
import { upsertProjects } from "~/lib/shiplog/project-db-service.server";
import { sql } from "drizzle-orm";

const db = drizzle({ client: neon(process.env.DATABASE_URL!) });

const s3 = new S3Client({
  region: "ca-central-1",
  credentials: fromSSO({ profile: "pharmer" }),
});

const BUCKET = process.env.S3_BUCKET_NAME!;
const ENV_PREFIX = process.env.S3_BUCKET_KEY_PREFIX_NO_SLASHES!;

if (!BUCKET || !ENV_PREFIX) {
  console.error("Missing S3_BUCKET_NAME or S3_BUCKET_KEY_PREFIX_NO_SLASHES in env");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Step 1: Upsert all projects from REPO_CONFIG
// ---------------------------------------------------------------------------
async function seedProjects(): Promise<Map<string, string>> {
  console.log("\n[1/3] Seeding projects from REPO_CONFIG...");

  const result = await upsertProjects(Object.keys(REPO_CONFIG));
  const projectMap = new Map(result.map((r) => [r.repoIdentifier, r.id]));

  console.log(`    ✓ Upserted ${result.length} projects`);
  return projectMap;
}

// ---------------------------------------------------------------------------
// Step 2: Fetch internal S3 file and extract repo identifiers
// ---------------------------------------------------------------------------
async function getReposFromInternalFile(s3KeyRelative: string): Promise<string[]> {
  const fullKey = `${ENV_PREFIX}/${s3KeyRelative}`;

  try {
    const response = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: fullKey })
    );

    const body = await response.Body?.transformToString();
    if (!body) return [];

    // Extract the JSON block from "## Raw Commit Data\n```json\n...\n```"
    const match = body.match(/## Raw Commit Data\s+```json\s+([\s\S]+?)\s+```/);
    if (!match) {
      console.warn(`    ⚠  No raw commit data found in ${fullKey}`);
      return [];
    }

    const parsed = JSON.parse(match[1]) as Array<{ repo: string }>;
    return parsed.map((r) => r.repo);
  } catch (err) {
    console.warn(`    ⚠  Failed to fetch ${fullKey}:`, (err as Error).message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Step 3: Backfill shiplog_projects from internal S3 files
// ---------------------------------------------------------------------------
async function backfillJoinTable(projectMap: Map<string, string>): Promise<void> {
  console.log("\n[2/3] Backfilling shiplog_projects from internal S3 files...");

  const shiplogs = await db
    .select({ id: shiplogsTable.id, slug: shiplogsTable.slug, s3InternalKey: shiplogsTable.s3_internal_key_relative })
    .from(shiplogsTable)
    .orderBy(shiplogsTable.published_at);

  console.log(`    Found ${shiplogs.length} shiplogs to process`);

  let linked = 0;
  let skipped = 0;

  for (const shiplog of shiplogs) {
    const repos = await getReposFromInternalFile(shiplog.s3InternalKey);

    if (repos.length === 0) {
      skipped++;
      continue;
    }

    const projectIds = repos
      .map((repo) => projectMap.get(repo))
      .filter((id): id is string => id !== undefined);

    if (projectIds.length === 0) {
      console.warn(`    ⚠  ${shiplog.slug}: no matching projects for repos: ${repos.join(", ")}`);
      skipped++;
      continue;
    }

    await db
      .insert(shiplogProjectsTable)
      .values(projectIds.map((project_id) => ({ shiplog_id: shiplog.id, project_id })))
      .onConflictDoNothing();

    console.log(`    ✓ ${shiplog.slug}: linked ${projectIds.length} projects (${repos.join(", ")})`);
    linked++;
  }

  console.log(`    Done: ${linked} shiplogs linked, ${skipped} skipped`);
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
async function printSummary(): Promise<void> {
  console.log("\n[3/3] Summary");

  const [projectCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(projectsTable);

  const [linkCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(shiplogProjectsTable);

  console.log(`    Projects: ${projectCount.count}`);
  console.log(`    Shiplog→Project links: ${linkCount.count}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("=== seed-projects ===");
  console.log(`Targeting env: ${ENV_PREFIX} | bucket: ${BUCKET}`);

  const projectMap = await seedProjects();
  await backfillJoinTable(projectMap);
  await printSummary();

  console.log("\n✓ Seed complete");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err);
  process.exit(1);
});
