import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
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

      <List>
        <ListItem>Added multi-tenant support with team management and permission systems — users can now collaborate within team workspaces with proper access controls.</ListItem>
        <ListItem>Full dark mode toggle shipped.</ListItem>
        <ListItem>Unified chat system consolidates chat, change requests, and refinements into a single messages table, streamlining conversation flow and improving per-change-request workflow tracking.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="formgen" />
      </Text>

      <List>
        <ListItem>CSS variable-based theming landed with an /apply-form-theme command, allowing forms to match any brand identity. Light/dark/system theme switching followed.</ListItem>
        <ListItem>New drag-and-drop ranking field using dnd-kit for priority surveys and preference ordering.</ListItem>
        <ListItem>Rating-matrix field types for collecting structured feedback.</ListItem>
        <ListItem>Complete multi-page form system with admin dashboard, thank you pages, and response detail viewer.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adapts" />
      </Text>

      <List>
        <ListItem>Added comprehensive testing frameworks with Vitest including test runner safeguards and debug modes.</ListItem>
        <ListItem>Event tracking is now enriched with IP geolocation data for geographic insights.</ListItem>
        <ListItem>Type-checking and test validation run before deployment, catching issues before they reach production.</ListItem>
        <ListItem>Template enhancements include placeholder metadata API, empty parameter filtering, and improved documentation.</ListItem>
      </List>

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
