import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W37",
  titleText: "Streamlining the Changelog Process",
  previewText: "Making it easier to keep the development history clean and organized with better documentation practices.",
  publishedAt: "2025-09-14",
  week: 37,
  year: 2025,
  status: "published",
  projectTags: ["autoscroll-recorder"],
} satisfies ShiplogMeta;

export default function Shiplog2025W37() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Updated the AI assistant guidelines to include clear instructions for maintaining the project changelog. This ensures that all future commits are properly documented with user-facing context, making it easier to track what's been shipped and communicate changes effectively.
      </Text>
    </ShiplogLayout>
  );
}
