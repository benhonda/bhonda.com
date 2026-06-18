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
  slug: "2026-W22",
  titleText: "Proposal Intelligence, Task Flow, and Analytics Precision",
  previewText: "Synapse gains more structured proposal generation and template fills. Devrounds adds task packaging and parked-subtask flow. Time-on-Page hits v2.0 with scroll depth, idle gating, and Safari fixes. Skills repo launches.",
  week: 22,
  year: 2026,
  status: "published",
  projectTags: ["synapse", "devrounds", "silo-cdp", "adpharm-skills", "adpharm-shad"],
} satisfies ShiplogMeta;

export default function Shiplog2026W22() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        A week of refinement across internal tools: more structured and repeatable proposal generation, deeper task-tracker integration in task planning, and a major analytics tracking release with scroll depth and accuracy improvements.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="synapse" /> Proposal Engine
      </Text>
      <Text as="p" variant="body">
        The proposal generation system gained more structure: a classifier that segments proposals by type and falls back intelligently when inputs are sparse, reusable templates that pre-fill common sections, and provenance tracking so generated content traces back to its inputs.
      </Text>
      <Text as="p" variant="body">
        Shipped a self-contained skill bundle with expanded intake and checkpoint validation, making the generation workflow more repeatable and auditable.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="devrounds" /> Task Planning
      </Text>
      <Text as="p" variant="body">
        The Packager landed: paste a task URL and get an agent-ready markdown brief automatically formatted for handoff. Saves the context-gathering step when kicking off agent work.
      </Text>
      <Text as="p" variant="body">
        Parked subtasks now live in a dedicated Backlog section — unschedule work without losing it. The people view got smarter: dropping a card onto a person row auto-assigns them, and the Unassigned row stays visible even when collapsed. Added a terminal canceled state across projects, subtasks, and reminders.
      </Text>
      <Text as="p" variant="body">
        Fixed week edge-nav so cards can dwell while dragging. Task-tracker linking now surfaces through a unified badge component and dedicated tabs for backlog items.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" /> Time-on-Page Plugin
      </Text>
      <Text as="p" variant="body">
        Version 2.0 shipped with breaking changes for the better. Config simplified to a single argument, heartbeat scheduler is now internal, and consent middleware validates before any tracking fires.
      </Text>
      <Text as="p" variant="body">
        Added scroll depth tracking in v2.1. Idle and focus gating prevent the engagement timer from running when users step away or switch tabs. The clock is now monotonic and survives bfcache restores. Safari close-tab detection works via a beforeunload fallback. SPA navigation tracking improved with popstate listeners for back/forward.
      </Text>
      <Quote note="via commit">
        Single-arg config, heartbeat scheduler, consent middleware.
      </Quote>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-skills" /> Skills Repository
      </Text>
      <Text as="p" variant="body">
        Launched a dedicated repository for agent skills. Includes the new adpharm-stack skill plus engineering and misc categories. Vendored dependencies and added discovery tooling to make skills reusable across projects.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" /> Component Registry
      </Text>
      <Text as="p" variant="body">
        Added an input-group component and ghost button variants with expanded icon sizes. The landing init step now preselects Base UI by default. Pruned stale custom components and rebuilt registry output to match source changes.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        Analytics Infrastructure
      </Text>
      <Text as="p" variant="body">
        Bootstrapped a remote MCP server for analytics data access, deployed as a Cloudflare Worker. Enables agent-driven analytics queries without local SDK setup.
      </Text>
    </ShiplogLayout>
  );
}
