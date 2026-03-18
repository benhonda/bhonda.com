import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W48",
  titleText: "Teams, Themes, and Testing: A Week of Polish",
  previewText: "Multi-tenancy came to Agentic Editor, Formgen got drag-and-drop rankings and custom theming, and ADAPTS grew a proper testing suite with IP geolocation.",
  publishedAt: "2025-11-30",
  week: 48,
  year: 2025,
  status: "published",
  projectTags: ["agentic-editor", "formgen", "adapts", "silo-cdp", "adpharm-shad"],
} satisfies ShiplogMeta;

export default function Shiplog2025W48() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Multi-tenancy came to Agentic Editor, Formgen gained drag-and-drop
        rankings and custom theming, and ADAPTS grew a proper testing suite
        with IP geolocation — a week of foundations across five projects.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="agentic-editor" />
      </Text>

      <Text as="p" variant="body">
        Added multi-tenant support with team management and permission systems—users can now collaborate within team workspaces with proper access controls. A full dark mode toggle shipped alongside a unified chat system that consolidates chat, change requests, and refinements into a single messages table, streamlining conversation flow and improving per-change-request workflow tracking.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="formgen" />
      </Text>

      <Text as="p" variant="body">
        CSS variable-based theming landed with an /apply-form-theme command, allowing forms to match any brand identity. Light/dark/system theme switching followed. A new drag-and-drop ranking field using dnd-kit shipped for priority surveys and preference ordering, alongside rating-matrix field types for collecting structured feedback. A complete multi-page form system with admin dashboard, thank you pages, and response detail viewer rounds out the week.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adapts" />
      </Text>

      <Text as="p" variant="body">
        Added comprehensive testing frameworks with Vitest including test runner safeguards and debug modes. Event tracking is now enriched with IP geolocation data for geographic insights. Type-checking and test validation run before deployment, catching issues before they reach production. Template enhancements include placeholder metadata API, empty parameter filtering, and improved documentation.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        Refined analytics templates and added typecheck scripts to maintain code quality.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Replaced custom container classes with Tailwind utilities for better consistency and maintainability. Resolved component override logic and installation ordering issues for smoother setup experiences.
      </Text>
    </ShiplogLayout>
  );
}
