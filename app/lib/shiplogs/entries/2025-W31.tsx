import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W31",
  titleText: "Autoscroll Recorder: From Zero to Production",
  previewText: "Shipped a complete video recording platform with pipeline visualization, S3 destinations, and job management—plus infrastructure automation across the board.",
  publishedAt: "2025-08-03",
  week: 31,
  year: 2025,
  status: "published",
  projectTags: ["autoscroll-recorder", "adpharm-shad"],
} satisfies ShiplogMeta;

export default function Shiplog2025W31() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Shipped a complete end-to-end video recording platform in one week. Infrastructure:
      </Text>

      <List>
        <ListItem>Deployed production infrastructure with ECS, EventBridge Pipes, and SQS integration.</ListItem>
        <ListItem>Built a recording pipeline with momentum scroll support and fine-tuned scroll settings.</ListItem>
        <ListItem>Implemented S3 video storage with configurable destinations.</ListItem>
        <ListItem>Added dead letter queue error handling for failed jobs.</ListItem>
      </List>

      <Text as="p" variant="body">
        Web application:
      </Text>

      <List>
        <ListItem>Launched a full UI with configuration management and job pipeline visualization.</ListItem>
        <ListItem>Added job duplication for easier workflow management.</ListItem>
        <ListItem>Built S3 destination setup with clear instructions.</ListItem>
        <ListItem>Integrated real-time status updates from the pipeline checker.</ListItem>
        <ListItem>Implemented video retrieval and playback from S3.</ListItem>
        <ListItem>Created a shared <code>@autoscroll/types</code> package for consistency across services.</ListItem>
        <ListItem>Added <code>.env.example</code> reference for required environment variables and improved environment configuration mapping.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Published style guides and environment configuration updates. Fixed form definitions and improved config matching.
      </Text>
    </ShiplogLayout>
  );
}
