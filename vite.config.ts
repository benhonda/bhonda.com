import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { $ } from "zx";
import devToolsJson from "vite-plugin-devtools-json";
import { existsSync } from "fs";
// NOTE: FOR SSL, ADD:
// import basicSsl from "@vitejs/plugin-basic-ssl";

// Helper to run a generator only if it exists
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

    // NOTE: FOR SSL, ADD:
    // proxy: {},
  },

  optimizeDeps: {
    // fix a remix bug where this gets bundled with client and fails
    exclude: ["@node-rs/argon2"],
  },

  plugins: [
    // to get rid of annoying chrome devtools errors in console
    devToolsJson(),
    // NOTE: FOR SSL, ADD:
    // basicSsl(),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    {
      name: "auto-generators",
      apply: "serve",
      configureServer(server) {
        // Run all generators on server start
        server.watcher.once("ready", async () => {
          console.log("Running generators...");
          await Promise.all(generators.map(runGenerator));
        });

        // Set up watchers for each generator
        generators.forEach((gen) => {
          gen.watchPatterns.forEach(({ pattern, event, suffix }) => {
            server.watcher.on(event, async (file) => {
              const shouldRun = file.includes(pattern) && (!suffix || file.endsWith(suffix));
              if (shouldRun) {
                await runGenerator(gen);
              }
            });
          });
        });
      },
    },

    // build
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

const generators: {
  name: string;
  script: string;
  watchPatterns: { pattern: string; event: string; suffix?: string }[];
}[] = [
  {
    name: "generouted",
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
  // {
  //   name: "eventbridge api handler map",
  //   script: "app/lib/eventbridge-api-jobs/_core/eventbridge-job-map.generate.ts",
  //   watchPatterns: [
  //     { pattern: "app/lib/eventbridge-api-jobs", event: "add", suffix: "job-handler.server.ts" },
  //     { pattern: "app/lib/eventbridge-api-jobs", event: "unlink", suffix: "job-handler.server.ts" },
  //   ],
  // },
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
