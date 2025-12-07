import { z } from "zod";

/**
 * Server environment variables
 *
 * Those prefixed with `PUBLIC_` are available to the client
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  /**
   * The app environment
   */
  PUBLIC_APP_ENV: z.enum(["development", "production", "preview", "staging"]).default("development"),
  /**
   * The fully qualified domain name of the app (used server-side)
   */
  APP_FQDN: z.string(),
  /**
   * The fully qualified domain name of the app (exposed to client)
   */
  PUBLIC_APP_FQDN: z.string(),
});

const vercelEnv = process.env.VERCEL_ENV;

const appFqdn = process.env.NODE_ENV === "development" ? "localhost:3000" : process.env.APP_FQDN;

const serverEnv = serverEnvSchema.parse({
  ...process.env,
  APP_FQDN: appFqdn,
  PUBLIC_APP_FQDN: appFqdn,
  PUBLIC_APP_ENV: vercelEnv,
});

export { serverEnv };
