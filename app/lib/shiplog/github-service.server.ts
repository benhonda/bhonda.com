import { Octokit } from "@octokit/rest";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import { REPO_CONFIG } from "./repo-whitelist";

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
 * Fetches commits from GitHub Search API for a given date range
 * Uses user filter to scope results to repos owned by the user
 */
export async function fetchCommitsForDateRange(
  authorEmail: string,
  startDate: Date,
  endDate: Date
): Promise<RepoCommits[]> {
  const octokit = new Octokit({
    auth: shiplogEnv.GITHUB_PAT,
  });

  // Format dates for GitHub search API (YYYY-MM-DD)
  const startDateStr = startDate.toISOString().split("T")[0];
  const endDateStr = endDate.toISOString().split("T")[0];

  try {
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
    const searchScopes = [
      `user:${GITHUB_USERNAME}`,
      ...Array.from(orgs).map((org) => `org:${org}`),
    ];

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
            const authorEmail = item.commit.author?.email || "unknown";
            const authorName = item.commit.author?.name || "Unknown";

            return {
              sha: item.sha,
              message: item.commit.message,
              date: item.commit.committer?.date || item.commit.author?.date || "",
              author: authorName,
              authorEmail: authorEmail,
              url: item.html_url,
            };
          })
          .filter((commit) => {
            // Double-check that the author email matches (safety net against API false positives)
            const matches = commit.authorEmail.toLowerCase() === authorEmail.toLowerCase();
            if (!matches) {
              console.log(`[GitHub]     Filtered out commit ${commit.sha.substring(0, 7)} - author mismatch: ${commit.authorEmail} !== ${authorEmail}`);
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

    // Group by repository
    const commitsByRepo = new Map<string, CommitData[]>();
    const skippedRepos = new Set<string>();

    for (const commit of allCommits) {
      // Extract repo from commit URL: https://github.com/owner/repo/commit/sha
      const repoMatch = commit.url.match(/github\.com\/([^/]+\/[^/]+)\/commit/);
      if (!repoMatch) continue;

      const repo = repoMatch[1];

      // Only include whitelisted repos
      if (!(repo in REPO_CONFIG)) {
        skippedRepos.add(repo);
        continue;
      }

      if (!commitsByRepo.has(repo)) {
        commitsByRepo.set(repo, []);
      }

      commitsByRepo.get(repo)!.push(commit);
    }

    if (skippedRepos.size > 0) {
      console.log(`[GitHub] Skipped ${skippedRepos.size} non-whitelisted repos: ${Array.from(skippedRepos).join(", ")}`);
    }

    // Convert to array format
    const result: RepoCommits[] = Array.from(commitsByRepo.entries()).map(([repo, commits]) => ({
      repo,
      commits,
    }));

    console.log(`[GitHub] Grouped into ${result.length} repositories`);
    result.forEach((r) => console.log(`  - ${r.repo}: ${r.commits.length} commits`));

    return result;
  } catch (error) {
    console.error("[GitHub] Error fetching commits:", error);
    throw new Error(`Failed to fetch commits from GitHub Search API: ${error}`);
  }
}
