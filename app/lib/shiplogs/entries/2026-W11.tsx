import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W11",
  titleText: "Auth Overhaul, Mobile Polish, and Multi-Output Recording",
  previewText: "Passwordless authentication, 14-day trials, and a complete mobile UX refresh land across the Inspiration Index. Plus: multi-resolution recording, dark mode, and smarter email routing.",
  publishedAt: "2026-03-15",
  week: 11,
  year: 2026,
  status: "published",
  projectTags: ["inspiration-index", "autoscroll-recorder", "cd2", "silo-cdp", "postgresdk"],
} satisfies ShiplogMeta;

export default function Shiplog2026W11() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Passwordless authentication, 14-day trials, and a complete mobile UX
        refresh landed in the Inspiration Index. Multi-resolution recording,
        dark mode, and smarter email routing shipped across the rest of the
        stack.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        OTP email authentication replaces password-based flows entirely, with a 14-day free trial giving new users full access before committing. Onboarding was redesigned with streamlined interest selection and profile setup. Users can now fully delete their accounts and cancel subscriptions.
      </Text>

      <Text as="p" variant="body">
        Mobile got a complete overhaul: adaptive breakpoints, sheet redesign, iOS bounce fixes, scroll restoration, improved dialogs, gesture handling, a sticky filter bar with pill-based active state, and uniform card sizing across collection mosaics and detail views.
      </Text>

      <Text as="p" variant="body">
        Search got smarter with vector embedding-based relevance ranking for section browsing, a pre-filter step and adaptive thinking levels for performance, and credits only consumed on successful results. HD downloads landed for paid users with standard MP4 remaining free for all. Search suggestions expanded with contextual chips and synonym matching.
      </Text>

      <Text as="p" variant="body">
        SEO foundations landed: canonical URLs, structured sitemaps, OG image generation, and proper indexability controls. Comprehensive event tracking shipped across user journeys, dedicated settings pages for account management, and a personalized content feed at the root route.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Multi-output support generates multiple resolutions from a single capture, replacing the single-output model. HiDPI-native capture with dynamic scaling and auto-adjusted bitrate produces crisp high-DPI recordings. Full-page screenshots now capture entire page state alongside video. GPU pipeline improved with CUDA acceleration and proper hardware detection.
      </Text>

      <Text as="p" variant="body">
        Screenshots appear in job detail pages with presigned download links for each resolution variant. Screenshot settings let you configure capture parameters per config-set. A consolidated dropdown for retry, duplicate, and management tasks simplifies job actions.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="cd2" />
      </Text>

      <Text as="p" variant="body">
        Domain-scoped API keys restrict keys to specific domains for tighter security. Admin interface for immediate key revocation shipped. System keys bypass domain restrictions for internal operations. Email forwarding gained CC support, attachment preservation, and attribution blocks. Auto-create initial forwarding rule on domain setup, priority warnings for silent-drop risks, and DLQ monitoring with CloudWatch alarms and Slack notifications for failed deliveries.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        Full CSS variable migration enables theme switching and dark mode across the platform. Toast notifications confirm settings saves.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Trigram search landed with multi-column fuzzy text search using pg_trgm. Proper integer type emission in Zod schemas fixed a type safety gap. distinctOn received subquery optimization for complex ordering scenarios.
      </Text>
    </ShiplogLayout>
  );
}
