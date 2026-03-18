import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W46",
  titleText: "The Type Safety Renaissance: PostgreSDK, Synapse CRM, and Infrastructure Evolution",
  previewText: "A massive week of shipping: PostgreSDK hits v0.13 with pagination and enum support, Synapse CRM gets audit logging and Google Sheets seeding, plus infrastructure tooling across the board.",
  publishedAt: "2025-11-16",
  week: 46,
  year: 2025,
  status: "published",
  projectTags: ["postgresdk", "synapse-crm", "adpharm-shad"],
} satisfies ShiplogMeta;

export default function Shiplog2025W46() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        A massive week of shipping: PostgreSDK hit v0.13 with pagination and
        enum support, Synapse CRM gained audit logging and Google Sheets
        seeding, and the Adpharm component registry leveled up its type safety.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        PostgreSDK saw three releases this week (v0.11.0 → v0.13.1), bringing major capabilities:
      </Text>

      <List>
        <ListItem>List operations now return total counts and cursor info alongside results via pagination metadata.</ListItem>
        <ListItem>PostgreSQL enums are now fully supported in both schema introspection and SDK generation.</ListItem>
        <ListItem>Sorting by multiple columns with mixed directions.</ListItem>
        <ListItem>New onRequest middleware hook for request-level logic in generated Hono routers.</ListItem>
        <ListItem>Generated SDKs received comprehensive JSDoc comments and improved examples.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse-crm" />
      </Text>

      <Text as="p" variant="body">
        The CRM shipped production-ready features and major UX improvements:
      </Text>

      <List>
        <ListItem>Automated PostgreSQL triggers now track all contact changes with a dedicated audit log viewer.</ListItem>
        <ListItem>A CLI tool imports contacts directly from Google Sheets with automation support.</ListItem>
        <ListItem>Contacts can now be sorted by multiple fields simultaneously and filtered by medical specialty with a new enum-backed schema.</ListItem>
        <ListItem>SWR-pattern action caching reduces server load.</ListItem>
        <ListItem>New persistent navigation sidebar and refined button sizing for denser, more efficient layouts.</ListItem>
        <ListItem>Full production infrastructure deployed alongside staging.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        The component registry leveled up its type safety and developer experience:
      </Text>

      <List>
        <ListItem>Phantom types now provide end-to-end type safety for React Router v7 actions.</ListItem>
        <ListItem>The use-action hook was streamlined to a fetcher-only implementation.</ListItem>
        <ListItem>A new tf-init command automates environment setup with Route53 integration.</ListItem>
        <ListItem>All components consolidated into a single cohesive package.</ListItem>
        <ListItem>Comprehensive RR7 stack docs with a clearer tier structure shipped.</ListItem>
      </List>
    </ShiplogLayout>
  );
}
