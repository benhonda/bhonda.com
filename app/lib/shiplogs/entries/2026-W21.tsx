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
  slug: "2026-W21",
  titleText: "iOS Submission Sprint, MCP Gateway, Board UX",
  previewText: "Hearth Press heads toward the App Store with submission tooling, collections, and cook-mode polish. Silo gains a read-only MCP gateway. Devrounds gets backlog groups and reminder improvements. Activity viewer adds organization-level synthesis.",
  week: 21,
  year: 2026,
  status: "published",
  projectTags: ["hearth-press", "silo-cdp", "devrounds", "adpharm-activity"],
} satisfies ShiplogMeta;

export default function Shiplog2026W21() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Heavy iOS polish and submission prep across the recipe app, a new read-only MCP gateway for the analytics platform, board management improvements, and organization-level synthesis in the activity viewer.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="hearth-press" />
      </Text>

      <Text as="p" variant="body">
        The recipe app is heading toward its first App Store submission. A guided interactive submission runner handles the full release workflow. Store screenshot capture pipeline generates marketing assets from live app views. Privacy manifest declares required-reason APIs for review compliance.
      </Text>

      <Text as="p" variant="body">
        Collections shipped — create collections, add recipes, manage them from a dedicated tab. Pull-to-refresh landed on library and collection screens. Long-press menus on recipe cards offer quick actions.
      </Text>

      <Text as="p" variant="body">
        Cook mode gained inline tap-to-check step rows, a floating exit button, and portion scaling that auto-promotes to larger kitchen units when appropriate. Recipe detail headers now collapse over full-bleed hero images with pull-to-dismiss photo galleries.
      </Text>

      <Text as="p" variant="body">
        Typography system moved to a rem-based tier system with Dynamic Type font caps so text scales gracefully without breaking layouts. Ingredient rows support structured mise references and a parens-after-amount grammar.
      </Text>

      <Text as="p" variant="body">
        Account management added an edit-name screen with save-on-back behavior. Auth now hydrates from cached user data and only signs out on hard failures. Device locale seeds initial unit preferences on first sign-up.
      </Text>

      <Quote note="via store metadata">A personal recipe library built for cooks who care about the details.</Quote>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        Launched a read-only MCP gateway as a Cloudflare Worker — agents can now query the analytics platform through the Model Context Protocol. Generated schema context with catalog comments provides structured query rules. Real external traffic metrics now derive live instead of relying on stored status flags.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="devrounds" />
      </Text>

      <Text as="p" variant="body">
        Backlog improvements: groups now prepend their name to items dragged onto the board, and backlog item cards gained a kebab menu for creating new projects directly from backlog entries. The board is now fully mobile-responsive with drag-paginate navigation across weeks.
      </Text>

      <Text as="p" variant="body">
        Reminders gained a task picker for re-association, mark-done checkboxes, and follow-up scheduling. Reminder detail panels render as vertical threads with date and body history tracked separately. Activity feed now coalesces autosave-fragmented edits at read time.
      </Text>

      <Text as="p" variant="body">
        Task-tracker integration improvements: live due-date chips appear on board cards, batched card reads carry each task's other project names, and drag-drop from the task tracker onto the backlog is a no-op instead of parking the card.
      </Text>

      <Text as="p" variant="body">
        Subtask management improvements: checkboxes for completion, drag-drop from backlog to create new projects, and a project drawer action to fan assignees out to all child subtasks.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-activity" />
      </Text>

      <Text as="p" variant="body">
        Organization-level synthesis shipped — the third tier of the insight ladder that rolls up project narratives into portfolio analysis. Portfolio composition now splits print versus digital work. External wait phases promoted to first-class dossier phases with labeled gap categories.
      </Text>

      <Text as="p" variant="body">
        Every LLM-synthesized surface gained an AI-generated badge for transparency. The viewer added Vercel edge basic-auth for server-side access control. Project-level attribution now excludes standing tickets and uses sole-owner active-day logic.
      </Text>
    </ShiplogLayout>
  );
}
