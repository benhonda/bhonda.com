import { existsSync, readFileSync } from "node:fs";

/**
 * Tests never see live secrets (`tests-see-no-secrets` in references/taskfile.md). bunfig
 * turns off Bun's own .env loading and the test task carries no `dotenv:`, so a secret can
 * only arrive by regression — a `dotenv:` re-added to the task, or one exported in a shell.
 * The secrets on this machine are exactly the keys `task pull` wrote to .env.secrets from
 * SSM, so that file IS the list: nothing to keep in sync by hand.
 */
const SECRETS_FILE = ".env.secrets";

const secretNames = existsSync(SECRETS_FILE)
  ? [...readFileSync(SECRETS_FILE, "utf8").matchAll(/^([A-Za-z_][A-Za-z0-9_]*)=/gm)].map((match) => match[1])
  : [];
const leaked = secretNames.filter((name) => name !== undefined && process.env[name] !== undefined);

if (leaked.length > 0) {
  throw new Error(
    `Live secrets in the test environment: ${leaked.join(", ")}. Tests must never see them — ` +
      "`test:<app>` in Taskfile.yml must carry no `dotenv:`, and your shell must not export them."
  );
}
