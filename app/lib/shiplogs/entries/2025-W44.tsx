import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W44",
  titleText: "Footer Fixes and Automated Workflows",
  previewText: "Updated contact information for synapsemedcom.ca and shipped automated refinement workflows for the Agentic Editor with screenshot generation.",
  publishedAt: "2025-11-02",
  week: 44,
  year: 2025,
  status: "published",
  projectTags: ["synapse-crm", "agentic-editor"],
} satisfies ShiplogMeta;

export default function Shiplog2025W44() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse-crm" />
      </Text>

      <Text as="p" variant="body">
        Updated footer contact information to ensure visitors have accurate details for reaching out.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="agentic-editor" />
      </Text>

      <Text as="p" variant="body">
        Shipped automated refinement workflows with screenshot generation, making it easier to review and iterate on changes. Also improved the sidebar architecture with better GitHub workflow integration.
      </Text>
    </ShiplogLayout>
  );
}
