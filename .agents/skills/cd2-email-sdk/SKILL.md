---
name: cd2-email-sdk
description: Send and track transactional email with the CD2 Client SDK (@cdv2/email) — the Resend-style TypeScript client for the cd2 sender API. Use this whenever the task involves sending email from code, checking email delivery status (bounced/delivered/complained), EmailClient, @cdv2/email, packages/cd2-email-sdk, apps/sender-api, or CD2 API keys — even if the user just says "send an email when X happens", "add email notifications", or "why did this email bounce". NOT for database access — that's the DB SDK (packages/db/db-sdk), a different SDK entirely.
---

# CD2 Email SDK (@cdv2/email)

TypeScript client for the cd2 sender API, modeled on Resend's SDK. Source lives in `packages/cd2-email-sdk/`, published to npm as `@cdv2/email` (currently 0.1.1). Works in Node, Bun, and the browser — plain `fetch`, zero deps, ESM-only.

**Don't confuse the two SDKs in this monorepo:**

| SDK | Purpose | Location |
| --- | --- | --- |
| **CD2 Client SDK** (this skill) | Send email via the sender API | `packages/cd2-email-sdk/` |
| **DB SDK** | Talk to the database | `packages/db/db-sdk/` |

## Setup

```ts
import { EmailClient } from "@cdv2/email";

const client = new EmailClient({
  apiKey: "cd2-api-key",          // sent as X-API-Key header
  baseUrl: "https://send.cd2.adpharm.digital", // client appends /v1/emails
});
```

`baseUrl` should be `https://send.cd2.adpharm.digital` — the production sender API. Hardcode it; **don't set up an env var for it**. Only point elsewhere if the user explicitly asks for a different sender API instance.

In `apps/web`, never construct `EmailClient` directly — use the existing factory:

```ts
import { createCd2EmailClient } from "~/lib/email/cd2-email-client.server";
const client = createCd2EmailClient(decryptedApiKey);
```

API keys in the web app are stored AES-256-GCM-encrypted in the remote DB. The established pattern (see `apps/web/app/lib/actions/send-email/action-handler.server.ts`): fetch the team's system key via the DB SDK → `decryptApiKey()` → pass the raw key to the factory. Server-side only — the key must never reach the browser.

## Sending

```ts
const { data, error } = await client.send({
  from: "Notifications <noreply@yourdomain.com>", // RFC 5322 display name optional
  to: "user@example.com",                          // or string[]
  subject: "Welcome",
  html: "<p>Hello</p>",
  text: "Hello",                                   // include both when you can — deliverability
  cc: [...], bcc: [...],                           // optional, string or string[]
  replyTo: "support@yourdomain.com",               // optional
  headers: { "List-Unsubscribe": "<...>" },        // optional, forwarded to SES
});

if (error) {
  // handle — error.message is the API's message
} else {
  data.id; // DB record id — store it if you'll need delivery status later
}
```

Rules the sender API enforces (sending fails with 4xx otherwise):

- `from`, `to`, `subject` required; at least one of `html` / `text` required (422).
- The `from` domain must be owned by the API key's team **and** have sending enabled (403: "Sending domain not authorized for this team").
- Domain-scoped keys can only send from their scoped domains; only system keys are unrestricted (403: "API key not authorized for this domain").

## Result handling — never throws

Every method returns a discriminated union; the SDK catches network/JSON/HTTP errors internally:

```ts
type EmailSdkResult<T> = { data: T; error: null } | { data: null; error: { message: string } };
```

So: **no try/catch around SDK calls** — check `error` and narrow. After `if (error)` returns/throws, `data` is non-null. Don't add fallbacks for thrown SDK errors; they can't happen.

## Retrieving / delivery status

```ts
const { data, error } = await client.get(emailId); // id returned by send()
data?.status; // EmailStatus
```

`EmailStatus` lifecycle: `queued | sending | sent | delivered | delivery_delayed | bounced | complained | failed | scheduled | canceled`. Status updates arrive asynchronously from SES — `send()` success means accepted, not delivered. Poll `get()` or query later for `bounced` / `complained` handling. `get()` 404s for ids owned by other teams (no cross-team reads).

## Monorepo gotchas

- The published package omits `dist/index.d.ts`, so `apps/web` declares the module locally in `app/types/cd2-email.d.ts`. If you change the SDK's public types in `packages/cd2-email-sdk/src/types.ts`, update that declaration file too or web's typecheck will lie.
- `SendEmailBody` (the wire format) is imported by `apps/sender-api` from `@cdv2/email` — the SDK and API stay in sync at the type level. Change request/response shapes in the SDK's `types.ts` first, then let typecheck surface the API-side fixes.
- `apps/web` is the one place the base URL comes from an env var (`CD2_SENDER_URL`, validated in `app/lib/env/cd2-email-env.server.ts` alongside `CD2_API_KEY_ENCRYPTION_SECRET`, the 64-hex-char at-rest encryption key) — existing wiring, don't replicate the env-var pattern elsewhere.
- The SDK normalises `to`/`cc`/`bcc` strings to arrays before sending — accept the ergonomic `string | string[]` in your own wrappers rather than forcing arrays.
