import { exec } from "child_process";
import { promisify } from "util";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import type { RepoCommits } from "./github-service.server";

const execPromise = promisify(exec);

export interface ShiplogContent {
  title: string;
  description: string;
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
export async function synthesizeShiplog(
  repoCommits: RepoCommits[],
  startDate: Date,
  endDate: Date
): Promise<{ content: ShiplogContent; metadata: SynthesisMetadata }> {
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

<date_range>
${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}
</date_range>

<output_requirements>
Return a JSON object with exactly these three fields:

{
  "title": "Creative, engaging title for the shiplog (keep it punchy and exciting)",
  "description": "1-2 sentence preview/summary for listing pages (make it compelling)",
  "content": "Full markdown blog post content (concise, organized by project, focus on what shipped)"
}
</output_requirements>

<content_guidelines>
- Organize by project/repository
- Focus on what shipped: features, fixes, improvements
- Emphasize user-facing impact and meaningful changes
- Keep it readable and engaging
- Use appropriate markdown formatting (headings, lists, etc.)
- Do NOT include commit hashes, URLs, or technical metadata
- Do NOT include trivial changes or internal refactoring unless significant
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
      if (!shiplogContent.title || !shiplogContent.description || !shiplogContent.content) {
        throw new Error("Missing required fields in Claude response");
      }
    } catch (parseError) {
      console.error("[Claude] Failed to parse JSON response:", parseError);
      console.error("[Claude] Raw response:", stdout);
      throw new Error(`Failed to parse Claude JSON response: ${parseError}`);
    }

    console.log(`[Claude] Successfully synthesized shiplog`);
    console.log(`[Claude] Model: ${MODEL_ID}`);
    console.log(`[Claude] Title: ${shiplogContent.title}`);
    console.log(`[Claude] Description: ${shiplogContent.description}`);

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
