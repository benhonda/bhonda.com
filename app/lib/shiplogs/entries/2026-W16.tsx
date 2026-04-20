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
  slug: "2026-W16",
  titleText: "Video Animation Library & UI Polish",
  previewText:
    "Launched programmatic video effects library, improved accessibility in Inspiration Index, and documented adblock resilience patterns.",
  publishedAt: "2026-04-19",
  week: 16,
  year: 2026,
  status: "published",
  projectTags: ["adpharm-remotion", "inspiration-index", "gtm-proxy"],
} satisfies ShiplogMeta;

export default function Shiplog2026W16() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Started a new video automation project, polished design system components, and improved developer documentation
        across infrastructure tooling.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-remotion" />
      </Text>

      <Text as="p" variant="body">
        Launched a new library for programmatic video generation. Built 20+ reusable Remotion effects including text
        animations, mockup displays, feature cards, and search interface demos. Added AI-assisted workflows for video
        design and storyboarding, plus centralized font management across compositions.
      </Text>

      <Quote note="via library design">
        Pre-built effects let you compose marketing videos from declarative components instead of timeline editors.
      </Quote>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Improved accessibility with screen reader descriptions and fixed display heading rendering. Added pricing and
        plans page, expanded database schema for better component categorization, and refined taxonomy descriptions for
        clearer browsing.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="gtm-proxy" />
      </Text>

      <Text as="p" variant="body">
        Documented adblock resilience patterns and implementation strategies. Improved developer experience with
        isolated devcontainer setup and added landing page specification tooling.
      </Text>
    </ShiplogLayout>
  );
}
