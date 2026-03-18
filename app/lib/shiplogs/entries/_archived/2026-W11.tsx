import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Quote } from "~/components/people/quote";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W11",
  titleText: "Search intelligence, mobile polish, and screenshot capture",
  previewText: "Major search and mobile UX improvements across the inspiration index, full-page screenshot capture for autoscroll recordings, and email platform enhancements.",
  publishedAt: "2026-03-15",
  week: 11,
  year: 2026,
  status: "draft",
  projectTags: ["inspiration-index", "autoscroll-recorder", "silo-cdp", "cd2"],
} satisfies ShiplogMeta;

export default function Shiplog2026W11() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        A productive week focused on search intelligence, mobile experience, and visual capture capabilities. The inspiration index saw significant upgrades to search ranking and mobile UX, while autoscroll recorder gained full-page screenshot support.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <List>
        <ListItem>Relevance-based section sorting using vector embeddings with adaptive thinking levels that adjust complexity based on query difficulty</ListItem>
        <ListItem>Live website search now includes trigram matching for more flexible results</ListItem>
      </List>

      <List>
        <ListItem>Responsive dialogs and navigation, refined filter UX, and touch-optimized interactions throughout</ListItem>
        <ListItem>Root feed moved to the homepage, with unified collection detail views replacing the old browse-only approach</ListItem>
      </List>

      <List>
        <ListItem>HD MP4 downloads for paid users; standard MP4 free for everyone</ListItem>
        <ListItem>Credits only consumed when searches return actual results</ListItem>
      </List>

      <Quote>14-day trial with redesigned onboarding flow featuring interest selection and search suggestion chips</Quote>

      <List>
        <ListItem>Authentication shifted from passwords to OTP email auth for simpler, more secure access</ListItem>
        <ListItem>Account management added delete account functionality and dedicated settings pages</ListItem>
        <ListItem>SEO fundamentals: canonical URLs, sitemaps, and OG image generation</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <List>
        <ListItem>Full-page screenshot capture now available alongside video recordings</ListItem>
        <ListItem>HiDPI-native capture with dynamic scaling produces sharper output</ListItem>
        <ListItem>Multi-output recording supports generating multiple resolutions from a single job</ListItem>
        <ListItem>Screenshots appear on job detail pages with dedicated settings for configuration</ListItem>
        <ListItem>Cookie consent selectors added to handle common banner scenarios automatically</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        Toast notifications confirm destination settings saves. Dark mode support via CSS theme variables enables system-matched theming.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="cd2" />
      </Text>

      <List>
        <ListItem>Email forwarding gained CC support, attachment handling, and attribution blocks for transparency</ListItem>
        <ListItem>API key revocation provides security controls</ListItem>
        <ListItem>Forwarding rules now sort by priority with warnings for silent-drop configurations</ListItem>
        <ListItem>DLQ monitoring with Slack notifications; hourly redrive attempts for failed messages</ListItem>
      </List>
    </ShiplogLayout>
  );
}
