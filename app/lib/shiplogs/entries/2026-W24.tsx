import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Quote } from "~/components/people/quote";
import { Tag } from "~/components/misc/tag";
import { InlineCode } from "~/components/blog/inline-code";
import { CodeBlock } from "~/components/blog/code-block";
import { List, ListItem } from "~/components/misc/list";
import { AudioPlayer } from "~/components/blog/audio-player";
import { TranscriptLine } from "~/components/blog/transcript-line";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W24",
  titleText: "Monorepo Consolidations, V2 Launches, Flow Design",
  previewText: "Silo V2 web app shipped, CD2 consolidated into unified monorepo, Devrounds gains weekly review AI and board improvements, Synapse flows take shape.",
  week: 24,
  year: 2026,
  status: "published",
  projectTags: ["silo-cdp", "cd2", "devrounds", "synapse", "adpharm-skills"],
} satisfies ShiplogMeta;

export default function Shiplog2026W24() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        A week of architectural consolidation and feature delivery. Silo's V2 web app launched with full source and destination management, CD2 unified three repositories into one monorepo, and Devrounds shipped AI-powered weekly reviews alongside major board improvements.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        The V2 web application went live this week with complete source and destination management. Users can now create, edit, and delete sources through the new interface, generate installation snippets, and upload configurations to S3. The destinations layer supports GTM integration through a typed registry with automatic settings reupload.
      </Text>

      <Text as="p" variant="body">
        The SDK gained remote settings support through CDN-hosted configuration blocks and a new <InlineCode>consent.onConsentChanged</InlineCode> API for tracking consent state changes. Documentation moved to a dedicated Astro + Starlight site with auto-generated wire-format tables derived from JSDoc comments.
      </Text>

      <Text as="p" variant="body">
        Infrastructure improvements include consolidating multiple enrichment crons into a single sequential endpoint with healthcheck heartbeats, migrating to the Vercel Hono preset for cleaner routing, and establishing a production E2E test suite that validates the full gateway and CDP pipeline.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="cd2" />
      </Text>

      <Text as="p" variant="body">
        Three separate repositories merged into a unified monorepo structure. The database API, web application, and worker services now share a single workspace with namespaced Taskfile commands and consolidated dependencies. A new interactive picker surfaces available dev servers and deployment targets.
      </Text>

      <Text as="p" variant="body">
        The email SDK became available as an agent skill, making it discoverable for automated integration work. The web application now consumes a shared database SDK workspace package, eliminating duplicate schema definitions.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="devrounds" />
      </Text>

      <Text as="p" variant="body">
        Weekly reviews gained AI-generated sprint postmortems that scope to the active week and deep-link every task for quick navigation. The board introduced a by-week view that packs projects into per-sprint columns with spanning lanes for cross-sprint work.
      </Text>

      <Text as="p" variant="body">
        Board interactions improved across the surface. Backlog sections gained quick-capture buttons at the top and bottom of each project group. Card kebab menus expose quick actions for assignees, moving cards, and adding to boards. Attachments now push directly to linked tasks, and reminder chips expanded to two lines showing source task context.
      </Text>

      <Text as="p" variant="body">
        The notes editor upgraded to rich text with inline image support and a shared lightbox for viewing attachments. Task completion triggers a dropdown menu for adding follow-ups rather than showing a toast. Project creation moved inline throughout the interface, letting users stage draft projects from pickers and commit them on submit.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse" />
      </Text>

      <Text as="p" variant="body">
        Major flow design work advanced across the application. The invitation flow merged claim and RSVP paths into a single unified experience, with onboarding forked as an entry variant. Delegation flow branched on actor type, and the day-of flow mapped the event-day arc for staff-scanned scenarios.
      </Text>

      <Text as="p" variant="body">
        Consent handling shifted to a layered model that unbundles cross-engagement reuse preferences. The profile flow transitioned from wizard to durable surface. A new storyboard view at <InlineCode>/flows</InlineCode> surfaces all interaction sequences, and card recipes on the design page demonstrate eight compositions of the primitive components.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-skills" />
      </Text>

      <Text as="p" variant="body">
        Two new reference skills joined the library. The product-tracking skill packages the Accoil methodology for deciding what to track and why, covering event naming, taxonomy design, and B2B account modeling. The silo-analytics skill provides comprehensive SDK documentation generated from the upstream docs repository through a new docs-engine pipeline.
      </Text>

      <Quote note="via docs-engine">Auto-generated reference skills from canonical documentation sources</Quote>
    </ShiplogLayout>
  );
}
