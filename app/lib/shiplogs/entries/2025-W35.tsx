import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W35",
  titleText: "Smarter S3 Access Controls Ship",
  previewText: "Enhanced infrastructure flexibility with distribution-aware access controls for better multi-environment deployments.",
  publishedAt: "2025-08-31",
  week: 35,
  year: 2025,
  status: "published",
  projectTags: ["autoscroll-recorder"],
} satisfies ShiplogMeta;

export default function Shiplog2025W35() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Shipped more intelligent S3 access management that automatically configures permissions based on distribution targets. This makes multi-environment deployments cleaner and reduces manual IAM configuration overhead.
      </Text>
    </ShiplogLayout>
  );
}
