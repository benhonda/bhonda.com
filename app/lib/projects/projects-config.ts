/** A single repository that contributes to a project. */
export type RepoConfig = {
  /** "owner/repo" GitHub identifier, e.g. "adpharm/silo-cdp" */
  identifier: string;
  displayName: string;
  description?: string;
  url?: string;
  repoUrl?: string;
};

export type ProjectConfig = {
  slug: string;
  name: string;
  description?: string;
  /** Primary public URL for the project */
  url?: string;
  /** Individual repos that make up this project */
  repos: readonly RepoConfig[];
};

export const PROJECTS_CONFIG = [
  {
    slug: "bhonda-com",
    name: "bhonda.com",
    description: "This site — a dev blog with weekly shiplogs of what I've been building",
    url: "https://www.bhonda.com",
    repos: [
      {
        identifier: "benhonda/bhonda.com",
        displayName: "bhonda.com",
        description: "This site — a dev blog with weekly shiplogs of what I've been building",
        url: "https://www.bhonda.com",
        repoUrl: "https://github.com/benhonda/bhonda.com",
      },
    ],
  },
  {
    slug: "vercel-s3-log-drain",
    name: "Vercel S3 Log Drain",
    description: "Drains Vercel logs into S3 for storage and analysis",
    repos: [
      {
        identifier: "adpharm/vercel-s3-log-drain",
        displayName: "Vercel S3 Log Drain",
        description: "Drains Vercel logs into S3 for storage and analysis",
      },
    ],
  },
  {
    slug: "formgen",
    name: "Formgen",
    description: "Build and publish bilingual forms for pharma marketing campaigns",
    repos: [
      {
        identifier: "adpharm/form-gen",
        displayName: "Formgen",
        description: "Build and publish bilingual forms for pharma marketing campaigns",
      },
    ],
  },
  {
    slug: "adpharm-shad",
    name: "Adpharm Shad Registry",
    description: "Shared UI component library used across adpharm products",
    url: "https://ui.adpharm.digital",
    repos: [
      {
        identifier: "adpharm/adpharm-shad",
        displayName: "Adpharm Shad Registry",
        description: "Shared UI component library used across adpharm products",
        url: "https://ui.adpharm.digital",
      },
    ],
  },
  {
    slug: "adpharm-toolshed",
    name: "Adpharm Toolshed",
    description: "Internal playground for dev experiments and one-off integrations",
    repos: [
      {
        identifier: "adpharm/adpharm-toolshed",
        displayName: "Adpharm Toolshed",
        description: "Internal playground for dev experiments and one-off integrations",
      },
    ],
  },
  {
    slug: "agentic-editor",
    name: "Agentic Editor",
    description: "Leave comments on any live website and let AI turn them into code changes",
    repos: [
      {
        identifier: "adpharm/agentic-editor",
        displayName: "Agentic Editor",
        description: "Leave comments on any live website and let AI turn them into code changes",
      },
    ],
  },
  {
    slug: "silo-cdp",
    name: "Silo CDP",
    description: "Unified view of patient and HCP data with reporting dashboards for pharma teams",
    repos: [
      {
        identifier: "adpharm/silo-cdp",
        displayName: "Silo CDP",
        description: "Unified view of patient and HCP data with reporting dashboards for pharma teams",
      },
      {
        identifier: "adpharm/silo-event-store-api",
        displayName: "Silo Event Store API",
        description: "Captures and stores user behavior events that power Silo's analytics",
      },
    ],
  },
  {
    slug: "autoscroll-recorder",
    name: "Autoscroll Recorder",
    description: "Schedule and manage automated scrollthrough recordings of any website",
    url: "https://app.autoscrollrecorder.com",
    repos: [
      {
        identifier: "adpharm/autoscroll-recorder-web",
        displayName: "Autoscroll Recorder Web",
        description: "Schedule and manage automated scrollthrough recordings of any website",
        url: "https://app.autoscrollrecorder.com",
      },
      {
        identifier: "adpharm/autoscroll-recorder-api",
        displayName: "Autoscroll Recorder API",
        description: "Records full-page website scrollthroughs as video, on demand",
      },
      {
        identifier: "adpharm/autoscroll-recorder-db-service",
        displayName: "Autoscroll Recorder DB Service",
        description: "Database service for the Autoscroll Recorder platform, powered by PostgreSDK",
      },
    ],
  },
  {
    slug: "inspiration-index",
    name: "Inspiration Index",
    description: "Browse a curated, searchable library of web design inspiration",
    url: "https://www.inspirationindex.app",
    repos: [
      {
        identifier: "adpharm/inspiration-index-app",
        displayName: "Inspiration Index App",
        description: "Browse a curated, searchable library of web design inspiration",
        url: "https://www.inspirationindex.app",
      },
      {
        identifier: "adpharm/inspiration-index-pipeline",
        displayName: "Inspiration Index Pipeline",
        description: "Continuously captures and AI-analyzes websites to feed the Inspiration Index",
      },
      {
        identifier: "adpharm/ii-pipeline-db-service",
        displayName: "Inspiration Index Pipeline DB Service",
        description: "Database service for the Inspiration Index pipeline, powered by PostgreSDK",
      },
      {
        identifier: "adpharm/link-scraper",
        displayName: "Link Scraper",
        description: "Discovers and curates new inspiration websites for the Inspiration Index",
      },
      {
        identifier: "adpharm/inspiration-index-terraform",
        displayName: "Inspiration Index Terraform",
        description: "Infrastructure for the Inspiration Index platform",
      },
    ],
  },
  {
    slug: "earlydays-dev",
    name: "earlydays.dev",
    description: "A publishing platform for early-stage founders to document their journey",
    repos: [
      {
        identifier: "adpharm/earlydays.dev",
        displayName: "earlydays.dev",
        description: "A publishing platform for early-stage founders to document their journey",
        repoUrl: "https://github.com/adpharm/earlydays.dev",
      },
    ],
  },
  {
    slug: "postgresdk",
    name: "PostgreSDK",
    description: "Generate a fully-typed API client from your Postgres schema — no boilerplate",
    repos: [
      {
        identifier: "adpharm/postgresdk",
        displayName: "PostgreSDK",
        description: "Generate a fully-typed API client from your Postgres schema — no boilerplate",
        repoUrl: "https://github.com/adpharm/postgresdk",
      },
    ],
  },
  {
    slug: "adapts",
    name: "ADAPTS",
    description: "Create and manage tracking links for pharma digital marketing campaigns",
    repos: [
      {
        identifier: "adpharm/adapts",
        displayName: "ADAPTS",
        description: "Create and manage tracking links for pharma digital marketing campaigns",
      },
      {
        identifier: "adpharm/adapts-tracking-link-templates",
        displayName: "ADAPTS Tracking Link Templates",
        description: "Landing page templates served at the end of ADAPTS campaign tracking links",
      },
    ],
  },
  {
    slug: "ga4-reporter",
    name: "GA4 Reporter",
    description: "Automates custom analytics reports from Google Analytics 4 data",
    repos: [
      {
        identifier: "adpharm/ga4-reporter",
        displayName: "GA4 Reporter",
        description: "Automates custom analytics reports from Google Analytics 4 data",
      },
    ],
  },
  {
    slug: "gtm-proxy",
    name: "GTM Proxy",
    description: "First-party proxy so analytics keeps working even when ad blockers are on",
    repos: [
      {
        identifier: "adpharm/gtm-proxy",
        displayName: "GTM Proxy",
        description: "First-party proxy so analytics keeps working even when ad blockers are on",
      },
    ],
  },
  {
    slug: "cd2",
    name: "CD2",
    description: "Adpharm's single-tenant Resend clone for transactional email",
    repos: [
      {
        identifier: "adpharm/cd2-web",
        displayName: "CD2 Web",
        description: "Web app for CD2 — Adpharm's single-tenant Resend clone for transactional email",
      },
      {
        identifier: "adpharm/cd2-workers",
        displayName: "CD2 Workers",
        description: "Client SDK, receiving API, and sending API workers powering CD2",
      },
      {
        identifier: "adpharm/cd2-db",
        displayName: "CD2 DB",
        description: "Database service for CD2, powered by PostgreSDK",
      },
    ],
  },
  {
    slug: "synapse-crm",
    name: "Synapse CRM",
    description: "Internal CRM for managing Synapse's HCP contacts and events",
    repos: [
      {
        identifier: "adpharm/synapse-crm",
        displayName: "Synapse CRM",
        description: "Internal CRM for managing Synapse's HCP contacts and events",
      },
      {
        identifier: "adpharm/synapse-crm-contacts-db",
        displayName: "Synapse CRM Contacts DB",
        description: "Contacts database service powering the Synapse CRM",
      },
      {
        identifier: "adpharm/synapsemedcom.ca",
        displayName: "synapsemedcom.ca",
        description: "Marketing website for Synapse Medcom, a medical communications agency",
      },
    ],
  },
] as const satisfies readonly ProjectConfig[];

export type ProjectSlug = (typeof PROJECTS_CONFIG)[number]["slug"];

/**
 * O(1) lookup map by slug.
 * Cast to `Record<ProjectSlug, ProjectConfig>` so callers see optional fields typed as
 * `string | undefined` rather than the narrow literal types inferred from `as const`.
 */
export const projectsBySlug = Object.fromEntries(
  PROJECTS_CONFIG.map((p) => [p.slug, p as ProjectConfig])
) as Record<ProjectSlug, ProjectConfig>;

/**
 * O(1) lookup map by repo identifier (e.g. "adpharm/silo-cdp" → ProjectConfig).
 * Useful for mapping raw GitHub repo identifiers to their parent project.
 */
export const projectByRepoIdentifier = Object.fromEntries(
  PROJECTS_CONFIG.flatMap((p) => p.repos.map((r) => [r.identifier, p as ProjectConfig]))
) as Record<string, ProjectConfig>;
