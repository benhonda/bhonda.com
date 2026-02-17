import { db } from "~/lib/db/index.server";
import { shiplogsTable } from "~/lib/db/schemas/shiplog-schema";
import { eq, desc } from "drizzle-orm";

export type ShiplogStatus = "draft" | "published" | "archived";

export interface ShiplogRecord {
  slug: string;
  titleText: string;
  previewText: string;
  introText: string;
  publishedAt: string; // YYYY-MM-DD
  week: number;
  year: number;
  s3PublicKeyRelative: string;
  s3InternalKeyRelative: string;
  statsRepos: number;
  statsCommits: number;
  status: ShiplogStatus;
}

/**
 * Insert or update shiplog record (upsert by slug)
 */
export async function insertShiplogRecord(data: Omit<ShiplogRecord, 'status'>): Promise<{ id: string }> {
  const existing = await db
    .select({ id: shiplogsTable.id })
    .from(shiplogsTable)
    .where(eq(shiplogsTable.slug, data.slug))
    .limit(1);

  if (existing.length > 0) {
    // Update existing record (preserve status)
    await db
      .update(shiplogsTable)
      .set({
        title_text: data.titleText,
        preview_text: data.previewText,
        intro_text: data.introText,
        published_at: data.publishedAt,
        week: data.week,
        year: data.year,
        s3_public_key_relative: data.s3PublicKeyRelative,
        s3_internal_key_relative: data.s3InternalKeyRelative,
        stats_repos: data.statsRepos,
        stats_commits: data.statsCommits,
      })
      .where(eq(shiplogsTable.slug, data.slug));

    console.log(`[Shiplog DB] Updated existing record: ${data.slug}`);
    return { id: existing[0].id };
  } else {
    // Insert new record (default to 'draft')
    const [inserted] = await db
      .insert(shiplogsTable)
      .values({
        slug: data.slug,
        title_text: data.titleText,
        preview_text: data.previewText,
        intro_text: data.introText,
        published_at: data.publishedAt,
        week: data.week,
        year: data.year,
        s3_public_key_relative: data.s3PublicKeyRelative,
        s3_internal_key_relative: data.s3InternalKeyRelative,
        stats_repos: data.statsRepos,
        stats_commits: data.statsCommits,
        status: "draft",
      })
      .returning({ id: shiplogsTable.id });

    console.log(`[Shiplog DB] Inserted new record: ${data.slug}`);
    return { id: inserted.id };
  }
}

/**
 * Get latest shiplogs ordered by published_at descending
 */
export async function getLatestShiplogs(limit: number = 6, isAdmin: boolean = false, offset: number = 0) {
  if (!isAdmin) {
    return db
      .select()
      .from(shiplogsTable)
      .where(eq(shiplogsTable.status, "published"))
      .orderBy(desc(shiplogsTable.published_at))
      .limit(limit)
      .offset(offset);
  }

  return db
    .select()
    .from(shiplogsTable)
    .orderBy(desc(shiplogsTable.published_at))
    .limit(limit)
    .offset(offset);
}

/**
 * Get shiplog by slug
 */
export async function getShiplogBySlug(slug: string, isAdmin: boolean = false) {
  const query = db
    .select()
    .from(shiplogsTable)
    .where(eq(shiplogsTable.slug, slug))
    .limit(1);

  const results = await query;
  const shiplog = results.at(0);

  if (!shiplog) {
    return null;
  }

  // Filter out non-published shiplogs for non-admins
  if (!isAdmin && shiplog.status !== "published") {
    return null;
  }

  return shiplog;
}

/**
 * Update shiplog status
 */
export async function updateShiplogStatus(slug: string, status: ShiplogStatus): Promise<void> {
  await db
    .update(shiplogsTable)
    .set({ status })
    .where(eq(shiplogsTable.slug, slug));

  console.log(`[Shiplog DB] Updated status for ${slug} to ${status}`);
}
