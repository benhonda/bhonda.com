/**
 * Repositories to INCLUDE in weekly shiplog generation.
 * Only repos in this config will appear in shiplogs.
 *
 * IMPORTANT: Whitelist approach ensures client work is never accidentally published.
 */

export interface RepoConfig {
  displayName: string;
}

export type RepoWhitelistConfig = Record<string, RepoConfig>;

export function repoIdentifierToSlug(repoIdentifier: string): string {
  return repoIdentifier.replace(/[/.]/g, "-").toLowerCase();
}

export const REPO_CONFIG = {
  // benhonda
  "benhonda/bhonda.com": { displayName: "bhonda.com" },
  // adpharm
  "adpharm/form-gen": { displayName: "Formgen" },
  "adpharm/adpharm-shad": { displayName: "Adpharm Shad Registry" },
  "adpharm/agentic-editor": { displayName: "Agentic Editor" },
  "adpharm/silo-cdp": { displayName: "Silo CDP" },
  "adpharm/silo-event-store-api": { displayName: "Silo Event Store API" },
  "adpharm/adapts-tracking-link-templates": { displayName: "ADAPTS Tracking Link Templates" },
  "adpharm/adapts": { displayName: "ADAPTS" },
  "adpharm/adpharm-toolshed": { displayName: "Adpharm Toolshed" },
  "adpharm/earlydays.dev": { displayName: "earlydays.dev" },
  "adpharm/inspiration-index-pipeline": { displayName: "Inspiration Index Pipeline" },
  "adpharm/inspiration-index-app": { displayName: "Inspiration Index App" },
  "adpharm/inspiration-index-terraform": { displayName: "Inspiration Index Terraform" },
  "adpharm/ga4-reporter": { displayName: "GA4 Reporter" },
  "adpharm/autoscroll-recorder-web": { displayName: "Autoscroll Recorder Web" },
  "adpharm/autoscroll-recorder-api": { displayName: "Autoscroll Recorder API" },
  "adpharm/gtm-proxy": { displayName: "GTM Proxy" },
  "adpharm/link-scraper": { displayName: "Link Scraper" },
  // synapse
  "adpharm/synapsemedcom.ca": { displayName: "synapsemedcom.ca" },
  "adpharm/synapse-crm": { displayName: "Synapse CRM" },
  "adpharm/synapse-crm-contacts-db": { displayName: "Synapse CRM Contacts DB" },
  // other
  "adpharm/postgresdk": { displayName: "PostgreSDK" },
} satisfies RepoWhitelistConfig;
