import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
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

      <Text as="p" variant="body">
        AI-powered search landed with a CMD+K dialog interface. The search pipeline streams results in real time, with auth-gated access and popular search pills to guide users. The filter system got a complete overhaul—now data-driven with snake_case URL params, motion flags for analyzing animations, and query expansion for better results. Pricing got a complete redesign with hardcoded LemonSqueezy variant IDs, added to both nav and footer. Billing infrastructure is live with search quotas to manage usage. For launch security, a pre-launch IP allowlist with a coming-soon page for non-whitelisted visitors was added.
      </Text>

      <Text as="p" variant="body">
        Behind the scenes, the pipeline moved from MediaConvert to FFmpeg Lambda for faster frame extraction, added motion flags taxonomy for categorizing animations, and built a capture liveness checker to hide dead links automatically. Font detection and typography analysis (heading vs body) help categorize design patterns. Link monitoring added a liveness-recheck cron for ongoing health checks.
      </Text>

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

      <Text as="p" variant="body">
        Recording platform shipped quality tracking to classify recordings, accurate encoded duration calculations, and scroll distance metrics. Added URL override support for edge cases and improved tech detection. Cookie banner handling got smarter with CSS Modules attribute selectors and a curated list of edge-case selectors.
      </Text>

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
