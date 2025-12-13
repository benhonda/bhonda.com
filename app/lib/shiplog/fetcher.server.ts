import { serverEnv } from "~/lib/env/env.defaults.server";
import { getLatestShiplogs, getShiplogBySlug as getShiplogBySlugFromDB, type ShiplogStatus } from "./db-service.server";

export interface ShiplogMeta {
  titleText: string;
  previewText: string;
  introText: string;
  publishedAt: string; // YYYY-MM-DD (end of week)
  week: number;
  year: number;
  slug: string; // YYYY-WNN
  stats: {
    repos: number;
    commits: number;
  };
  status: ShiplogStatus;
}

export interface Shiplog extends ShiplogMeta {
  content: string;
}

/**
 * Parse frontmatter and content from markdown file
 */
function parseFrontmatter(raw: string, status: ShiplogStatus): Shiplog {
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

  return {
    titleText: meta.titleText,
    previewText: meta.previewText,
    introText: meta.introText,
    publishedAt: meta.published_at,
    week: meta.week,
    year: meta.year,
    slug: meta.slug,
    stats: meta.stats,
    status,
    content: content.trim(),
  };
}


/**
 * Fetch a shiplog from CDN using S3 public key (returns null on 404/403)
 * S3 key format: public/ships/YYYY-WNN.md (relative)
 * CDN URL format: ${cdnUrl}/ships/YYYY-WNN.md
 */
async function fetchShiplogContentFromCDN(cdnUrl: string, s3KeyRelative: string): Promise<string | null> {
  // Extract path after "public/" from relative key
  const pathAfterPublic = s3KeyRelative.split("public/")[1];

  if (!pathAfterPublic) {
    console.error(`[Shiplog Fetcher] Invalid S3 key format: ${s3KeyRelative}`);
    return null;
  }

  const url = `${cdnUrl}/${pathAfterPublic}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404 || response.status === 403) {
        return null;
      }
      console.error(`[Shiplog Fetcher] Unexpected error fetching ${url}: ${response.status} ${response.statusText}`);
      return null;
    }

    const raw = await response.text();
    return raw;
  } catch (error) {
    console.error(`[Shiplog Fetcher] Network error fetching ${url}:`, error);
    return null;
  }
}

/**
 * Fetch shiplogs from database and CDN
 */
export async function fetchShiplogs(isAdmin: boolean = false): Promise<Shiplog[]> {
  const cdnUrl = serverEnv.PUBLIC_CDN_URL;

  console.log('[Shiplog Fetcher] Starting fetch from database...');
  console.log('[Shiplog Fetcher] CDN URL:', cdnUrl);

  // Query database for latest shiplogs
  const records = await getLatestShiplogs(6, isAdmin);
  console.log(`[Shiplog Fetcher] Found ${records.length} records in database`);

  // Fetch content from CDN for each record
  const shiplogs = await Promise.all(
    records.map(async (record) => {
      const raw = await fetchShiplogContentFromCDN(cdnUrl, record.s3_public_key_relative);

      if (!raw) {
        console.warn(`[Shiplog Fetcher] Failed to fetch content for ${record.slug}`);
        return null;
      }

      const parsed = parseFrontmatter(raw, record.status);
      console.log(`[Shiplog Fetcher] ✓ Loaded ${record.slug}`);
      return parsed;
    })
  );

  const filtered = shiplogs.filter((log): log is Shiplog => log !== null);
  console.log(`[Shiplog Fetcher] Returning ${filtered.length} shiplogs`);
  return filtered;
}

/**
 * Fetch a single shiplog by slug (slug format: YYYY-WNN)
 */
export async function fetchShiplogBySlug(slug: string, isAdmin: boolean = false): Promise<Shiplog | null> {
  const cdnUrl = serverEnv.PUBLIC_CDN_URL;

  console.log(`[Shiplog Fetcher] Fetching shiplog by slug: ${slug}`);

  // Query database for shiplog record
  const record = await getShiplogBySlugFromDB(slug, isAdmin);

  if (!record) {
    console.warn(`[Shiplog Fetcher] No database record found for slug: ${slug}`);
    return null;
  }

  // Fetch content from CDN
  const raw = await fetchShiplogContentFromCDN(cdnUrl, record.s3_public_key_relative);

  if (!raw) {
    console.warn(`[Shiplog Fetcher] Failed to fetch content for ${slug}`);
    return null;
  }

  const parsed = parseFrontmatter(raw, record.status);
  console.log(`[Shiplog Fetcher] ✓ Loaded ${slug}`);
  return parsed;
}
