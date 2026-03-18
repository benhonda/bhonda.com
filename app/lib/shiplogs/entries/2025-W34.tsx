import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W34",
  titleText: "Multi-Destination Video Distribution, PostgreSDK Relation Magic, and Infrastructure Automation",
  previewText: "Shipped cross-account S3 video distribution with Google Drive support, powerful typed database relationships with WHERE clause filtering, and streamlined Terraform workflows across multiple projects.",
  publishedAt: "2025-08-24",
  week: 34,
  year: 2025,
  status: "published",
  projectTags: ["autoscroll-recorder", "postgresdk", "synapse-crm", "gtm-proxy"],
} satisfies ShiplogMeta;

export default function Shiplog2025W34() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Videos can now be automatically distributed to multiple destinations including S3 (with cross-account support) and Google Drive. The new distribution system uses Lambda functions that can assume ECS task roles for secure cross-account access, with detailed logging when distribution fails to help troubleshoot issues. Also migrated to a pure SQS worker architecture, simplifying the event processing pipeline and improving reliability.
      </Text>

      <Text as="p" variant="body">
        On the UI side, fixed refresh functionality that was breaking before completing, improved job metadata extraction, resolved UI performance issues, and added configuration interfaces for S3 and Google Drive destinations in settings.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Added typed include methods that let you fetch related data with full TypeScript support. You can now query relationships in both directions (forward and reverse foreign keys) with configurable depth. List endpoints and include methods also now support WHERE clauses, giving you precise control over which records to fetch when working with relationships.
      </Text>

      <Text as="p" variant="body">
        On the developer experience side, an interactive configuration merge process now preserves existing settings when updating. Standardized config field naming to eliminate confusion, added select schema generation for better type safety, and introduced a new <code>gen</code> shorthand command for faster code generation.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse-crm" />
      </Text>

      <Text as="p" variant="body">
        Fixed contact list navigation issues and improved action system typing for more reliable interaction flows. Added simplified Terraform/Terragrunt setup for Route 53 DNS management with support for existing hosted zones, making it easier to manage DNS across environments. Also shipped comprehensive setup guides with enforcement of latest provider version checks, Vercel environment variable management now fully automated via Terraform, and added GitHub CLI and improved Terraform tooling to the devcontainer.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="gtm-proxy" />
      </Text>

      <Text as="p" variant="body">
        Cookie translation between domains is now working, enabling proper cross-domain tracking for analytics.
      </Text>
    </ShiplogLayout>
  );
}
