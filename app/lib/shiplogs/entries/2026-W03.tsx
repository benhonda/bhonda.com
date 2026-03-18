import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import { InlineCode } from "~/components/blog/inline-code";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W03",
  titleText: "Navigation Overhauls, SDK Power-Ups, and Video Intelligence",
  previewText: "A week of major UX improvements across Inspiration Index, powerful new features in PostgreSDK, and smarter video analysis for the Autoscroll ecosystem.",
  publishedAt: "2026-01-18",
  week: 3,
  year: 2026,
  status: "published",
  projectTags: ["inspiration-index", "postgresdk", "autoscroll-recorder", "bhonda-com"],
} satisfies ShiplogMeta;

export default function Shiplog2026W03() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <List>
        <ListItem>Major navigation overhaul replacing the sidebar with a top navigation bar; new public landing page</ListItem>
        <ListItem>URL-based device preferences and improved typography in the discover experience</ListItem>
        <ListItem>Route structure streamlined from /resources to /captures</ListItem>
        <ListItem>Website-grouped views with collapsible filters and Components/Assets tabs with website-level filtering</ListItem>
        <ListItem>Proper SEO meta tags; favicons displayed alongside captures</ListItem>
        <ListItem>Section management improved with the ability to delete sections and auto-generated filter taxonomies from YAML schemas</ListItem>
      </List>

      <List>
        <ListItem>Loading screen detection in video frame analysis prevents blank frames from cluttering the dataset</ListItem>
        <ListItem>Gemini context caching for faster AI processing</ListItem>
        <ListItem>Soft-delete support and device tracking added</ListItem>
        <ListItem>Dynamic taxonomy system with configurable section layouts</ListItem>
        <ListItem>Styling data flattened from nested objects to top-level columns with a constrained color palette</ListItem>
        <ListItem>Metadata override fields prefixed with <InlineCode>ii-set</InlineCode>; support for Open Graph images and favicons</ListItem>
      </List>

      <List>
        <ListItem>Enhanced URL deduplication and canonical URL normalization</ListItem>
        <ListItem>Scraper now collects favicons and Twitter card images during metadata extraction</ListItem>
        <ListItem>Page type definitions auto-generate from YAML schemas with strict wildcard pattern validation</ListItem>
        <ListItem>URL liveness verification script ensures only active pages enter the pipeline</ListItem>
        <ListItem>Recorder submission cron shifted to daily at noon EST</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <List>
        <ListItem>Flexible numeric type mapping via a new <InlineCode>numericMode</InlineCode> config option</ListItem>
        <ListItem>Typed include methods now support query options for more powerful relational queries</ListItem>
        <ListItem>JSONB handling improved with better generic types and type-safe <InlineCode>JsonValue</InlineCode> replacing loose <InlineCode>Record&lt;string, any&gt;</InlineCode></ListItem>
        <ListItem>Vector search expanded with support for all pgvector types and conditional generation of vector-specific code</ListItem>
        <ListItem>Pull token support and improved config merging simplify authentication</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <List>
        <ListItem>SWR-based job status polling for real-time updates on recording progress</ListItem>
        <ListItem>Job creation logic extracted into shared utilities for cleaner code reuse</ListItem>
        <ListItem>Viewport dimensions captured in S3 metadata with centralized device configurations</ListItem>
        <ListItem>Type safety improved across the board, especially in distribution Lambda and S3 metadata validation</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="bhonda-com" />
      </Text>

      <Text as="p" variant="body">
        Shiplog handling improved with lazy-loading of versions and proper S3 versioning permissions for better performance and reliability.
      </Text>
    </ShiplogLayout>
  );
}
