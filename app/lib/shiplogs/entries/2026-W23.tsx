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
  slug: "2026-W23",
  titleText: "Photo OCR, Design Systems, and Workflow Integration",
  previewText: "Shipped photo OCR scanning in Hearth Press, launched Synapse's design system and product foundation, built proposal rehydration tooling, and deepened task-tracker integration across Devrounds.",
  week: 23,
  year: 2026,
  status: "published",
  projectTags: ["hearth-press", "synapse", "devrounds", "synapse-crm", "silo-cdp"],
} satisfies ShiplogMeta;

export default function Shiplog2026W23() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        A productive stretch across five active projects: photo OCR scanning landed in production, Synapse crystallized from concept to design system, Devrounds gained deeper workflow integration, and the proposal engine got more reliable extraction.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="hearth-press" /> Hearth Press
      </Text>
      <Text as="p" variant="body">
        Photo OCR scanning went live. Users can now snap a photo of printed materials and extract structured text using vision models. The camera flow includes a dedicated scan doorway, signed CDN media keys for secure uploads, and a lightweight staging tier for testing new features before production deployment.
      </Text>
      <Text as="p" variant="body">
        Infrastructure improvements added CDN viewer token authentication and a preview environment for safer iteration. The OCR backend swapped to a faster model for better response times.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse" /> Synapse App
      </Text>
      <Text as="p" variant="body">
        Synapse moved from concept to scaffolded reality. The monorepo now includes a web app design system exported from Claude Design, an Astro 6 marketing site, and a design system showcase. Product documentation landed alongside the code: a v1 journey walkthrough, spine data model, and agent orientation handoff.
      </Text>
      <Text as="p" variant="body">
        The design system serves as the visual foundation for the app, with interactive task pickers and organized component libraries ready for implementation.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="devrounds" /> Devrounds
      </Text>
      <Text as="p" variant="body">
        Task-tracker integration deepened with assignee write-back, a card mirror sheet, and instant drawer navigation. Clicking a linked card now opens its details on the linked-task tab without switching views. Board task comments now interleave with the activity feed for unified context.
      </Text>
      <Text as="p" variant="body">
        The backlog reorganized into Backlog and Parked top-level tabs, with a new task priority row replacing the sidebar tab. The priority row displays dated cards and a show-hide toggle for completed items. Inline reminder completion checkboxes make it faster to mark tasks done without opening dialogs.
      </Text>
      <Text as="p" variant="body">
        The packager brief gained an agent preamble and leaner reference appendix, with subtask creation now scheduling into sprints instead of parking by default.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse-crm" /> Synapse Proposal Engine
      </Text>
      <Text as="p" variant="body">
        The extraction engine pivoted from regex parsing to LLM-based extraction with interruption safety and tuned prompting. Reconciliation logic improved with physical-block awareness and candidate-rollup fixes, and bulk extraction hardened with rate limiting and access auditing.
      </Text>
      <Text as="p" variant="body">
        Document tooling gained drag-drop uploads, a review step that flags unresolved placeholders, and per-row copy buttons for faster handling. Multi-domain access gates replaced single-domain restrictions for broader team access, and configuration can now load from environment variables for easier deployment.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" /> Silo Services
      </Text>
      <Text as="p" variant="body">
        The test suite converted to a fully-parallel harness with one server per worker for faster feedback. The release workflow became interactive with version picker prompts, npm pre-flight checks, auto-revert on failure, and browser-based 2FA retry loops. Dirty tree warnings now prompt instead of blocking, and version bumps anchor to the latest npm-published version for consistency.
      </Text>
    </ShiplogLayout>
  );
}
