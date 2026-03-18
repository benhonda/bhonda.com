import { spawn } from "child_process";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";

export interface ClaudeRunOptions {
  model?: string;
  maxTurns?: number;
  /** Tools Claude is allowed to use. Defaults to none. */
  allowedTools?: string[];
  timeout?: number;
}

/**
 * Runs `claude -p` with the given prompt piped to stdin.
 * Returns stdout. No shell involved — prompt is passed directly via stdin.
 * All tools are disallowed by default; pass `allowedTools` to opt in.
 * Project/local settings are skipped by default; pass `settingSources` to override.
 */
export async function codeWithClaude(prompt: string, options: ClaudeRunOptions = {}): Promise<string> {
  const { model, maxTurns, allowedTools = [], timeout = 120_000 } = options;

  const args = ["-p"];
  if (model) args.push("--model", model);
  if (maxTurns !== undefined) args.push("--max-turns", String(maxTurns));
  if (allowedTools.length) args.push("--allowedTools", ...allowedTools);

  const display = ["claude", ...args].map((a) => (/[\s()]/.test(a) ? `"${a}"` : a)).join(" ");
  console.log("[claude-cli] command:", display);
  const { stdout, stderr } = await spawnWithStdin("claude", args, prompt, {
    env: { ...process.env, CLAUDE_CODE_OAUTH_TOKEN: shiplogEnv.CLAUDE_CODE_OAUTH_TOKEN },
    timeout,
  });

  if (stderr) console.warn("[claude-cli] stderr:", stderr);

  return stdout;
}

function spawnWithStdin(
  cmd: string,
  args: string[],
  input: string,
  options: { env?: NodeJS.ProcessEnv; timeout?: number }
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      env: options.env,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => (stdout += chunk.toString()));
    child.stderr.on("data", (chunk: Buffer) => (stderr += chunk.toString()));

    const timer = options.timeout
      ? setTimeout(() => { child.kill(); reject(new Error("Claude subprocess timed out")); }, options.timeout)
      : null;

    child.on("close", (code) => {
      if (timer) clearTimeout(timer);
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`Claude exited with code ${code}:\n${stderr}`));
    });

    child.on("error", (err) => {
      if (timer) clearTimeout(timer);
      reject(err);
    });

    child.stdin.write(input, "utf-8");
    child.stdin.end();
  });
}
