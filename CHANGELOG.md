# Changelog

## 2026-04-20

- chore: Published W13 shiplog (status flipped from draft) and added W15 and W16 shiplog entries covering CLI tooling improvements, video animation library launch, and UI polish across multiple projects
- feat: Added `adpharm-remotion` project to projects config — new shiplog-whitelisted project for programmatic video generation with Remotion for pharma marketing campaigns
- chore: Enabled Python devcontainer feature (latest version) for local tooling needs

## 2026-04-10

- chore: Published W14 shiplog entry covering analytics reporting enhancements — key insights synthesis, period-over-period comparisons, and report template consolidation for silo-cdp

## 2026-03-30

- chore: Draft W13 shiplog entry added covering email invites, performance wins, quality gates, and updates across five projects

## 2026-03-27

- feat: New FAQ added to Google Ads Search Campaigns post — "Why does the page feed upload dialog offer HTTPS as a source option?" with cited sources from Google Ads Help
- docs: Audited all 7 FAQs for fluff — removed redundant cross-FAQ explanations, filler transitions, and restated paragraphs; replaced with cross-references

## 2026-03-25

- feat: Accordion UI component added (Radix UI primitive) with `radix-ui` dependency
- feat: New draft blog post — "Google Ads Search Campaigns in 2026: FAQ" covering UTM tracking, ValueTrack parameters, auto-tagging vs manual tagging, AI Max, Final URL Expansion, Page Feeds, and URL exclusions

## 2026-03-23

- feat: "Bunny Cache Buster" project added to projects config as a tracked project with shiplog whitelisting
- chore: Devcontainer volume mounts now use `${devcontainerId}` suffix to prevent cross-instance collisions

## 2026-03-18

- refactor: Hardcoded private email addresses extracted to environment variables (`ADMIN_EMAIL`, `GITHUB_AUTHOR_EMAIL`) — prevents personal info from being exposed in this public repo



- feat: SEO metadata expanded across all routes — added `description` meta to root, `article:published_time` OG tag to blog and shiplog detail pages, full OG tags + canonical + JSON-LD `CollectionPage` schema to `/topics/:topic`, JSON-LD `SoftwareApplication` schema to `/projects/:slug`, and topic routes added to sitemap
- feat: Project description used as OG/meta description on project pages (fallback to generic text when absent)
- chore: Web manifest `short_name` shortened to "bhonda" and `description` field added

- refactor: Theme system overhauled — replaced CSS `@custom-variant dark` with Tailwind v4's `--dark-mode: class`, added a blocking inline script to `<head>` to apply the correct class before first paint (eliminating dark-mode flash), and moved system-preference detection into React state so the UI stays in sync with OS changes without a reload
- feat: `buildPreferencesCookieHeader` utility added to `preference-cookie.server.ts` for serializing preferences to a `Set-Cookie` header value
- refactor: `Tag` pill styling updated to use `bg-primary/20` with primary foreground colors and `#` prefix on topic tags

- feat: `CodeBlock` and `InlineCode` components added with sugar-high syntax highlighting; `MarkdownContent` updated to use them with remark-gfm for full GFM support (tables, strikethrough, proper fenced code blocks)
- feat: `PostMeta` now accepts a typed `projects` field (`ProjectSlug[]`) rendered as linked Tag pills alongside free-form `tags` in the blog post layout
- refactor: Blog post files migrated to `YYYY-WNN-slug` naming convention; `InlineCode`, `CodeBlock`, `AudioPlayer`, `TranscriptLine`, `List`, `ListItem` registered in content taxonomy for shiplog generation with grouped named imports
- chore: Shiplog entries migrated from raw `<code>` to `<InlineCode>` component for consistency
- feat: `/topics/:topic` route added — aggregates blog posts and shiplogs by topic tag on a single page, with `Tag` component updated to link to these topic pages
- refactor: `PostMeta.tags` renamed to `topics` and both `PostMeta` and `ShiplogMeta` now support a `topics` field rendered as linked topic tag pills
- refactor: `PostCard` extracted as a reusable component; blog index simplified to use it

- refactor: Shiplog repo whitelist consolidated into `PROJECTS_CONFIG` via a `shiplogWhitelisted` flag on each repo, eliminating the separate duplicate `REPO_CONFIG` in `repo-whitelist.ts` and making projects the single source of truth for both display and inclusion logic
- feat: `List` and `ListItem` misc components added; all shiplog entries migrated from prose paragraphs to structured lists for better readability
- feat: Two new blog posts published — "Breaking the 39fps Cloud Capture Limit" and "Migrating Video Recording to Chrome for Testing" — featuring embedded audio players and transcript components
- feat: `PUBLIC_CDN_URL` exposed as a client-side env var so the CDN base URL is accessible in browser context
- refactor: Shiplogs migrated from S3/CDN/DB to fully-local file-based TSX modules in `app/lib/shiplogs/entries/`, eliminating all async data fetching, DB writes, and CDN dependencies for content delivery
- refactor: Projects migrated from DB to a static `PROJECTS_CONFIG` array in `app/lib/projects/projects-config.ts`, making project data version-controlled and zero-latency
- feat: `scripts/generate-shiplog.ts` added as a local CLI replacement for the Vercel cron — generates shiplog entries directly as TSX files using Claude
- feat: `scripts/backfill-shiplog-entries.ts` added to migrate historical S3 shiplog data into the new local format
- refactor: `/ships` and `/ships/:slug` routes converted from client-side action fetching to SSR loaders, eliminating loading states and improving SEO
- refactor: `/projects` and `/projects/:slug` routes converted from client-side action fetching to SSR loaders backed by static config
- refactor: Sitemap loader made synchronous — no longer awaits DB/CDN calls; uses static shiplog registry and project config
- chore: Removed Vercel cron endpoint `api/cron/weekly-shiplog`, reactions system, version history/diff modal, S3 client/services, DB services, and all associated action handlers (~3000 lines deleted)

> **Note:** This is the last commit before fully-local migration. Previous entry preserved for reference.

- feat: Blog section re-introduced at `/blog` and `/blog/:slug` alongside the existing People section — posts are file-based TSX modules exporting `postMeta`, with draft/published gating and admin visibility of drafts
- feat: Blog routes, types, registry, and post layout component added; `/blog` included in sitemap with per-post `lastmod` and `priority`
- feat: Jim Carrey added to People profiles
- chore: `/blog` and `/blog/:slug` added to the typed route registry; breadcrumbs and page header nav updated to include blog

## 2026-03-06

- fix: robots.txt simplified to gate on environment only (`PUBLIC_APP_ENV !== "production"`), removing unreliable host-based checks; cache-control changed to `no-store` so crawlers always get the current policy
- fix: Canonical base URL in robots.txt and sitemap.xml now derives directly from `APP_FQDN` without a hardcoded `www.` prefix, so the configured domain is the single source of truth
- feat: Sitemap now includes `/projects` and `/projects/:slug` routes, with `lastmod` derived from the latest associated shiplog date
- fix: People page JSON-LD corrected from `Article` to `ProfilePage` schema type with proper `mainEntity` Person structure, improving structured data accuracy for search engines
- fix: Root and Shiplog JSON-LD structured data now include an `image` field and use trailing-slash canonical URLs for consistency

## 2026-03-02

- fix: Post-login redirect now lands on the correct dev server port (3014 instead of 3000)
- fix: Session cookie now expires after 14 days instead of at browser close

## 2026-02-27

- feat: Blog section replaced with a "People" section — `/people` index and `/people/:slug` detail routes for curated profiles of quotable individuals, built with the same file-based TSX module pattern
- refactor: Sitemap, homepage, breadcrumbs, and nav updated to reference `/people` instead of `/blog`; all blog routes, types, and components removed
- feat: OG meta tags now correctly inherit from the root layout on all routes — `mergeMeta` utility added to deduplicate parent/child meta and ensure per-page og:title, og:description, and og:url override the root defaults without duplication
- refactor: Root layout OG/Twitter Card tags moved from hardcoded `<head>` HTML to a proper `meta` export so React Router's meta merging applies correctly
- feat: `PersonMeta` schema extended with a required `metaDescription` field to decouple SEO descriptions from the shorter UI preview text used in cards and listings
- feat: Page header title ("bhonda.com") is now a link back to the homepage and shows "Ben Honda" as a subtitle

## 2026-02-23

- feat: Blog section added with `/blog` index and `/blog/:slug` detail routes; posts are file-based TSX modules in `app/lib/blog/posts/` exporting a `blogMeta` object and default component, rendered via a shared `BlogPostLayout`
- feat: Blog posts now require a `status` field (`draft` | `published`); draft posts return 404 on both index and detail routes, preventing premature exposure
- feat: Blog posts support an optional `lastUpdated` field displayed in the post header and used as `lastmod` in the sitemap
- feat: Blog posts added to sitemap with per-post `lastmod` and priority
- feat: Homepage redesigned from a client-side action-driven shiplog list to a SSR 3-column grid showing the 4 most recent Shiplogs, Blog posts, and Projects
- feat: Sitewide SEO improved — OG tags now include description, url, and article type per page; Twitter Card meta added; Person and BlogPosting JSON-LD structured data added to root and content detail pages
- fix: Canonical URLs corrected from `bhonda.com` to `www.bhonda.com` across all routes
- chore: Dev server port changed from 3000 to 3014 across vite config and Taskfile

## 2026-02-17

- feat: Projects section added — repos from the shiplog whitelist are now tracked as first-class entities with their own `/projects` index and `/projects/:slug` detail pages showing associated shiplogs
- feat: Weekly shiplog cron now automatically upserts project records and links each shiplog to its source repos, enabling project-scoped shiplog browsing
- feat: DB schema extended with `projects` and `shiplog_projects` tables to model the many-to-many relationship between shiplogs and repos
- feat: `insertShiplogRecord` now returns the inserted/updated record ID so downstream steps (project linking) can reference it without a second query
- refactor: Claude synthesis and edit prompts updated to suppress week number disclosure in generated content
- feat: Projects index now renders as a responsive grid and filters out repos with no shiplogs, reducing noise in the listing
- feat: Project detail page now includes breadcrumb navigation back to the projects index
- feat: Breadcrumbs component added as a reusable navigation primitive
- feat: `projects` table now stores a `description` field; each repo in the whitelist has a human-readable description that is displayed in place of the raw repo identifier on both the index and detail pages
- chore: Vercel cron schedule for the weekly shiplog removed from `vercel.json`
- feat: `projects` table now stores optional `url` and `repo_url` fields; project cards and detail pages display live-site and GitHub links where available
- chore: Devcontainer now installs `xdg-utils` alongside `postgresql-client`

## 2026-02-08

- refactor: Devcontainer setup simplified to use official Claude CLI installer and removed Playwright MCP configuration
- refactor: Claude shiplog prompts now exclude website names that are scraped or crawled to prevent data source attribution

## 2026-01-19

- feat: Production deployments now use Vercel OIDC for AWS authentication instead of static credentials for improved security
- feat: Claude shiplog synthesis now filters out client-specific information (names, brands, proprietary data) to prevent accidental disclosure
- refactor: Database queries for non-admin users now filter by published status earlier in the query chain for better performance
- feat: Homepage now includes "View all shiplogs" button and "Shiplogs" subsection heading for clearer navigation
- refactor: Shiplog pagination refactored to use ref-based page tracking and layout effects to prevent content flickering on load
- feat: IAM role policy now includes S3 ListBucketVersions permission for complete version history access
- refactor: Shiplog detail page back link now navigates to /ships instead of home for better navigation hierarchy

- feat: Manual shiplog upload task now supports explicit year parameter for generating shiplogs from previous years (YEAR=2025)
- feat: Shiplog list now supports pagination with "Load More" button for browsing full shiplog history beyond initial 12 entries
- feat: Contact page now displays profile photo alongside contact information

## 2026-01-13

- refactor: Shiplog version history now loads on-demand when dropdown opens instead of eagerly fetching on page load for better performance
- feat: IAM role policy updated to support S3 versioning operations (GetObjectVersion, ListObjectVersions) enabling full version history functionality

## 2026-01-05

- feat: Dynamic robots.txt route blocks bots in non-production environments while allowing all bots in production with sitemap reference
- feat: Dynamic sitemap.xml route generates XML sitemap with static routes and all published shiplog entries including lastmod dates

## 2025-12-13

- feat: Contact page with LinkedIn and GitHub profile links replacing placeholder "other" page
- feat: Shiplog analytics tracking with events for opens, read completion, and reactions including time-to-read metrics
- feat: User identification on app load for authenticated users with profile data sent to analytics
- feat: Shiplog info dialog explaining what shiplogs are and how they're generated
- refactor: Theme color refinements for better visual hierarchy and contrast in light/dark modes
- refactor: Removed internationalization route structure (/$lang) for simpler URL patterns
- refactor: Shiplog detail page layout improvements with better mobile responsiveness and admin controls repositioning

## 2025-12-13

- refactor: Simplified CDN configuration by replacing environment-specific URLs (PUBLIC_CDN_URL_PRODUCTION/STAGING) with single PUBLIC_CDN_URL per deployment
- refactor: Database schema now stores relative S3 keys (public/ships/2025-W50.md) instead of full keys for environment portability
- feat: S3 key builder utility centralizes key construction logic with support for environment overrides in staging reset workflows
- feat: Staging reset command (task reset-staging) syncs both Neon database and S3 content from production for consistent test environments
- feat: Upload task now supports environment override (task upload-shiplog WEEK=50 ENV=production) for manual backfill operations
- refactor: Shiplog service functions refactored to use object params instead of positional args for better maintainability
- feat: Shiplog list item extracted to reusable component with status badge and admin controls
- refactor: Markdown strong tags now render with font-semibold styling, heading-md size reduced to xl/1.5xl for better visual hierarchy

## 2025-12-10

- feat: Shiplog status workflow with draft/published/archived states allowing admins to control visibility before public release
- feat: SEO optimization with canonical URLs, page-specific meta descriptions, and OG image for social sharing
- refactor: Removed robots noindex meta tag to allow search engine indexing of production site
- refactor: Brand assets updated with new favicon, apple-touch-icon, and web manifest icons
- feat: Error boundary now includes home link for better user recovery from errors
- feat: Dark mode support with system preference detection and manual toggle persisted to localStorage
- feat: Shared page header and footer components with GitHub link and theme toggle for consistent navigation
- refactor: Shiplog schema changed from title/description to titleText/previewText/introText for clearer content structure
- refactor: Repo whitelist converted to config object with display names for better shiplog presentation
- refactor: Claude edit service instructions improved to prevent duplicate h1 headings and introduction paragraphs
- refactor: Claude synthesis now uses repo display names and excludes projects with no meaningful user-facing changes
- refactor: Action handler now gracefully handles aborted requests (common during tab focus revalidation)
- refactor: Button typography changed from semibold to medium weight for lighter visual hierarchy
- refactor: Markdown list items now use proper list-outside styling and HR elements render with border-border class
- refactor: Shiplog reaction buttons redesigned with consistent height and improved icon/count alignment

## 2025-12-10

- feat: Shiplog reactions system allowing readers to add GitHub-style emoji reactions (thumbs up/down, heart, rocket, etc) tracked by anonymous session ID
- feat: Shiplog version history with S3-backed versioning, side-by-side diff viewer, and one-click restoration for admins
- feat: Analytics configuration with Silo write key "bhondacom" and environment-scoped cookie/localStorage keys for proper event tracking
- feat: Shiplog database storage with slug, title, description, published_at tracking and S3 key references
- feat: Admin authentication system with email-based access control and requireAdmin helper
- feat: Shiplog fetcher refactored to query database first then fetch content from CDN using S3 public keys
- feat: Manual shiplog upload task command for backfilling weeks via local dev server
- refactor: CDN environment variables now required (PUBLIC_CDN_URL_PRODUCTION and PUBLIC_CDN_URL_STAGING)
- refactor: Typography improvements with button font-mono, heading-xs variant, and muted text colors in markdown
- refactor: Shiplog frontmatter changed from 'date' field to 'published_at' for consistency with database schema
- refactor: Admin authorization restricted to single email address (ben@theadpharm.com)
- docs: Added critical policy documenting that .server.ts imports can only be used in loaders/actions to prevent runtime errors
- chore: Added /other and /ships routes to router configuration

## 2025-12-08

- refactor: Replaced Anthropic SDK with Claude Code subprocess in print mode to reduce dependencies and leverage CLI authentication
- refactor: Switched from repo blacklist to whitelist approach ensuring client work is never accidentally published in shiplogs
- refactor: Simplified shiplog filenames from YYYY-WNN-MM-DD.md to YYYY-WNN.md format for cleaner URLs and routing
- refactor: S3 shiplog structure now uses public/ and internal/ prefixes with CDN access only for public content
- feat: Shiplog frontend with client-side list view (5min cache) and SSR detail pages for SEO optimization
- feat: BunnyNet CDN integration with IAM-authenticated S3 origin and environment-specific URLs managed via Terraform
- feat: Environment-aware CDN fallback where dev reads from both prod and staging CDNs (staging wins for conflicts)
- feat: Shiplog frontmatter now includes year field for filtering and display purposes
- feat: GitHub service now supports multi-org commit search with automatic org detection from accessible repositories
- feat: GitHub commit search switched to author-email filter with double-check validation to prevent false positives
- feat: Weekly shiplog cron supports manual week specification via ?week=N query parameter for testing and backfilling
- feat: Internal shiplogs now include synthesis metadata (model ID, prompt, timestamp, CLI command) for full generation traceability
- feat: Added development mode auth bypass for local testing of cron endpoints
- feat: ISO week utilities for calculating week numbers and date ranges following ISO 8601 standard
- feat: Added react-markdown dependency for rendering shiplog markdown content

## 2025-12-07

- feat: Shiplog generation now produces structured content with frontmatter metadata (title, description, date, week number, stats) enabling better listing pages and SEO
- feat: Custom typography system with Array (display/sans), Erode (body/serif), and Tabular (mono) for distinct visual hierarchy
- feat: Basic homepage with tabbed navigation for latest, ships, and other content sections
- feat: Production environment infrastructure configuration with DNS, CDN, and deployment targets
- refactor: Renamed VERCEL_CRON_SECRET to CRON_SECRET for clarity and consistency
- refactor: Staging domain changed from app-staging.bhonda.com to staging.bhonda.com for cleaner URLs
- feat: Infrastructure as code foundation with Terragrunt/Terraform modules managing shared AWS resources (S3, Route53) and environment-specific stacks (Bunny CDN, Vercel OIDC)
- feat: AWS S3 client integration enabling server-side file storage and retrieval operations
- feat: Weekly shiplog automation using Vercel Cron to fetch GitHub commits, synthesize with Claude, and publish markdown summaries to S3
- feat: Added benhonda.dev domain configuration with DNS records for production deployment
- refactor: Terragrunt task dependencies now ensure shared infrastructure is initialized/planned/applied before environment-specific operations
- chore: Added Anthropic SDK and Octokit dependencies for AI synthesis and GitHub API integration
- docs: Added public repository security notice to prevent accidental credential commits
