import { EmailClient } from "@cdv2/email";
import { cd2EmailEnv } from "~/lib/env/cd2-email-env.server";

/**
 * Production CD2 sender API base URL — the client appends `/v1/emails`.
 * Hardcoded by design (no env var) per the CD2 SDK conventions.
 */
const CD2_SENDER_BASE_URL = "https://send.cd2.adpharm.digital";

/**
 * Create a CD2 email client using the system API key from the environment.
 *
 * Server-only — the API key must never reach the browser.
 */
export function createCd2EmailClient(): EmailClient {
  return new EmailClient({
    apiKey: cd2EmailEnv.CD2_API_KEY,
    baseUrl: CD2_SENDER_BASE_URL,
  });
}
