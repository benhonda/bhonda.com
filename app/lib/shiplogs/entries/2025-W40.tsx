import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W40",
  titleText: "The Infrastructure & Automation Overhaul",
  previewText: "Major upgrades across the board: one-click GitHub setup, dual database support, global CDN delivery, and comprehensive pipeline observability for video processing.",
  publishedAt: "2025-10-05",
  week: 40,
  year: 2025,
  status: "published",
  projectTags: ["agentic-editor", "inspiration-index"],
} satisfies ShiplogMeta;

export default function Shiplog2025W40() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="agentic-editor" />
      </Text>

      <Text as="p" variant="body">
        Added automated GitHub Actions workflow and secrets configuration with a single click. The new setup includes verification checks, confirmation dialogs, and a comprehensive job setup checklist to ensure everything's configured correctly before you start working.
      </Text>

      <List>
        <ListItem>New preview mode with browser chrome simulation, configurable iframe zoom, and Vercel deployment preview bypass support.</ListItem>
        <ListItem>Breadcrumb navigation via React Router v7 handles.</ListItem>
        <ListItem>Floating sidebar with persistent state that survives page refreshes using cookie-based storage.</ListItem>
        <ListItem>Annotation client with BunnyNet CDN integration for global asset delivery and simplified S3 configuration.</ListItem>
        <ListItem>Vercel OIDC authentication for secure cloud resource access.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Split data concerns with separate APP_DB and PIPELINE_DB databases, allowing the application and video processing pipeline to scale independently.
      </Text>

      <List>
        <ListItem>Built comprehensive pipeline review visualization with frame-by-frame analysis UI, human feedback controls, and progress indicators.</ListItem>
        <ListItem>Added BunnyNet CDN for global asset delivery of video frames and processed content.</ListItem>
        <ListItem>Implemented end-to-end observability with review artifacts.</ListItem>
        <ListItem>New analyze-video-frames Lambda directly analyzes frames and fixes alignment issues that were causing processing failures.</ListItem>
        <ListItem>Moved all Terraform infrastructure into the main application and pipeline repositories, streamlining deployment and configuration management.</ListItem>
      </List>
    </ShiplogLayout>
  );
}
