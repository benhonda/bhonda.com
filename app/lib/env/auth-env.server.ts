import { z } from "zod";

/**
 * Server environment variables
 *
 * Those prefixed with `PUBLIC_` are available to the client
 */
const authEnvSchema = z.object({
  /**
   * The Google OAuth2 client ID
   */
  GOOGLE_OAUTH2_CLIENT_ID: z.string(),
  /**
   * The Google OAuth2 client secret
   */
  GOOGLE_OAUTH2_CLIENT_SECRET: z.string(),
  /**
   * The admin email address for access control
   */
  ADMIN_EMAIL: z.string().email(),
});

const authEnv = authEnvSchema.parse({
  ...process.env,
});

export { authEnv };
