import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
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
        PostgreSDK saw three releases this week (v0.11.0 → v0.13.1), bringing major capabilities. List operations now return total counts and cursor info alongside results via pagination metadata. PostgreSQL enums are now fully supported in both schema introspection and SDK generation. Sorting by multiple columns with mixed directions landed, along with a new onRequest middleware hook for request-level logic in generated Hono routers. Generated SDKs also received comprehensive JSDoc comments and improved examples.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse-crm" />
      </Text>

      <Text as="p" variant="body">
        The CRM shipped production-ready features and major UX improvements. Automated PostgreSQL triggers now track all contact changes with a dedicated audit log viewer. A CLI tool imports contacts directly from Google Sheets with automation support. Contacts can now be sorted by multiple fields simultaneously and filtered by medical specialty with a new enum-backed schema. SWR-pattern action caching reduces server load, a new persistent navigation sidebar landed, and refined button sizing produces denser, more efficient layouts. Full production infrastructure was also deployed alongside staging.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        The component registry leveled up its type safety and developer experience. Phantom types now provide end-to-end type safety for React Router v7 actions. The use-action hook was streamlined to a fetcher-only implementation. A new tf-init command automates environment setup with Route53 integration, all components were consolidated into a single cohesive package, and comprehensive RR7 stack docs with a clearer tier structure shipped.
      </Text>
    </ShiplogLayout>
  );
}
