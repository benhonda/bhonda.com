import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
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

      <Text as="p" variant="body">
        Major infrastructure improvements: migrated from AWS Secrets Manager to SSM Parameter Store, fixed database connection handling, and added proper idempotency to prevent duplicate processing.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        The UI got a major usability upgrade: added global navigation and breadcrumbs for easier browsing, implemented auto-refresh with pause/resume on job status pages, added job cancellation for in-progress recordings, and device selection now happens at job creation time. Fixed video downloads to actually download instead of opening in a new tab, and streamlined the job retry interface.
      </Text>

      <Text as="p" variant="body">
        Cracked the GPU acceleration puzzle: replaced Xvfb with Xorg dummy driver to enable proper GPU passthrough in Docker containers. WebGL now works with hardware acceleration. Mobile recording is now fully supported—removed fixed Chrome window sizes and increased display resolution to 4K.
      </Text>

      <Text as="p" variant="body">
        Smooth scrolling got a complete overhaul: reimplemented constant scroll mode for buttery 60fps performance with dynamic content handling. Fixed CSS smooth-scroll interference and added segmented scrolling for long pages. Localization improvements added dynamic locale detection and comprehensive Chrome translation disabling to prevent popups during recording.
      </Text>

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
