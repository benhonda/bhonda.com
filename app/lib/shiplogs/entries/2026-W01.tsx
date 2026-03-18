import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Quote } from "~/components/people/quote";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import { InlineCode } from "~/components/blog/inline-code";
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

      <List>
        <ListItem>Automatic collision detection that triggers S3 auto-processing and simplifies the retry workflow</ListItem>
        <ListItem>Pipeline now consolidates page type taxonomy into a single source of truth for consistent classification across the system</ListItem>
        <ListItem>Fresh sidebar navigation and enhanced pipeline review UI, plus a complete theme system migration</ListItem>
        <ListItem>Link scraper adds intelligent page discovery and classification—automatically detecting and categorizing page types as it crawls</ListItem>
        <ListItem>Page type hints passed directly to the Recorder API; metadata batched per-URL for better tracking</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        The big win: unlimited distribution retries with timeout detection. Jobs that fail to distribute now automatically retry with detailed technical tracking. The distribution system displays real-time status on job detail pages, making it easy to monitor what's happening with your recordings.
      </Text>

      <Quote note="retry count">Distribution retries increased from 3 to 50 attempts with full idempotency tracking.</Quote>

      <List>
        <ListItem>Improved S3 destination setup flow with auto-generated external IDs and a corrected workflow</ListItem>
        <ListItem>Migrated to JWT authentication and Terragrunt infrastructure</ListItem>
        <ListItem>Support for optional per-job metadata via the API</ListItem>
        <ListItem>iubenda cookie consent banner support</ListItem>
        <ListItem>Comprehensive S3 metadata with every recording</ListItem>
        <ListItem>Lambda now properly persists user metadata to the database</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Breaking change: multi-service authentication. Replaced the single-secret JWT system with proper multi-service auth, making it production-ready for distributed systems.
      </Text>

      <List>
        <ListItem>Added an <InlineCode>init pull</InlineCode> subcommand for simpler configuration</ListItem>
        <ListItem>Increased max pagination to 1,000 records</ListItem>
        <ListItem>Direct nested includes now work without wrapper syntax</ListItem>
        <ListItem>JWT secrets no longer hardcoded in generated code</ListItem>
        <ListItem>CLI shows helpful errors when config files are missing</ListItem>
        <ListItem>Documentation overhauled with new guides for service authorization and SDK distribution</ListItem>
      </List>

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
