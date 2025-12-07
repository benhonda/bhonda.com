import { hash, verify } from "@node-rs/argon2";
import { sha1 } from "@oslojs/crypto/sha1";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { TokenBucketRateLimit } from "./rateLimit.server";

const ipPasswordHashRateLimit = new TokenBucketRateLimit(5, 30);
// const userUpdatePasswordRateLimit = new BasicRateLimit<number>(5, 60 * 10);

/**
 * Check the rate limit for hashing passwords.
 * @param context
 */
export function checkIpHashRateLimit(context: { request: Request }) {
  // TODO: Assumes X-Forwarded-For is always included.
  const clientIP = context.request.headers.get("X-Forwarded-For");
  if (clientIP !== null && !ipPasswordHashRateLimit.check(clientIP, 1)) {
    throw new Error("Too many requests");
  }
}

/**
 * Consume the rate limit for hashing passwords.
 * @param context
 */
export function consumeIpHashRateLimit(context: { request: Request }) {
  const clientIP = context.request.headers.get("X-Forwarded-For");
  if (clientIP !== null && !ipPasswordHashRateLimit.consume(clientIP, 1)) {
    throw new Error("Too many requests");
  }
}

/**
 * Hash a password.
 * @param password
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

/**
 * Verify a password hash.
 * @param hash
 * @param password
 */
export async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
  return await verify(hash, password);
}

/**
 * Verify the strength of a password.
 * @param password
 */
export async function verifyPasswordStrength(password: string): Promise<boolean> {
  if (password.length < 8 || password.length > 255) {
    return false;
  }
  const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
  const hashPrefix = hash.slice(0, 5);
  const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
  const data = await response.text();
  const items = data.split("\n");
  for (const item of items) {
    const hashSuffix = item.slice(0, 35).toLowerCase();
    if (hash === hashPrefix + hashSuffix) {
      return false;
    }
  }
  return true;
}

/**
 * Create a strong random password (for guest users).
 * @returns
 */
export async function createStrongRandomPassword(len: number = 8): Promise<string> {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
