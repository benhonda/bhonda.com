import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W28",
  titleText: "Framework Foundations & Pharmacy Validation",
  previewText: "Rebuilt the actions framework from the ground up and added pharmacy license validation tools. Major architectural improvements across the stack.",
  publishedAt: "2025-07-13",
  week: 28,
  year: 2025,
  status: "published",
  projectTags: ["adpharm-shad", "adpharm-toolshed"],
} satisfies ShiplogMeta;

export default function Shiplog2025W28() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Shipped a modernized actions framework with a complete rewrite delivering improved structure and ergonomics. RR7 analytics support was added for better insights, built-in i18n support landed for multi-language applications, reactive state management arrived via RR7 signals, and TypeScript support for serverless functions was improved with better Lambda types. The entire registry structure was reorganized for cleaner code organization and a better developer experience.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-toolshed" />
      </Text>

      <Text as="p" variant="body">
        Added a new license validator tool for validating pharmacy license numbers. Login issues were resolved, event-driven architecture support was added via EventBridge integration, and environment variable handling and schema validation were improved.
      </Text>
    </ShiplogLayout>
  );
}
