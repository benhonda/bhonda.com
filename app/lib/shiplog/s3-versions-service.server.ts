import { ListObjectVersionsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "~/lib/aws/s3/s3-client.server";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import { buildS3Key, buildShiplogKeys } from "~/lib/aws/s3/s3-key-builder.server";

export interface ShiplogVersion {
  versionId: string;
  lastModified: string; // ISO timestamp
  isLatest: boolean;
}

/**
 * List all versions of a shiplog file in S3
 */
export async function listShiplogVersions(slug: string): Promise<ShiplogVersion[]> {
  const bucket = shiplogEnv.S3_BUCKET_NAME;
  const { publicRelative } = buildShiplogKeys(slug);
  const key = buildS3Key(publicRelative);

  console.log(`[S3 Versions] Listing versions for ${key}`);

  try {
    const command = new ListObjectVersionsCommand({
      Bucket: bucket,
      Prefix: key,
    });

    const response = await s3Client.send(command);

    if (!response.Versions || response.Versions.length === 0) {
      console.warn(`[S3 Versions] No versions found for ${key}`);
      return [];
    }

    const versions = response.Versions
      .filter((v) => v.Key === key && v.VersionId)
      .map((v) => ({
        versionId: v.VersionId!,
        lastModified: v.LastModified?.toISOString() || "",
        isLatest: v.IsLatest || false,
      }))
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

    console.log(`[S3 Versions] Found ${versions.length} versions`);
    return versions;
  } catch (error) {
    console.error("[S3 Versions] Error listing versions:", error);
    throw new Error(`Failed to list S3 versions: ${error}`);
  }
}

/**
 * Fetch a specific version of a shiplog from S3
 */
export async function fetchShiplogVersion(slug: string, versionId: string): Promise<string> {
  const bucket = shiplogEnv.S3_BUCKET_NAME;
  const { publicRelative } = buildShiplogKeys(slug);
  const key = buildS3Key(publicRelative);

  console.log(`[S3 Versions] Fetching version ${versionId} for ${key}`);

  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      VersionId: versionId,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error("Empty response body");
    }

    const content = await response.Body.transformToString();
    console.log(`[S3 Versions] Successfully fetched version ${versionId}`);
    return content;
  } catch (error) {
    console.error("[S3 Versions] Error fetching version:", error);
    throw new Error(`Failed to fetch S3 version: ${error}`);
  }
}
