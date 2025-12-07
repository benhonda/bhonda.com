import fs from "fs/promises";
import path from "path";

const actionsDir = path.resolve("app/lib/actions");
const outFile = path.resolve("app/lib/actions/_core/action-map.ts");

function camelCase(name: string) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

async function main() {
  const entries = await fs.readdir(actionsDir, { withFileTypes: true });

  const imports: string[] = [];
  const mappings: string[] = [];
  const actionNames: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const actionType = entry.name;
    const importVar = camelCase(actionType);

    // verify handler exists
    const handlerPath = path.join(actionsDir, actionType, "action-handler.server.ts");
    try {
      await fs.access(handlerPath);
    } catch {
      console.warn(`⚠️  Skipping ${actionType}: handler file not found`);
      continue;
    }

    const relativeImport = `~/lib/actions/${actionType}/action-handler.server`;

    imports.push(`import ${importVar} from "${relativeImport}";`);
    mappings.push(`  "${actionType}": ${importVar},`);
    actionNames.push(`"${actionType}"`);
  }

  const content = `//
//
// ⚠️ AUTO-GENERATED — DO NOT EDIT
//
//

${imports.join("\n")}

export type ActionName = ${actionNames.join(" | ")};

const handlerMap: Record<ActionName, any> = {
${mappings.join("\n")}
};

export default handlerMap;
`;

  await fs.writeFile(outFile, content);
  console.log(`√ Generated handler map with ${mappings.length} entries`);
}

main().catch((err) => {
  console.error("Failed to generate handler map:", err);
  process.exit(1);
});
