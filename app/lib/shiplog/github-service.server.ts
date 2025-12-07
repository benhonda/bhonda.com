import { Octokit } from "@octokit/rest";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import { BLACKLISTED_REPOS } from "./repo-blacklist";

export interface CommitData {
  sha: string;
  message: string;
  date: string;
  author: string;
  url: string;
}

export interface RepoCommits {
  repo: string;
  commits: CommitData[];
}

/**
 * Fetches commits from GitHub for a given date range
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

  console.log(`[GitHub] Fetching commits from ${startDateStr} to ${endDateStr} for ${authorEmail}`);

  // Search for commits by author and date range
  const searchQuery = `author:${authorEmail} committer-date:${startDateStr}..${endDateStr}`;

  try {
    // Fetch all commits with pagination
    const allCommits: CommitData[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const response = await octokit.rest.search.commits({
        q: searchQuery,
        per_page: perPage,
        page,
        sort: "committer-date",
        order: "desc",
      });

      if (response.data.items.length === 0) break;

      const commits = response.data.items.map((item) => ({
        sha: item.sha,
        message: item.commit.message,
        date: item.commit.committer?.date || item.commit.author?.date || "",
        author: item.commit.author?.name || "Unknown",
        url: item.html_url,
      }));

      allCommits.push(...commits);

      // Check if we've fetched all pages
      if (response.data.items.length < perPage) break;
      page++;
    }

    console.log(`[GitHub] Found ${allCommits.length} total commits`);

    // Group by repository
    const commitsByRepo = new Map<string, CommitData[]>();

    for (const commit of allCommits) {
      // Extract repo from commit URL: https://github.com/owner/repo/commit/sha
      const repoMatch = commit.url.match(/github\.com\/([^/]+\/[^/]+)\/commit/);
      if (!repoMatch) continue;

      const repo = repoMatch[1];

      // Skip blacklisted repos
      if (BLACKLISTED_REPOS.includes(repo)) {
        console.log(`[GitHub] Skipping blacklisted repo: ${repo}`);
        continue;
      }

      if (!commitsByRepo.has(repo)) {
        commitsByRepo.set(repo, []);
      }

      commitsByRepo.get(repo)!.push(commit);
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
    throw new Error(`Failed to fetch commits from GitHub: ${error}`);
  }
}
