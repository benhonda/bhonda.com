import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W39",
  titleText: "Pipelines, Pixels, and Polish: A Week of Infrastructure & UX Wins",
  previewText: "Shipped AI-powered video analysis with Gemini, overhauled autoscroll recording with GPU acceleration and mobile support, plus a dozen UX improvements across the board.",
  publishedAt: "2025-09-28",
  week: 39,
  year: 2025,
  status: "published",
  projectTags: ["inspiration-index", "autoscroll-recorder", "ga4-reporter"],
} satisfies ShiplogMeta;

export default function Shiplog2025W39() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Shipped a complete AI-powered video analysis pipeline using Gemini for multi-modal frame analysis. The system now includes intelligent retry/re-run support with selective step execution, so you can resume failed pipelines without starting from scratch.
      </Text>

      <List>
        <ListItem>Migrated from AWS Secrets Manager to SSM Parameter Store.</ListItem>
        <ListItem>Fixed database connection handling.</ListItem>
        <ListItem>Added proper idempotency to prevent duplicate processing.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        The UI got a major usability upgrade:
      </Text>

      <List>
        <ListItem>Added global navigation and breadcrumbs for easier browsing.</ListItem>
        <ListItem>Implemented auto-refresh with pause/resume on job status pages.</ListItem>
        <ListItem>Added job cancellation for in-progress recordings.</ListItem>
        <ListItem>Device selection now happens at job creation time.</ListItem>
        <ListItem>Fixed video downloads to actually download instead of opening in a new tab.</ListItem>
        <ListItem>Streamlined the job retry interface.</ListItem>
      </List>

      <Text as="p" variant="body">
        Cracked the GPU acceleration puzzle: replaced Xvfb with Xorg dummy driver to enable proper GPU passthrough in Docker containers. WebGL now works with hardware acceleration. Mobile recording is now fully supported—removed fixed Chrome window sizes and increased display resolution to 4K.
      </Text>

      <List>
        <ListItem>Reimplemented constant scroll mode for buttery 60fps performance with dynamic content handling.</ListItem>
        <ListItem>Fixed CSS smooth-scroll interference and added segmented scrolling for long pages.</ListItem>
        <ListItem>Added dynamic locale detection and comprehensive Chrome translation disabling to prevent popups during recording.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="ga4-reporter" />
      </Text>

      <Text as="p" variant="body">
        New project: built a GA4 analytics reporter with support for display campaign analytics. First commit shipped with Rethink PNH campaign reporting.
      </Text>
    </ShiplogLayout>
  );
}
