import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Quote } from "~/components/people/quote";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
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

      <List>
        <ListItem>Runs now support notes for tracking context and decisions alongside each recording attempt</ListItem>
        <ListItem>Configuration dialogs gained helper popovers and duplication shortcuts for faster setup</ListItem>
        <ListItem>Device presets with mobile-standard and desktop-standard configurations optimized for common recording scenarios</ListItem>
        <ListItem>S3 destination system routes outputs independently—send different formats to different buckets with template variables for dynamic paths</ListItem>
        <ListItem>GPU-accelerated encoding switched to HEVC for better compression; rendering pipeline moved to hardware acceleration for smoother capture at higher resolutions</ListItem>
      </List>

      <Quote note="terminology cleanup">
        Renamed jobs to runs throughout the interface to better reflect the
        per-attempt nature of recording tasks.
      </Quote>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <List>
        <ListItem>Pull operations now prompt before deleting stale files, with a force flag for automation contexts</ListItem>
        <ListItem>Soft-delete filtering improved with proper precedence handling and per-table column overrides</ListItem>
        <ListItem>Include-loader respects soft-delete flags through nested queries; new <code>includeSoftDeleted</code> option gives explicit control over surfacing deleted records</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <List>
        <ListItem>Navigation gained a flyout interface with cascade visibility controls</ListItem>
        <ListItem>Client-side embedding cache enables zero-latency relevance sorting for sections</ListItem>
        <ListItem>Taxonomy prompts sharpened to better disambiguate components from sections</ListItem>
        <ListItem>Filtering moved to a registry-driven system for consistent behavior across all discovery routes</ListItem>
      </List>
    </ShiplogLayout>
  );
}
