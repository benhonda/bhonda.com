import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W43",
  titleText: "Multi-Round Reviews, Viewport Controls, and Smarter UI Navigation",
  previewText: "This week brought major UX improvements to the Agentic Editor with conversation-style feedback, browser viewport controls, and a redesigned review interface that makes iterating on changes smoother than ever.",
  publishedAt: "2025-10-26",
  week: 43,
  year: 2025,
  status: "published",
  projectTags: ["agentic-editor"],
} satisfies ShiplogMeta;

export default function Shiplog2025W43() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="agentic-editor" />
      </Text>

      <Text as="p" variant="body">
        Introduced a conversation-style review workflow that supports multiple rounds of feedback. Comments now thread naturally, showing the full history of refinements and responses. The new three-stage processing pipeline (submission → review → refinement) makes it clear where each piece of feedback stands in the workflow.
      </Text>

      <Text as="p" variant="body">
        Added browser viewport controls with increment/decrement zoom buttons, making it easier to review designs at different scales. The controls are integrated directly into the interface, so you can quickly adjust your view without losing context.
      </Text>

      <List>
        <ListItem>Completely redesigned the review interface with a resizable sidebar, collapsible comment threads, and cleaner visual hierarchy.</ListItem>
        <ListItem>Added intelligent refinement tracking that highlights multiple elements simultaneously when relevant.</ListItem>
        <ListItem>Streamlined the job creation flow with repository setup instructions and improved error handling for GitHub workflows.</ListItem>
        <ListItem>Architecture now centers around GitHub issues and API polling for better reliability and debuggability.</ListItem>
        <ListItem>Deployment detection helps track when changes actually go live.</ListItem>
        <ListItem>Session cancellation and retry functionality added alongside approval-by-default UX that reduces friction in common workflows.</ListItem>
      </List>
    </ShiplogLayout>
  );
}
