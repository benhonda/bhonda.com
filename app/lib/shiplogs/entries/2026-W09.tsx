import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W09",
  titleText: "AI Search, Launch Prep, and Platform Polish",
  previewText: "Shipped AI-powered search with CMD+K interface, overhauled pricing and billing, launched pre-launch IP allowlist, and polished recording automation with quality tracking and tech detection.",
  publishedAt: "2026-03-01",
  week: 9,
  year: 2026,
  status: "published",
  projectTags: ["inspiration-index", "bhonda-com", "autoscroll-recorder", "postgresdk", "silo-cdp"],
} satisfies ShiplogMeta;

export default function Shiplog2026W09() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <List>
        <ListItem>AI-powered search with a CMD+K dialog interface—streams results in real time, auth-gated with popular search pills to guide users</ListItem>
        <ListItem>Filter system overhauled to be data-driven with snake_case URL params, motion flags for analyzing animations, and query expansion for better results</ListItem>
        <ListItem>Pricing redesigned with hardcoded LemonSqueezy variant IDs, added to both nav and footer</ListItem>
        <ListItem>Billing infrastructure live with search quotas to manage usage</ListItem>
        <ListItem>Pre-launch IP allowlist with a coming-soon page for non-whitelisted visitors</ListItem>
      </List>

      <List>
        <ListItem>Pipeline moved from MediaConvert to FFmpeg Lambda for faster frame extraction</ListItem>
        <ListItem>Motion flags taxonomy added for categorizing animations</ListItem>
        <ListItem>Capture liveness checker hides dead links automatically</ListItem>
        <ListItem>Font detection and typography analysis (heading vs body) for categorizing design patterns</ListItem>
        <ListItem>Link monitoring liveness-recheck cron for ongoing health checks</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="bhonda-com" />
      </Text>

      <Text as="p" variant="body">
        Personal site got a refresh. Replaced the blog section with a People section, fixed OG meta tag inheritance, and ran a full SEO pass. Homepage got redesigned with a new blog draft/publish system for managing content.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <List>
        <ListItem>Quality tracking to classify recordings with accurate encoded duration calculations and scroll distance metrics</ListItem>
        <ListItem>URL override support for edge cases and improved tech detection</ListItem>
        <ListItem>Cookie banner handling improved with CSS Modules attribute selectors and a curated list of edge-case selectors</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Fixed vector column serialization issues and JSONB handling.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        Extended Vercel OIDC auth to EventBridge and SQS clients, fixed SQL NULL-poisoning in traffic exclusion, and improved session tracking to 14-day windows.
      </Text>
    </ShiplogLayout>
  );
}
