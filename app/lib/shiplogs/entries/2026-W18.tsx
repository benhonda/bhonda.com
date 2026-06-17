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
  slug: "2026-W18",
  titleText: "Insights Publication, Email Tooling, and Activity Tracking",
  previewText: "Launched the Insights publication with AI & Tech and Compliance categories, shipped template generation improvements for email workflows, and started building the Activity Tool in Devrounds.",
  publishedAt: "2026-05-03",
  week: 18,
  year: 2026,
  status: "draft",
  projectTags: ["theadpharm-com", "foundation-emails-fork", "devrounds", "hearth-press"],
} satisfies ShiplogMeta;

export default function Shiplog2026W18() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Big publishing launch this week. The Insights publication went live with AI & Tech and Compliance categories, RSS feeds, and author profiles. Email template generation got faster and more flexible. And a new project emerged to track agency activity across repositories.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="theadpharm-com" /> Insights Publication
      </Text>

      <Text as="p" variant="body">
        Shipped the full Insights publication platform. The site now hosts posts across AI & Tech and Compliance Insights categories, complete with author profiles, featured post layouts, and progressive disclosure filters on the index page. Added RSS feeds for syndication and an <InlineCode>llms.txt</InlineCode> file for AI discoverability.
      </Text>

      <Text as="p" variant="body">
        Redesigned the Digital Products navigation dropdown to accommodate the new publication and launched an email-only newsletter signup. The navigation and footer are now centralized in the app layout for consistency across all pages.
      </Text>

      <Quote>Four AI & Tech posts and one Compliance Insights post published, with backfilled dates.</Quote>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="foundation-emails-fork" /> Email Template Generation
      </Text>

      <Text as="p" variant="body">
        Email template workflows got a major upgrade. Each template now generates three hosted HTML derivatives, and the compare page includes a download-HTML button for quick exports. Added language-scoped preview tokens and fully-substituted hide-block markers for recipient views.
      </Text>

      <Text as="p" variant="body">
        Refined the Veeva workflow with fragment builds now integrated into the gulp pipeline, shared layouts across projects, and a button-image composer for CTA creation. Fixed an issue where account tokens were incorrectly translated to French on the OCA Resources page.
      </Text>

      <List as="ul">
        <ListItem>Download button for hosted HTML comparison</ListItem>
        <ListItem>Three HTML derivatives per template</ListItem>
        <ListItem>Veeva fragment build integration</ListItem>
        <ListItem>Button-image composer for CTAs</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="devrounds" /> Activity Tool Launch
      </Text>

      <Text as="p" variant="body">
        Started building Devrounds with the Activity Tool at its core. The tool tracks agency metrics across repositories, showing build-time architecture decisions and development patterns. Shipped the initial pipeline, data sources, and viewer routes along with infrastructure scaffolding and a GitHub reader skill.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="hearth-press" /> Design Iteration
      </Text>

      <Text as="p" variant="body">
        Refined the import experience with a restructured flow that splits photo and text entry paths. Added an always-editing import preview, unit picker sub-flow, and new flows for page-lived-in and friend exploration scenarios. Consolidated the library and recipe registry views for simpler navigation.
      </Text>
    </ShiplogLayout>
  );
}
