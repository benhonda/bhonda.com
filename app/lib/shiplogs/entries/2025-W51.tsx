import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W51",
  titleText: "Automation, Documentation, and Email Infrastructure",
  previewText: "Rolling out cron-powered automation, polishing documentation across projects, and shipping a complete email system with Gmail-style compose UI and retry capabilities.",
  publishedAt: "2025-12-21",
  week: 51,
  year: 2025,
  status: "published",
  projectTags: ["synapse-crm", "gtm-proxy", "inspiration-index", "autoscroll-recorder"],
} satisfies ShiplogMeta;

export default function Shiplog2025W51() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        A complete email infrastructure with Gmail-style compose UI shipped in
        Synapse CRM, cron-powered automation landed in the Inspiration Index,
        and documentation got a polish pass across the board.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse-crm" />
      </Text>

      <Text as="p" variant="body">
        Shipped a full-featured email infrastructure with Gmail-style compose UI, HTML email templates, and optional unsubscribe group management. Added email retry functionality for failed sends, giving users control over deliverability issues. Contact notes are now prominently displayed for better visibility, consistent page layouts landed across the application, and a user-facing changelog with full feature history shipped.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="gtm-proxy" />
      </Text>

      <Text as="p" variant="body">
        Added comprehensive GTM parameter masking to protect sensitive data in analytics. Fixed critical regex bugs that were causing URL parsing issues.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Implemented Vercel Cron job integration with proper Bearer token authentication. Restructured API routes for better organization and maintainability.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Reformatted changelog and updated documentation structure for better readability.
      </Text>
    </ShiplogLayout>
  );
}
