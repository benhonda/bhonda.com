import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { restoreShiplogVersionActionDefinition } from "./action-definition";
import { requireAdmin } from "~/lib/auth-utils/user.server";
import { fetchShiplogVersion } from "~/lib/shiplog/s3-versions-service.server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "~/lib/aws/s3/s3-client.server";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import { serverEnv } from "~/lib/env/env.defaults.server";
import { buildS3Key, buildShiplogKeys } from "~/lib/aws/s3/s3-key-builder.server";

/**
 * Fetch current version from CDN
 */
async function fetchCurrentContent(slug: string): Promise<string> {
  const cdnUrl = serverEnv.PUBLIC_CDN_URL;
  const filename = `${slug}.md`;
  const url = `${cdnUrl}/ships/${filename}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch current shiplog: ${response.status}`);
  }

  return response.text();
}

export default createActionHandler(
  restoreShiplogVersionActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    await requireAdmin(request);

    const inputData = parseActionInput(restoreShiplogVersionActionDefinition, unsafeInputData);
    const { slug, versionId, restore } = inputData;

    console.log(`[Restore Version] Processing ${slug}, version ${versionId}, restore=${restore}`);

    const currentContent = await fetchCurrentContent(slug);
    const versionContent = await fetchShiplogVersion(slug, versionId);

    if (restore) {
      const bucket = shiplogEnv.S3_BUCKET_NAME;
      const { publicRelative } = buildShiplogKeys(slug);
      const publicKey = buildS3Key(publicRelative);

      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: publicKey,
          Body: versionContent,
          ContentType: "text/markdown",
        })
      );

      console.log(`[Restore Version] Successfully restored version ${versionId} as new version`);
    }

    return {
      currentContent,
      versionContent,
    };
  }
);
