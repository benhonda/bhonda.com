import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "~/lib/aws/s3/s3-client.server";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import type { RepoCommits } from "./github-service.server";
import type { ShiplogContent, SynthesisMetadata } from "./claude-service.server";

export interface ShiplogMetadata {
  dateRange: {
    start: string;
    end: string;
  };
  totalCommits: number;
  repositories: Array<{
    name: string;
    commitCount: number;
  }>;
}

/**
 * Builds frontmatter markdown with metadata
 */
function buildFrontmatterMarkdown(
  shiplogContent: ShiplogContent,
  dateStr: string,
  metadata: ShiplogMetadata,
  isoWeek: number,
  isoYear: number
): string {
  const slug = `${isoYear}-W${isoWeek.toString().padStart(2, "0")}`;

  const frontmatter = `---
title: "${shiplogContent.title.replace(/"/g, '\\"')}"
description: "${shiplogContent.description.replace(/"/g, '\\"')}"
date: "${dateStr}"
week: ${isoWeek}
year: ${isoYear}
stats:
  repos: ${metadata.repositories.length}
  commits: ${metadata.totalCommits}
slug: "${slug}"
---

${shiplogContent.content}`;

  return frontmatter;
}

/**
 * Generates the internal shiplog markdown with metadata and raw data
 */
function generateInternalShiplog(
  publicContent: string,
  metadata: ShiplogMetadata,
  synthesisMetadata: SynthesisMetadata,
  repoCommits: RepoCommits[]
): string {
  const repoList = metadata.repositories
    .map((r) => `- ${r.name} (${r.commitCount} commits)`)
    .join("\n");

  const rawData = JSON.stringify(repoCommits, null, 2);

  return `# Weekly Shiplog - Internal

## Generation Metadata
- **Generated:** ${synthesisMetadata.timestamp}
- **Model:** ${synthesisMetadata.model}
- **CLI Command:** \`${synthesisMetadata.cliCommand}\`

## Shiplog Statistics
- **Date Range:** ${metadata.dateRange.start} to ${metadata.dateRange.end}
- **Total Commits:** ${metadata.totalCommits}
- **Repositories:** ${metadata.repositories.length}

## Repositories Processed
${repoList}

## Claude Synthesis Prompt
\`\`\`
${synthesisMetadata.prompt}
\`\`\`

## Raw Commit Data
\`\`\`json
${rawData}
\`\`\`

---

# Public Shiplog
${publicContent}
`;
}

/**
 * Uploads shiplog files to S3
 */
export async function uploadShiplogToS3(
  shiplogContent: ShiplogContent,
  synthesisMetadata: SynthesisMetadata,
  repoCommits: RepoCommits[],
  executionDate: Date,
  isoWeek: number,
  isoYear: number
): Promise<{ publicKey: string; internalKey: string }> {
  const dateStr = executionDate.toISOString().split("T")[0]; // YYYY-MM-DD (for frontmatter)
  const prefix = shiplogEnv.S3_BUCKET_KEY_PREFIX_NO_SLASHES;
  const bucket = shiplogEnv.S3_BUCKET_NAME;

  // Generate filename with ISO week: YYYY-WNN.md
  const filename = `${isoYear}-W${isoWeek.toString().padStart(2, "0")}.md`;

  // Generate keys
  const publicKey = `${prefix}/public/ships/${filename}`;
  const internalKey = `${prefix}/internal/ships/${filename}`;

  // Calculate metadata
  const metadata: ShiplogMetadata = {
    dateRange: {
      start: repoCommits[0]?.commits[0]?.date.split("T")[0] || dateStr,
      end: dateStr,
    },
    totalCommits: repoCommits.reduce((sum, r) => sum + r.commits.length, 0),
    repositories: repoCommits.map((r) => ({
      name: r.repo,
      commitCount: r.commits.length,
    })),
  };

  // Build frontmatter markdown for public shiplog
  const publicMarkdown = buildFrontmatterMarkdown(shiplogContent, dateStr, metadata, isoWeek, isoYear);

  // Generate internal content
  const internalContent = generateInternalShiplog(publicMarkdown, metadata, synthesisMetadata, repoCommits);

  console.log(`[S3] Uploading shiplogs to bucket: ${bucket}`);
  console.log(`[S3] Public key: ${publicKey}`);
  console.log(`[S3] Internal key: ${internalKey}`);

  try {
    // Upload public shiplog
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: publicKey,
        Body: publicMarkdown,
        ContentType: "text/markdown",
      })
    );

    console.log(`[S3] Successfully uploaded public shiplog`);

    // Upload internal shiplog
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: internalKey,
        Body: internalContent,
        ContentType: "text/markdown",
      })
    );

    console.log(`[S3] Successfully uploaded internal shiplog`);

    return { publicKey, internalKey };
  } catch (error) {
    console.error("[S3] Error uploading shiplogs:", error);
    throw new Error(`Failed to upload shiplogs to S3: ${error}`);
  }
}
