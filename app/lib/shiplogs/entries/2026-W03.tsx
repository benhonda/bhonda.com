import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
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

      <Text as="p" variant="body">
        The app got a major navigation overhaul, replacing the sidebar with a cleaner top navigation bar and adding a public landing page. The discover experience is now more intuitive with URL-based device preferences and improved typography. Route structure was streamlined from /resources to /captures, making the URL scheme more descriptive. Discovery now includes website-grouped views with collapsible filters, letting you browse by Components/Assets tabs with website-level filtering. SEO got proper meta tags, and the app now displays favicons alongside captures. Section management improved with the ability to delete sections and auto-generated filter taxonomies from YAML schemas.
      </Text>

      <Text as="p" variant="body">
        Video frame analysis got smarter with loading screen detection, preventing blank frames from cluttering the dataset. Gemini context caching was added for faster AI processing, along with soft-delete support and device tracking. The taxonomy system became dynamic with configurable section layouts. Styling data flattened from nested objects to top-level columns with a constrained color palette, metadata override fields got the ii-set prefix, and support for Open Graph images and favicons was added.
      </Text>

      <Text as="p" variant="body">
        URL handling became more robust with enhanced deduplication and canonical URL normalization. The scraper now collects favicons and Twitter card images during metadata extraction. Page type definitions auto-generate from YAML schemas with strict wildcard pattern validation, a URL liveness verification script ensures only active pages make it into the pipeline, and the Recorder submission cron shifted to daily at noon EST.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        The SDK gained flexible numeric type mapping through a new numericMode config option, giving developers control over how PostgreSQL numeric types are handled in TypeScript. Typed include methods now support query options for more powerful relational queries. JSONB handling improved with better generic types and type-safe JsonValue replacing loose Record&lt;string, any&gt; definitions. Vector search expanded with support for all pgvector types and conditional generation of vector-specific code. Authentication got easier with pull token support and improved config merging.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        The web interface added SWR-based job status polling for real-time updates on recording progress. Job creation logic was extracted into shared utilities for cleaner code reuse. On the API side, viewport dimensions are now captured in S3 metadata with centralized device configurations. Type safety improved across the board, especially in distribution Lambda and S3 metadata validation.
      </Text>

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
