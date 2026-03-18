import { TEXT_VARIANTS, type TextProps } from "~/components/misc/text";
import { PUBLIC_SPACER_SIZES, type SpacerProps } from "~/components/misc/spacer";
import type { QuoteProps } from "~/components/people/quote";
import type { TagProps } from "~/components/misc/tag";
import { PROJECTS_CONFIG } from "~/lib/projects/projects-config";
import type { InlineCodeProps } from "~/components/blog/inline-code";
import type { CodeBlockProps } from "~/components/blog/code-block";
import type { AudioPlayerProps } from "~/components/blog/audio-player";
import type { TranscriptLineProps } from "~/components/blog/transcript-line";
import type { ListProps, ListItemProps } from "~/components/misc/list";

type PropDocs<T> = { [K in keyof T]?: string };
type TaxonomyEntry<T> = { importPath: string; usage: string; props: PropDocs<T>; example: string };

const TAXONOMY = {
  Text: {
    importPath: "~/components/misc/text",
    usage: "Body copy, section headings, labels. Primary typography primitive.",
    props: {
      as: "h1|h2|h3|h4|p|span|div|li",
      variant: Object.keys(TEXT_VARIANTS).join("|"), // ← TEXT_VARIANTS, never stale
      children: "Text content",
    },
    example: '<Text as="p" variant="body">Your text here</Text>',
  } satisfies TaxonomyEntry<TextProps>,

  Spacer: {
    importPath: "~/components/misc/spacer",
    usage: "Vertical whitespace between major sections.",
    props: {
      size: PUBLIC_SPACER_SIZES.join("|"), // ← PUBLIC_SPACER_SIZES, never stale
    },
    example: '<Spacer size="sm" />',
  } satisfies TaxonomyEntry<SpacerProps>,

  Quote: {
    importPath: "~/components/people/quote",
    usage: "A notable statement or key insight worth calling out visually.",
    props: {
      children: "The quote text",
      note: "Optional attribution or context",
    },
    example: '<Quote note="via commit">We shipped the thing.</Quote>',
  } satisfies TaxonomyEntry<QuoteProps>,

  Tag: {
    importPath: "~/components/misc/tag",
    usage: "Inline project tag pill linking to /projects/:slug. Use only valid project slugs.",
    props: {
      project: PROJECTS_CONFIG.map((p) => p.slug).join("|"), // ← projects-config, never stale
    },
    example: '<Tag project="bhonda-com" />',
  } satisfies TaxonomyEntry<TagProps>,

  InlineCode: {
    importPath: "~/components/blog/inline-code",
    usage: "Inline code snippet within a sentence or paragraph. Use for identifiers, commands, file names, env vars, etc.",
    props: {
      children: "The code string to display",
    },
    example: "<InlineCode>x11grab</InlineCode>",
  } satisfies TaxonomyEntry<InlineCodeProps>,

  CodeBlock: {
    importPath: "~/components/blog/code-block",
    usage: "Multi-line code sample. Renders with syntax highlighting. Use for config files, shell commands, or code snippets.",
    props: {
      children: "The code string (required)",
      language: "Optional language label shown top-right (e.g. bash, tsx, yaml)",
      filename: "Optional filename label shown top-left (e.g. .env, docker-compose.yml)",
    },
    example: '<CodeBlock language="bash">npm install</CodeBlock>',
  } satisfies TaxonomyEntry<CodeBlockProps>,

  List: {
    importPath: "~/components/misc/list",
    usage: "Unordered or ordered list. Children must be <ListItem> elements.",
    props: {
      as: "ul|ol",
      children: "<ListItem> elements",
    },
    example: '<List>\n  <ListItem>First point</ListItem>\n  <ListItem>Second point</ListItem>\n</List>',
  } satisfies TaxonomyEntry<ListProps>,

  ListItem: {
    importPath: "~/components/misc/list",
    usage: "A single item inside a <List>. Renders as body-variant text.",
    props: {
      children: "Item content (can include inline elements like <InlineCode>)",
    },
    example: "<ListItem>Install the dependency</ListItem>",
  } satisfies TaxonomyEntry<ListItemProps>,

  AudioPlayer: {
    importPath: "~/components/blog/audio-player",
    usage: "Sticky embedded audio player for NotebookLM-generated audio overviews or any CDN-hosted audio.",
    props: {
      cdnPath: 'Path relative to CDN root (e.g. "blog/2026-03-18/overview.m4a")',
      title: "Optional label shown above the player",
    },
    example: '<AudioPlayer cdnPath="blog/2026-03-18/overview.m4a" title="Audio Overview" />',
  } satisfies TaxonomyEntry<AudioPlayerProps>,

  TranscriptLine: {
    importPath: "~/components/blog/transcript-line",
    usage: "A single speaker turn in a transcript. Use inside a <div className=\"space-y-3\"> wrapper.",
    props: {
      speaker: "Speaker label (e.g. \"Speaker 1\", \"Host\")",
      children: "The spoken content — can include inline elements like <InlineCode>",
    },
    example: '<TranscriptLine speaker="Speaker 1">We found the bottleneck.</TranscriptLine>',
  } satisfies TaxonomyEntry<TranscriptLineProps>,
} as const;

/** Serialized string injected into Claude's synthesis prompt */
export function buildTaxonomyString(): string {
  return Object.entries(TAXONOMY)
    .map(([name, entry]) => {
      const propsStr = Object.entries(entry.props)
        .map(([k, v]) => `  ${k}: ${v}`)
        .join("\n");
      return `### <${name}>\nUse for: ${entry.usage}\nProps:\n${propsStr}\nExample: ${entry.example}`;
    })
    .join("\n\n");
}

/** Import paths for the generated TSX file — grouped by path to produce clean named imports. */
export const taxonomyImports: { names: string[]; from: string }[] = Object.values(
  Object.entries(TAXONOMY).reduce<Record<string, { names: string[]; from: string }>>(
    (acc, [name, entry]) => {
      const path = entry.importPath;
      if (!acc[path]) acc[path] = { names: [], from: path };
      acc[path].names.push(name);
      return acc;
    },
    {}
  )
);
