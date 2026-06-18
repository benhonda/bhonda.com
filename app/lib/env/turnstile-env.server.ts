import { z } from "zod";

/**
 * Server environment variables for Cloudflare Turnstile.
 *
 * Secret-key-only — the (non-secret) site key lives in `env.defaults.server.ts`
 * as `PUBLIC_TURNSTILE_SITE_KEY`, the single env module wired into `window.env`.
 */
const turnstileEnvSchema = z.object({
  /**
   * Turnstile secret key — used server-side to verify the widget token against
   * Cloudflare's siteverify endpoint. Never exposed to the client.
   */
  TURNSTILE_SECRET_KEY: z.string().min(1),
});

// Single canonical `export { turnstileEnv }` — the env-map generator's discovery
// regex only matches a single export identifier.
const turnstileEnv = turnstileEnvSchema.parse({ ...process.env });

export { turnstileEnv };
