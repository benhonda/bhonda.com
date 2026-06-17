import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Quote } from "~/components/people/quote";
import { Tag } from "~/components/misc/tag";
import { InlineCode } from "~/components/blog/inline-code";
import { CodeBlock } from "~/components/blog/code-block";
import { List, ListItem } from "~/components/misc/list";
import { AudioPlayer } from "~/components/blog/audio-player";
import { TranscriptLine } from "~/components/blog/transcript-line";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W19",
  titleText: "Case Studies, Tracking Link Controls, and Email QC Tooling",
  previewText: "Launched Case Studies publication with citation tracking, shipped per-link UTM controls for tracking templates, enriched Asana integration for activity tool, and added link auditing and PDF export for email workflows.",
  publishedAt: "2026-05-10",
  week: 19,
  year: 2026,
  status: "draft",
  projectTags: ["theadpharm-com", "adapts", "devrounds", "foundation-emails-fork"],
} satisfies ShiplogMeta;

export default function Shiplog2026W19() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        New publication surfaces this week: Case Studies with citation tracking on the agency site, granular UTM controls for tracking links, deeper Asana integration for activity metrics, and QC tooling for email template workflows.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="theadpharm-com" /> Case Studies Launch
      </Text>
      <Text as="p" variant="body">
        Shipped the Case Studies publication with brand-author model and citation tracking. The first post went live with a system for tracking quoted sources and attributions throughout case study content.
      </Text>
      <Text as="p" variant="body">
        Refined the Sister Agency section with shared glowing box components and two-column layout. Added pixel-wipe effect to the team photo on the about page hero—transitions from black and white to color on load.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adapts" /> Tracking Link Controls
      </Text>
      <Text as="p" variant="body">
        Added per-link toggles for <InlineCode>utm_via</InlineCode> and <InlineCode>utm_referrer</InlineCode> parameters. Tracking links now support granular control over which UTM params get auto-appended to destination URLs.
      </Text>
      <Text as="p" variant="body">
        Fixed trailing slash handling—destination URLs now preserve trailing slashes instead of stripping them. Migrated template variable from <InlineCode>__destination_query_params</InlineCode> to <InlineCode>__utm_config</InlineCode> for clearer naming.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="devrounds" /> Asana Integration
      </Text>
      <Text as="p" variant="body">
        Enriched the Asana data pipeline with people sync and project metadata synchronization. Activity metrics now pull from Asana tasks, people, and project structures with race-safe ingest and 12-month backfill.
      </Text>
      <Text as="p" variant="body">
        Consolidated routes under <InlineCode>_app</InlineCode> for cleaner navigation. Added shadcn and UX skills to the agent toolkit.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="foundation-emails-fork" /> Email QC Tooling
      </Text>
      <Text as="p" variant="body">
        Added Links view to the compare page—tabulates every anchor tag across language variants with validation flags for smell detection. Makes link QC faster by surfacing all URLs in one table.
      </Text>
      <Text as="p" variant="body">
        Shipped PDF export task for rendering templates to single-page PDFs for client approval workflows. Added view-in-browser URL self-healing with historical canonical lookup and <InlineCode>.no-substitutions.html</InlineCode> generation for every template.
      </Text>
      <Text as="p" variant="body">
        Delivered multiple client templates with improved link handling, banner migrations, and Product Monograph anchoring.
      </Text>
    </ShiplogLayout>
  );
}
