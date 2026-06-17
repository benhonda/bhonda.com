# Environment variables — validated, fail-fast

Config parsed + validated at module load, so a missing/malformed var crashes the
process immediately with a clear error instead of surfacing as `undefined` mid-request.

**Read when:** adding an env var, or a new service that needs config.

## Contract
- Every var is declared in a **zod schema** and read through a parsed, typed object —
  never `process.env.FOO` scattered around.
- Parsing happens at import with `.parse()` → fail fast and loud on anything missing/wrong.
- Server vs client are split; client-exposed vars are marked by a `PUBLIC_` prefix.

## Non-negotiables
| key | rule | why |
| --- | --- | --- |
| parse-not-safeparse | parse with `.parse()`, no fallbacks for required vars (optional dev vars may use `.default()`) | a bad config should stop the app at boot |
| public-prefix | only `PUBLIC_`-prefixed vars reach the client; keep `*.server.ts` vs client env modules separate | the client/server boundary; never import a `.server` env into client code |
| per-service-modules | each service/domain owns its schema file (core, auth, db, aws-s3, …) | env stays local to what needs it; SSOT per service |
| jsdoc-intent | each var gets a short JSDoc note on its purpose | the schema is the documentation (self-teaching) |
| deployed-vars-tf | deployed-environment vars are added on the infra side, not by hand in the Vercel UI | ownership is `references/terraform.md` (TF-managed vs manual-secret split) |

## Engine — copy faithfully (`assets/lib/env/_core/env-map.generate.ts`)
The consolidation generator. `task generate` runs it to build `lib/env/all-server-env.ts`
+ `lib/env/all-client-env.ts` (the `PUBLIC_` filter for the client) — generated
per-project, never hand-edited. Pipeline: `references/taskfile.md`. The per-service
schema files themselves are Shape.

## Shape — write fresh per service (illustration, not gospel)
```ts
// lib/env/aws-s3-env.server.ts — parsed at import (fail-fast)
import { z } from "zod";
export const awsS3Env = z.object({
  /** Upload bucket */ S3_BUCKET_NAME: z.string(),
  /** CDN host */      CDN_FQDN: z.string(),
}).parse(process.env);
```

## Verify at latest
- **zod** — enum/default/`infer` and the recommended way to parse/coerce `process.env`.
- The framework's mechanism for exposing public env to the client (how RR7 + Vercel
  inject it) — use the current idiom, not an old hand-rolled global.
