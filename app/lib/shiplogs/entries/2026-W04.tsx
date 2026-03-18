import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
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

      <List>
        <ListItem>Collections and saved items let users organize and save designs they discover, with security hardening to keep saved data safe</ListItem>
        <ListItem>Infinite scroll rolled out across both the pipeline review interface and the public landing page</ListItem>
        <ListItem>Granular style filters for searching by specific components, assets, and page sections</ListItem>
        <ListItem>Production CloudWatch alerting for pipeline failures</ListItem>
        <ListItem>Metadata handling refined with base64 encoding for page titles/descriptions and consistent field naming with a unified prefix</ListItem>
        <ListItem>Link scraper expanded source coverage with concurrency controls and adjusted schedule</ListItem>
        <ListItem>Switched from single to array source attribution for designs that appear across multiple inspiration platforms</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <List>
        <ListItem>Production monitoring with CloudWatch alarms for GPU task failures and runtime failures</ListItem>
        <ListItem>Video trimming capabilities and enhanced browser fingerprinting for edge cases in automated recording</ListItem>
        <ListItem>Database-backed job status management replaces the previous complex pipeline monitoring with a simpler ECS-based approach</ListItem>
        <ListItem>New landing page and dashboard with SEO improvements</ListItem>
        <ListItem>Batch management features including job deletion and infinite scroll pagination</ListItem>
      </List>
    </ShiplogLayout>
  );
}
