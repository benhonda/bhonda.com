import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { editShiplogActionDefinition } from "./action-definition";
import { requireAdmin } from "~/lib/auth-utils/user.server";
import { editShiplogWithClaude } from "~/lib/shiplog/claude-edit-service.server";
import { serverEnv } from "~/lib/env/env.defaults.server";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "~/lib/aws/s3/s3-client.server";
import { getShiplogBySlug } from "~/lib/shiplog/db-service.server";
import type { ShiplogStatus } from "~/lib/shiplog/db-service.server";

/**
 * Fetch raw markdown from CDN
 */
async function fetchRawMarkdown(slug: string): Promise<string> {
  const env = serverEnv.PUBLIC_APP_ENV;
  const filename = `${slug}.md`;

  const cdnUrl =
    env === "production"
      ? serverEnv.PUBLIC_CDN_URL_PRODUCTION
      : serverEnv.PUBLIC_CDN_URL_STAGING;

  const url = `${cdnUrl}/ships/${filename}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch shiplog: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

/**
 * Parse frontmatter and content from markdown
 */
function parseFrontmatter(raw: string, status: ShiplogStatus) {
  const frontmatterMatch = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    throw new Error("Invalid shiplog format: missing frontmatter");
  }

  const [, frontmatterStr, content] = frontmatterMatch;

  const meta: Record<string, any> = {};
  const lines = frontmatterStr.split("\n");

  let isInStatsBlock = false;

  for (const line of lines) {
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
        isInStatsBlock = false;
      }
    }

    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      let parsedValue: string | number = value.replace(/^["']|["']$/g, "");

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

export default createActionHandler(
  editShiplogActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    await requireAdmin(request);

    const inputData = parseActionInput(editShiplogActionDefinition, unsafeInputData);

    const { slug, editPrompt } = inputData;

    console.log(`[Edit Shiplog] Starting edit for ${slug}`);

    // Get current status from database
    const shiplogFromDb = await getShiplogBySlug(slug, true);
    if (!shiplogFromDb) {
      throw new Error(`Shiplog not found: ${slug}`);
    }

    const currentMarkdown = await fetchRawMarkdown(slug);

    const updatedMarkdown = await editShiplogWithClaude(currentMarkdown, editPrompt);

    const prefix = shiplogEnv.S3_BUCKET_KEY_PREFIX_NO_SLASHES;
    const bucket = shiplogEnv.S3_BUCKET_NAME;
    const filename = `${slug}.md`;
    const publicKey = `${prefix}/public/ships/${filename}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: publicKey,
        Body: updatedMarkdown,
        ContentType: "text/markdown",
      })
    );

    console.log(`[Edit Shiplog] Successfully uploaded edited shiplog to S3`);

    const shiplog = parseFrontmatter(updatedMarkdown, shiplogFromDb.status);

    return {
      shiplog,
    };
  }
);
