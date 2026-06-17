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
  titleText: "Hearth Press design foundations, SEO overhaul, and experimental pathways",
  previewText: "Launched design system for Hearth Press recipe books, rebuilt agency site with full SEO stack, shipped new pricing model and experimental analysis pipeline for Inspiration Index, and extended email tooling with hosting and CLI workflows.",
  publishedAt: "2026-04-26",
  week: 17,
  year: 2026,
  status: "draft",
  projectTags: ["hearth-press", "theadpharm-com", "inspiration-index", "foundation-emails-fork", "caniemail-for-agents", "adpharm-remotion", "cd2"],
} satisfies ShiplogMeta;

export default function Shiplog2026W17() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        New foundations this week: design system and book-making flows for Hearth Press, a complete SEO and infrastructure rebuild for the agency site, pricing overhaul and experimental analysis for Inspiration Index, and extended email workflow tooling.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="hearth-press" /> Hearth Press
      </Text>
      <Text as="p" variant="body">
        Built the design foundations for the recipe book platform. Consolidated the design system into a brand book with comprehensive tokens, extracted reusable library components, and added identity specimens.
      </Text>
      <Text as="p" variant="body">
        Designed five core user flows: importing recipes via in-app paste, making a book with inline recipe editing, adding photographs with main and in-book sub-flows, notes management, and line comments. Added a roadmap timeline surface and book exploration sketchbook for design iteration.
      </Text>
      <Text as="p" variant="body">
        Introduced portion scaling, flow navigation dropdown, sticky CTAs, and screen-by-screen navigation. Pivoted editing interface from spread-level to page-level controls for tighter recipe management.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="theadpharm-com" /> Agency Site
      </Text>
      <Text as="p" variant="body">
        Shipped a complete SEO and infrastructure overhaul. Added dynamic per-route Open Graph images, Organization JSON-LD enrichment, sitemap, robots.txt, canonical URLs, and favicons. Converted hero group photo to WebP with preload for Largest Contentful Paint optimization.
      </Text>
      <Text as="p" variant="body">
        Provisioned Vercel and AWS infrastructure via Terragrunt with OIDC. Migrated to flat routes with auto-generator pipeline. Decommissioned EventBridge stack.
      </Text>
      <Text as="p" variant="body">
        Replaced honeypot and timestamp bot protection with Cloudflare Turnstile. Added environment-scoped analytics with user identification on form submission. Fixed hero CLS issue.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" /> Inspiration Index
      </Text>
      <Text as="p" variant="body">
        Launched new pricing model: renamed Team tier to Studio, switched to quarterly billing cadence, and added per-seat AI search caps. Fixed pricing CTA copy and current-plan badge display for post-trial users.
      </Text>
      <Text as="p" variant="body">
        Implemented server-authoritative anonymous search quota with per-fingerprint rate limiting. Added daily processing summary cron job.
      </Text>
      <Text as="p" variant="body">
        Shipped experimental analysis pathway with dedicated GPU processing. Runs website and experimental page taxonomy over key frames, with blocker audit handoff and shared processing history. Split site-page analysis into blocker audit and taxonomy phases running in parallel for faster processing.
      </Text>
      <Text as="p" variant="body">
        Migrated filter taxonomy to shared module with auto-generation from pipeline database. Added numeric bounds, composed wrappers, and sharpened rubrics. Emits LLM-ready Zod schemas with field descriptions.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="foundation-emails-fork" /> Email Workflow Tooling
      </Text>
      <Text as="p" variant="body">
        Added random per-directory URL prefixes for hosted S3 keys with 90-day HTML lifecycle. Supports permanent opt-out and unexpire restore path.
      </Text>
      <Text as="p" variant="body">
        Introduced non-interactive CLI subcommands with per-preset dist folders, unified <InlineCode>--host</InlineCode> flag, and merge-tag preview substitution. Added compare subcommand and host-by-default package flow.
      </Text>
      <Text as="p" variant="body">
        Improved button rendering with VML arcsize formula fixes, dark mode support, and multi-line handling. Added view toggle for comparison pages. Enhanced PTM workflow with auto-nested images under <InlineCode>images/</InlineCode> and document-relative references.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="caniemail-for-agents" /> Can I Email for Agents
      </Text>
      <Text as="p" variant="body">
        Released initial skill for email client compatibility lookups. Supports installation via <InlineCode>npx skills install</InlineCode> path. Published with Adpharm ownership.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-remotion" /> Remotion Effects
      </Text>
      <Text as="p" variant="body">
        Added four new text animation effects: <InlineCode>PhoneSplittingText</InlineCode>, <InlineCode>WordAttack</InlineCode>, <InlineCode>TextInWave</InlineCode>, and <InlineCode>IntroducingTextCenter</InlineCode>. Centralized font loading and codified library conventions.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="cd2" /> CD2 Email SDK
      </Text>
      <Text as="p" variant="body">
        Fixed broken Bun export condition in <InlineCode>@cdv2/email</InlineCode> SDK. Released version 0.1.1.
      </Text>
    </ShiplogLayout>
  );
}
