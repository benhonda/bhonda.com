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
  slug: "2026-W20",
  titleText: "Recipe app nears launch, sprint tools mature",
  previewText: "Structured recipe editing, multi-photo carousels, and App Store submission prep. Sprint boards gain activity feeds, reminders, and workflow visualizers ship.",
  publishedAt: "2026-05-17",
  week: 20,
  year: 2026,
  status: "draft",
  projectTags: ["hearth-press", "devrounds", "adpharm-activity", "cd2", "postgresdk"],
} satisfies ShiplogMeta;

export default function Shiplog2026W20() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        A recipe app readying for launch, sprint planning tools maturing, and workflow visualizers shipping.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="hearth-press" />
      </Text>

      <Text as="p" variant="body">
        The app moved closer to App Store submission. Structured ingredient editing landed — quantities, units, names, and comments parse cleanly from recipe imports. Import preview gives you a chance to review and fix extractions before saving to your library.
      </Text>

      <Text as="p" variant="body">
        Recipe scaling handles fractions including fifths and sixths, pluralization, and parenthetical scaling notes. Long-press an ingredient to comment, edit, or delete it. The recipe detail screen shows multi-photo carousels when multiple images exist. AI generates hero images during import when the source page lacks suitable photos.
      </Text>

      <Text as="p" variant="body">
        Apple and Google sign-in work end-to-end. Account deletion flow satisfies App Store requirements. The marketing site launched with contact and legal pages. Unit system v1 shipped, enabling the portion-scale lens that lets you scale recipes by servings.
      </Text>

      <Quote note="App Store submission">Store metadata aligned to v1 binary, submission pack complete.</Quote>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="devrounds" />
      </Text>

      <Text as="p" variant="body">
        The sprint planner evolved into a full board with new entity types. Taskless reminders live in their own sidebar and rail lane. Backlog items represent untriaged work that can promote to subtasks or projects. Standalone tasks exist without a parent project in a dedicated lane.
      </Text>

      <Text as="p" variant="body">
        Activity feeds show timeline history at the bottom of project and subtask drawers. Drag tasks from the Programming Priority board directly onto sprint cells. The week board view surfaces unscheduled projects on the current week's rail.
      </Text>

      <Text as="p" variant="body">
        Image attachments work on projects and subtasks. Board drawers are URL-addressable with a copy-link action. Colored avatar fallbacks tint initials deterministically by name. Hide completed toggle filters finished work. New badges flag fresh tasks from the priority board. Hover previews show linked task details without leaving the board.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-activity" />
      </Text>

      <Text as="p" variant="body">
        The workflow visualizer shipped. Day-grid Gantt charts anchor activity trees on project pages. Collapsible groups and direct links navigate the timeline. Business-day axis skips weekends and holidays automatically.
      </Text>

      <Text as="p" variant="body">
        LLM-generated narratives describe what happened in each activity group. Composition donut redesign adds a per-person and per-category inner ring. Gap explanations surface on the Gantt — external-wait subtotals categorize every quiet stretch and sum the externally-blocked days. Project status derives from rules: active, completed, or dormant.
      </Text>

      <Text as="p" variant="body">
        Access gate with code protects the viewer alongside noindex directives.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="cd2" />
      </Text>

      <Text as="p" variant="body">
        Team memberships and member management UI landed. The docs page refactored to agent-prompt-driven navigation. Infrastructure now supports Vercel-hosted DNS apexes for SES domains.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Version 0.19.6 fixed a browser fetch binding issue that caused illegal invocation errors when calling the SDK from web contexts.
      </Text>
    </ShiplogLayout>
  );
}
