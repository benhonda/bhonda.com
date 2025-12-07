import { S3Client } from "@aws-sdk/client-s3";
import { fromSSO } from "@aws-sdk/credential-providers";

const s3Client = new S3Client({
  region: "ca-central-1",
  credentials: process.env.NODE_ENV === "production" ? undefined : fromSSO({ profile: "pharmer" }),
});

export { s3Client };
