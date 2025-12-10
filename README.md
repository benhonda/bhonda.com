## About

---

## TODOs

**Dec 10 2025**:

What do I need to do to get this live TODAY?

- [ ] Backfill 5-10 weeks.
- [ ] Verify the content of the backfilled weeks.
- [ ] Mobile-friendly
- [ ] Meta data

Other

- [ ] Backend review system, with ability to prompt to make changes
- [ ] DB entries to fill "Latest" tab, and better s3 listings
- [ ] Github-style Reactions to posts/ships
- [ ] Silo event tracking
- [ ] Versioning of ships

**Dec 8 2025**:

- [x] How to handle staging + prod data in dev? (Solved: read from both, staging wins)
- [x] Hook up frontend to read from CDN (Solved: client-side list, SSR detail)
- [ ] re-upload with explicit repos now. then test double cdn changes.

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

---

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
  - Public files: `${prefix}/public/ships/` (CDN accessible)
  - Internal files: `${prefix}/internal/ships/` (not CDN accessible)
- BunnyNet CDN with IAM auth (restricted to `/public` subfolder)
- Terraform manages CDN URLs in Vercel env vars

**Endpoints:**

- Cron: `/api/cron/weekly-shiplog?week=50` (manual generation)
- List: Client-side action with 5min cache
- Detail: `/ships/2025-W50` (SSR for SEO)
