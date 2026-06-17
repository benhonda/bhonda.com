import { z } from "zod";

/**
 * Database environment — validated, fail-fast (see references/env.md).
 * Picked up by `env-map.generate.ts` via the `export { dbEnv }` form.
 */
const dbEnvSchema = z.object({
  /** Postgres connection string */
  DATABASE_URL: z.string().min(1),
});

const dbEnv = dbEnvSchema.parse({
  ...process.env,
});

export { dbEnv };
