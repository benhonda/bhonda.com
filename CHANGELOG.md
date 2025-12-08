# Changelog

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
