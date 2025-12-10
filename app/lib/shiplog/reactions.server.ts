import { TokenBucketRateLimit } from "~/lib/auth-utils/rateLimit.server";
import { ReadableError } from "~/lib/readable-error";

export const reactionRateLimit = new TokenBucketRateLimit<string>(5, 60);

/**
 * Check reaction rate limit for an IP
 */
export function checkReactionRateLimit(request: Request): void {
  const clientIP = request.headers.get("X-Forwarded-For");
  if (clientIP && !reactionRateLimit.check(clientIP, 1)) {
    throw new ReadableError("Too many reactions. Please slow down.");
  }
}

/**
 * Consume reaction rate limit for an IP
 */
export function consumeReactionRateLimit(request: Request): void {
  const clientIP = request.headers.get("X-Forwarded-For");
  if (clientIP && !reactionRateLimit.consume(clientIP, 1)) {
    throw new ReadableError("Too many reactions. Please slow down.");
  }
}
