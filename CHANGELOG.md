# Changelog

## 2026-01-19

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
