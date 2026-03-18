import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W24",
  titleText: "Inspiration Index Takes Flight: AI-Powered Content Capture & Form Infrastructure",
  previewText: "Launched the Inspiration Index with intelligent webpage analysis, automated content capture via EventBridge, and built a complete form system with type-safe validation across the stack.",
  publishedAt: "2025-06-15",
  week: 24,
  year: 2025,
  status: "published",
  projectTags: ["inspiration-index", "adpharm-shad"],
} satisfies ShiplogMeta;

export default function Shiplog2025W24() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        The Inspiration Index app went from zero to production this week with a complete AI-powered content capture system.
      </Text>

      <List>
        <ListItem>Integrated Claude to analyze and describe webpages, extracting meaningful insights from captured content.</ListItem>
        <ListItem>EventBridge integration handles automated frame capture and processing, working around the 5-second timeout constraints.</ListItem>
        <ListItem>Pinecone set up for embedding storage and semantic search capabilities.</ListItem>
        <ListItem>Complete form system shipped with typed components, hooks, and server-side Zod validation for bulletproof data handling.</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Expanded the shared component registry with production-ready form infrastructure.
      </Text>

      <List>
        <ListItem>Comprehensive form builder with type-safe field definitions and validation.</ListItem>
        <ListItem>Authentication schemas and utilities for consistent auth handling.</ListItem>
        <ListItem>Improved build process and dependency management for smoother integration across projects.</ListItem>
      </List>
    </ShiplogLayout>
  );
}
