import { z } from "zod";

/**
 * Environment variables for weekly shiplog generation
 */
const shiplogEnvSchema = z.object({
  /**
   * GitHub Personal Access Token for fetching commits
   */
  GITHUB_PAT: z.string(),
  /**
   * Claude Code OAuth token for Claude synthesis
   */
  CLAUDE_CODE_OAUTH_TOKEN: z.string(),
  /**
   * S3 bucket name for storing shiplogs
   */
  S3_BUCKET_NAME: z.string(),
  /**
   * S3 bucket key prefix (no leading/trailing slashes)
   */
  S3_BUCKET_KEY_PREFIX_NO_SLASHES: z.string(),
  /**
   * Secret for verifying Vercel cron requests
   */
  CRON_SECRET: z.string(),
  /**
   * AWS IAM role ARN for Vercel OIDC (production only)
   */
  AWS_ROLE_ARN: z.string().optional(),
});

/**
 * Get shiplog environment variables (reads fresh from process.env each time)
 */
function getShiplogEnv() {
  return shiplogEnvSchema.parse({
    ...process.env,
  });
}

// Export singleton for backwards compatibility, but also export getter
const shiplogEnv = getShiplogEnv();

export { shiplogEnv, getShiplogEnv };
