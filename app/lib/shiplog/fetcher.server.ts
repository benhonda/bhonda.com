import { serverEnv } from "~/lib/env/env.defaults.server";
import { getDateRangeFromISOWeek, getISOWeekNumber, getISOWeekYear } from "./date-utils.server";

export interface ShiplogMeta {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD (end of week)
  week: number;
  year: number;
  slug: string; // YYYY-WNN
  stats: {
    repos: number;
    commits: number;
  };
}

export interface Shiplog extends ShiplogMeta {
  content: string;
}

/**
 * Parse frontmatter and content from markdown file
 */
function parseFrontmatter(raw: string): Shiplog {
  const frontmatterMatch = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    throw new Error("Invalid shiplog format: missing frontmatter");
  }

  const [, frontmatterStr, content] = frontmatterMatch;

  // Parse YAML-like frontmatter
  const meta: Record<string, any> = {};
  const lines = frontmatterStr.split("\n");

  let currentKey: string | null = null;
  let isInStatsBlock = false;

  for (const line of lines) {
    // Handle stats block
    if (line.trim() === "stats:") {
      isInStatsBlock = true;
      meta.stats = {};
      continue;
    }

    if (isInStatsBlock) {
      const statsMatch = line.match(/^\s+(\w+):\s*(.+)$/);
      if (statsMatch) {
        const [, key, value] = statsMatch;
        meta.stats[key] = parseInt(value, 10);
        continue;
      } else {
        // End of stats block, fall through to process this line normally
        isInStatsBlock = false;
      }
    }

    // Handle regular fields
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      currentKey = key;

      // Remove quotes from strings
      let parsedValue: any = value.replace(/^["']|["']$/g, "");

      // Parse numbers
      if (!isNaN(Number(parsedValue))) {
        parsedValue = Number(parsedValue);
      }

      meta[key] = parsedValue;
    }
  }

  // Generate slug from week/year if missing (backwards compatibility)
  const slug = meta.slug || `${meta.year}-W${meta.week.toString().padStart(2, "0")}`;

  return {
    title: meta.title || "",
    description: meta.description || "",
    date: meta.date || "",
    week: meta.week || 0,
    year: meta.year || 0,
    slug,
    stats: meta.stats || { repos: 0, commits: 0 },
    content: content.trim(),
  };
}

/**
 * Generate expected shiplog filenames for the last N completed weeks
 * Skips the current week (starts from last week)
 */
function getExpectedShiplogFilenames(weeksBack: number = 6): string[] {
  const now = new Date();
  const filenames: string[] = [];

  // Start from last week (i=1 skips current week)
  for (let i = 1; i <= weeksBack; i++) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() - i * 7);

    const isoWeek = getISOWeekNumber(targetDate);
    const isoYear = getISOWeekYear(targetDate);

    const filename = `${isoYear}-W${isoWeek.toString().padStart(2, "0")}.md`;
    filenames.push(filename);
  }

  return filenames;
}

/**
 * Fetch a shiplog from CDN (returns null on 404/403)
 */
async function fetchShiplogFromCDN(cdnUrl: string, filename: string): Promise<Shiplog | null> {
  const url = `${cdnUrl}/ships/${filename}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // Silently handle expected failures (404 = not exists, 403 = CDN permissions/not exists)
      if (response.status === 404 || response.status === 403) {
        return null;
      }
      // Only log unexpected errors
      console.error(`[Shiplog Fetcher] Unexpected error fetching ${url}: ${response.status} ${response.statusText}`);
      return null;
    }

    const raw = await response.text();
    const parsed = parseFrontmatter(raw);
    console.log(`[Shiplog Fetcher] ✓ Parsed shiplog from ${filename}:`, {
      title: parsed.title,
      slug: parsed.slug,
      week: parsed.week,
      year: parsed.year
    });
    return parsed;
  } catch (error) {
    // Only log actual network errors, not expected failures
    console.error(`[Shiplog Fetcher] Network error fetching ${url}:`, error);
    return null;
  }
}

/**
 * Fetch shiplogs with environment-aware fallback cascade
 */
export async function fetchShiplogs(): Promise<Shiplog[]> {
  const env = serverEnv.PUBLIC_APP_ENV;
  const prodCDN = serverEnv.PUBLIC_CDN_URL_PRODUCTION;
  const stagingCDN = serverEnv.PUBLIC_CDN_URL_STAGING;

  console.log('[Shiplog Fetcher] Starting fetch...');
  console.log('[Shiplog Fetcher] Env:', env);
  console.log('[Shiplog Fetcher] Prod CDN:', prodCDN);
  console.log('[Shiplog Fetcher] Staging CDN:', stagingCDN);

  const filenames = getExpectedShiplogFilenames(6);
  console.log('[Shiplog Fetcher] Looking for weeks:', filenames);

  if (env === "production") {
    // Production: only read from production CDN
    if (!prodCDN) {
      console.warn("[Shiplog Fetcher] Production CDN URL not configured");
      return [];
    }

    const shiplogs = await Promise.all(filenames.map((filename) => fetchShiplogFromCDN(prodCDN, filename)));
    const filtered = shiplogs.filter((log): log is Shiplog => log !== null).sort((a, b) => b.date.localeCompare(a.date));
    console.log(`[Shiplog Fetcher] Returning ${filtered.length} shiplogs from production`);
    return filtered;
  } else if (env === "staging") {
    // Staging: only read from staging CDN
    if (!stagingCDN) {
      console.warn("[Shiplog Fetcher] Staging CDN URL not configured");
      return [];
    }

    const shiplogs = await Promise.all(filenames.map((filename) => fetchShiplogFromCDN(stagingCDN, filename)));
    const filtered = shiplogs.filter((log): log is Shiplog => log !== null).sort((a, b) => b.date.localeCompare(a.date));
    console.log(`[Shiplog Fetcher] Returning ${filtered.length} shiplogs from staging`);
    return filtered;
  } else {
    // Development: read from both, staging wins
    if (!prodCDN || !stagingCDN) {
      console.warn("[Shiplog Fetcher] CDN URLs not configured for development");
      return [];
    }

    const [prodShiplogs, stagingShiplogs] = await Promise.all([
      Promise.all(filenames.map((filename) => fetchShiplogFromCDN(prodCDN, filename))),
      Promise.all(filenames.map((filename) => fetchShiplogFromCDN(stagingCDN, filename))),
    ]);

    // Merge: staging overwrites production
    const merged = new Map<string, Shiplog>();

    prodShiplogs.filter((log): log is Shiplog => log !== null).forEach((log) => merged.set(log.slug, log));

    stagingShiplogs.filter((log): log is Shiplog => log !== null).forEach((log) => merged.set(log.slug, log));

    const result = Array.from(merged.values()).sort((a, b) => b.date.localeCompare(a.date));
    console.log(`[Shiplog Fetcher] Returning ${result.length} merged shiplogs (dev)`);
    console.log('[Shiplog Fetcher] Slugs:', result.map(s => s.slug));
    return result;
  }
}

/**
 * Fetch a single shiplog by slug (slug format: YYYY-WNN)
 */
export async function fetchShiplogBySlug(slug: string): Promise<Shiplog | null> {
  const env = serverEnv.PUBLIC_APP_ENV;
  const prodCDN = serverEnv.PUBLIC_CDN_URL_PRODUCTION;
  const stagingCDN = serverEnv.PUBLIC_CDN_URL_STAGING;

  // Slug is already in the right format: YYYY-WNN
  const filename = `${slug}.md`;

  if (env === "production") {
    if (!prodCDN) return null;
    return fetchShiplogFromCDN(prodCDN, filename);
  } else if (env === "staging") {
    if (!stagingCDN) return null;
    return fetchShiplogFromCDN(stagingCDN, filename);
  } else {
    // Dev: try staging first, then production
    if (!prodCDN || !stagingCDN) return null;

    const stagingLog = await fetchShiplogFromCDN(stagingCDN, filename);
    if (stagingLog) return stagingLog;

    return fetchShiplogFromCDN(prodCDN, filename);
  }
}
