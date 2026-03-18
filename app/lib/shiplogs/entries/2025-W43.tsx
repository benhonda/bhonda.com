import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
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

      <Text as="p" variant="body">
        Completely redesigned the review interface with a resizable sidebar, collapsible comment threads, and cleaner visual hierarchy. The new layout puts focus on the content being reviewed while keeping feedback accessible. Added intelligent refinement tracking that highlights multiple elements simultaneously when relevant.
      </Text>

      <Text as="p" variant="body">
        Streamlined the job creation flow with repository setup instructions and improved error handling for GitHub workflows. The architecture now centers around GitHub issues and API polling, making the system more reliable and easier to debug. Deployment detection helps track when changes actually go live.
      </Text>

      <Text as="p" variant="body">
        Improved UI navigation throughout the app, with better feedback during long-running operations and smarter state management. Added session cancellation and retry functionality, plus approval-by-default UX that reduces friction in common workflows.
      </Text>
    </ShiplogLayout>
  );
}
