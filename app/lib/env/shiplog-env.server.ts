import { z } from "zod";

/**
 * Environment variables for shiplog generation (used by generator script + services).
 */
const shiplogEnvSchema = z.object({
  /** GitHub Personal Access Token for fetching commits */
  GITHUB_PAT: z.string(),
  /** Claude Code OAuth token for AI synthesis */
  CLAUDE_CODE_OAUTH_TOKEN: z.string(),
  /** GitHub account email for filtering commits by author */
  GITHUB_AUTHOR_EMAIL: z.string().email(),
});

function getShiplogEnv() {
  return shiplogEnvSchema.parse({ ...process.env });
}

const shiplogEnv = getShiplogEnv();

export { shiplogEnv, getShiplogEnv };
