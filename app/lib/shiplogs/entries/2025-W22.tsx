import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W22",
  titleText: "Component Libraries, Analytics Refinements & Bug Squashing",
  previewText: "Launched a new shadcn component registry, refined analytics filtering across multiple projects, and knocked out critical URL handling bugs.",
  publishedAt: "2025-06-01",
  week: 22,
  year: 2025,
  status: "published",
  projectTags: ["adpharm-shad", "silo-cdp", "adapts"],
} satisfies ShiplogMeta;

export default function Shiplog2025W22() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Launched a new shadcn-based component registry with initial component imports and Tailwind configuration. The registry is now set up and ready to serve reusable UI components across Adpharm projects.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adapts" />
      </Text>

      <List>
        <ListItem>Improved analytics filtering to properly handle both www and non-www domains, ensuring accurate tracking across all domain variants.</ListItem>
        <ListItem>Fixed a critical URL bug that was affecting link navigation.</ListItem>
        <ListItem>Cleaned up export functionality and routing behavior on the drive layout page.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <List>
        <ListItem>Refined error handling by switching from hard errors to logging for better observability.</ListItem>
        <ListItem>Updated GTM (Google Tag Manager) naming conventions.</ListItem>
        <ListItem>Fixed destructuring issues that were causing data handling problems.</ListItem>
      </List>
    </ShiplogLayout>
  );
}
