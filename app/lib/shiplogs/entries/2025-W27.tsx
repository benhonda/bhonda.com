import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W27",
  titleText: "Building the Foundation: New Tooling & Registry Infrastructure",
  previewText: "Launched the Adpharm Toolshed automation platform and expanded reporting capabilities in Silo CDP with Excel generation for data analysis.",
  publishedAt: "2025-07-06",
  week: 27,
  year: 2025,
  status: "published",
  projectTags: ["adpharm-toolshed", "adpharm-shad", "silo-cdp"],
} satisfies ShiplogMeta;

export default function Shiplog2025W27() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-toolshed" />
      </Text>

      <Text as="p" variant="body">
        Launched a new internal automation platform to streamline development workflows. The initial release includes a Figma image extraction tool to automate asset management from design files, with infrastructure powered by AWS EventBridge for scheduled automation tasks.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Built out the component registry infrastructure for our React Router-based design system.
      </Text>

      <List>
        <ListItem>Registry now supports SSL in development.</ListItem>
        <ListItem>Includes comprehensive testing.</ListItem>
        <ListItem>Improved routing with path array support through Generouted.</ListItem>
        <ListItem>Split authentication logic into standalone modules for better reusability across projects.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        Expanded reporting capabilities with Excel file generation, enabling data analysts to export structured reports for deeper analysis and offline processing.
      </Text>
    </ShiplogLayout>
  );
}
