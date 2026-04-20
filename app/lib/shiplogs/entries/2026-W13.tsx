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
  slug: "2026-W13",
  titleText: "Email invites, performance wins, and quality gates",
  previewText:
    "Shipped email-based team invites, major performance improvements across the stack, and stricter quality controls for captured content.",
  publishedAt: "2026-03-29",
  week: 13,
  year: 2026,
  status: "published",
  projectTags: ["inspiration-index", "autoscroll-recorder", "silo-cdp", "bhonda-com", "postgresdk"],
} satisfies ShiplogMeta;

export default function Shiplog2026W13() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Big collaboration upgrade this week with email-based team invites. Also shipped performance improvements, search
        personalization, and automated quality gates for content curation.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Team invites now work with email addresses — invitees no longer need an existing account. Send an invite to any
        email, and they'll get prompted to create an account when they accept. Billing visibility is now scoped to team
        owners only.
      </Text>

      <Text as="p" variant="body">
        Performance improvements across the board: fonts now preload to eliminate render-blocking fetches, dialogs and
        analytics load lazily, and animations moved from JavaScript to pure CSS. Pages load faster and feel snappier.
      </Text>

      <Text as="p" variant="body">
        Search results now show personalized suggestions on the hero section based on your query patterns. Behind the
        scenes, content is now sorted by <InlineCode>ai_design_score</InlineCode> instead of embedding distance,
        improving relevance. Captures with design scores below 2.0 are automatically rejected before entering the index.
      </Text>

      <Text as="p" variant="body">
        Browsing and filtering got a refresh. The taxonomy formerly called "website model" is now "website archetype"
        throughout the UI. Industry and archetype taxonomies have been expanded and refined. Browse filters and page
        headers have been overhauled for clarity. Device filtering now uses explicit groups instead of viewport
        heuristics.
      </Text>

      <Text as="p" variant="body">
        Smaller improvements: plan badges now appear on user avatars in the nav bar, horizontal scroll bug fixed on the
        filter selector, sort preferences are now saved in a cookie, and search results use cursor pagination for better
        performance. Added CSV export for Google Ads page feeds.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Improved reliability for GPU-based recording jobs. Added capacity gating with tiered delays to prevent queue
        saturation. Fixed an issue where multi-output distribution events used incorrect S3 keys. URL override matching
        now correctly handles trailing slashes.
      </Text>

      <Text as="p" variant="body">
        Fixed a bug where third-party scripts were monkey-patching <InlineCode>console.log</InlineCode>, breaking debug
        output. Hardened the recording pipeline with AMI pinning, better error propagation, and framerate adjustments.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        Added March 2026 report generation for PNHCA.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="bhonda-com" />
      </Text>

      <Text as="p" variant="body">
        Published two new FAQ entries: one covering Google Ads Search Campaigns and another on HTTPS feed sources.
        Audited all existing FAQs to remove fluff. Added an Accordion component to support expandable Q&A sections.
        Added project page for <Tag project="bunny-cache-buster" />.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Shipped three releases this week. Removed default limits from list operations — now returns all records unless
        explicitly limited. Fixed type generation for nullable belongs-to relationships. Improved error handling with
        proper HTTP status codes for Postgres errors and added UUID format validation.
      </Text>
    </ShiplogLayout>
  );
}
