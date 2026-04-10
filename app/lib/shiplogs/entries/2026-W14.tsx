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
  slug: "2026-W14",
  titleText: "Report Insights & Period Comparisons",
  previewText:
    "Enhanced analytics reporting with key insights, data quality indicators, and period-over-period comparison capabilities.",
  publishedAt: "2026-04-05",
  week: 14,
  year: 2026,
  status: "published",
  projectTags: ["silo-cdp"],
} satisfies ShiplogMeta;

export default function Shiplog2026W14() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Focused week on analytics reporting infrastructure. Added insight synthesis and comparison tooling across
        outcomes-first reports.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        Shipped three major reporting enhancements. First, every outcomes-first report now includes a Key Insights
        section that synthesizes top findings and flags data quality issues automatically. Second, added
        period-over-period comparison functionality so users can track trends across reporting cycles. Third,
        consolidated multiple report versions into unified templates and built event migration tooling to streamline
        future schema updates.
      </Text>

      <Text as="p" variant="body">
        Generated new monthly reports across the platform and delivered updated historical reports with the new insight
        framework applied retroactively.
      </Text>
    </ShiplogLayout>
  );
}
