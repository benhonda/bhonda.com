import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
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

      <Text as="p" variant="body">
        Shipped a new preview mode with browser chrome simulation, configurable iframe zoom, and Vercel deployment preview bypass support. The preview now feels like viewing a real deployed site. Breadcrumb navigation via React Router v7 handles was added alongside a floating sidebar with persistent state that survives page refreshes using cookie-based storage.
      </Text>

      <Text as="p" variant="body">
        Added annotation client with BunnyNet CDN integration for global asset delivery, simplified S3 configuration, and integrated Vercel OIDC authentication for secure cloud resource access.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Split data concerns with separate APP_DB and PIPELINE_DB databases, allowing the application and video processing pipeline to scale independently.
      </Text>

      <Text as="p" variant="body">
        Built comprehensive pipeline review visualization with frame-by-frame analysis UI. You can now see exactly what's happening at each step of video processing, complete with human feedback controls and progress indicators. Added BunnyNet CDN for global asset delivery, ensuring video frames and processed content load quickly regardless of location.
      </Text>

      <Text as="p" variant="body">
        Implemented end-to-end observability with review artifacts. The new analyze-video-frames Lambda directly analyzes frames and fixes alignment issues that were causing processing failures. Moved all Terraform infrastructure into the main application and pipeline repositories, streamlining deployment and configuration management.
      </Text>
    </ShiplogLayout>
  );
}
