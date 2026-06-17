/** A single repository that contributes to a project. */
export type RepoConfig = {
  /** "owner/repo" GitHub identifier, e.g. "adpharm/silo-cdp" */
  identifier: string;
  displayName: string;
  description?: string;
  url?: string;
  repoUrl?: string;
  /** If true, this repo's commits are included in weekly shiplog generation. */
  shiplogWhitelisted?: boolean;
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
    slug: "postgresdk",
    name: "PostgreSDK",
    description: "Generate a fully-typed API client from your Postgres schema — no boilerplate",
    repos: [
      {
        identifier: "adpharm/postgresdk",
        displayName: "PostgreSDK",
        description: "Generate a fully-typed API client from your Postgres schema — no boilerplate",
        repoUrl: "https://github.com/adpharm/postgresdk",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "silo-cdp",
    name: "Silo CDP",
    description: "Segment, for cheap & data-hungry agencies",
    repos: [
      // NOTE: silo restructured — old adpharm/silo-cdp + adpharm/silo-event-store-api
      // are archived and replaced by the repos below.
      {
        identifier: "adpharm/silo-web",
        displayName: "Silo Web",
        description: "Unified view of patient and HCP data with reporting dashboards for pharma teams",
        shiplogWhitelisted: true,
      },
      {
        identifier: "adpharm/silo-services",
        displayName: "Silo Services",
        description: "Core backend services powering the Silo CDP platform",
        shiplogWhitelisted: true,
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
        shiplogWhitelisted: true,
      },
      {
        identifier: "adpharm/autoscroll-recorder-api",
        displayName: "Autoscroll Recorder API",
        description: "Records full-page website scrollthroughs as video, on demand",
        shiplogWhitelisted: true,
      },
      {
        identifier: "adpharm/autoscroll-recorder-db-service",
        displayName: "Autoscroll Recorder DB Service",
        description: "Database service for the Autoscroll Recorder platform, powered by PostgreSDK",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "inspiration-index",
    name: "Inspiration Index",
    description: "Browse a curated, searchable library of web design inspiration",
    url: "https://www.inspirationindex.app",
    repos: [
      // NOTE: adpharm/inspiration-index-terraform was archived and removed.
      {
        identifier: "adpharm/inspiration-index-app",
        displayName: "Inspiration Index App",
        description: "Browse a curated, searchable library of web design inspiration",
        url: "https://www.inspirationindex.app",
        shiplogWhitelisted: true,
      },
      {
        identifier: "adpharm/inspiration-index-pipeline",
        displayName: "Inspiration Index Pipeline",
        description: "Continuously captures and AI-analyzes websites to feed the Inspiration Index",
        shiplogWhitelisted: true,
      },
      {
        identifier: "adpharm/ii-pipeline-db-service",
        displayName: "Inspiration Index Pipeline DB Service",
        description: "Database service for the Inspiration Index pipeline, powered by PostgreSDK",
        shiplogWhitelisted: true,
      },
      {
        identifier: "adpharm/link-scraper",
        displayName: "Link Scraper",
        description: "Discovers and curates new inspiration websites for the Inspiration Index",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "cd2",
    name: "CD2",
    description: "Adpharm's single-tenant Resend clone for transactional email",
    repos: [
      // NOTE: cd2 consolidated — old cd2-web/cd2-workers/cd2-db are archived,
      // replaced by the single adpharm/cd2 repo.
      {
        identifier: "adpharm/cd2",
        displayName: "CD2",
        description: "Single-tenant Resend clone for transactional email",
        shiplogWhitelisted: true,
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
        shiplogWhitelisted: true,
      },
      {
        identifier: "adpharm/synapse-crm-contacts-db",
        displayName: "Synapse CRM Contacts DB",
        description: "Contacts database service powering the Synapse CRM",
        shiplogWhitelisted: true,
      },
      {
        identifier: "adpharm/synapsemedcom.ca",
        displayName: "synapsemedcom.ca",
        description: "Marketing website for Synapse Medcom, a medical communications agency",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "synapse",
    name: "Synapse",
    description: "Synapse medical communications platform",
    repos: [
      {
        identifier: "adpharm/synapse-app",
        displayName: "Synapse App",
        description: "TODO", // own product — confirm description
        shiplogWhitelisted: true,
      },
      {
        identifier: "adpharm/synapse-proposal-engine",
        displayName: "Synapse Proposal Engine",
        description: "Generates and manages proposals for Synapse",
        shiplogWhitelisted: true,
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
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "bunny-cache-buster",
    name: "Bunny Cache Buster",
    description: "BunnyNet CDN cache busting proxy",
    repos: [
      {
        identifier: "adpharm/bunny-cache-buster",
        displayName: "Bunny Cache Buster",
        description: "BunnyNet CDN cache busting proxy",
        shiplogWhitelisted: true,
      },
    ],
  },
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
        shiplogWhitelisted: true,
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
        shiplogWhitelisted: true,
      },
      {
        identifier: "adpharm/adapts-tracking-link-templates",
        displayName: "ADAPTS Tracking Link Templates",
        description: "Landing page templates served at the end of ADAPTS campaign tracking links",
        shiplogWhitelisted: true,
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
        shiplogWhitelisted: true,
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
        shiplogWhitelisted: true,
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
        shiplogWhitelisted: true,
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
        shiplogWhitelisted: true,
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
        shiplogWhitelisted: true,
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
        shiplogWhitelisted: true,
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
        shiplogWhitelisted: true,
      },
      {
        identifier: "adpharm/ga4-mcp",
        displayName: "GA4 MCP",
        description: "MCP server exposing GA4 reporting data to AI agents",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "adpharm-remotion",
    name: "Adpharm Remotion",
    description: "Programmatic video generation with Remotion for pharma marketing campaigns",
    repos: [
      {
        identifier: "adpharm/adpharm-remotion",
        displayName: "Adpharm Remotion",
        description: "Programmatic video generation with Remotion for pharma marketing campaigns",
        repoUrl: "https://github.com/adpharm/adpharm-remotion",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "adpharm-skills",
    name: "Adpharm Skills",
    description: "Shared Claude Code skills and agent tooling used across Adpharm products",
    repos: [
      {
        identifier: "adpharm/adpharm-skills",
        displayName: "Adpharm Skills",
        description: "Shared Claude Code skills and agent tooling used across Adpharm products",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "adpharm-activity",
    name: "Adpharm Activity",
    description: "TODO", // own product — confirm description
    repos: [
      {
        identifier: "adpharm/adpharm-activity",
        displayName: "Adpharm Activity",
        description: "TODO",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "caniemail-for-agents",
    name: "Can I Email for Agents",
    description: "Can I Email compatibility data packaged for AI coding agents",
    repos: [
      {
        identifier: "adpharm/caniemail-for-agents",
        displayName: "Can I Email for Agents",
        description: "Can I Email compatibility data packaged for AI coding agents",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "claude-skills-playground",
    name: "Claude Skills Playground",
    description: "Playground for prototyping Claude Code skills",
    repos: [
      {
        identifier: "adpharm/claude-skills-playground",
        displayName: "Claude Skills Playground",
        description: "Playground for prototyping Claude Code skills",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "foundation-emails-fork",
    name: "Foundation for Emails Fork",
    description: "Adpharm's fork of Foundation for Emails (Inky) for responsive HTML email",
    repos: [
      {
        identifier: "adpharm/foundation-emails-fork",
        displayName: "Foundation for Emails Fork",
        description: "Adpharm's fork of Foundation for Emails (Inky) for responsive HTML email",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "devrounds",
    name: "Devrounds",
    description: "TODO", // own product — confirm description
    repos: [
      {
        identifier: "adpharm/devrounds",
        displayName: "Devrounds",
        description: "TODO",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "theadpharm-com",
    name: "theadpharm.com",
    description: "The Adpharm's agency marketing website",
    repos: [
      {
        identifier: "adpharm/theadpharm.com",
        displayName: "theadpharm.com",
        description: "The Adpharm's agency marketing website",
        shiplogWhitelisted: true,
      },
    ],
  },
  {
    slug: "hearth-press",
    name: "Hearth Press",
    description: "TODO", // personal project — confirm description
    repos: [
      {
        identifier: "benhonda/hearth-press",
        displayName: "Hearth Press",
        description: "TODO",
        repoUrl: "https://github.com/benhonda/hearth-press",
        shiplogWhitelisted: true,
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
export const projectsBySlug = Object.fromEntries(PROJECTS_CONFIG.map((p) => [p.slug, p as ProjectConfig])) as Record<
  ProjectSlug,
  ProjectConfig
>;

/**
 * O(1) lookup map by repo identifier (e.g. "adpharm/silo-cdp" → ProjectConfig).
 * Useful for mapping raw GitHub repo identifiers to their parent project.
 */
export const projectByRepoIdentifier = Object.fromEntries(
  PROJECTS_CONFIG.flatMap((p) => p.repos.map((r) => [r.identifier, p as ProjectConfig]))
) as Record<string, ProjectConfig>;
