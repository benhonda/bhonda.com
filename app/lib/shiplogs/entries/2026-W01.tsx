import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Quote } from "~/components/people/quote";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W01",
  titleText: "From Page Intelligence to Pipeline Precision: A Week of Distributed Systems",
  previewText: "Shipped automatic collision detection for inspiration pipelines, complete distribution retry systems for video recording, and multi-service authentication for PostgreSDK—all while teaching machines to understand web pages.",
  publishedAt: "2026-01-04",
  week: 1,
  year: 2026,
  status: "published",
  projectTags: ["inspiration-index", "autoscroll-recorder", "postgresdk", "agentic-editor"],
} satisfies ShiplogMeta;

export default function Shiplog2026W01() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Shipped automatic collision detection that triggers S3 auto-processing and simplifies the retry workflow. The pipeline now consolidates page type taxonomy into a single source of truth, making it easier to classify and process content consistently across the system. The app got a fresh sidebar navigation and enhanced pipeline review UI, plus a complete theme system migration for a cleaner codebase.
      </Text>

      <Text as="p" variant="body">
        The link scraper added intelligent page discovery and classification—automatically detecting and categorizing different page types as it crawls. Page type hints are now passed directly to the Recorder API, and metadata is properly batched per-URL for better tracking.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        The big win: unlimited distribution retries with timeout detection. Jobs that fail to distribute now automatically retry with detailed technical tracking. The distribution system displays real-time status on job detail pages, making it easy to monitor what's happening with your recordings.
      </Text>

      <Quote note="retry count">Distribution retries increased from 3 to 50 attempts with full idempotency tracking.</Quote>

      <Text as="p" variant="body">
        Improved the S3 destination setup flow with auto-generated external IDs and a corrected workflow that's much easier to follow. Under the hood, migrated to JWT authentication and Terragrunt infrastructure, added support for optional per-job metadata via the API, iubenda cookie consent banner support, and comprehensive S3 metadata with every recording. The Lambda now properly persists user metadata to the database.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Breaking change: multi-service authentication. Replaced the single-secret JWT system with proper multi-service auth, making it production-ready for distributed systems. Added an init pull subcommand for simpler configuration and increased max pagination to 1,000 records. Fixed several developer experience issues: direct nested includes now work without wrapper syntax, JWT secrets are no longer hardcoded in generated code, and the CLI shows helpful errors when config files are missing. Documentation received a major overhaul with new guides for service authorization and SDK distribution.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="agentic-editor" />
      </Text>

      <Text as="p" variant="body">
        Migrated infrastructure to use shared VPC resources, reducing operational complexity and improving resource utilization across environments.
      </Text>
    </ShiplogLayout>
  );
}
