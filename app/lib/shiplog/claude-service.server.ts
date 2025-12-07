import Anthropic from "@anthropic-ai/sdk";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import type { RepoCommits } from "./github-service.server";

export interface ShiplogContent {
  title: string;
  description: string;
  content: string;
}

/**
 * Synthesizes commits into a cohesive weekly shiplog using Claude
 */
export async function synthesizeShiplog(
  repoCommits: RepoCommits[],
  startDate: Date,
  endDate: Date
): Promise<ShiplogContent> {
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
Return a JSON object with exactly these three fields:

{
  "title": "Creative, engaging title for the shiplog (keep it punchy and exciting)",
  "description": "1-2 sentence preview/summary for listing pages (make it compelling)",
  "content": "Full markdown blog post content (concise, organized by project, focus on what shipped)"
}

**Content Guidelines:**
- Organize by project/repository
- Focus on what shipped: features, fixes, improvements
- Emphasize user-facing impact and meaningful changes
- Keep it readable and engaging
- Use appropriate markdown formatting (headings, lists, etc.)
- Do NOT include commit hashes, URLs, or technical metadata
- Do NOT include trivial changes or internal refactoring unless significant

**Commits:**

${formattedCommits}

Return only the JSON object, no additional text:`;

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

    // Parse JSON response
    let shiplogContent: ShiplogContent;
    try {
      // Extract JSON from response (Claude might wrap it in markdown code blocks)
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in Claude response");
      }

      shiplogContent = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!shiplogContent.title || !shiplogContent.description || !shiplogContent.content) {
        throw new Error("Missing required fields in Claude response");
      }
    } catch (parseError) {
      console.error("[Claude] Failed to parse JSON response:", parseError);
      console.error("[Claude] Raw response:", content.text);
      throw new Error(`Failed to parse Claude JSON response: ${parseError}`);
    }

    console.log(`[Claude] Successfully synthesized shiplog`);
    console.log(`[Claude] Title: ${shiplogContent.title}`);
    console.log(`[Claude] Description: ${shiplogContent.description}`);
    console.log(`[Claude] Content length: ${shiplogContent.content.length} chars`);

    return shiplogContent;
  } catch (error) {
    console.error("[Claude] Error synthesizing shiplog:", error);
    throw new Error(`Failed to synthesize shiplog with Claude: ${error}`);
  }
}
