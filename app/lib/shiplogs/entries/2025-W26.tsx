import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W26",
  titleText: "Forms & Dashboards: A Week of Polish",
  previewText: "Expanded form capabilities with new components and smoothed out analytics workflows across ADAPTS.",
  publishedAt: "2025-06-29",
  week: 26,
  year: 2025,
  status: "published",
  projectTags: ["adpharm-shad", "adapts"],
} satisfies ShiplogMeta;

export default function Shiplog2025W26() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Expanded the form component library with fresh additions to the registry. Teams building forms now have access to new components that weren't available before.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adapts" />
      </Text>

      <Text as="p" variant="body">
        Cleaned up analytics integration paths for Looker Studio across common domain configurations. Also shipped initial setup for the SOBI Canada project.
      </Text>
    </ShiplogLayout>
  );
}
