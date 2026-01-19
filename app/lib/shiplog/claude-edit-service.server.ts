import { exec } from "child_process";
import { promisify } from "util";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";

const execPromise = promisify(exec);

const MODEL_ID = "claude-sonnet-4-5-20250929";

/**
 * Edits a shiplog using Claude Code print mode
 */
export async function editShiplogWithClaude(currentMarkdown: string, editPrompt: string): Promise<string> {
  console.log(`[Claude Edit] Starting edit with prompt: ${editPrompt.substring(0, 100)}...`);

  const systemPrompt = `You are editing a weekly shiplog markdown file.

<current_content>
${currentMarkdown}
</current_content>

<user_edit_request>
${editPrompt}
</user_edit_request>

<instructions>
- Return the FULL updated markdown file with frontmatter intact
- Preserve the frontmatter structure (between ---) exactly as is
- Perform surgical modifications only - Only modify what the user requested
- Maintain markdown formatting following this spec:
    - The frontmatter's title and intro will be used as the h1/"#" heading at the start of the markdown and introduction paragraph - so you should not include an h1/"#" heading at the start of the markdown or introduction paragraph - this will be handled by the frontmatter.
- Return ONLY the markdown content, no explanations, no additional text, no markdown code blocks, no nothing.
- Do NOT include any client-specific information including names, brands, or other proprietary information. Only information about the projects in the commit list can be mentioned.
</instructions>

Return the complete updated markdown file:`;

  try {
    const { stdout, stderr } = await execPromise(
      `echo ${JSON.stringify(systemPrompt)} | claude -p --model ${MODEL_ID} --max-turns 1 --tools ""`,
      {
        env: {
          ...process.env,
          CLAUDE_CODE_OAUTH_TOKEN: shiplogEnv.CLAUDE_CODE_OAUTH_TOKEN,
        },
        maxBuffer: 10 * 1024 * 1024,
        timeout: 60000,
      }
    );

    if (stderr) {
      console.warn("[Claude Edit] stderr output:", stderr);
    }

    const updatedMarkdown = stdout.trim();

    if (!updatedMarkdown) {
      throw new Error("Claude returned empty response");
    }

    console.log(`[Claude Edit] Successfully edited shiplog`);
    console.log(`[Claude Edit] Model: ${MODEL_ID}`);

    return updatedMarkdown;
  } catch (error) {
    console.error("[Claude Edit] Error editing shiplog:", error);
    throw new Error(`Failed to edit shiplog with Claude: ${error}`);
  }
}
