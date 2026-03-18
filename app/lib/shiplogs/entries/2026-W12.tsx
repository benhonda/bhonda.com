import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Quote } from "~/components/people/quote";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W12",
  titleText: "Notes, Presets, and Faster Filtering",
  previewText: "Recording tools gained notes and device presets, database SDK got safer file management with soft-delete filtering, and search performance improved with embedding cache.",
  publishedAt: "2026-03-22",
  week: 12,
  year: 2026,
  status: "draft",
  projectTags: ["autoscroll-recorder", "postgresdk", "inspiration-index"],
} satisfies ShiplogMeta;

export default function Shiplog2026W12() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Recording workflows got smarter with notes and presets, database tooling
        became safer with interactive prompts, and search performance improved
        with client-side filtering.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Runs now support notes for tracking context and decisions alongside each
        recording attempt. Configuration dialogs gained helper popovers and
        duplication shortcuts for faster setup.
      </Text>

      <Text as="p" variant="body">
        Device presets arrived with mobile-standard and desktop-standard
        configurations optimized for common recording scenarios. The S3
        destination system now routes outputs independently, letting you send
        different formats to different buckets with template variables for
        dynamic paths.
      </Text>

      <Text as="p" variant="body">
        Video quality improvements shipped under the hood: GPU-accelerated
        encoding switched to HEVC for better compression, and the rendering
        pipeline moved to hardware acceleration for smoother capture at higher
        resolutions.
      </Text>

      <Quote note="terminology cleanup">
        Renamed jobs to runs throughout the interface to better reflect the
        per-attempt nature of recording tasks.
      </Quote>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Pull operations now prompt before deleting stale files, with a force
        flag for automation contexts. Soft-delete filtering improved
        significantly with proper precedence handling and per-table column
        overrides.
      </Text>

      <Text as="p" variant="body">
        The include-loader now respects soft-delete flags through nested
        queries, and a new includeSoftDeleted option gives explicit control over
        whether to surface deleted records.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Navigation gained a flyout interface with cascade visibility controls.
        Search performance improved with a client-side embedding cache that
        enables zero-latency relevance sorting for sections.
      </Text>

      <Text as="p" variant="body">
        Taxonomy prompts were sharpened to better disambiguate components from
        sections, and filtering moved to a registry-driven system for consistent
        behavior across all discovery routes.
      </Text>
    </ShiplogLayout>
  );
}
