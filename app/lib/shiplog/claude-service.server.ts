import { exec } from "child_process";
import { promisify } from "util";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import type { RepoCommits } from "./github-service.server";
import { REPO_CONFIG } from "./repo-whitelist";

const execPromise = promisify(exec);

export interface ShiplogContent {
  titleText: string;
  previewText: string;
  introText: string;
  content: string;
}

export interface SynthesisMetadata {
  model: string;
  prompt: string;
  timestamp: string;
  cliCommand: string;
}

const MODEL_ID = "claude-sonnet-4-5-20250929";

/**
 * Synthesizes commits into a cohesive weekly shiplog using Claude Code print mode
 */
export async function synthesizeShiplog(args: {
  repoCommits: RepoCommits[];
  startDate: Date;
  endDate: Date;
}): Promise<{ content: ShiplogContent; metadata: SynthesisMetadata }> {
  const { repoCommits, startDate, endDate } = args;
  console.log(`[Claude] Synthesizing shiplog for ${repoCommits.length} repositories`);

  // Format commits for Claude
  const formattedCommits = repoCommits
    .map((repoData) => {
      const commitList = repoData.commits
        .map((c) => `  - ${c.message.split("\n")[0]} (${c.date.split("T")[0]})`)
        .join("\n");

      const displayName = REPO_CONFIG[repoData.repo as keyof typeof REPO_CONFIG]?.displayName ?? repoData.repo;
      return `### ${displayName}\n${commitList}`;
    })
    .join("\n\n");

  const prompt = `You are synthesizing a weekly shiplog from git commits.

<date_range>
${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}
</date_range>

<output_requirements>
Return a JSON object with exactly these three fields:

{
  "titleText": "Creative, engaging title for the shiplog (keep it punchy and exciting)",
  "previewText": "1-2 sentence preview/summary for listing pages (make it compelling)",
  "introText": "1-3 sentences introducing the content (will be used as the first paragraph of the blog post)",
  "content": "Full markdown blog post content (concise, organized by project, focus on what shipped)"
}
</output_requirements>

<content_guidelines>
- Organize by project/repository
- Focus on what shipped: features, fixes, improvements (ONLY user-facing impact and meaningful changes)
- It's possible for a given project that no user-facing meaningful changes were shipped. If that's the case, then just don't include this project.
- Keep it readable and engaging
- Use appropriate markdown formatting (headings, lists, etc.) following this spec:
    - The frontmatter's titleText and introText will be used as the h1/"#" heading at the start of the markdown and introduction paragraph - so you should not include an h1/"#" heading at the start of the markdown or introduction paragraph - this will be handled by the frontmatter.
- Do NOT include commit hashes, URLs, or technical metadata
- Do NOT include trivial changes or internal refactoring
- Do NOT include any client-specific information including names, brands, or other proprietary information. Only information about the projects in the commit list can be mentioned.
- Do NOT include any brand/company names if not necessary - the generated shiplog is about the projects themselves, not the client.
</content_guidelines>

<commits>
${formattedCommits}
</commits>

Return only the JSON object, no additional text:`;

  const cliCommand = `echo <prompt> | claude -p --model ${MODEL_ID} --max-turns 1 --tools ""`;
  const timestamp = new Date().toISOString();

  try {
    // Use stdin to pass the prompt (safer than command-line args)
    const { stdout, stderr } = await execPromise(
      `echo ${JSON.stringify(prompt)} | claude -p --model ${MODEL_ID} --max-turns 1 --tools ""`,
      {
        env: {
          ...process.env,
          CLAUDE_CODE_OAUTH_TOKEN: shiplogEnv.CLAUDE_CODE_OAUTH_TOKEN,
        },
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large responses
        timeout: 60000, // 60 second timeout
      }
    );

    if (stderr) {
      console.warn("[Claude] stderr output:", stderr);
    }

    // Parse JSON response
    let shiplogContent: ShiplogContent;
    try {
      // Extract JSON from response (Claude might wrap it in markdown code blocks)
      const jsonMatch = stdout.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in Claude response");
      }

      shiplogContent = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!shiplogContent.titleText || !shiplogContent.previewText || !shiplogContent.introText || !shiplogContent.content) {
        throw new Error("Missing required fields in Claude response");
      }
    } catch (parseError) {
      console.error("[Claude] Failed to parse JSON response:", parseError);
      console.error("[Claude] Raw response:", stdout);
      throw new Error(`Failed to parse Claude JSON response: ${parseError}`);
    }

    console.log(`[Claude] Successfully synthesized shiplog`);
    console.log(`[Claude] Model: ${MODEL_ID}`);
    console.log(`[Claude] Title: ${shiplogContent.titleText}`);
    console.log(`[Claude] Preview: ${shiplogContent.previewText}`);

    const metadata: SynthesisMetadata = {
      model: MODEL_ID,
      prompt,
      timestamp,
      cliCommand,
    };

    return { content: shiplogContent, metadata };
  } catch (error) {
    console.error("[Claude] Error synthesizing shiplog:", error);
    throw new Error(`Failed to synthesize shiplog with Claude: ${error}`);
  }
}
