import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
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

      <List>
        <ListItem>Added "unknown" status detection for jobs that get lost in the pipeline, making it easier to spot and retry failed jobs.</ListItem>
        <ListItem>Improved job tracking by switching from job IDs to SQS message IDs for more reliable ECS task matching.</ListItem>
        <ListItem>Added batch job tracking and repository cleanup features.</ListItem>
        <ListItem>Built a reusable jobs table component for consistent UI across different pages.</ListItem>
      </List>

      <List>
        <ListItem>Launched a full API system for programmatic job creation, enabling automated workflows.</ListItem>
        <ListItem>Implemented type-safe API key management with proper authentication.</ListItem>
        <ListItem>Fixed authentication issues with X-API-Key header support for Vercel compatibility.</ListItem>
      </List>

      <Text as="p" variant="body">
        UX and recording improvements:
      </Text>

      <List>
        <ListItem>Fixed expired presigned URLs on job details pages.</ListItem>
        <ListItem>Enabled retry for jobs with unknown status.</ListItem>
        <ListItem>Removed unnecessary page reloads after bulk job refresh.</ListItem>
        <ListItem>Improved configuration settings UI with better documentation.</ListItem>
        <ListItem>Hidden the cursor in video recordings using FFmpeg's <code>-draw_mouse</code> option.</ListItem>
        <ListItem>Prevented cookie banners from hiding entire HTML elements.</ListItem>
        <ListItem>Implemented URL-based filename generation with date partitioning for better organization.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <List>
        <ListItem>Migrated to a new multi-site scraper architecture using the Firecrawl SDK.</ListItem>
        <ListItem>Launched an Awwwards scraper MVP with daily cron scheduling and backfill capabilities.</ListItem>
        <ListItem>Separated scraping logic from recording workflows for better modularity.</ListItem>
        <ListItem>Added type-safe enums and improved submission handling.</ListItem>
        <ListItem>Implemented proper lock release on script failures with enhanced logging.</ListItem>
      </List>

      <List>
        <ListItem>Implemented shared ECR repository infrastructure across environments.</ListItem>
        <ListItem>Updated production configuration for deployment readiness.</ListItem>
        <ListItem>Added ECS task tagging for improved job tracking.</ListItem>
        <ListItem>Fixed ES module compatibility issues for Vercel deployments.</ListItem>
      </List>
    </ShiplogLayout>
  );
}
