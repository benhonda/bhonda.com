import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W33",
  titleText: "Shipping PostgreSDK, Synapse CRM, and Registry Updates",
  previewText: "A productive week building out PostgreSDK's testing infrastructure, launching Synapse CRM's contacts system, and refining component registries.",
  publishedAt: "2025-08-17",
  week: 33,
  year: 2025,
  status: "published",
  projectTags: ["postgresdk", "synapse-crm", "adpharm-shad"],
} satisfies ShiplogMeta;

export default function Shiplog2025W33() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Major improvements to the PostgreSQL SDK generator.
      </Text>

      <List>
        <ListItem>Added automatic Zod schema emitters for runtime validation.</ListItem>
        <ListItem>Restructured the package to support framework-specific outputs with proper module extensions.</ListItem>
        <ListItem>Built an end-to-end test suite with Drizzle ORM integration and generic test generation.</ListItem>
        <ListItem>Introduced a contract endpoint for better API versioning and type safety.</ListItem>
        <ListItem>Simplified date type configuration and improved nullish value handling.</ListItem>
        <ListItem>Released versions 0.5.1 through 0.7.3 with these improvements.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse-crm" />
      </Text>

      <Text as="p" variant="body">
        Launched a full contacts database with a generated API layer and built the user interface for managing CRM contacts. Migrated to the RR7 stack baseline for better performance.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Updated component registry with latest modifications and component improvements.
      </Text>
    </ShiplogLayout>
  );
}
