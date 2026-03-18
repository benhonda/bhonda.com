import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Quote } from "~/components/people/quote";
import { Tag } from "~/components/misc/tag";
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

      <Text as="p" variant="body">
        Search got smarter with relevance-based section sorting using vector embeddings and adaptive thinking levels that adjust complexity based on query difficulty. Live website search now includes trigram matching for more flexible results.
      </Text>

      <Text as="p" variant="body">
        Mobile experience received a complete overhaul: responsive dialogs and navigation, refined filter UX, and touch-optimized interactions throughout. The root feed moved to the homepage, with unified collection detail views replacing the old browse-only approach.
      </Text>

      <Text as="p" variant="body">
        Download options expanded with HD MP4 for paid users and standard MP4 free for everyone. Credits are now only consumed when searches return actual results, preventing waste on empty queries.
      </Text>

      <Quote>14-day trial with redesigned onboarding flow featuring interest selection and search suggestion chips</Quote>

      <Text as="p" variant="body">
        Authentication shifted from passwords to OTP email auth for simpler, more secure access. Account management added delete account functionality and dedicated settings pages. SEO fundamentals landed: canonical URLs, sitemaps, and OG image generation.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Full-page screenshot capture now available alongside video recordings. HiDPI-native capture with dynamic scaling produces sharper output, while multi-output recording supports generating multiple resolutions from a single job.
      </Text>

      <Text as="p" variant="body">
        Screenshots appear on job detail pages with dedicated settings for configuration. Cookie consent selectors added to handle common banner scenarios automatically.
      </Text>

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

      <Text as="p" variant="body">
        Email forwarding gained CC support, attachment handling, and attribution blocks for transparency. API key revocation provides security controls, while forwarding rules now sort by priority with warnings for silent-drop configurations.
      </Text>

      <Text as="p" variant="body">
        DLQ monitoring with Slack notifications keeps tabs on delivery issues, with hourly redrive attempts for failed messages.
      </Text>
    </ShiplogLayout>
  );
}
