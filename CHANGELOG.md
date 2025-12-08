# Changelog

## 2025-12-08

- refactor: Replaced Anthropic SDK with Claude Code subprocess in print mode to reduce dependencies and leverage CLI authentication
- feat: Shiplog filenames now include ISO week number (YYYY-WNN-MM-DD.md) for better chronological organization
- feat: Shiplog frontmatter now includes year field for filtering and display purposes
- feat: GitHub service now supports multi-org commit search with automatic org detection from accessible repositories
- feat: Weekly shiplog cron supports manual week specification via ?week=N query parameter for testing and backfilling
- feat: Added development mode auth bypass for local testing of cron endpoints
- feat: ISO week utilities for calculating week numbers and date ranges following ISO 8601 standard

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
