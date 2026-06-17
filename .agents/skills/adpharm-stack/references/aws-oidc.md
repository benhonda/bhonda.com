# AWS access — clients & credentials (local SSO ↔ Vercel OIDC)

How the app authenticates to AWS with no long-lived keys. **Owns the AWS identity facts**
(profile, region, OIDC) that other references link to.

**Read when:** creating an AWS SDK client (S3, etc.) or touching how the app gets creds.

## Contract
- AWS SDK clients resolve credentials **by environment**: production (on Vercel) via
  OIDC role assumption (short-lived); locally via a named SSO profile. Same client code.
- No AWS access keys anywhere — the bridge is an IAM role ARN (`AWS_ROLE_ARN`) the Vercel
  OIDC token assumes.

## Non-negotiables
| key | rule | why |
| --- | --- | --- |
| credential-branch | `NODE_ENV === "production"` → Vercel OIDC `awsCredentialsProvider({ roleArn })`; else → local SSO | short-lived creds in prod, no stored secrets |
| profile-pharmer | local SSO profile is `pharmer` | shared Adpharm profile (`task login` does the SSO login — see `references/taskfile.md`) |
| region | default region `ca-central-1` unless a resource truly lives elsewhere | team default |
| role-arn-from-infra | `AWS_ROLE_ARN` comes from infra, validated in env, set as a TF-managed Vercel var | never paste an ARN by hand (env: `references/env.md`; wiring: `references/terraform.md`) |
| server-singleton | clients are `*.server.ts`, instantiated once | not per-request |
| allow-only-iam | any IAM policy for new access is ALLOW, never DENY | team policy |

## Engine
None — this is Shape (a tiny credential branch).

## Shape — write fresh (illustration, not gospel)
```ts
// lib/aws/s3/s3-client.server.ts
import { S3Client } from "@aws-sdk/client-s3";
import { fromSSO } from "@aws-sdk/credential-providers";
import { awsCredentialsProvider } from "@vercel/functions/oidc";
import { serverEnv } from "~/lib/env/env.defaults.server";

export const s3Client = new S3Client({
  region: "ca-central-1",
  credentials:
    process.env.NODE_ENV === "production"
      ? awsCredentialsProvider({ roleArn: serverEnv.AWS_ROLE_ARN })
      : fromSSO({ profile: "pharmer" }),
});
```
Any new AWS service uses the same branch — only the client class changes.

## Verify at latest
- **`@aws-sdk/*` v3** — current client package + `@aws-sdk/credential-providers` `fromSSO`.
- **`@vercel/functions`** — current import/name for the OIDC provider and Vercel's current
  OIDC setup; this integration evolves.
