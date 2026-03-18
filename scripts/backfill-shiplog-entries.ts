/**
 * Backfill shiplog TSX entry files from the database.
 *
 * For each shiplog in the DB, fetches the full markdown body from the CDN
 * and generates a TSX entry file using <MarkdownContent />.
 *
 * Idempotent: skips any week that already has an entry file.
 * Safe:       never overwrites existing files.
 *
 * Usage:
 *   bun run scripts/backfill-shiplog-entries.ts [--dry-run]
 *
 * Requires in env (.env or .env.vercel):
 *   DATABASE_URL, PUBLIC_CDN_URL
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.vercel" });

import fs from "fs/promises";
import path from "path";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { shiplogsTable, shiplogProjectsTable, projectsTable } from "~/lib/db/schema";
import type { ShiplogStatus } from "~/lib/shiplogs/shiplog-types";
import { projectByRepoIdentifier, type ProjectSlug } from "~/lib/projects/projects-config";

const isDryRun = process.argv.includes("--dry-run");

const ENTRIES_DIR = path.resolve("app/lib/shiplogs/entries");
const ARCHIVED_DIR = path.join(ENTRIES_DIR, "_archived");

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------
const { DATABASE_URL, PUBLIC_CDN_URL } = process.env;
if (!DATABASE_URL) { console.error("✗ Missing DATABASE_URL"); process.exit(1); }
if (!PUBLIC_CDN_URL) { console.error("✗ Missing PUBLIC_CDN_URL"); process.exit(1); }

const db = drizzle({ client: neon(DATABASE_URL) });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** "2026-W12" → "Shiplog2026W12" */
function slugToComponentName(slug: string): string {
  return "Shiplog" + slug.split("-").join("");
}

/**
 * Strips YAML frontmatter from a markdown string.
 * Expects the format: ---\n...frontmatter...\n---\n\ncontent
 */
function stripFrontmatter(markdown: string): string {
  if (!markdown.startsWith("---")) return markdown;
  const end = markdown.indexOf("\n---", 3);
  if (end === -1) return markdown;
  return markdown.slice(end + 4).trimStart();
}

/**
 * Fetches the markdown body for a shiplog from the CDN.
 * s3_public_key_relative is e.g. "public/ships/2026-W11.md"
 * CDN serves it at: ${PUBLIC_CDN_URL}/ships/2026-W11.md (strips the "public/" prefix)
 */
async function fetchMarkdownBody(s3PublicKeyRelative: string): Promise<string> {
  const cdnPath = s3PublicKeyRelative.replace(/^public\//, "");
  const url = `${PUBLIC_CDN_URL}/${cdnPath}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CDN fetch failed (${res.status}): ${url}`);
  const raw = await res.text();
  return stripFrontmatter(raw);
}

/** Escapes a string for safe embedding inside a JS template literal. */
function escapeTemplateLiteral(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function renderEntryTsx(opts: {
  slug: string;
  titleText: string;
  previewText: string;
  publishedAt: string;
  week: number;
  year: number;
  status: ShiplogStatus;
  projectTags: ProjectSlug[];
  markdownBody: string;
}): string {
  const { slug, titleText, previewText, publishedAt, week, year, status, projectTags, markdownBody } = opts;
  const componentName = slugToComponentName(slug);

  const projectTagsLine = projectTags.length > 0
    ? `  projectTags: [${projectTags.map((t) => `"${t}"`).join(", ")}],\n`
    : "";

  return `import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { MarkdownContent } from "~/components/misc/markdown-content";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "${slug}",
  titleText: "${titleText.replace(/"/g, '\\"')}",
  previewText: "${previewText.replace(/"/g, '\\"')}",
  publishedAt: "${publishedAt}",
  week: ${week},
  year: ${year},
  status: "${status}",
${projectTagsLine}} satisfies ShiplogMeta;

const content = \`${escapeTemplateLiteral(markdownBody)}\`;

export default function ${componentName}() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <MarkdownContent content={content} />
    </ShiplogLayout>
  );
}
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\n=== backfill-shiplog-entries${isDryRun ? " (DRY RUN)" : ""} ===\n`);

  // Select repo_identifier so we can map to the new ProjectSlug via projectByRepoIdentifier.
  // The DB project slugs are old-style (e.g. "adpharm-silo-cdp") and do NOT match
  // the new ProjectSlug type — mapping through repo_identifier is the safe path.
  const rows = await db
    .select({
      id: shiplogsTable.id,
      slug: shiplogsTable.slug,
      title_text: shiplogsTable.title_text,
      preview_text: shiplogsTable.preview_text,
      published_at: shiplogsTable.published_at,
      week: shiplogsTable.week,
      year: shiplogsTable.year,
      status: shiplogsTable.status,
      s3_public_key_relative: shiplogsTable.s3_public_key_relative,
      repo_identifier: projectsTable.repo_identifier,
    })
    .from(shiplogsTable)
    .leftJoin(shiplogProjectsTable, eq(shiplogProjectsTable.shiplog_id, shiplogsTable.id))
    .leftJoin(projectsTable, eq(projectsTable.id, shiplogProjectsTable.project_id))
    .orderBy(shiplogsTable.published_at);

  // Group rows by shiplog id, resolving repo_identifier → ProjectSlug along the way
  const shiplogMap = new Map<
    string,
    {
      slug: string;
      title_text: string;
      preview_text: string;
      published_at: string;
      week: number;
      year: number;
      status: ShiplogStatus;
      s3_public_key_relative: string;
      projectTags: ProjectSlug[];
    }
  >();

  for (const row of rows) {
    let entry = shiplogMap.get(row.id);
    if (!entry) {
      entry = {
        slug: row.slug,
        title_text: row.title_text,
        preview_text: row.preview_text,
        published_at: row.published_at,
        week: row.week,
        year: row.year,
        status: row.status as ShiplogStatus,
        s3_public_key_relative: row.s3_public_key_relative,
        projectTags: [],
      };
      shiplogMap.set(row.id, entry);
    }

    // Map the DB repo_identifier to a valid ProjectSlug via projectByRepoIdentifier.
    // Use `in` guard for honest runtime safety — Record<string, V> types don't model missing keys.
    if (row.repo_identifier && row.repo_identifier in projectByRepoIdentifier) {
      const projectSlug = projectByRepoIdentifier[row.repo_identifier].slug as ProjectSlug;
      if (!entry.projectTags.includes(projectSlug)) {
        entry.projectTags.push(projectSlug);
      }
    }
  }

  const shiplogs = [...shiplogMap.values()];
  console.log(`Found ${shiplogs.length} shiplogs in DB.\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const shiplog of shiplogs) {
    const isArchived = shiplog.status === "archived";
    const outPath = isArchived
      ? path.join(ARCHIVED_DIR, `${shiplog.slug}.tsx`)
      : path.join(ENTRIES_DIR, `${shiplog.slug}.tsx`);

    // Idempotency: skip if file already exists
    try {
      await fs.access(outPath);
      console.log(`  ⏭  ${shiplog.slug}  (already exists)`);
      skipped++;
      continue;
    } catch {
      // File doesn't exist — proceed
    }

    if (isDryRun) {
      console.log(`  [dry-run] would write → ${path.relative(process.cwd(), outPath)}`);
      created++;
      continue;
    }

    // Fetch markdown body from CDN
    let markdownBody: string;
    try {
      markdownBody = await fetchMarkdownBody(shiplog.s3_public_key_relative);
    } catch (err) {
      console.error(`  ✗  ${shiplog.slug}  CDN fetch failed: ${err}`);
      failed++;
      continue;
    }

    const content = renderEntryTsx({
      slug: shiplog.slug,
      titleText: shiplog.title_text,
      previewText: shiplog.preview_text,
      publishedAt: shiplog.published_at,
      week: shiplog.week,
      year: shiplog.year,
      status: shiplog.status,
      projectTags: shiplog.projectTags,
      markdownBody,
    });

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, content, "utf-8");
    console.log(`  ✓  ${shiplog.slug}  → ${path.relative(process.cwd(), outPath)}`);
    created++;
  }

  console.log(`\nDone. ${created} created, ${skipped} skipped${failed > 0 ? `, ${failed} failed` : ""}.\n`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("\n✗ Backfill failed:", err);
  process.exit(1);
});
