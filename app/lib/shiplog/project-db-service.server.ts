import { db } from "~/lib/db/index.server";
import { projectsTable, shiplogProjectsTable, shiplogsTable } from "~/lib/db/schemas/shiplog-schema";
import { eq, desc, count, max, and, sql } from "drizzle-orm";
import { REPO_CONFIG, repoIdentifierToSlug, type RepoWhitelistConfig } from "./repo-whitelist";
import type { ShiplogMeta } from "./fetcher.server";
import type { ShiplogStatus } from "./db-service.server";

export type Project = typeof projectsTable.$inferSelect;

export interface ProjectWithStats extends Project {
  shiplogCount: number;
  latestShiplogDate: string | null;
}

/**
 * Upsert projects from a list of repo identifiers (must be in REPO_CONFIG).
 * Returns the id + repoIdentifier for each upserted project.
 */
export async function upsertProjects(
  repoIdentifiers: string[]
): Promise<{ id: string; repoIdentifier: string }[]> {
  const config = REPO_CONFIG as RepoWhitelistConfig;
  const validIdentifiers = repoIdentifiers.filter((id) => id in config);

  if (validIdentifiers.length === 0) return [];

  const values = validIdentifiers.map((repoIdentifier) => ({
    slug: repoIdentifierToSlug(repoIdentifier),
    display_name: config[repoIdentifier].displayName,
    description: config[repoIdentifier].description,
    url: config[repoIdentifier].url ?? null,
    repo_url: config[repoIdentifier].repoUrl ?? null,
    repo_identifier: repoIdentifier,
  }));

  const result = await db
    .insert(projectsTable)
    .values(values)
    .onConflictDoUpdate({
      target: projectsTable.repo_identifier,
      set: {
        display_name: sql`excluded.display_name`,
        description: sql`excluded.description`,
        url: sql`excluded.url`,
        repo_url: sql`excluded.repo_url`,
      },
    })
    .returning({ id: projectsTable.id, repoIdentifier: projectsTable.repo_identifier });

  return result;
}

/**
 * Link a shiplog to a list of projects by project ID.
 * Silently ignores duplicates.
 */
export async function linkShiplogToProjects(shiplogId: string, projectIds: string[]): Promise<void> {
  if (projectIds.length === 0) return;

  await db
    .insert(shiplogProjectsTable)
    .values(projectIds.map((project_id) => ({ shiplog_id: shiplogId, project_id })))
    .onConflictDoNothing();
}

/**
 * Get all projects with shiplog count and latest shiplog date.
 * Ordered by most recent activity first.
 */
export async function getAllProjects(): Promise<ProjectWithStats[]> {
  const results = await db
    .select({
      id: projectsTable.id,
      slug: projectsTable.slug,
      display_name: projectsTable.display_name,
      description: projectsTable.description,
      url: projectsTable.url,
      repo_url: projectsTable.repo_url,
      repo_identifier: projectsTable.repo_identifier,
      created_at: projectsTable.created_at,
      updated_at: projectsTable.updated_at,
      shiplogCount: count(shiplogProjectsTable.shiplog_id),
      latestShiplogDate: max(shiplogsTable.published_at),
    })
    .from(projectsTable)
    .leftJoin(shiplogProjectsTable, eq(shiplogProjectsTable.project_id, projectsTable.id))
    .leftJoin(shiplogsTable, eq(shiplogsTable.id, shiplogProjectsTable.shiplog_id))
    .groupBy(projectsTable.id)
    .orderBy(desc(max(shiplogsTable.published_at)));

  return results.map((r) => ({
    ...r,
    shiplogCount: Number(r.shiplogCount),
    latestShiplogDate: r.latestShiplogDate ?? null,
  }));
}

/**
 * Get a single project by slug.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const results = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.slug, slug))
    .limit(1);

  return results.at(0) ?? null;
}

/**
 * Get shiplogs associated with a project, returned as ShiplogMeta (no CDN content).
 */
export async function getShiplogMetaByProjectId(
  projectId: string,
  isAdmin: boolean,
  limit: number,
  offset: number
): Promise<ShiplogMeta[]> {
  const whereClause = isAdmin
    ? eq(shiplogProjectsTable.project_id, projectId)
    : and(
        eq(shiplogProjectsTable.project_id, projectId),
        eq(shiplogsTable.status, "published")
      );

  const records = await db
    .select({
      slug: shiplogsTable.slug,
      title_text: shiplogsTable.title_text,
      preview_text: shiplogsTable.preview_text,
      intro_text: shiplogsTable.intro_text,
      published_at: shiplogsTable.published_at,
      week: shiplogsTable.week,
      year: shiplogsTable.year,
      stats_repos: shiplogsTable.stats_repos,
      stats_commits: shiplogsTable.stats_commits,
      status: shiplogsTable.status,
    })
    .from(shiplogsTable)
    .innerJoin(shiplogProjectsTable, eq(shiplogProjectsTable.shiplog_id, shiplogsTable.id))
    .where(whereClause)
    .orderBy(desc(shiplogsTable.published_at))
    .limit(limit)
    .offset(offset);

  return records.map((r) => ({
    titleText: r.title_text,
    previewText: r.preview_text,
    introText: r.intro_text,
    publishedAt: r.published_at,
    week: r.week,
    year: r.year,
    slug: r.slug,
    stats: { repos: r.stats_repos, commits: r.stats_commits },
    status: r.status as ShiplogStatus,
  }));
}
