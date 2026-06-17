import { z } from "zod";

/**
 * Server environment variables for CD2 transactional email.
 *
 * Those prefixed with `PUBLIC_` are available to the client.
 */
const cd2EmailEnvSchema = z.object({
  /**
   * CD2 sender API key (sent as the X-API-Key header). Must be authorized to
   * send from the contact form's `from` domain (m.bhonda.com).
   */
  CD2_API_KEY: z.string().min(1),
});

// Single canonical `export { cd2EmailEnv }` — the env-map generator's discovery
// regex only matches a single export identifier.
const cd2EmailEnv = cd2EmailEnvSchema.parse({ ...process.env });

export { cd2EmailEnv };
