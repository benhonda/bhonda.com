import { TEXT_VARIANTS, type TextProps } from "~/components/misc/text";
import { PUBLIC_SPACER_SIZES, type SpacerProps } from "~/components/misc/spacer";
import type { QuoteProps } from "~/components/people/quote";
import type { TagProps } from "~/components/misc/tag";
import { PROJECTS_CONFIG } from "~/lib/projects/projects-config";

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

/** Import paths for the generated TSX file */
export const taxonomyImports = Object.entries(TAXONOMY).map(([name, entry]) => ({
  name,
  from: entry.importPath,
}));
