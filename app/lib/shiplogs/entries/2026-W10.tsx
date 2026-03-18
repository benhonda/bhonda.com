import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
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
        Shipped a complete email infrastructure platform from scratch.
      </Text>

      <List>
        <ListItem>Send and receive emails via AWS SES with multi-domain support</ListItem>
        <ListItem>Domain management with automated DNS configuration via Route53</ListItem>
        <ListItem>Email forwarding with rule-based routing across domains</ListItem>
        <ListItem>API authentication with encrypted API keys (AES-256-CBC) for secure programmatic access</ListItem>
        <ListItem>Web dashboard for teams, domains, forwarding rules, and viewing sent/received emails</ListItem>
        <ListItem>Dark mode with system preference detection</ListItem>
        <ListItem>TypeScript SDK for developers (<code>@cdv2/email</code>)</ListItem>
        <ListItem>Inbound emails processed via Lambda, stored in PostgreSQL, with REST APIs and SDK interfaces for integration</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Replaced the structured filter system with AI-generated SQL queries. Search now understands natural language and generates precise database queries on the fly.
      </Text>

      <List>
        <ListItem>Abort support, skeleton loading states, and result-by-ID deep linking</ListItem>
        <ListItem>Pricing comparison table with Pro and Team tiers—new users get a 30-day reverse trial with rolling search quotas</ListItem>
        <ListItem>/signup route with auth layout split and navigation improvements</ListItem>
        <ListItem>Pre-launch IP allowlist removed—now publicly accessible</ListItem>
      </List>

      <List>
        <ListItem>Tabbed site detail pages with capture galleries and metadata</ListItem>
        <ListItem>Hover cards for quick site previews</ListItem>
        <ListItem>Animated search placeholders and refined filter toggles</ListItem>
        <ListItem>Taxonomy expansions with better categorization for components, sections, and page types</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Wellness checks for recording URLs landed before submitting jobs.
      </Text>

      <List>
        <ListItem>Tests URLs for availability and tracks health status per URL</ListItem>
        <ListItem>Health indicators shown in job tables; known-bad URLs blocked from retry attempts</ListItem>
        <ListItem>Detects when infrastructure is at capacity vs. actual failures</ListItem>
        <ListItem>Retry lineage tracking traces job relationships; parallel batch retries speed up recovery</ListItem>
        <ListItem>Paginated job loading with status badges</ListItem>
        <ListItem>Recorder now submits pages to all device types instead of iPhone-only, improving coverage across desktop, tablet, and mobile viewports</ListItem>
      </List>

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
        Gained <code>distinctOn</code> support and fixed schema-scoped introspection.
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
