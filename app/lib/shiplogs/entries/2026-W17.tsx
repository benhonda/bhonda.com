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
  slug: "2026-W17",
  titleText: "Foundations and Launches",
  previewText: "Hearth Press takes shape, theadpharm.com goes live with full SEO, Inspiration Index pricing evolves, and new text effects land in Remotion.",
  week: 17,
  year: 2026,
  status: "published",
  projectTags: ["hearth-press", "theadpharm-com", "inspiration-index", "cd2", "caniemail-for-agents", "adpharm-remotion"],
} satisfies ShiplogMeta;

export default function Shiplog2026W17() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        This was a week of foundations and launches. A new project found its shape through design iteration, theadpharm.com launched with full SEO infrastructure, and Inspiration Index evolved its pricing model to better serve team workflows.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="hearth-press" /> Hearth Press
      </Text>
      <Text as="p" variant="body">
        Hearth Press emerged this week as a new project focused on creating beautiful printed recipe books. The design system took shape with a consolidated token-based brand book and reusable library components. Five major user flows were mapped out: importing recipes via in-app paste, creating a book from scratch with inline recipe editing, adding photographs with dedicated framing controls, managing notes and annotations, and collaborative line-by-line commenting. A roadmap timeline surface and interactive book design explorations give the project clear direction forward.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="theadpharm-com" /> theadpharm.com
      </Text>
      <Text as="p" variant="body">
        The agency site launched with production-ready SEO infrastructure. Dynamic open graph images render per route, JSON-LD structured data enriches search engine understanding, and the sitemap auto-generates from the route manifest. The contact form now identifies users in the analytics pipeline and sends messages through the CD2 email service. Bot protection upgraded from honeypot fields to Cloudflare Turnstile for a cleaner user experience. The entire stack provisions through Terraform with OIDC-based AWS access and environment-scoped analytics.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" /> Inspiration Index
      </Text>
      <Text as="p" variant="body">
        Pricing evolved to better match team workflows. The Team tier was renamed to Studio and moved to quarterly billing cadence with per-seat AI search caps. Anonymous users now have server-enforced search quotas with per-fingerprint rate limiting to protect service availability. Post-trial users see clearer current-plan badges and updated pricing CTA copy. Under the hood, the filter taxonomy migrated to a shared module and a daily processing summary cron keeps the team informed.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="cd2" /> CD2
      </Text>
      <Text as="p" variant="body">
        The email SDK released version 0.1.1 fixing a broken Bun export condition that prevented some projects from importing the client correctly. The package now works reliably across Node and Bun environments.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="caniemail-for-agents" /> Can I Email for Agents
      </Text>
      <Text as="p" variant="body">
        Launched as a new skill for Claude Code. Agents can now check HTML email client support directly during development workflows, answering questions about CSS properties, HTML elements, and feature compatibility across email clients without leaving the IDE.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-remotion" /> Adpharm Remotion
      </Text>
      <Text as="p" variant="body">
        Four new text animation effects joined the library: PhoneSplittingText for character-by-character reveals, WordAttack for punchy emphasis animations, TextInWave for flowing motion effects, and IntroducingTextCenter for centered title treatments. Font loading was centralized and library conventions were codified across all effects for consistent behavior.
      </Text>
    </ShiplogLayout>
  );
}
