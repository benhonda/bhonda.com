import { S3Client } from "@aws-sdk/client-s3";
import { fromSSO } from "@aws-sdk/credential-providers";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import { awsCredentialsProvider } from "@vercel/functions/oidc";

const s3Client = new S3Client({
  region: "ca-central-1",
  credentials:
    process.env.NODE_ENV === "production"
      ? awsCredentialsProvider({
          roleArn: shiplogEnv.AWS_ROLE_ARN as string,
        })
      : fromSSO({ profile: "pharmer" }),
});

export { s3Client };
