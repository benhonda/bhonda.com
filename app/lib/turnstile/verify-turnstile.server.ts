import { turnstileEnv } from "~/lib/env/turnstile-env.server";

/** Cloudflare's token-validation endpoint. */
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Abort siteverify after this long rather than hanging the request. */
const TIMEOUT_MS = 10_000;

/**
 * Verify a Turnstile token server-side against Cloudflare's siteverify API.
 *
 * Tokens are single-use and expire 300s after issuance; a replayed or stale
 * token returns `success: false` (`timeout-or-duplicate`). The secret key is
 * read from server env and never leaves the backend.
 *
 * @param token   the `cf-turnstile-response` produced by the client widget
 * @param remoteip optional client IP, forwarded to Cloudflare for extra signal
 * @returns whether the token is valid (false on any error/timeout — fail closed)
 */
export async function verifyTurnstileToken(token: string, remoteip?: string): Promise<boolean> {
  if (!token) return false;

  const body = new URLSearchParams({
    secret: turnstileEnv.TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (remoteip) body.set("remoteip", remoteip);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    if (!data.success) {
      console.error("turnstile: siteverify rejected token:", data["error-codes"]);
    }
    return data.success;
  } catch (error) {
    // Network error / timeout — fail closed so a CAPTCHA outage can't be bypassed.
    console.error("turnstile: siteverify request failed:", error);
    return false;
  }
}
