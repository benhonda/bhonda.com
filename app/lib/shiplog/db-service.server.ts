import { db } from "~/lib/db/index.server";
import { shiplogsTable } from "~/lib/db/schemas/shiplog-schema";
import { eq, desc } from "drizzle-orm";

export interface ShiplogRecord {
  slug: string;
  titleText: string;
  previewText: string;
  introText: string;
  publishedAt: string; // YYYY-MM-DD
  week: number;
  year: number;
  s3PublicKey: string;
  s3InternalKey: string;
  statsRepos: number;
  statsCommits: number;
}

/**
 * Insert or update shiplog record (upsert by slug)
 */
export async function insertShiplogRecord(data: ShiplogRecord): Promise<void> {
  const existing = await db
    .select()
    .from(shiplogsTable)
    .where(eq(shiplogsTable.slug, data.slug))
    .limit(1);

  if (existing.length > 0) {
    // Update existing record
    await db
      .update(shiplogsTable)
      .set({
        title_text: data.titleText,
        preview_text: data.previewText,
        intro_text: data.introText,
        published_at: data.publishedAt,
        week: data.week,
        year: data.year,
        s3_public_key: data.s3PublicKey,
        s3_internal_key: data.s3InternalKey,
        stats_repos: data.statsRepos,
        stats_commits: data.statsCommits,
      })
      .where(eq(shiplogsTable.slug, data.slug));

    console.log(`[Shiplog DB] Updated existing record: ${data.slug}`);
  } else {
    // Insert new record
    await db.insert(shiplogsTable).values({
      slug: data.slug,
      title_text: data.titleText,
      preview_text: data.previewText,
      intro_text: data.introText,
      published_at: data.publishedAt,
      week: data.week,
      year: data.year,
      s3_public_key: data.s3PublicKey,
      s3_internal_key: data.s3InternalKey,
      stats_repos: data.statsRepos,
      stats_commits: data.statsCommits,
    });

    console.log(`[Shiplog DB] Inserted new record: ${data.slug}`);
  }
}

/**
 * Get latest shiplogs ordered by published_at descending
 */
export async function getLatestShiplogs(limit: number = 6) {
  return db
    .select()
    .from(shiplogsTable)
    .orderBy(desc(shiplogsTable.published_at))
    .limit(limit);
}

/**
 * Get shiplog by slug
 */
export async function getShiplogBySlug(slug: string) {
  const results = await db
    .select()
    .from(shiplogsTable)
    .where(eq(shiplogsTable.slug, slug))
    .limit(1);

  return results.at(0) || null;
}
