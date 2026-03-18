import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W08",
  titleText: "Projects Showcase, Stories-Style Browsing, and Pipeline Reliability",
  previewText: "This week brought a new projects section to the portfolio, a complete UX overhaul for Inspiration Index with stories-style browsing, and major reliability improvements to the capture pipeline.",
  publishedAt: "2026-02-22",
  week: 8,
  year: 2026,
  status: "published",
  projectTags: ["bhonda-com", "inspiration-index", "postgresdk"],
} satisfies ShiplogMeta;

export default function Shiplog2026W08() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="bhonda-com" />
      </Text>

      <Text as="p" variant="body">
        Added a dedicated projects section that lets you browse all active projects and their individual shiplogs. Each project now displays with a grid layout, descriptions, and links to source code where available. The UI includes zero-shiplog filtering and breadcrumb navigation for easier browsing.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        The browsing experience got a major refresh with stories-style website cards that feel more engaging and visual. Clicking cards now opens a full dialog view instead of navigating away, and videos resume from where you left off when switching between captures. An About page was added featuring live statistics pulled directly from the database—showing real-time counts of captured sites, frames analyzed, and components identified. The homepage hero now displays these stats as well.
      </Text>

      <Text as="p" variant="body">
        Anonymous feedback collection launched for captures, with a login prompt when trying to save items. Share buttons for deep-linking directly to specific sections of captures shipped. Public SEO landing pages launched under a new browse layout, card grids now show pagination countdowns, and pixel-art hearts mark saved items.
      </Text>

      <Text as="p" variant="body">
        The capture pipeline received significant robustness improvements with interactive retry mechanisms, better error handling, and AI cost tracking across pipeline runs. Batch retry support and several edge case fixes that could cause processing failures landed. The classification system was overhauled to be more precise and maintainable, with clearer definitions for visual styles and components, making the entire dataset more coherent.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        PostgreSDK now displays its version on startup and embeds version info in builds, making it easier to track which version of the database schema is in use across different environments.
      </Text>
    </ShiplogLayout>
  );
}
