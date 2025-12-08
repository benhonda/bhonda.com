## About

...

## Weekly Shiplog System

Automated system that generates weekly development summaries from git commits.

**ISO Week Format:** `YYYY-WNN` (e.g., `2025-W50`)
- Weeks run Monday to Sunday (ISO 8601)
- Week 1 contains first Thursday of the year
- Example: 2025-W50 = Dec 8-14, 2025

**Data Flow:**
- **Write:** Production writes to `production/`, staging writes to `staging/`
- **Read:**
  - Production: reads `production/` only
  - Staging: reads `staging/` only
  - Dev: reads both (staging wins for conflicts)

**Infrastructure:**
- S3 bucket: `bhonda-com-assets`
- BunnyNet CDN with IAM auth (not public S3)
- Terraform manages CDN URLs in Vercel env vars

**Endpoints:**
- Cron: `/api/cron/weekly-shiplog?week=50` (manual generation)
- List: Client-side action with 5min cache
- Detail: `/ships/2025-W50` (SSR for SEO)

## TODOs

**Dec 8 2025**:

- [x] How to handle staging + prod data in dev? (Solved: read from both, staging wins)
- [x] Hook up frontend to read from CDN (Solved: client-side list, SSR detail)

**Dec 7 2025**:

- [x] Test the API and be able to backfill.
- [x] Once the API is working, we need to hook up the frontend to read from S3. or from the CDN.

## Nice-to-haves

- **Dec 7 2025**:

## Other notables

- **Dec 8 2025**: ISO weeks run Monday-Sunday. Filenames use `YYYY-WNN.md` format (not dates).
- **Dec 8 2025**: BunnyNet CDN authenticates to S3 via IAM user (S3 bucket stays private).
- **Dec 7 2025**: GitHub removed commit data from the events api at some point in 2025.
- **Dec 7 2025**: We're using classic github PATs instead of fine-grained because we want info from repos owned by org and by personal, which we can do with 1 classic token or 2 fine-grained tokens.
