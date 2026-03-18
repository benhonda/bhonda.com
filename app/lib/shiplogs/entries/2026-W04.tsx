import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W04",
  titleText: "Collections, Alerts, and Architecture Refinements",
  previewText: "Shipped collection management for saved designs, production monitoring across the stack, and a wave of type safety improvements that make everything more reliable.",
  publishedAt: "2026-01-25",
  week: 4,
  year: 2026,
  status: "published",
  projectTags: ["inspiration-index", "autoscroll-recorder"],
} satisfies ShiplogMeta;

export default function Shiplog2026W04() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Collections and saved items functionality landed, letting users organize and save designs they discover—with security hardening to keep saved data safe. Infinite scroll rolled out across both the pipeline review interface and the public landing page, making it easier to browse large sets of designs without pagination breaks. Granular style filters let users search by specific components, assets, and page sections, making it much faster to find exactly the type of design inspiration you're looking for.
      </Text>

      <Text as="p" variant="body">
        Production CloudWatch alerting for pipeline failures shipped, bringing monitoring parity with other production services. Metadata handling was refined with base64 encoding for page titles and descriptions, and field naming was reorganized with a consistent prefix for better clarity. The link scraper expanded source coverage while implementing concurrency controls and adjusting the scraping schedule, and switched from single to array source attribution for proper attribution when designs appear across multiple inspiration platforms.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Implemented production monitoring with CloudWatch alarms for both GPU task failures and runtime failures, ensuring quick notification when things go wrong in the recording infrastructure. Video trimming capabilities and enhanced browser fingerprinting shipped to better handle edge cases in automated recording. The job status tracking system improved with database-backed status management, replacing the previous complex pipeline monitoring with a simpler, more reliable ECS-based approach. A new landing page and dashboard with SEO improvements landed alongside batch management features including job deletion and infinite scroll pagination.
      </Text>
    </ShiplogLayout>
  );
}
