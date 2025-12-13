import { shiplogEnv } from "~/lib/env/shiplog-env.server";

/**
 * Validates that a key doesn't contain environment prefix
 */
function validateRelativeKey(key: string): void {
  if (key.match(/^(staging|production)\//)) {
    throw new Error(`S3 key must not include environment prefix. Got: ${key}`);
  }

  if (!key.startsWith("public/") && !key.startsWith("internal/")) {
    throw new Error(`S3 key must start with public/ or internal/. Got: ${key}`);
  }
}

/**
 * Builds full S3 key from relative path
 * Input: "public/ships/2025-W50.md"
 * Output: "staging/public/ships/2025-W50.md"
 */
export function buildS3Key(relativePath: string, envOverride?: "staging" | "production"): string {
  validateRelativeKey(relativePath);

  const envPrefix = envOverride || shiplogEnv.S3_BUCKET_KEY_PREFIX_NO_SLASHES;
  return `${envPrefix}/${relativePath}`;
}

/**
 * Extracts relative key from full S3 key
 * Input: "staging/public/ships/2025-W50.md"
 * Output: "public/ships/2025-W50.md"
 */
export function parseRelativeKey(fullKey: string): string {
  const match = fullKey.match(/^(staging|production)\/(.*)/);

  if (!match) {
    validateRelativeKey(fullKey);
    return fullKey;
  }

  return match[2];
}

/**
 * Builds shiplog relative keys from slug
 */
export function buildShiplogKeys(slug: string): {
  publicRelative: string;
  internalRelative: string;
} {
  const filename = `${slug}.md`;
  return {
    publicRelative: `public/ships/${filename}`,
    internalRelative: `internal/ships/${filename}`,
  };
}
