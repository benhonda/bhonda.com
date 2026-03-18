import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W29",
  titleText: "Shadcn Migration & Toolshed Validation",
  previewText: "Major UI library migration underway for Inspiration Index, plus new website validation tools in Adpharm Toolshed.",
  publishedAt: "2025-07-20",
  week: 29,
  year: 2025,
  status: "published",
  projectTags: ["inspiration-index", "adpharm-shad", "adpharm-toolshed"],
} satisfies ShiplogMeta;

export default function Shiplog2025W29() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Started a comprehensive migration to Shadcn UI components. This will modernize the component library and improve consistency across the application.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Shipped several improvements to the design system.
      </Text>

      <List>
        <ListItem>Migrated to CSS variables for theming, enabling better customization and maintainability.</ListItem>
        <ListItem>Updated internationalization (i18n) for React Router v7.</ListItem>
        <ListItem>Refined authentication utilities organization.</ListItem>
        <ListItem>Added analytics integration.</ListItem>
        <ListItem>Enhanced search parameter handling.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-toolshed" />
      </Text>

      <Text as="p" variant="body">
        Launched a new website validator tool with inline results display. This internal tool helps validate website configurations and formatting, streamlining quality assurance workflows.
      </Text>
    </ShiplogLayout>
  );
}
