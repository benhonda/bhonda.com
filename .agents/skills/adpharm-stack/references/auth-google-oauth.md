# Google sign-in (OAuth2 authorization-code flow)

Server-side Google OAuth with a session cookie.

**Read when:** adding Google sign-in, the OAuth callback, or session handling around it.

## Contract
- Authorization-code flow: build a Google auth URL with a CSRF `state` → user authorizes
  → callback receives a `code` → server exchanges it for tokens → fetches the profile →
  upserts the user → creates a session cookie → redirects into the app.
- The client never handles tokens.

## Non-negotiables
| key | rule | why |
| --- | --- | --- |
| auth-code-flow | authorization-code, server-side — not implicit, no tokens in the browser | secrets stay server-side |
| state-csrf | generate `state`, store it in the session, verify on callback before exchange | CSRF guard |
| avatar-base64 | fetch the avatar and store a base64 data URI **alongside** the URL (`avatar_url` + `avatar_base64`) | Google's `picture` is on a `googleapis.com` host ad-blockers frequently block; base64 is resilient |
| normalized-profile | return provider-agnostic fields: `provider`, `provider_id` (OpenID `sub`), `email`, `display_name`, `avatar_url`, `avatar_base64`, raw `provider_data` | a second provider can slot in |
| session-cookie | httpOnly, `secure` in prod, `sameSite=lax`, signed with `SESSION_SECRET`, sliding expiry. **Default to a signed (stateless) cookie**; the db example's `internalSessionsTable` is only for when you need server-side revocation | standard secure session — one session model, not two |
| callback-in-loader | exchange→upsert→session lives in the callback route loader | server-only, not a client component |

Secrets come from validated env (`references/env.md`); the user is persisted via the DB
layer (`references/db.md`).

## Engine
None — this is Shape. Implement at current best practice, honoring the table above.

## Shape — write fresh (illustration, not gospel)
```ts
getGoogleOAuth2Url(state): string
//   accounts.google.com/o/oauth2/v2/auth?response_type=code
//   &scope=openid%20email%20profile&state=…&client_id=…&redirect_uri=…
async function getGoogleProfile(code): Promise<OAuth2Profile>
//   POST token endpoint (code + secret) → access token; GET userinfo → raw; fetch picture → base64
type OAuth2Profile = {
  provider: "google"; provider_id: string; email: string; display_name: string;
  avatar_url?: string; avatar_base64?: string; provider_data: unknown;
};
// callback loader: verify state → getGoogleProfile → upsert user → set session → redirect
```

## Verify at latest
- **Google OAuth** — current auth/token/userinfo endpoints, scopes, and recommended
  params (`access_type`, `prompt`) per Google's docs.
- **react-router v7** — session storage, loader/redirect, `Set-Cookie`.
- Consider whether a maintained auth/OAuth library is now the best-practice choice over
  hand-rolling the exchange — but keep every non-negotiable above if you adopt one.
