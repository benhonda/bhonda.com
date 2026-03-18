import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import { InlineCode } from "~/components/blog/inline-code";
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

      <List>
        <ListItem>Adaptive breakpoints, sheet redesign, iOS bounce fixes, scroll restoration, and improved dialogs</ListItem>
        <ListItem>Gesture handling and sticky filter bar with pill-based active state</ListItem>
        <ListItem>Uniform card sizing across collection mosaics and detail views</ListItem>
      </List>

      <List>
        <ListItem>Vector embedding-based relevance ranking for section browsing</ListItem>
        <ListItem>Pre-filter step and adaptive thinking levels for search performance</ListItem>
        <ListItem>Credits only consumed on successful results</ListItem>
        <ListItem>HD downloads for paid users; standard MP4 remains free for all</ListItem>
        <ListItem>Search suggestions expanded with contextual chips and synonym matching</ListItem>
      </List>

      <List>
        <ListItem>Canonical URLs, structured sitemaps, and OG image generation for SEO</ListItem>
        <ListItem>Comprehensive event tracking across user journeys</ListItem>
        <ListItem>Dedicated settings pages for account management</ListItem>
        <ListItem>Personalized content feed at the root route</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <List>
        <ListItem>Multi-output support generates multiple resolutions from a single capture, replacing the single-output model</ListItem>
        <ListItem>HiDPI-native capture with dynamic scaling and auto-adjusted bitrate for crisp high-DPI recordings</ListItem>
        <ListItem>Full-page screenshots capture entire page state alongside video</ListItem>
        <ListItem>GPU pipeline improved with CUDA acceleration and proper hardware detection</ListItem>
      </List>

      <List>
        <ListItem>Screenshots appear in job detail pages with presigned download links for each resolution variant</ListItem>
        <ListItem>Screenshot settings let you configure capture parameters per config-set</ListItem>
        <ListItem>Consolidated dropdown for retry, duplicate, and management tasks simplifies job actions</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="cd2" />
      </Text>

      <List>
        <ListItem>Domain-scoped API keys restrict keys to specific domains for tighter security</ListItem>
        <ListItem>Admin interface for immediate key revocation; system keys bypass domain restrictions for internal operations</ListItem>
        <ListItem>Email forwarding gained CC support, attachment preservation, and attribution blocks</ListItem>
        <ListItem>Auto-create initial forwarding rule on domain setup</ListItem>
        <ListItem>Priority warnings for silent-drop risks</ListItem>
        <ListItem>DLQ monitoring with CloudWatch alarms and Slack notifications for failed deliveries</ListItem>
      </List>

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

      <List>
        <ListItem>Trigram search with multi-column fuzzy text search using pg_trgm</ListItem>
        <ListItem>Proper integer type emission in Zod schemas fixed a type safety gap</ListItem>
        <ListItem><InlineCode>distinctOn</InlineCode> received subquery optimization for complex ordering scenarios</ListItem>
      </List>
    </ShiplogLayout>
  );
}
