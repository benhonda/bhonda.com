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
  titleText: "Store Submissions, Sprint Boards, and Workflow Viz",
  previewText: "Prepped a recipe app for the App and Play Stores, shipped a sprint planning board with live integration, and built workflow visualization tools for project insights.",
  week: 20,
  year: 2026,
  status: "published",
  projectTags: ["hearth-press", "devrounds", "adpharm-activity", "cd2", "postgresdk"],
} satisfies ShiplogMeta;

export default function Shiplog2026W20() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        A recipe app went from internal prototype to store-ready, a new sprint planning tool launched with live task integration, and workflow visualization surfaced years of project history.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="hearth-press" />
      </Text>
      <Text as="p" variant="body">
        Submitted to the App Store and Play Store with full compliance features. Account deletion flow meets App Store requirements end-to-end. Marketing site launched with contact pages and legal copy.
      </Text>
      <Text as="p" variant="body">
        Shipped a complete unit system supporting dual measurements and portion scaling. Recipes now parse fractions, handle fifths and sixths, pluralize ingredients, and scale parenthetical quantities. Structured ingredients track quantity, unit, name, and comments separately.
      </Text>
      <Text as="p" variant="body">
        Import pipeline extracts recipes from web pages using AI, generates hero images, and saves them to the library. Preview screen lets you edit before saving. Multi-photo carousels display recipe images.
      </Text>
      <Text as="p" variant="body">
        Recipe detail screen shows ingredients in named phases, method steps with comments, curator credits, and personal notes. Long-press an ingredient to comment, edit, or delete. Header menu provides recipe-level actions.
      </Text>
      <Text as="p" variant="body">
        Library screen displays saved recipes with image tiles and credits. Account sheet manages sign-in and deletion. Google and Apple sign-in work on both mobile and web.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="devrounds" />
      </Text>
      <Text as="p" variant="body">
        Launched a sprint planning board with timeline and week views. Drag projects and subtasks across calendar cells to reschedule. Backlog panel holds unscheduled work. Reminders attach to specific dates without needing a project.
      </Text>
      <Text as="p" variant="body">
        Live integration mirrors programming priority tasks. Drag tasks from the explorer directly onto the board. Changes sync immediately—no manual imports.
      </Text>
      <Text as="p" variant="body">
        Activity feed shows project and subtask timelines at the bottom of drawers. Image attachments live on projects, subtasks, and backlog items. Drawers are URL-addressable with shareable links.
      </Text>
      <Text as="p" variant="body">
        Week board groups projects by seven-day spans. Unscheduled projects appear on the current week's rail. Hide completed projects with a toggle. Colored avatars identify assignees at a glance.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-activity" />
      </Text>
      <Text as="p" variant="body">
        Visualized project workflows from years of task history. Day-grid Gantt charts show work timelines with quiet stretches highlighted. Gap explanations categorize delays as external blockers or internal pauses.
      </Text>
      <Text as="p" variant="body">
        LLM-generated narratives summarize each activity group. Project pages display composition breakdowns showing how time split across roles and phases. Recency tables surface what changed recently.
      </Text>
      <Text as="p" variant="body">
        Rule-based status tracking marks projects as active, completed, or dormant. External wait subtotals measure days blocked by outside dependencies. Viewer lives behind an access gate for internal use.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="cd2" />
      </Text>
      <Text as="p" variant="body">
        Team memberships enable role-based access control. Member management UI handles invitations and permissions. DNS apex support works for domains hosted on external nameservers.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>
      <Text as="p" variant="body">
        Fixed fetch binding for browser environments. SDK clients no longer throw illegal invocation errors when called from web apps.
      </Text>
    </ShiplogLayout>
  );
}
