import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W50",
  titleText: "Dark Mode, Event Intelligence, and Infrastructure Evolution",
  previewText: "Shipped comprehensive dark mode theming, advanced IP risk detection for event tracking, and streamlined infrastructure across multiple projects.",
  publishedAt: "2025-12-14",
  week: 50,
  year: 2025,
  status: "published",
  projectTags: ["bhonda-com", "silo-cdp", "adapts", "adpharm-shad", "formgen"],
} satisfies ShiplogMeta;

export default function Shiplog2025W50() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Comprehensive dark mode theming, advanced IP risk detection for event
        tracking, and infrastructure streamlining shipped across five projects
        this week.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="bhonda-com" />
      </Text>

      <Text as="p" variant="body">
        Added complete dark mode support with theme switching capabilities.
      </Text>

      <List>
        <ListItem>Shiplog system now includes status workflows for better content management.</ListItem>
        <ListItem>Versioning for tracking changes over time.</ListItem>
        <ListItem>Reactions for reader engagement.</ListItem>
        <ListItem>Transitioned to database storage with admin controls, CDN integration, and a polished frontend experience.</ListItem>
        <ListItem>SEO optimizations to improve discoverability.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <List>
        <ListItem>Integrated IPHub to automatically detect and flag risky IP addresses in event data, adding a security and fraud prevention layer to event tracking.</ListItem>
        <ListItem>Streamlined the system by removing identity resolution features, refocusing the API as a pure event store for faster and easier maintenance.</ListItem>
        <ListItem>GeoLite2 database moved to a public directory and the geo-enrichment cron endpoint switched to GET for better caching and reliability.</ListItem>
        <ListItem>Configurable source-level video plugin configuration shipped, giving teams more control over tracking behavior.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adapts" />
      </Text>

      <List>
        <ListItem>Added destination URL tracking to analytics metrics and improved test reliability.</ListItem>
        <ListItem>Removed Google Tag Manager in favor of a cleaner, more direct analytics implementation.</ListItem>
        <ListItem>Published a comprehensive analytics configuration guide to help teams set up tracking correctly.</ListItem>
        <ListItem>Destination URL and query parameter handling refactored for consistency across the platform.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Extracted theme switching functionality into the rr7-stack-core, making it available for all projects built on the stack. Enhanced Terraform documentation with BunnyNet S3 authentication details.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="formgen" />
      </Text>

      <List>
        <ListItem>Reduced the CHB needs assessment from a longer flow to just 4 pages, improving completion rates.</ListItem>
        <ListItem>Type-safe in-app redirects implemented using standard Web APIs and Next.js middleware, replacing the old vercel.json configuration approach.</ListItem>
        <ListItem>Migrated to a shared infrastructure architecture with proper domain routing for better scalability.</ListItem>
        <ListItem>Optional field completion warning dialogs now help users avoid accidentally skipping important information.</ListItem>
      </List>
    </ShiplogLayout>
  );
}
