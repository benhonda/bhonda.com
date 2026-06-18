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
  /**
   * CDN URL
   */
  PUBLIC_CDN_URL: z.string(),
  /**
   * Cloudflare Turnstile site key (exposed to client to render the widget).
   * Non-secret by design; defaults to the bhonda.com key so no per-env config
   * is required. The matching secret is `TURNSTILE_SECRET_KEY` (server-only).
   */
  PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).default("0x4AAAAAADnThTlLraqtL33x"),
});

const vercelEnv = process.env.VERCEL_ENV;

const appFqdn = process.env.NODE_ENV === "development" ? "localhost:3014" : process.env.APP_FQDN;

const serverEnv = serverEnvSchema.parse({
  ...process.env,
  APP_FQDN: appFqdn,
  PUBLIC_APP_FQDN: appFqdn,
  PUBLIC_APP_ENV: vercelEnv,
});

export { serverEnv };
