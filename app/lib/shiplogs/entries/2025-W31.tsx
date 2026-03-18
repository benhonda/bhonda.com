import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
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
        Shipped a complete end-to-end video recording platform in one week. On the infrastructure side, deployed production infrastructure with ECS, EventBridge Pipes, and SQS integration, built a recording pipeline with momentum scroll support and fine-tuned scroll settings, implemented S3 video storage with configurable destinations, and added dead letter queue error handling for failed jobs.
      </Text>

      <Text as="p" variant="body">
        On the web application side, launched a full UI with configuration management and job pipeline visualization, added job duplication for easier workflow management, built S3 destination setup with clear instructions, integrated real-time status updates from the pipeline checker, and implemented video retrieval and playback from S3. Also created a shared <code>@autoscroll/types</code> package for consistency across services, added <code>.env.example</code> reference for required environment variables, and improved environment configuration mapping.
      </Text>

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
