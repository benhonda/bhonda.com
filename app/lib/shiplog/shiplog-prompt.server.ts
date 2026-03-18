import type { RepoCommits } from "./github-service.server";
import { REPO_CONFIG } from "./repo-whitelist";
import { buildTaxonomyString, taxonomyImports } from "./content-taxonomy";

export function buildShiplogPrompt(args: {
  repoCommits: RepoCommits[];
  startDate: Date;
  endDate: Date;
  outPath: string;
  slug: string;
  week: number;
  year: number;
  publishedAt: string;
}): string {
  const { repoCommits, startDate, endDate, outPath, slug, week, year, publishedAt } = args;
  const taxonomy = buildTaxonomyString();
  const fnName = `Shiplog${slug.replace(/-/g, "")}`;

  const componentImports = taxonomyImports
    .map(({ names, from }) => `import { ${names.join(", ")} } from "${from}";`)
    .join("\n");

  const formattedCommits = repoCommits
    .map((repoData) => {
      const commitList = repoData.commits
        .map((c) => `  - ${c.message.split("\n")[0]} (${c.date.split("T")[0]})`)
        .join("\n");
      const displayName = REPO_CONFIG[repoData.repo as keyof typeof REPO_CONFIG]?.displayName ?? repoData.repo;
      return `### ${displayName}\n${commitList}`;
    })
    .join("\n\n");

  return `<task>
Synthesize a weekly shiplog from the commits below and write it to the target file.
When done, run \`task typecheck\` to verify. Fix any errors and re-run until clean.
</task>

<date_range>
${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}
</date_range>

<content_components>
Use these React components (and only these) for the JSX content. Output valid JSX.

${taxonomy}
</content_components>

<target_file>
Write this file to: ${outPath}

Fill in titleText, previewText, and the JSX content from your synthesis.

\`\`\`tsx
import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
${componentImports}
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "${slug}",
  titleText: "YOUR TITLE HERE",
  previewText: "YOUR PREVIEW HERE",
  publishedAt: "${publishedAt}",
  week: ${week},
  year: ${year},
  status: "draft",        // change to "published" when ready
  projectTags: [],        // add ProjectSlug values as needed
} satisfies ShiplogMeta;

export default function ${fnName}() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      {/* YOUR JSX CONTENT HERE */}
    </ShiplogLayout>
  );
}
\`\`\`
</target_file>

<content_guidelines>
- Organize by project
- Only include user-facing impact: shipped features, fixes, improvements
- Omit projects with no meaningful user-facing changes
- Open with a 1–3 sentence intro paragraph (<Text as="p" variant="body">)
- Use <Text as="h2" variant="heading-sm"> for project headings
- Use <Text as="p" variant="body"> for body paragraphs
- Use <Spacer size="sm" /> between sections
- Use <Quote> for notable statements or key insights
- Use <Tag project="slug"> only with slugs listed in the taxonomy
- No markdown, no bare HTML
- No commit hashes, URLs, or technical metadata
- No trivial changes or internal refactoring
- No client names, brand names, or proprietary information — write about the projects only
- No names of websites the projects interact with externally
- No week numbers
</content_guidelines>

<commits>
${formattedCommits}
</commits>`;
}
