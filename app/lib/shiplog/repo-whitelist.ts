/**
 * Repositories to INCLUDE in weekly shiplog generation.
 * Only repos in this whitelist will appear in shiplogs.
 * Format: "owner/repo"
 *
 * IMPORTANT: Whitelist approach ensures client work is never accidentally published.
 */
export const WHITELISTED_REPOS: string[] = [
  // Add personal/public repositories to include in shiplogs here
  // benhonda
  "benhonda/bhonda.com",
  // adpharm
  "adpharm/form-gen",
  "adpharm/adpharm-shad",
  "adpharm/agentic-editor",
  "adpharm/silo-cdp",
  "adpharm/silo-event-store-api",
  "adpharm/adapts-tracking-link-templates",
  "adpharm/adapts",
  "adpharm/adpharm-toolshed",
  "adpharm/earlydays.dev",
  "adpharm/inspiration-index-pipeline",
  "adpharm/inspiration-index-app",
  "adpharm/inspiration-index-terraform",
  "adpharm/ga4-reporter",
  "adpharm/autoscroll-recorder-web",
  "adpharm/autoscroll-recorder-api",
  "adpharm/gtm-proxy",
  "adpharm/link-scraper",
  // synapse
  "adpharm/synapsemedcom.ca",
  "adpharm/synapse-crm",
  "adpharm/synapse-crm-contacts-db",
  // other
  "adpharm/postgresdk",
];
