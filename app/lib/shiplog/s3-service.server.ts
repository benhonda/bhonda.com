import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "~/lib/aws/s3/s3-client.server";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import type { RepoCommits } from "./github-service.server";

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
 * Generates the internal shiplog markdown with metadata and raw data
 */
function generateInternalShiplog(
  publicContent: string,
  metadata: ShiplogMetadata,
  repoCommits: RepoCommits[]
): string {
  const repoList = metadata.repositories
    .map((r) => `- ${r.name} (${r.commitCount} commits)`)
    .join("\n");

  const rawData = JSON.stringify(repoCommits, null, 2);

  return `# Weekly Shiplog - Internal
Date Range: ${metadata.dateRange.start} to ${metadata.dateRange.end}
Total Commits: ${metadata.totalCommits}
Repositories: ${metadata.repositories.length}

## Repositories Processed
${repoList}

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
  publicContent: string,
  repoCommits: RepoCommits[],
  executionDate: Date
): Promise<{ publicKey: string; internalKey: string }> {
  const dateStr = executionDate.toISOString().split("T")[0]; // YYYY-MM-DD
  const prefix = shiplogEnv.S3_BUCKET_KEY_PREFIX_NO_SLASHES;
  const bucket = shiplogEnv.S3_BUCKET_NAME;

  // Generate keys
  const publicKey = `${prefix}/ships/${dateStr}.md`;
  const internalKey = `${prefix}/ships/internal/${dateStr}.md`;

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

  // Generate internal content
  const internalContent = generateInternalShiplog(publicContent, metadata, repoCommits);

  console.log(`[S3] Uploading shiplogs to bucket: ${bucket}`);
  console.log(`[S3] Public key: ${publicKey}`);
  console.log(`[S3] Internal key: ${internalKey}`);

  try {
    // Upload public shiplog
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: publicKey,
        Body: publicContent,
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
