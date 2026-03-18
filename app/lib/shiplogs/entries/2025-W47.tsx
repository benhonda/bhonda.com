import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W47",
  titleText: "Email Campaigns, Event Store Overhaul, and SDK Improvements",
  previewText: "Shipped email campaign automation with Gmail integration in Synapse CRM, restructured the Event Store API with better tooling, and streamlined PostgreSDK configuration.",
  publishedAt: "2025-11-23",
  week: 47,
  year: 2025,
  status: "published",
  projectTags: ["synapse-crm", "silo-cdp", "postgresdk"],
} satisfies ShiplogMeta;

export default function Shiplog2025W47() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Email campaign automation with Gmail integration shipped in Synapse CRM,
        the Event Store API was restructured with cleaner code organization, and
        PostgreSDK configuration got a simplification pass.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse-crm" />
      </Text>

      <Text as="p" variant="body">
        Launched a full email campaigns module with Gmail API integration. You can now create, manage, and send email campaigns directly from the CRM, with Gmail handling the delivery infrastructure.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        Restructured the entire codebase with a cleaner src/ directory organization and added PostgreSDK code generation for type-safe database interactions. Also integrated ESLint with import path validation to catch issues early and cleaned up legacy files from the migration.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Simplified the configuration system by unifying output directories and reorganizing how special endpoints are handled, making the SDK easier to configure and maintain.
      </Text>
    </ShiplogLayout>
  );
}
