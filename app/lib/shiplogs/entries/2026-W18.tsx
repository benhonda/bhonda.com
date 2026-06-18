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
  titleText: "Insights Publication & New Agency Tooling",
  previewText: "Launched a full-featured publication platform with multiple posts and author profiles, shipped design improvements to photo processing workflows, and scaffolded a new agency activity measurement tool.",
  publishedAt: "2026-05-03",
  week: 18,
  year: 2026,
  status: "draft",
  projectTags: ["theadpharm-com", "hearth-press", "devrounds"],
} satisfies ShiplogMeta;

export default function Shiplog2026W18() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        A publishing-heavy week. Launched a complete Insights publication platform, reimagined photo import flows for recipe preservation, and stood up new tooling to measure agency output.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="theadpharm-com" /> Insights Publication
      </Text>

      <Text as="p" variant="body">
        Shipped a full-featured publication platform with two categories: AI & Tech and Compliance Insights. The platform includes markdown-based posts, author profiles with bios and headshots, featured post layouts, category filtering, RSS feeds, and an email-only newsletter signup.
      </Text>

      <Text as="p" variant="body">
        Redesigned the Insights index with progressive disclosure and filtering controls. The layout adapts based on post count, maintaining visual consistency whether showing one featured post or multiple across categories. Navigation and footer were centralized into the app layout for consistency across all sections.
      </Text>

      <Quote note="via new feature">
        Four AI & Tech posts and the first Compliance Insights post launched with backfilled publish dates and a broader framing for the publication's scope.
      </Quote>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="hearth-press" /> Photo Processing & Import Flow
      </Text>

      <Text as="p" variant="body">
        Redesigned the photo import experience with a new always-editing preview mode and a dedicated photo processing screen. The import flow now offers both textarea and photo entry points, consolidating the library and recipe registry into a unified view. Added a unit-picker sub-flow for recipe measurements.
      </Text>

      <Text as="p" variant="body">
        Shipped landing page v2 and added two new user flows: a page-lived-in scenario and an exploratory friends-sharing flow. These flows help validate the photo processing and import redesign with real-world use cases.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="devrounds" /> Agency Activity Tool
      </Text>

      <Text as="p" variant="body">
        Scaffolded a new project to measure agency activity and output. The tool includes a data pipeline with multiple sources, viewer routes for exploring activity, and infrastructure provisioning with Terragrunt. Built a GitHub reader skill and AI agent skill scaffolding to power the activity measurement engine.
      </Text>
    </ShiplogLayout>
  );
}
