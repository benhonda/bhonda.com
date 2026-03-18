/**
 * Repositories to INCLUDE in weekly shiplog generation.
 * To whitelist a repo, set `shiplogWhitelisted: true` on its entry in PROJECTS_CONFIG.
 *
 * IMPORTANT: Opt-in approach ensures client work is never accidentally published.
 */
import type { RepoConfig } from "~/lib/projects/projects-config";
import { PROJECTS_CONFIG } from "~/lib/projects/projects-config";

/** Keyed by "owner/repo" identifier. Only includes repos with shiplogWhitelisted: true. */
export const REPO_CONFIG: Record<string, RepoConfig> = Object.fromEntries(
  PROJECTS_CONFIG.flatMap((p) =>
    p.repos.filter((r) => r.shiplogWhitelisted).map((r) => [r.identifier, r])
  )
);
