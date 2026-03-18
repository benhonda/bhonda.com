import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
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
        UI fixes and additions:
      </Text>

      <List>
        <ListItem>Fixed refresh functionality that was breaking before completing.</ListItem>
        <ListItem>Improved job metadata extraction.</ListItem>
        <ListItem>Resolved UI performance issues.</ListItem>
        <ListItem>Added configuration interfaces for S3 and Google Drive destinations in settings.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Added typed include methods that let you fetch related data with full TypeScript support. You can now query relationships in both directions (forward and reverse foreign keys) with configurable depth. List endpoints and include methods also now support WHERE clauses, giving you precise control over which records to fetch when working with relationships.
      </Text>

      <Text as="p" variant="body">
        Developer experience improvements:
      </Text>

      <List>
        <ListItem>Interactive configuration merge process now preserves existing settings when updating.</ListItem>
        <ListItem>Standardized config field naming to eliminate confusion.</ListItem>
        <ListItem>Added select schema generation for better type safety.</ListItem>
        <ListItem>Introduced a new <code>gen</code> shorthand command for faster code generation.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse-crm" />
      </Text>

      <List>
        <ListItem>Fixed contact list navigation issues and improved action system typing.</ListItem>
        <ListItem>Added simplified Terraform/Terragrunt setup for Route 53 DNS management with support for existing hosted zones.</ListItem>
        <ListItem>Shipped comprehensive setup guides with enforcement of latest provider version checks.</ListItem>
        <ListItem>Vercel environment variable management now fully automated via Terraform.</ListItem>
        <ListItem>Added GitHub CLI and improved Terraform tooling to the devcontainer.</ListItem>
      </List>

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
