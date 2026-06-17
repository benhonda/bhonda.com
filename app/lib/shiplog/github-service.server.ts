import { Octokit } from "@octokit/rest";
import { throttling } from "@octokit/plugin-throttling";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import { REPO_CONFIG } from "./repo-whitelist";

const ThrottledOctokit = Octokit.plugin(throttling);

export interface CommitData {
  sha: string;
  message: string;
  date: string;
  author: string;
  authorEmail: string;
  url: string;
}

export interface RepoCommits {
  repo: string;
  commits: CommitData[];
}

const GITHUB_USERNAME = "benhonda";

/**
 * Shared Octokit instance authed with the shiplog PAT.
 * Throttling plugin auto-spaces requests and retries on GitHub's primary +
 * secondary rate limits (the search API trips secondary limits aggressively).
 */
export function getOctokit(): Octokit {
  return new ThrottledOctokit({
    auth: shiplogEnv.GITHUB_PAT,
    throttle: {
      onRateLimit: (retryAfter, options, _octokit, retryCount) => {
        console.warn(`[GitHub] Rate limit hit on ${options.method} ${options.url}; retrying after ${retryAfter}s`);
        return retryCount < 3; // retry up to 3 times
      },
      onSecondaryRateLimit: (retryAfter, options, _octokit, retryCount) => {
        console.warn(`[GitHub] Secondary rate limit on ${options.method} ${options.url}; retrying after ${retryAfter}s`);
        return retryCount < 3;
      },
    },
  });
}

/** Extracts "owner/repo" from a commit html_url, or null if it doesn't match. */
function extractRepoIdentifier(commitUrl: string): string | null {
  return commitUrl.match(/github\.com\/([^/]+\/[^/]+)\/commit/)?.[1] ?? null;
}

/**
 * Fetches ALL commits by `authorEmail` in the date range across the user + every
 * org they belong to — NO whitelist filtering. Shared by the generator (which then
 * whitelist-filters) and the reconcile tool (which wants the full picture).
 */
export async function fetchAllCommitsForDateRange(
  authorEmail: string,
  startDate: Date,
  endDate: Date
): Promise<CommitData[]> {
  const octokit = getOctokit();

  // Format dates for GitHub search API (YYYY-MM-DD)
  const startDateStr = startDate.toISOString().split("T")[0];
  const endDateStr = endDate.toISOString().split("T")[0];

  // First, verify authentication and check what repos we can access
  const user = await octokit.rest.users.getAuthenticated();
  console.log(`[GitHub] Authenticated as: ${user.data.login}`);

  // List accessible repos to detect organizations
  const repoList = await octokit.rest.repos.listForAuthenticatedUser({
    per_page: 100, // Get more repos to detect all orgs
    sort: "updated",
  });

  // Extract unique org names from repos
  const orgs = new Set<string>();
  repoList.data.forEach((repo) => {
    const owner = repo.owner?.login;
    if (owner && owner !== GITHUB_USERNAME) {
      orgs.add(owner);
    }
  });

  console.log(`[GitHub] Detected orgs: ${Array.from(orgs).join(", ") || "none"}`);

  // Commit search doesn't support OR operators, so we need multiple searches
  // Search scopes: user:benhonda + org:adpharm + org:other...
  const searchScopes = [`user:${GITHUB_USERNAME}`, ...Array.from(orgs).map((org) => `org:${org}`)];

  const allCommits: CommitData[] = [];
  const isDevelopment = process.env.NODE_ENV === "development";
  const maxPagesPerScope = isDevelopment ? 2 : 10; // Limit pages in dev to avoid rate limits

  // Execute search for each scope and merge results
  for (const scope of searchScopes) {
    const searchQuery = `author-email:${authorEmail} ${scope} author-date:${startDateStr}..${endDateStr}`;

    let page = 1;
    const perPage = 100;

    while (page <= maxPagesPerScope) {
      const response = await octokit.rest.search.commits({
        q: searchQuery,
        per_page: perPage,
        page,
        sort: "author-date",
        order: "desc",
      });

      if (response.data.items.length === 0) break;

      const commits = response.data.items
        .map((item) => {
          const itemEmail = item.commit.author?.email || "unknown";
          const authorName = item.commit.author?.name || "Unknown";

          return {
            sha: item.sha,
            message: item.commit.message,
            date: item.commit.committer?.date || item.commit.author?.date || "",
            author: authorName,
            authorEmail: itemEmail,
            url: item.html_url,
          };
        })
        .filter((commit) => {
          // Double-check that the author email matches (safety net against API false positives)
          const matches = commit.authorEmail.toLowerCase() === authorEmail.toLowerCase();
          if (!matches) {
            console.log(
              `[GitHub]     Filtered out commit ${commit.sha.substring(0, 7)} - author mismatch: ${commit.authorEmail} !== ${authorEmail}`
            );
          }
          return matches;
        });

      allCommits.push(...commits);

      // Check if we've fetched all pages
      if (response.data.items.length < perPage) break;
      page++;
    }
  }

  console.log(`[GitHub] Found ${allCommits.length} total commits across all scopes`);
  return allCommits;
}

/** Groups commits by "owner/repo" identifier (commits with unparseable URLs are dropped). */
export function groupCommitsByRepo(commits: CommitData[]): Map<string, CommitData[]> {
  const byRepo = new Map<string, CommitData[]>();
  for (const commit of commits) {
    const repo = extractRepoIdentifier(commit.url);
    if (!repo) continue;
    if (!byRepo.has(repo)) byRepo.set(repo, []);
    byRepo.get(repo)!.push(commit);
  }
  return byRepo;
}

/**
 * Fetches commits for a date range, grouped by repo and filtered to whitelisted repos only.
 * This is the generator's entrypoint — opt-in whitelisting keeps client work from leaking.
 */
export async function fetchCommitsForDateRange(
  authorEmail: string,
  startDate: Date,
  endDate: Date
): Promise<RepoCommits[]> {
  try {
    const allCommits = await fetchAllCommitsForDateRange(authorEmail, startDate, endDate);
    const byRepo = groupCommitsByRepo(allCommits);

    const result: RepoCommits[] = [];
    const skippedRepos = new Set<string>();

    for (const [repo, commits] of byRepo) {
      if (!(repo in REPO_CONFIG)) {
        skippedRepos.add(repo);
        continue;
      }
      result.push({ repo, commits });
    }

    if (skippedRepos.size > 0) {
      console.log(
        `[GitHub] Skipped ${skippedRepos.size} non-whitelisted repos: ${Array.from(skippedRepos).join(", ")}`
      );
    }

    console.log(`[GitHub] Grouped into ${result.length} repositories`);
    result.forEach((r) => console.log(`  - ${r.repo}: ${r.commits.length} commits`));

    return result;
  } catch (error) {
    console.error("[GitHub] Error fetching commits:", error);
    throw new Error(`Failed to fetch commits from GitHub Search API: ${error}`);
  }
}

export type RepoStatus = "active" | "archived" | "missing";

/**
 * Looks up the current status of an "owner/repo" on GitHub.
 * Used by the reconcile tool to flag stale whitelist entries.
 */
export async function getRepoStatus(identifier: string): Promise<RepoStatus> {
  const [owner, repo] = identifier.split("/");
  if (!owner || !repo) return "missing";

  try {
    const { data } = await getOctokit().rest.repos.get({ owner, repo });
    return data.archived ? "archived" : "active";
  } catch (error) {
    // 404 (and 451 for DMCA-blocked) → treat as gone
    if (typeof error === "object" && error !== null && "status" in error && (error.status === 404 || error.status === 451)) {
      return "missing";
    }
    throw error;
  }
}
