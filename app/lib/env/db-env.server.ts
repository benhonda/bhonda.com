import { z } from "zod";

/**
 * Server environment variables
 *
 * Those prefixed with `PUBLIC_` are available to the client
 */
const dbEnvSchema = z.object({
  /**
   * The URL of the database
   */
  DATABASE_URL: z.string().min(1),
  /**
   * The session secret
   */
  SESSION_SECRET: z.string(),
});

const dbEnv = dbEnvSchema.parse({
  ...process.env,
});

export { dbEnv };
