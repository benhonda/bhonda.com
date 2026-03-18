import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W49",
  titleText: "Week of Infrastructure, Analytics, and Polish",
  previewText: "Launched bhonda.com with automated weekly shiplogs, enhanced Agentic Editor with team collaboration and iframe-bridge improvements, and added comprehensive analytics tracking to Formgen.",
  publishedAt: "2025-12-07",
  week: 49,
  year: 2025,
  status: "published",
  projectTags: ["bhonda-com", "agentic-editor", "formgen", "adpharm-shad"],
} satisfies ShiplogMeta;

export default function Shiplog2025W49() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Launched bhonda.com with the automated weekly shiplog system, shipped
        team collaboration and iframe-bridge improvements to Agentic Editor,
        and added comprehensive analytics tracking to Formgen.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="bhonda-com" />
      </Text>

      <Text as="p" variant="body">
        Launched my new personal site this week. The star feature is an automated weekly shiplog system that generates these development summaries every Sunday using git commits and Claude. The site includes custom typography, optimized font loading, and full infrastructure setup with AWS S3 and CDN integration.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="agentic-editor" />
      </Text>

      <Text as="p" variant="body">
        Shipped several collaboration and infrastructure improvements. Team functionality enables better collaboration and message permissions. The iframe-bridge installation flow got major improvements with granular tracking, retry capability, reset functionality, and better user guidance including cookie configuration. The activity sidebar was enhanced with inline replies and @claude was renamed for clearer interaction. Workflow setup added a copy command option and completion tracking, admin status controls improved the Claude status UI, and infrastructure was restructured for multi-environment deployment.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="formgen" />
      </Text>

      <Text as="p" variant="body">
        Implemented comprehensive form analytics with admin user identification and tracking documentation. Response exports and enhanced preview capabilities landed alongside a language toggle. Question numbering, object grouping, and HTML rendering support shipped for richer form content, along with various UI polish improvements.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Added ranking and rating matrix field types. A new theme and preference management system with action caching shipped alongside updated React Router v7 routing documentation and specialized slash commands for common workflows.
      </Text>
    </ShiplogLayout>
  );
}
