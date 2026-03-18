import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W36",
  titleText: "Job Monitoring, Multi-Site Scraping, and Production Polish",
  previewText: "Enhanced video recording job tracking with unknown status detection, launched a multi-site link scraper with Firecrawl integration, and shipped API-driven job creation for programmatic workflows.",
  publishedAt: "2025-09-07",
  week: 36,
  year: 2025,
  status: "published",
  projectTags: ["autoscroll-recorder", "inspiration-index"],
} satisfies ShiplogMeta;

export default function Shiplog2025W36() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Added "unknown" status detection for jobs that get lost in the pipeline, making it easier to spot and retry failed jobs. Improved job tracking by switching from job IDs to SQS message IDs for more reliable ECS task matching, added batch job tracking and repository cleanup features, and built a reusable jobs table component for consistent UI across different pages.
      </Text>

      <Text as="p" variant="body">
        Launched a full API system for programmatic job creation, enabling automated workflows. Implemented type-safe API key management with proper authentication and fixed authentication issues with X-API-Key header support for Vercel compatibility.
      </Text>

      <Text as="p" variant="body">
        On the UX side, fixed expired presigned URLs on job details pages, enabled retry for jobs with unknown status, removed unnecessary page reloads after bulk job refresh, and improved configuration settings UI with better documentation. Also hid the cursor in video recordings using FFmpeg's <code>-draw_mouse</code> option, prevented cookie banners from hiding entire HTML elements, and implemented URL-based filename generation with date partitioning for better organization.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Migrated to a new multi-site scraper architecture using the Firecrawl SDK. Launched an Awwwards scraper MVP with daily cron scheduling and backfill capabilities. Separated scraping logic from recording workflows for better modularity, added type-safe enums and improved submission handling, and implemented proper lock release on script failures with enhanced logging.
      </Text>

      <Text as="p" variant="body">
        On the infrastructure side, implemented shared ECR repository infrastructure across environments, updated production configuration for deployment readiness, added ECS task tagging for improved job tracking, and fixed ES module compatibility issues for Vercel deployments.
      </Text>
    </ShiplogLayout>
  );
}
