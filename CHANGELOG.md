# Changelog

## 2025-12-07

- feat: Infrastructure as code foundation with Terragrunt/Terraform modules managing shared AWS resources (S3, Route53) and environment-specific stacks (Bunny CDN, Vercel OIDC)
- feat: AWS S3 client integration enabling server-side file storage and retrieval operations
- feat: Weekly shiplog automation using Vercel Cron to fetch GitHub commits, synthesize with Claude, and publish markdown summaries to S3
- feat: Added benhonda.dev domain configuration with DNS records for production deployment
- refactor: Terragrunt task dependencies now ensure shared infrastructure is initialized/planned/applied before environment-specific operations
- chore: Added Anthropic SDK and Octokit dependencies for AI synthesis and GitHub API integration
- docs: Added public repository security notice to prevent accidental credential commits
