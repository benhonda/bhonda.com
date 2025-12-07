import Anthropic from "@anthropic-ai/sdk";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import type { RepoCommits } from "./github-service.server";

/**
 * Synthesizes commits into a cohesive weekly shiplog using Claude
 */
export async function synthesizeShiplog(
  repoCommits: RepoCommits[],
  startDate: Date,
  endDate: Date
): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: shiplogEnv.CLAUDE_CODE_OAUTH_TOKEN,
  });

  console.log(`[Claude] Synthesizing shiplog for ${repoCommits.length} repositories`);

  // Format commits for Claude
  const formattedCommits = repoCommits
    .map((repoData) => {
      const commitList = repoData.commits
        .map((c) => `  - ${c.message.split("\n")[0]} (${c.date.split("T")[0]})`)
        .join("\n");

      return `### ${repoData.repo}\n${commitList}`;
    })
    .join("\n\n");

  const prompt = `You are synthesizing a weekly shiplog from git commits.

**Date Range:** ${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}

**Input:** Commits grouped by repository from the past week.

**Output Requirements:**
- Write a concise, blog-post style markdown document
- Organize content by project/repository
- Focus on what shipped: features, fixes, improvements
- Emphasize user-facing impact and meaningful changes
- Keep it readable and engaging
- Use appropriate markdown formatting (headings, lists, etc.)
- Do NOT include commit hashes, URLs, or technical metadata
- Do NOT include trivial changes or internal refactoring unless significant

**Commits:**

${formattedCommits}

Write the weekly shiplog now:`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    console.log(`[Claude] Successfully synthesized shiplog (${content.text.length} chars)`);

    return content.text;
  } catch (error) {
    console.error("[Claude] Error synthesizing shiplog:", error);
    throw new Error(`Failed to synthesize shiplog with Claude: ${error}`);
  }
}
