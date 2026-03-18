import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W42",
  titleText: "Screenshot Auth, Smarter Comments & GitHub Workflows",
  previewText: "This week brought authenticated screenshots to the Agentic Editor, a complete overhaul of the commenting system, and streamlined GitHub automation across the toolshed.",
  publishedAt: "2025-10-19",
  week: 42,
  year: 2025,
  status: "published",
  projectTags: ["agentic-editor", "adpharm-toolshed"],
} satisfies ShiplogMeta;

export default function Shiplog2025W42() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="agentic-editor" />
      </Text>

      <Text as="p" variant="body">
        The editor can now capture screenshots of pages behind authentication, using a shared ECR architecture for secure credential management. Environment variable management was also improved by splitting Vercel environment variables into Terraform-managed and manual categories for better infrastructure-as-code practices.
      </Text>

      <Text as="p" variant="body">
        The comment system was overhauled: migrated from the old comment system to a smarter, selector-based approach that's more reliable and maintainable. You can now edit comments directly where they appear with no context switching. The iframe-bridge now intelligently positions itself to avoid conflicts with page content, and sidebar width preferences are saved and restored across sessions via cookies.
      </Text>

      <Text as="p" variant="body">
        The preview UI now has working back/forward/refresh buttons. PR status tracking provides better visibility with explicit target branch specification. Onboarding was improved with clearer messages, persistent loading states, and detailed post-merge instructions. Multiple iframe-bridge reliability issues were fixed including health check failures, origin mismatches, and cross-origin compatibility problems. Claude model is now explicitly specified in automated issue creation for consistent AI assistance.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-toolshed" />
      </Text>

      <Text as="p" variant="body">
        Added a GitHub Actions workflow for automated PR assistance via Claude PR Assistant. The development environment now includes the gh CLI for streamlined GitHub operations, and proper permissions were configured for Claude Code integration.
      </Text>
    </ShiplogLayout>
  );
}
