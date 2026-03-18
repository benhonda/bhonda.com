import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W38",
  titleText: "Pipeline Hardening & GPU-Accelerated Recording",
  previewText: "Major infrastructure improvements to the Inspiration Index pipeline and autoscroll recorder, plus retry functionality for failed recordings.",
  publishedAt: "2025-09-21",
  week: 38,
  year: 2025,
  status: "published",
  projectTags: ["inspiration-index", "autoscroll-recorder"],
} satisfies ShiplogMeta;

export default function Shiplog2025W38() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        The pipeline infrastructure received significant reliability improvements.
      </Text>

      <List>
        <ListItem>S3-only upload support means the pipeline now handles video uploads directly from S3 without requiring recorder metadata.</ListItem>
        <ListItem>Staging environment fixes resolved Step Functions failures and MediaConvert S3 path issues that were blocking staging deployments.</ListItem>
        <ListItem>Infrastructure automation standardized naming conventions and improved error handling across Terraform configurations.</ListItem>
        <ListItem>Streamlined testing improved the /test-pipeline command with clearer documentation and better enforcement.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Switched Chrome rendering from EGL to GLX for proper X11/Xorg WebGL support, resolving GPU task failures and enabling hardware-accelerated recording.
      </Text>

      <Text as="p" variant="body">
        Built comprehensive retry functionality for failed recordings:
      </Text>

      <List>
        <ListItem>Automatic detection and recovery of failed recordings.</ListItem>
        <ListItem>Fixed retry job status tracking to prevent false completion states.</ListItem>
        <ListItem>Clear error messages when S3 videos are detected during recovery.</ListItem>
        <ListItem>Proper permission handling for S3 object deletion and ECS task management.</ListItem>
        <ListItem>Docker image metadata logging for better debugging.</ListItem>
        <ListItem>Resolved timeout issues at 120s for GPU tasks.</ListItem>
        <ListItem>Fixed EventBridge Pipe and Vercel IAM permissions for full ECS and SQS access.</ListItem>
      </List>
    </ShiplogLayout>
  );
}
