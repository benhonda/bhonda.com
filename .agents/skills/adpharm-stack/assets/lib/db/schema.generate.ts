import fs from "fs/promises";
import path from "path";

const schemasDir = path.resolve("app/lib/db/schemas");
const outFile = path.resolve("app/lib/db/schema.ts");

async function main() {
  const entries = await fs.readdir(schemasDir, { withFileTypes: true });

  const schemaFiles: string[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".ts")) continue;

    const modulePath = `~/lib/db/schemas/${entry.name.replace(".ts", "")}`;
    schemaFiles.push(modulePath);
  }

  const content = `//
//
// ⚠️ AUTO-GENERATED — DO NOT EDIT
//
//

${schemaFiles.map((path) => `export * from "${path}";`).join("\n")}
`;

  await fs.writeFile(outFile, content);
  console.log(`✓ Generated database schema file with ${schemaFiles.length} schema files`);
}

main().catch((err) => {
  console.error("Failed to generate database schema file:", err);
  process.exit(1);
});
