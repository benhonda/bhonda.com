import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W41",
  titleText: "ADAPTS: Axsome Integration",
  previewText: "Added support for Axsome to the ADAPTS platform this week.",
  publishedAt: "2025-10-12",
  week: 41,
  year: 2025,
  status: "published",
  projectTags: ["adapts"],
} satisfies ShiplogMeta;

export default function Shiplog2025W41() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adapts" />
      </Text>

      <Text as="p" variant="body">
        Integrated Axsome into the platform, expanding the roster of supported pharmaceutical companies.
      </Text>
    </ShiplogLayout>
  );
}
