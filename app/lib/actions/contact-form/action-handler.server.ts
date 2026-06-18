import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { ReadableError } from "~/lib/readable-error";
import { createCd2EmailClient } from "~/lib/email/cd2-email-client.server";
import { verifyTurnstileToken } from "~/lib/turnstile/verify-turnstile.server";
import { contactFormActionDefinition } from "./action-definition";

/** RFC 5322 from-address — domain must be authorized for the CD2 API key. */
const FROM_ADDRESS = "bhonda.com <noreply@m.bhonda.com>";
/** Inbox that receives contact-form submissions. */
const TO_ADDRESS = "ben@theadpharm.com";

/** Escape user input before interpolating into the HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Server action — sends a contact-form submission to TO_ADDRESS via CD2.
 * replyTo is set to the submitter so a plain "Reply" reaches them directly.
 */
export default createActionHandler(contactFormActionDefinition, async ({ inputData: unsafeInputData }, request) => {
  const { name, email, message, turnstileToken } = parseActionInput(contactFormActionDefinition, unsafeInputData);

  // Bot gate — verify the Turnstile token before doing any work.
  const remoteip = request.headers.get("cf-connecting-ip") ?? undefined;
  const human = await verifyTurnstileToken(turnstileToken, remoteip);
  if (!human) {
    throw new ReadableError("CAPTCHA verification failed. Please try again.");
  }

  const client = createCd2EmailClient();

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
  `;
  const text = `New contact form submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

  const { data, error } = await client.send({
    from: FROM_ADDRESS,
    to: TO_ADDRESS,
    replyTo: email,
    subject: `New contact form submission from ${name}`,
    html,
    text,
  });

  if (error) {
    // Log the underlying reason; surface a friendly message to the user.
    console.error("contact-form: CD2 send failed:", error.message);
    throw new ReadableError("Sorry — your message couldn't be sent right now. Please try again later.");
  }

  return { emailId: data.id };
});
