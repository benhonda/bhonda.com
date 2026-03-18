import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W28",
  titleText: "Framework Foundations & Pharmacy Validation",
  previewText: "Rebuilt the actions framework from the ground up and added pharmacy license validation tools. Major architectural improvements across the stack.",
  publishedAt: "2025-07-13",
  week: 28,
  year: 2025,
  status: "published",
  projectTags: ["adpharm-shad", "adpharm-toolshed"],
} satisfies ShiplogMeta;

export default function Shiplog2025W28() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Shipped a modernized actions framework with a complete rewrite delivering improved structure and ergonomics.
      </Text>

      <List>
        <ListItem>RR7 analytics support for better insights.</ListItem>
        <ListItem>Built-in i18n support for multi-language applications.</ListItem>
        <ListItem>Reactive state management via RR7 signals.</ListItem>
        <ListItem>Improved TypeScript support for serverless functions with better Lambda types.</ListItem>
        <ListItem>Reorganized the entire registry structure for cleaner code organization and a better developer experience.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-toolshed" />
      </Text>

      <List>
        <ListItem>Added a new license validator tool for validating pharmacy license numbers.</ListItem>
        <ListItem>Resolved login issues.</ListItem>
        <ListItem>Added event-driven architecture support via EventBridge integration.</ListItem>
        <ListItem>Improved environment variable handling and schema validation.</ListItem>
      </List>
    </ShiplogLayout>
  );
}
