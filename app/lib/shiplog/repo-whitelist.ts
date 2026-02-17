/**
 * Repositories to INCLUDE in weekly shiplog generation.
 * Only repos in this config will appear in shiplogs.
 *
 * IMPORTANT: Whitelist approach ensures client work is never accidentally published.
 */

export interface RepoConfig {
  displayName: string;
  description: string;
}

export type RepoWhitelistConfig = Record<string, RepoConfig>;

export function repoIdentifierToSlug(repoIdentifier: string): string {
  return repoIdentifier.replace(/[/.]/g, "-").toLowerCase();
}

export const REPO_CONFIG = {
  // benhonda
  "benhonda/bhonda.com": {
    displayName: "bhonda.com",
    description: "This site — a dev blog with weekly shiplogs of what I've been building",
  },
  // adpharm
  "adpharm/form-gen": {
    displayName: "Formgen",
    description: "Build and publish bilingual forms for pharma marketing campaigns",
  },
  "adpharm/adpharm-shad": {
    displayName: "Adpharm Shad Registry",
    description: "Shared UI component library used across adpharm products",
  },
  "adpharm/agentic-editor": {
    displayName: "Agentic Editor",
    description: "Leave comments on any live website and let AI turn them into code changes",
  },
  "adpharm/silo-cdp": {
    displayName: "Silo CDP",
    description: "Unified view of patient and HCP data with reporting dashboards for pharma teams",
  },
  "adpharm/silo-event-store-api": {
    displayName: "Silo Event Store API",
    description: "Captures and stores user behavior events that power Silo's analytics",
  },
  "adpharm/adapts-tracking-link-templates": {
    displayName: "ADAPTS Tracking Link Templates",
    description: "Landing page templates served at the end of ADAPTS campaign tracking links",
  },
  "adpharm/adapts": {
    displayName: "ADAPTS",
    description: "Create and manage tracking links for pharma digital marketing campaigns",
  },
  "adpharm/adpharm-toolshed": {
    displayName: "Adpharm Toolshed",
    description: "Internal playground for dev experiments and one-off integrations",
  },
  "adpharm/earlydays.dev": {
    displayName: "earlydays.dev",
    description: "A publishing platform for early-stage founders to document their journey",
  },
  "adpharm/inspiration-index-pipeline": {
    displayName: "Inspiration Index Pipeline",
    description: "Continuously captures and AI-analyzes websites to feed the Inspiration Index",
  },
  "adpharm/inspiration-index-app": {
    displayName: "Inspiration Index App",
    description: "Browse a curated, searchable library of web design inspiration",
  },
  "adpharm/inspiration-index-terraform": {
    displayName: "Inspiration Index Terraform",
    description: "Infrastructure for the Inspiration Index platform",
  },
  "adpharm/ga4-reporter": {
    displayName: "GA4 Reporter",
    description: "Automates custom analytics reports from Google Analytics 4 data",
  },
  "adpharm/autoscroll-recorder-web": {
    displayName: "Autoscroll Recorder Web",
    description: "Schedule and manage automated scrollthrough recordings of any website",
  },
  "adpharm/autoscroll-recorder-api": {
    displayName: "Autoscroll Recorder API",
    description: "Records full-page website scrollthroughs as video, on demand",
  },
  "adpharm/gtm-proxy": {
    displayName: "GTM Proxy",
    description: "First-party proxy so analytics keeps working even when ad blockers are on",
  },
  "adpharm/link-scraper": {
    displayName: "Link Scraper",
    description: "Discovers and curates new inspiration websites for the Inspiration Index",
  },
  // synapse
  "adpharm/synapsemedcom.ca": {
    displayName: "synapsemedcom.ca",
    description: "Marketing website for Synapse Medcom, a medical communications agency",
  },
  "adpharm/synapse-crm": {
    displayName: "Synapse CRM",
    description: "Internal CRM for managing Synapse's HCP contacts and events",
  },
  "adpharm/synapse-crm-contacts-db": {
    displayName: "Synapse CRM Contacts DB",
    description: "Contacts database service powering the Synapse CRM",
  },
  // other
  "adpharm/postgresdk": {
    displayName: "PostgreSDK",
    description: "Generate a fully-typed API client from your Postgres schema — no boilerplate",
  },
} satisfies RepoWhitelistConfig;
