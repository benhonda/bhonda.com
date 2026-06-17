import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { $ } from "zx";
import devToolsJson from "vite-plugin-devtools-json";
import { existsSync } from "fs";

/**
 * Code generators run two ways, both calling the same scripts:
 *  - here, automatically, on dev-server start + on build, re-running on file changes
 *  - via `task generate` (which `task typecheck` depends on) for typecheck / CI
 *
 * Add a generator by appending to `generators` below. Each is guarded by existsSync,
 * so trimming a subsystem (deleting its generator script) is a safe no-op.
 */
const generators: {
  name: string;
  script: string;
  watchPatterns: { pattern: string; event: string; suffix?: string }[];
}[] = [
  {
    name: "generouted (route types)",
    script: "app/lib/router/generouted-generate-routes.ts",
    watchPatterns: [
      { pattern: "app/routes", event: "add", suffix: ".tsx" },
      { pattern: "app/routes", event: "add", suffix: ".ts" },
      { pattern: "app/routes", event: "unlink", suffix: ".tsx" },
      { pattern: "app/routes", event: "unlink", suffix: ".ts" },
    ],
  },
  {
    name: "action handler map",
    script: "app/lib/actions/_core/action-map.generate.ts",
    watchPatterns: [
      { pattern: "app/lib/actions", event: "add", suffix: "action-handler.server.ts" },
      { pattern: "app/lib/actions", event: "unlink", suffix: "action-handler.server.ts" },
    ],
  },
  {
    name: "database schema",
    script: "app/lib/db/schema.generate.ts",
    watchPatterns: [
      { pattern: "app/lib/db/schemas", event: "add", suffix: "-schema.ts" },
      { pattern: "app/lib/db/schemas", event: "unlink", suffix: "-schema.ts" },
    ],
  },
  {
    name: "environment consolidation",
    script: "app/lib/env/_core/env-map.generate.ts",
    watchPatterns: [
      { pattern: "app/lib/env", event: "add", suffix: "-env.server.ts" },
      { pattern: "app/lib/env", event: "add", suffix: "-env.client.ts" },
      { pattern: "app/lib/env", event: "unlink", suffix: "-env.server.ts" },
      { pattern: "app/lib/env", event: "unlink", suffix: "-env.client.ts" },
    ],
  },
];

async function runGenerator(gen: { name: string; script: string }) {
  if (existsSync(gen.script)) {
    await $`bun run ${gen.script}`;
    console.log(`√ ${gen.name} generated`);
  } else {
    console.log(`⚠️  Skipping ${gen.name}: ${gen.script} not found`);
  }
}

export default defineConfig({
  server: {
    host: "0.0.0.0", // required to work in a devcontainer
    port: 3000,
  },
  resolve: {
    // `~` → app/. vite-tsconfig-paths is deprecated; alias directly. tsconfig `paths` covers tsc.
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
  plugins: [
    devToolsJson(),
    tailwindcss(),
    reactRouter(),
    // Run all generators on dev-server start, then re-run the relevant one on file changes.
    {
      name: "auto-generators",
      apply: "serve",
      configureServer(server) {
        server.watcher.once("ready", async () => {
          console.log("Running generators...");
          await Promise.all(generators.map(runGenerator));
        });
        generators.forEach((gen) => {
          gen.watchPatterns.forEach(({ pattern, event, suffix }) => {
            server.watcher.on(event, async (file) => {
              if (file.includes(pattern) && (!suffix || file.endsWith(suffix))) {
                await runGenerator(gen);
              }
            });
          });
        });
      },
    },
    // Run all generators once at build start.
    {
      name: "auto-generators-build",
      apply: "build",
      async buildStart() {
        console.log("Running generators...");
        await Promise.all(generators.map(runGenerator));
      },
    },
  ],
});
