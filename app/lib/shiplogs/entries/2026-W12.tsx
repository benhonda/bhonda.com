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
  slug: "2026-W12",
  titleText: "Search Polish, GPU Recording, Dark Mode",
  previewText:
    "Target-level search with deduplication, GPU-accelerated HEVC recording with multi-snapshot UI, theme system overhaul, and PostgreSDK transaction primitives.",
  publishedAt: "2026-03-22",
  week: 12,
  year: 2026,
  status: "published",
  projectTags: ["inspiration-index", "autoscroll-recorder", "bhonda-com", "postgresdk", "bunny-cache-buster"],
} satisfies ShiplogMeta;

export default function Shiplog2026W12() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="p" variant="body">
        Major search infrastructure improvements with target-level rendering and inline editing, GPU-accelerated
        recording workflow with multi-snapshot support, and theme system refinements across the portfolio.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Search now renders at the target level with site-level deduplication strategy, eliminating redundant results
        across the board. Pipeline review gained inline entity editing and three new panels: processing history with
        detailed artifact tracking, section tree visualization with capture labels, and summary view with Shiki JSON
        syntax highlighting.
      </Text>

      <Text as="p" variant="body">
        Navigation flyout now includes a 500ms open delay to prevent accidental triggers. Filter embedding cache
        delivers zero-latency section relevance sorting by precomputing embeddings at query time. Onboarding flow
        simplified with streamlined interest selection and inline search launchpad.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Multi-snapshot support arrived with interval-based viewport capture system and thumbnail strip UI. Screenshots
        now appear as inline previews on run detail pages. Dark mode received FOUC prevention and comprehensive color
        calibration across success states and UI elements.
      </Text>

      <Text as="p" variant="body">
        Device presets expanded with <InlineCode>mobile-standard</InlineCode> and{" "}
        <InlineCode>desktop-standard</InlineCode> configurations optimized for T4 VGX GPU at 2x capture scale.
        Distribution routing UI now supports per-output S3 destinations with InfoPopover help text and duplicate
        destination controls. Runs can now include notes for context tracking.
      </Text>

      <Text as="p" variant="body">
        Chrome for Testing replaced the previous browser setup with configurable recording parameters including zoom
        level, UI offsets, and trim seconds. GPU encoder switched from H.264 to HEVC/H.265 (
        <InlineCode>hevc_nvenc</InlineCode>) with expanded quality flags and p6 preset. Backend migrated from Xvfb to
        GPU-backed Xorg on AL2023 ECS GPU AMI for hardware-accelerated encoding.
      </Text>

      <Quote note="GPU migration">
        HEVC encoding with hardware acceleration cuts file sizes while maintaining quality at 2x capture scale.
      </Quote>

      <Text as="p" variant="body">
        Frame deduplication using perceptual dHash eliminates redundant frames during transcode. CDN cache purging via
        Bunny Cache Buster service ensures fresh playback after indexing. Run/job ID separation now cleanly
        distinguishes per-attempt identity from stable S3 identity.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="bhonda-com" />
      </Text>

      <Text as="p" variant="body">
        SEO metadata improvements rolled out across all routes. Theme system overhauled with blocking script to prevent
        FOUC and Tailwind v4 dark mode integration. Topics browsing launched with{" "}
        <InlineCode>/topics/:topic</InlineCode> route, PostCard component, and tagging taxonomy.
      </Text>

      <Text as="p" variant="body">
        Blog section reintroduced alongside People profiles. Code highlighting arrived via CodeBlock and InlineCode
        components with GFM markdown support. List component added for structured content. Shiplogs and projects
        migrated to fully-local file-based system.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Upsert operations landed with <InlineCode>sdk.table.upsert({"{ where, create, update }"})</InlineCode> syntax.
        Transaction support added via <InlineCode>sdk.$transaction()</InlineCode> for atomic multi-operation workflows.
        Delete operations split into <InlineCode>$softDelete()</InlineCode> and <InlineCode>$hardDelete()</InlineCode>{" "}
        methods for explicit control.
      </Text>

      <Text as="p" variant="body">
        Stale file cleanup now prompts before deletion with <InlineCode>--force</InlineCode> flag for non-interactive
        environments. Pull operation automatically detects and removes orphaned output files.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="bunny-cache-buster" />
      </Text>

      <Text as="p" variant="body">
        Bunny Cache Buster service started to purge CDN cache remotely for new and updated content.
      </Text>
    </ShiplogLayout>
  );
}
