import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { InlineCode } from "~/components/blog/inline-code";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W32",
  titleText: "PostgreSDK Ships, Autoscroll Gets Type-Safe, and Synapse Takes Shape",
  previewText: "A week of database tooling innovation, type-safe configuration systems, and CRM foundation building. PostgreSDK hit v0.4.0, Autoscroll Recorder got JSON Schema validation, and Synapse CRM launched.",
  publishedAt: "2025-08-10",
  week: 32,
  year: 2025,
  status: "published",
  projectTags: ["postgresdk", "autoscroll-recorder", "synapse-crm"],
} satisfies ShiplogMeta;

export default function Shiplog2025W32() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Shipped v0.4.0 after a week of intensive development and iteration. The SDK now features a complete client implementation with authentication, routing capabilities, and Neon database driver support. Type checking improvements ensure reliability across the board.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Implemented a JSON Schema-based type system with AJV validation for configuration management. The recorder now uses a master JSON schema to define all types, providing runtime validation and type safety. Type-safe UI schemas enable better form generation and settings management. Shipped across both API and web components with a shared <InlineCode>@autoscroll/types</InlineCode> package.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse-crm" />
      </Text>

      <Text as="p" variant="body">
        Launched initial version with PostgreSDK integration and Neon driver support. The foundation is set for a new contacts database and CRM functionality.
      </Text>
    </ShiplogLayout>
  );
}
