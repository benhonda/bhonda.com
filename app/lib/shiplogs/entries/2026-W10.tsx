import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W10",
  titleText: "Email Platform Launch & AI Search Evolution",
  previewText: "Shipped a full-stack email platform with sending, receiving, and domain management. Overhauled Inspiration Index search with AI-generated queries and added pricing pages.",
  publishedAt: "2026-03-08",
  week: 10,
  year: 2026,
  status: "published",
  projectTags: ["cd2", "inspiration-index", "autoscroll-recorder", "silo-cdp", "postgresdk", "bhonda-com", "vercel-s3-log-drain"],
} satisfies ShiplogMeta;

export default function Shiplog2026W10() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="cd2" />
      </Text>

      <Text as="p" variant="body">
        Shipped a complete email infrastructure platform from scratch. Send and receive emails via AWS SES with multi-domain support. Domain management with automated DNS configuration via Route53, email forwarding with rule-based routing across domains, and API authentication with encrypted API keys (AES-256-CBC) for secure programmatic access. A web dashboard handles teams, domains, forwarding rules, and viewing sent/received emails. Dark mode with system preference detection shipped alongside a TypeScript SDK for developers (@cdv2/email). The platform handles inbound emails via Lambda processors, stores everything in PostgreSQL, and exposes both REST APIs and SDK interfaces for integration.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Replaced the structured filter system with AI-generated SQL queries. Search now understands natural language and generates precise database queries on the fly. Abort support, skeleton loading states, and result-by-ID deep linking landed. Pricing comparison table launched with Pro and Team tiers—new users get a 30-day reverse trial with rolling search quotas. Added /signup route with auth layout split and navigation improvements.
      </Text>

      <Text as="p" variant="body">
        Tabbed site detail pages with capture galleries and metadata, hover cards for quick site previews, animated search placeholders, refined filter toggles, and taxonomy expansions with better categorization for components, sections, and page types all shipped. The pre-launch IP allowlist was removed—now publicly accessible.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Wellness checks for recording URLs landed before submitting jobs. The system now tests URLs for availability, tracks health status per URL, shows health indicators in job tables, blocks known-bad URLs from retry attempts, and detects when infrastructure is at capacity vs. actual failures. Retry lineage tracking traces job relationships, parallel batch retries speed up recovery, and paginated job loading with status badges shipped. Recorder now submits pages to all device types instead of iPhone-only, improving coverage across desktop, tablet, and mobile viewports.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        Implemented PIPEDA-compliant IP handling in the Event Store: raw IPs encrypted at rest, HMAC hashing for analytics, automatic scrubbing after enrichment, and a backfill script to clean pre-existing events.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Gained distinctOn support and fixed schema-scoped introspection.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="bhonda-com" />
      </Text>

      <Text as="p" variant="body">
        Improved SEO with canonical URL handling, refined robots.txt rules, and sitemap enhancements.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="vercel-s3-log-drain" />
      </Text>

      <Text as="p" variant="body">
        Migrated from PostgreSQL to AWS SQS for better scalability.
      </Text>
    </ShiplogLayout>
  );
}
