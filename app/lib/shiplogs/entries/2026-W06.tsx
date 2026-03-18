import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
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
        A landmark week for PostgreSDK, shipping nine releases (v0.17.0 through v0.18.10) with a focus on TypeScript type safety and developer ergonomics. Select/exclude field filtering landed on all CRUD operations, include methods, and JSONB tables—with full TypeScript overloads so return types narrow automatically based on what you select. Automatic type inference for included relations means nested includes now carry proper TypeScript types all the way through. The code generator now detects file-level changes and skips unnecessary regeneration with version-based cache invalidation. Also fixed nested include parameter resolution to use the correct target table's spec, and fixed pair combination method generation for tables with 4–6 relationships.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        The scraper grew significantly, adding five new scraping sources bringing the total to nine. Domain URL limits and import deduplication prevent runaway crawls and redundant data. Parallel page discovery with database-level conflict resolution improves throughput. Round-robin website selection for balanced recorder submissions shipped, alongside URL normalization and metadata sanitization, expanded page type taxonomy, and SNS state-change alerts with Terraform IaC for operational visibility.
      </Text>

      <Text as="p" variant="body">
        Tech stack detection landed as a new field—pages are now analyzed for the technologies they use. The pipeline migrated to a normalized technology storage schema with type-safe SDK includes. AI classification improved with better examples and a model upgrade, taxonomy color delimiters updated for more reliable parsing, and the schema was cleaned up with DB SDK regenerated. The app shipped a feedback system with save buttons, navigation improvements, path-based device routing, optimized API payloads using new field selection, and extracted saved item Zod schemas to a shared directory.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Custom tech detection replaces the third-party Wappalyzer library, with a new detectTechnologies API param. Switched to Ghostery adblocker for more reliable cookie and ad blocking. Persistent Chrome profile replaces dynamic locale detection for more consistent browser behavior. Deterministic S3 keys replace date-partitioned keys for simpler asset management. Navigation errors excluded from browser crash detection to reduce false positives, and ECS task event capture added for operational observability.
      </Text>

      <Text as="p" variant="body">
        On the web side: role-based access control with admin user support, device selection added to the job creation API, a bulk job retry API endpoint for operational recovery, and a waitlist system with improved retry distribution handling.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        Bot detection system launched with user agent analysis, UBID tracking, and iOS browser support. Team membership enrichment and UBID enrichment systems added for improved visitor identity tracking. Bot enrichment optimized with bulk SQL updates and idempotent team enrichment with corrected property field names.
      </Text>

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
