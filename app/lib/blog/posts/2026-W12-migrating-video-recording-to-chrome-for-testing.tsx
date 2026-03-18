import { AudioPlayer } from "~/components/blog/audio-player";
import { InlineCode } from "~/components/blog/inline-code";
import { TranscriptLine } from "~/components/blog/transcript-line";
import { PostLayout } from "~/components/blog/post-layout";
import { Text } from "~/components/misc/text";
import { MarkdownContent } from "~/components/misc/markdown-content";
import type { PostMeta } from "~/lib/blog/blog-types";
import researchContent from "./2026-W12-migrating-video-recording-to-chrome-for-testing-research.md?raw";

export const postMeta = {
  title: "Migrating Video Recording to Chrome for Testing",
  slug: "migrating-video-recording-to-chrome-for-testing",
  preview:
    "Chrome 137 quietly broke our zoom extension. The fix was a browser built for robots — and it taught NotebookLM something new.",
  metaDescription:
    "How Chrome for Testing solved an impossible codec + extension constraint in our GPU recording pipeline — proprietary_codecs=true, no branding guard, same CDP version as Playwright 1.54.0 — and the 140px banner offset that came along for the ride.",
  status: "published",
  publishedAt: "2026-03-18",
  projects: ["autoscroll-recorder"],
  tags: ["engineering", "browser", "chrome", "cloud"],
} satisfies PostMeta;

export default function MigratingVideoRecordingToChromeForTesting() {
  return (
    <PostLayout meta={postMeta}>
      <Text as="p" variant="body">
        Chrome 137 quietly removed <InlineCode>--load-extension</InlineCode> support from all branded Chrome
        builds. For most people that's invisible. For us it was a hard break: our GPU recording path
        needs a MV3 zoom extension loaded via that flag, and it also needs proprietary codec support
        (H.264, AAC, HEVC) for sites with embedded video. Playwright's bundled Chromium keeps{" "}
        <InlineCode>--load-extension</InlineCode> working, but its FFmpeg is statically compiled without the
        proprietary codecs — and that's not a swappable <InlineCode>.so</InlineCode>, it's welded in. We were
        stuck between a browser that could zoom but not play video, and one that could play video
        but not zoom.
      </Text>
      <Text as="p" variant="body">
        Chrome for Testing (CfT) is built with <InlineCode>proprietary_codecs=true</InlineCode> and ships its
        own <InlineCode>libffmpeg.so</InlineCode>. More importantly, it sets{" "}
        <InlineCode>is_chrome_for_testing=true</InlineCode>, which is mutually exclusive with{" "}
        <InlineCode>is_chrome_branded=true</InlineCode> in the Chromium source — so the branding guard that
        blocks <InlineCode>--load-extension</InlineCode> simply never fires. CfT version{" "}
        <InlineCode>139.0.7258.154</InlineCode> shares the same <InlineCode>major.minor.build</InlineCode> as Playwright
        1.54.0's bundled Chromium, so CDP stays compatible. The cost: a mandatory 53px "Chrome is
        being controlled by automated software" banner that stacks on top of the existing 87px
        browser chrome — 140px total vertical offset before page content begins. The 87px figure
        itself includes a deliberate 2px sub-pixel buffer to absorb rounding artifacts at 2× device
        scale. CfT has no auto-update mechanism, so the version is pinned in the Dockerfile and
        must be bumped manually when Playwright is upgraded.
      </Text>
      <Text as="p" variant="body">
        I dropped the implementation notes into NotebookLM. Here's what came back.
      </Text>

      <AudioPlayer
        cdnPath="blog/2026-03-18-chrome-for-testing/Migrating_video_recording_to_Chrome_for_Testing.m4a"
        title="NotebookLM Audio Overview — Migrating Video Recording to Chrome for Testing"
      />

      <hr className="border-border" />

      <Text as="h2" variant="heading-sm">Transcript</Text>

      <div className="space-y-3">
        <TranscriptLine speaker="Speaker 1">
          So we're unpacking a stack of engineering notes updated today, March 18, 2026. And the
          mission for this deep dive is to look at a back-end migration from standard Google Chrome
          to Chrome for Testing —
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">or CfT, I guess.</TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Right. CfT. It's basically how they solved this seemingly impossible software conflict in
          automated web recording. And for you listening, it's kind of like you have this Swiss Army
          knife, right? Imagine you're camping and you really need to open a bottle of wine, but you
          also need to cut some rope —
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          but suddenly the knife has this weird new rule where if you pull out the corkscrew, the
          blade just physically locks shut. Like you literally cannot use both at the same time.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          Which is exactly what happened to the developer's GPU recording path. They hit this massive
          lockout because they needed two browser capabilities to run at the exact same time.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Right — playing embedded video and zooming the page.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          Exactly. So playing video needs proprietary codecs like H.264 and AAC. But zooming the
          page needs an MV3 extension loaded via a specific command line flag — the{" "}
          <InlineCode>--load-extension</InlineCode> flag.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          But standard Google Chrome version 137 and newer completely disabled that extension flag
          for their official branded builds, right?
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          Yeah, that just instantly kills the zoom functionality. So, naturally, the fallback is to
          use the unbranded open-source Chromium browser that comes bundled with Playwright, which
          is their automation tool. But wait — the open-source version lacks those proprietary video
          codecs. So they're just stuck.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Totally stuck. They were caught between a browser that zooms but won't play video, and one
          that plays video but won't zoom.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          I mean, wait — why couldn't they just force the open-source version to play the video?
          Like, just drop the right FFmpeg library file into the directory and swap it out?
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Well, you'd think so. But the open-source FFmpeg engine in that specific Chromium build is
          actually statically compiled without those codecs.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">Oh, wow. So it's just hardcoded in there?</TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Yeah, it's welded into the frame of the application. So a simple library swap just doesn't
          work. You need an entirely different binary to let both features coexist.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          Okay, let's unpack this. Enter Chrome for Testing, or CfT.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Right. And it solves the video issue right out of the gate because it ships with{" "}
          <InlineCode>proprietary_codecs=true</InlineCode> and has its own <InlineCode>libffmpeg.so</InlineCode> file.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          Nice. And it also flips that hard-coded switch —{" "}
          <InlineCode>is_chrome_for_testing=true</InlineCode> — which is huge because of how the Chromium
          source code is written.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Exactly. That state is mutually exclusive with <InlineCode>is_chrome_branded=true</InlineCode>.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          It's basically a VIP backstage pass, right? It lets the developers walk right past Chrome's
          security bouncers so they can load the zoom extension.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          It really is an elegant fix to a horrible dependency nightmare. And it perfectly matches
          the CDP protocol version they needed for Playwright 1.54.0 — version 139.0.7258.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          Okay, so fixing the engine is a massive win. But swapping engines naturally changes the
          physical dimensions of the car. Adopting a specialized testing browser brings in a literal,
          physical UI problem on the screen.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Yeah, it forces this mandatory 53-pixel warning banner — the one that declares "Chrome is
          being controlled by automated software."
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          Oh man, that completely wrecked the visual recording coordinates.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          It really does. Because if you're capturing a specific viewport, the browser chrome at the
          top usually takes up 87 pixels.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          But now you add a 53-pixel banner on top of that. So suddenly you're dealing with this
          hyper-specific 140-pixel vertical offset before the actual web page content even begins.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          And the developer's notes map out that exact 140-pixel offset. But here is the wild part —
          that 87-pixel browser chrome measurement actually includes a deliberate 2-pixel buffer.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          Wait, a 2-pixel buffer just for rounding errors?
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Yeah. To absorb sub-pixel rounding errors. When you scale down a web page for recording on
          high-density displays, the math often gives you fractions of a pixel.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          And the rendering engine obviously can't draw half a pixel, so it just drops it.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Exactly. Leaving this annoying one or two pixel white gap at the bottom of an
          800-pixel-high viewport.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          Debugging a single white line of pixels sounds like an absolute nightmare. Adding exactly 2
          pixels to the top offset to force the math to round correctly is just brilliant duct-tape
          engineering.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          It really is. And because CfT is purely for testing environments, it doesn't auto-update.
          So the developers have to manually pin versions to ensure that 140-pixel offset — and
          everything else — stays totally stable.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          Well, for you listening, every seamless screen recorder or automated web tool you use
          relies heavily on this exact kind of invisible scaffolding.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Yeah. You're never really meant to see the precise sub-pixel math or the specialized
          browser builds running under the hood.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          It's just duct tape and math all the way down.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Right. And it kind of leaves you with a big question to think about. If standard browsers
          keep locking down features like extensions for security — like Chrome Stable 137 did — are
          we heading toward a future where the internet is split entirely into browsers for humans
          and browsers for bots?
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 2">
          It's definitely a fascinating split to watch unfold.
        </TranscriptLine>
        <TranscriptLine speaker="Speaker 1">
          Yeah. Next time your software restricts what tools you can use at the same time, just
          remember — you're not the only one trying to use the corkscrew and the blade at once.
          Sometimes you just have to go find a completely different knife.
        </TranscriptLine>
      </div>

      <hr className="border-border" />

      <Text as="h2" variant="heading-sm">Research Notes</Text>

      <MarkdownContent content={researchContent} />
    </PostLayout>
  );
}
