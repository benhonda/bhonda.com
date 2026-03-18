import { AudioPlayer } from "~/components/blog/audio-player";
import { TranscriptLine } from "~/components/blog/transcript-line";
import { PostLayout } from "~/components/blog/post-layout";
import type { PostMeta } from "~/lib/blog/blog-types";

export const postMeta = {
  title: "Migrating Video Recording to Chrome for Testing",
  slug: "migrating-video-recording-to-chrome-for-testing",
  preview:
    "Chrome 137 quietly broke our zoom extension. The fix was a browser built for robots — and it taught NotebookLM something new.",
  metaDescription:
    "How Chrome for Testing solved an impossible codec + extension constraint in our GPU recording pipeline — proprietary_codecs=true, no branding guard, same CDP version as Playwright 1.54.0 — and the 140px banner offset that came along for the ride.",
  status: "published",
  publishedAt: "2026-03-18",
  tags: ["engineering", "browser", "chrome", "cloud"],
} satisfies PostMeta;

export default function MigratingVideoRecordingToChromeForTesting() {
  return (
    <PostLayout meta={postMeta}>
      <p>
        Chrome 137 quietly removed <code>--load-extension</code> support from all branded Chrome
        builds. For most people that's invisible. For us it was a hard break: our GPU recording path
        needs a MV3 zoom extension loaded via that flag, and it also needs proprietary codec support
        (H.264, AAC, HEVC) for sites with embedded video. Playwright's bundled Chromium keeps{" "}
        <code>--load-extension</code> working, but its FFmpeg is statically compiled without the
        proprietary codecs — and that's not a swappable <code>.so</code>, it's welded in. We were
        stuck between a browser that could zoom but not play video, and one that could play video
        but not zoom.
      </p>
      <p>
        Chrome for Testing (CfT) is built with <code>proprietary_codecs=true</code> and ships its
        own <code>libffmpeg.so</code>. More importantly, it sets{" "}
        <code>is_chrome_for_testing=true</code>, which is mutually exclusive with{" "}
        <code>is_chrome_branded=true</code> in the Chromium source — so the branding guard that
        blocks <code>--load-extension</code> simply never fires. CfT version{" "}
        <code>139.0.7258.154</code> shares the same <code>major.minor.build</code> as Playwright
        1.54.0's bundled Chromium, so CDP stays compatible. The cost: a mandatory 53px "Chrome is
        being controlled by automated software" banner that stacks on top of the existing 87px
        browser chrome — 140px total vertical offset before page content begins. The 87px figure
        itself includes a deliberate 2px sub-pixel buffer to absorb rounding artifacts at 2× device
        scale. CfT has no auto-update mechanism, so the version is pinned in the Dockerfile and
        must be bumped manually when Playwright is upgraded.
      </p>
      <p>
        I dropped the implementation notes into NotebookLM. Here's what came back.
      </p>

      <AudioPlayer
        cdnPath="blog/2026-03-18-chrome-for-testing/Migrating_video_recording_to_Chrome_for_Testing.m4a"
        title="NotebookLM Audio Overview — Migrating Video Recording to Chrome for Testing"
      />

      <hr className="border-border" />

      <h2 className="text-lg font-semibold">Transcript</h2>

      <div className="space-y-3 text-sm leading-relaxed">
        <p>
          <span className="font-semibold">Speaker 1:</span> So we're unpacking a stack of
          engineering notes updated today, March 18, 2026. And the mission for this deep dive is to
          look at a back-end migration from standard Google Chrome to Chrome for Testing —
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> or CfT, I guess.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Right. CfT. It's basically how they
          solved this seemingly impossible software conflict in automated web recording. And for you
          listening, it's kind of like you have this Swiss Army knife, right? Imagine you're camping
          and you really need to open a bottle of wine, but you also need to cut some rope —
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> but suddenly the knife has this weird
          new rule where if you pull out the corkscrew, the blade just physically locks shut. Like
          you literally cannot use both at the same time.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> Which is exactly what happened to the
          developer's GPU recording path. They hit this massive lockout because they needed two
          browser capabilities to run at the exact same time.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Right — playing embedded video and
          zooming the page.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> Exactly. So playing video needs
          proprietary codecs like H.264 and AAC. But zooming the page needs an MV3 extension loaded
          via a specific command line flag — the <code>--load-extension</code> flag.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> But standard Google Chrome version 137
          and newer completely disabled that extension flag for their official branded builds, right?
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> Yeah, that just instantly kills the
          zoom functionality. So, naturally, the fallback is to use the unbranded open-source
          Chromium browser that comes bundled with Playwright, which is their automation tool. But
          wait — the open-source version lacks those proprietary video codecs. So they're just
          stuck.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Totally stuck. They were caught between
          a browser that zooms but won't play video, and one that plays video but won't zoom.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> I mean, wait — why couldn't they just
          force the open-source version to play the video? Like, just drop the right FFmpeg library
          file into the directory and swap it out?
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Well, you'd think so. But the
          open-source FFmpeg engine in that specific Chromium build is actually statically compiled
          without those codecs.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> Oh, wow. So it's just hardcoded in
          there?
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Yeah, it's welded into the frame of the
          application. So a simple library swap just doesn't work. You need an entirely different
          binary to let both features coexist.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> Okay, let's unpack this. Enter Chrome
          for Testing, or CfT.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Right. And it solves the video issue
          right out of the gate because it ships with <code>proprietary_codecs=true</code> and has
          its own <code>libffmpeg.so</code> file.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> Nice. And it also flips that
          hard-coded switch — <code>is_chrome_for_testing=true</code> — which is huge because of
          how the Chromium source code is written.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Exactly. That state is mutually
          exclusive with <code>is_chrome_branded=true</code>.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> It's basically a VIP backstage pass,
          right? It lets the developers walk right past Chrome's security bouncers so they can load
          the zoom extension.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> It really is an elegant fix to a
          horrible dependency nightmare. And it perfectly matches the CDP protocol version they
          needed for Playwright 1.54.0 — version 139.0.7258.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> Okay, so fixing the engine is a massive
          win. But swapping engines naturally changes the physical dimensions of the car. Adopting a
          specialized testing browser brings in a literal, physical UI problem on the screen.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Yeah, it forces this mandatory 53-pixel
          warning banner — the one that declares "Chrome is being controlled by automated software."
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> Oh man, that completely wrecked the
          visual recording coordinates.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> It really does. Because if you're
          capturing a specific viewport, the browser chrome at the top usually takes up 87 pixels.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> But now you add a 53-pixel banner on
          top of that. So suddenly you're dealing with this hyper-specific 140-pixel vertical offset
          before the actual web page content even begins.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> And the developer's notes map out that
          exact 140-pixel offset. But here is the wild part — that 87-pixel browser chrome
          measurement actually includes a deliberate 2-pixel buffer.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> Wait, a 2-pixel buffer just for
          rounding errors?
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Yeah. To absorb sub-pixel rounding
          errors. When you scale down a web page for recording on high-density displays, the math
          often gives you fractions of a pixel.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> And the rendering engine obviously
          can't draw half a pixel, so it just drops it.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Exactly. Leaving this annoying one or
          two pixel white gap at the bottom of an 800-pixel-high viewport.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> Debugging a single white line of pixels
          sounds like an absolute nightmare. Adding exactly 2 pixels to the top offset to force the
          math to round correctly is just brilliant duct-tape engineering.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> It really is. And because CfT is purely
          for testing environments, it doesn't auto-update. So the developers have to manually pin
          versions to ensure that 140-pixel offset — and everything else — stays totally stable.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> Well, for you listening, every seamless
          screen recorder or automated web tool you use relies heavily on this exact kind of
          invisible scaffolding.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Yeah. You're never really meant to see
          the precise sub-pixel math or the specialized browser builds running under the hood.
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> It's just duct tape and math all the
          way down.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Right. And it kind of leaves you with a
          big question to think about. If standard browsers keep locking down features like
          extensions for security — like Chrome Stable 137 did — are we heading toward a future
          where the internet is split entirely into browsers for humans and browsers for bots?
        </p>
        <p>
          <span className="font-semibold">Speaker 2:</span> It's definitely a fascinating split to
          watch unfold.
        </p>
        <p>
          <span className="font-semibold">Speaker 1:</span> Yeah. Next time your software restricts
          what tools you can use at the same time, just remember — you're not the only one trying to
          use the corkscrew and the blade at once. Sometimes you just have to go find a completely
          different knife.
        </p>
      </div>
    </PostLayout>
  );
}
