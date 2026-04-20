import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { InlineCode } from "~/components/blog/inline-code";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W15",
  titleText: "CLI Tooling & Developer Experience",
  previewText: "Shipped install-skill command for PostgreSDK and improved API key management for Bunny Cache Buster",
  publishedAt: "2026-04-12",
  week: 15,
  year: 2026,
  status: "published",
  projectTags: ["postgresdk", "bunny-cache-buster"],
} satisfies ShiplogMeta;

export default function Shiplog2026W15() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Focused on developer tooling this cycle. Added CLI capabilities to PostgreSDK and polished configuration flows
        for Bunny Cache Buster.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Released v0.19.5 with a new <InlineCode>install-skill</InlineCode> command. You can now bundle and install
        Claude Code skills directly from the CLI, streamlining the workflow for adding custom AI agent capabilities to
        your projects.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="bunny-cache-buster" />
      </Text>

      <Text as="p" variant="body">
        Added a direct link to Vercel project settings from the dashboard, making it easier to manage API keys without
        hunting through multiple screens. Also improved route documentation in the README for contributors.
      </Text>
    </ShiplogLayout>
  );
}
