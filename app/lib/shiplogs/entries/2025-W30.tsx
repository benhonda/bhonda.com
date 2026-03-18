import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W30",
  titleText: "Autoscroll Magic, Component Registries, and CDP Refinements",
  previewText: "Shipped a smooth autoscroll recorder demo, rebuilt the component registry system with multi-stack support, and polished the Inspiration Index with better theming and pipeline improvements.",
  publishedAt: "2025-07-27",
  week: 30,
  year: 2025,
  status: "published",
  projectTags: ["autoscroll-recorder", "adpharm-shad", "silo-cdp", "inspiration-index"],
} satisfies ShiplogMeta;

export default function Shiplog2025W30() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Shipped a working demo of an autoscroll recorder with mobile optimizations and smooth CSS-based scrolling. The tool now handles scroll interactions more naturally and performs better on mobile devices.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Major overhaul of the component registry system. Compressed multiple file systems into a unified structure with multi-stack definitions in the registry JSON. Added login page and improved developer experience with better documentation. Transitioned to CSS variables for theming, and components now generate at build time for better performance.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        Added retry event scripts to improve reliability of event processing in the customer data platform.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Polished the app with several improvements. Fixed theming issues and refined visual styling. Enhanced build pipeline with better event tracking and attempt counting. Updated dev container and job pipeline configurations, and improved model selection and validation.
      </Text>
    </ShiplogLayout>
  );
}
