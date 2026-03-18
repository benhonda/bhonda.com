import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W06",
  titleText: "Type Safety Everywhere & The Pipeline Grows",
  previewText: "A massive week of infrastructure hardening — PostgreSDK leveled up with deep TypeScript type inference, the scraper pipeline added seven new sources, and the recorder stack got smarter tech detection and role-based access control.",
  publishedAt: "2026-02-08",
  week: 6,
  year: 2026,
  status: "published",
  projectTags: ["postgresdk", "inspiration-index", "autoscroll-recorder", "silo-cdp", "formgen"],
} satisfies ShiplogMeta;

export default function Shiplog2026W06() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        A landmark week, shipping nine releases (v0.17.0 through v0.18.10) with a focus on TypeScript type safety and developer ergonomics.
      </Text>

      <List>
        <ListItem>Select/exclude field filtering on all CRUD operations, include methods, and JSONB tables—with full TypeScript overloads so return types narrow automatically based on what you select</ListItem>
        <ListItem>Automatic type inference for included relations means nested includes now carry proper TypeScript types all the way through</ListItem>
        <ListItem>Code generator now detects file-level changes and skips unnecessary regeneration with version-based cache invalidation</ListItem>
        <ListItem>Fixed nested include parameter resolution to use the correct target table's spec</ListItem>
        <ListItem>Fixed pair combination method generation for tables with 4–6 relationships</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <List>
        <ListItem>Scraper grew significantly—five new sources bringing the total to nine</ListItem>
        <ListItem>Domain URL limits and import deduplication prevent runaway crawls and redundant data</ListItem>
        <ListItem>Parallel page discovery with database-level conflict resolution improves throughput</ListItem>
        <ListItem>Round-robin website selection for balanced recorder submissions</ListItem>
        <ListItem>URL normalization, metadata sanitization, and expanded page type taxonomy</ListItem>
        <ListItem>SNS state-change alerts with Terraform IaC for operational visibility</ListItem>
      </List>

      <List>
        <ListItem>Tech stack detection landed as a new field—pages are now analyzed for the technologies they use</ListItem>
        <ListItem>Pipeline migrated to a normalized technology storage schema with type-safe SDK includes</ListItem>
        <ListItem>AI classification improved with better examples and a model upgrade</ListItem>
        <ListItem>Taxonomy color delimiters updated for more reliable parsing; schema cleaned up with DB SDK regenerated</ListItem>
        <ListItem>App shipped a feedback system with save buttons, navigation improvements, and path-based device routing</ListItem>
        <ListItem>Optimized API payloads using new field selection; extracted saved item Zod schemas to a shared directory</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <List>
        <ListItem>Custom tech detection replaces the third-party Wappalyzer library, with a new <code>detectTechnologies</code> API param</ListItem>
        <ListItem>Switched to Ghostery adblocker for more reliable cookie and ad blocking</ListItem>
        <ListItem>Persistent Chrome profile replaces dynamic locale detection for more consistent browser behavior</ListItem>
        <ListItem>Deterministic S3 keys replace date-partitioned keys for simpler asset management</ListItem>
        <ListItem>Navigation errors excluded from browser crash detection to reduce false positives</ListItem>
        <ListItem>ECS task event capture added for operational observability</ListItem>
      </List>

      <List>
        <ListItem>Role-based access control with admin user support</ListItem>
        <ListItem>Device selection added to the job creation API</ListItem>
        <ListItem>Bulk job retry API endpoint for operational recovery</ListItem>
        <ListItem>Waitlist system with improved retry distribution handling</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <List>
        <ListItem>Bot detection system launched with user agent analysis, UBID tracking, and iOS browser support</ListItem>
        <ListItem>Team membership enrichment and UBID enrichment systems added for improved visitor identity tracking</ListItem>
        <ListItem>Bot enrichment optimized with bulk SQL updates and idempotent team enrichment with corrected property field names</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="formgen" />
      </Text>

      <Text as="p" variant="body">
        Rating matrix export now expands fields into individual columns for better spreadsheet usability. Excel export fallback fixed for nested data structures.
      </Text>
    </ShiplogLayout>
  );
}
