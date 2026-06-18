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
  slug: "2026-W19",
  titleText: "Case Studies, UTM Controls, and Task Sync",
  previewText: "Launched Case Studies publishing on theadpharm.com, shipped granular UTM toggles for ADAPTS tracking links, and expanded Devrounds task-tracker integration with people sync and 12-month backfill.",
  week: 19,
  year: 2026,
  status: "published",
  projectTags: ["theadpharm-com", "adapts", "devrounds"],
} satisfies ShiplogMeta;

export default function Shiplog2026W19() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Content publishing infrastructure on <Tag project="theadpharm-com" />, marketing link controls for <Tag project="adapts" />, and team data sync on <Tag project="devrounds" />.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="theadpharm-com" />
      </Text>

      <Text as="p" variant="body">
        Launched the Case Studies section with a brand-author model and citation tracker for attributing insights and quotes to team members. The system lets us publish long-form analysis tied to specific authors and track where ideas originated.
      </Text>

      <Text as="p" variant="body">
        Visual improvements to the about page: the team photo now uses a pixel-wipe transition from black-and-white to full colour on hover. The Sister Agency section got a refresh with glowing borders and a two-column layout.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adapts" />
      </Text>

      <Text as="p" variant="body">
        Tracking links now support per-link toggles for <InlineCode>utm_via</InlineCode> and <InlineCode>utm_referrer</InlineCode> auto-append behavior. The template system switched from <InlineCode>__destination_query_params</InlineCode> to a unified <InlineCode>__utm_config</InlineCode> approach for cleaner parameter control.
      </Text>

      <Text as="p" variant="body">
        Fixed a bug where trailing slashes on destination URLs were being stripped incorrectly, which broke some downstream analytics setups.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="devrounds" />
      </Text>

      <Text as="p" variant="body">
        Expanded the task-tracker integration to sync people data alongside projects. The ingest now backfills 12 months of historical activity and handles concurrent updates safely. Routes consolidated under a single app namespace for cleaner routing.
      </Text>
    </ShiplogLayout>
  );
}
