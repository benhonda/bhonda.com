import type { ExternalPost } from "./blog-types";

/**
 * Posts published elsewhere (theadpharm.com) that bhonda.com surfaces and links out to.
 * Content stays on its home domain — only this lightweight reference lives here.
 *
 * To add one: drop in the title, the external post's meta description, its URL, the
 * publish date, and matching topics so it feeds the relevant /topics/* hubs.
 */
export const externalPosts: readonly ExternalPost[] = [
  {
    title: "Making a vet clinic citable by ChatGPT, Perplexity, and Claude",
    slug: "sixteen-mile-vet-ai-answer-engine-seo",
    description:
      "The technical and content work to make a veterinary clinic citable by AI answer engines — robots policy, structured data, and performance — so ChatGPT, Perplexity, and Claude surface it as a source.",
    externalUrl: "https://www.theadpharm.com/insights/sixteen-mile-vet-ai-answer-engine-seo",
    source: "theadpharm.com",
    publishedAt: "2026-05-09",
    topics: ["ai-seo", "marketing"],
  },
  {
    title: "Claude Design produces AI slop unless you tell it not to",
    slug: "claude-design-without-the-ai-slop-look",
    description:
      "Anthropic's new design tool ships with anti-slop guardrails. They don't fire on their own. The DESIGN.md, system prompt, named aesthetic, and reference-mix that actually do.",
    externalUrl: "https://www.theadpharm.com/insights/claude-design-without-the-ai-slop-look",
    source: "theadpharm.com",
    publishedAt: "2026-05-01",
    topics: ["claude", "design", "ai"],
  },
  {
    title: "A working playbook for Claude Code Skills on Opus 4.7",
    slug: "claude-code-skills-opus-4-7-playbook",
    description:
      "Skills are markdown files Claude reads when relevant. The description field decides whether one ever triggers. What changed in Opus 4.7, and the trap that silently disables half your skills.",
    externalUrl: "https://www.theadpharm.com/insights/claude-code-skills-opus-4-7-playbook",
    source: "theadpharm.com",
    publishedAt: "2026-04-24",
    topics: ["claude", "ai", "engineering"],
  },
  {
    title: "Two Google image models, two jobs: a working prompt guide for Nano Banana Pro and Nano Banana 2",
    slug: "nano-banana-pro-and-2-prompt-guide",
    description:
      "Google ships two image models on Gemini 3 now: Pro for hero shots, NB2 for everything else. The original Nano Banana's prompting habits actively hurt; here's the working stack.",
    externalUrl: "https://www.theadpharm.com/insights/nano-banana-pro-and-2-prompt-guide",
    source: "theadpharm.com",
    publishedAt: "2026-04-17",
    topics: ["ai", "prompting", "design"],
  },
  {
    title: "Brand-fidelity mockups in Claude Code and Google Stitch: what actually steers them off the AI default",
    slug: "claude-code-stitch-brand-mockups",
    description:
      "Both tools default to the same generic AI aesthetic: Inter, purple-on-white, three-up icon cards. A practitioner playbook for steering each off it, and the cross-tool file doing most of the work.",
    externalUrl: "https://www.theadpharm.com/insights/claude-code-stitch-brand-mockups",
    source: "theadpharm.com",
    publishedAt: "2026-04-10",
    topics: ["claude", "design", "ai"],
  },
  {
    title: "How to get Claude Opus 4.7 to write copy that doesn't sound like AI",
    slug: "claude-opus-anti-slop-playbook",
    description:
      "A working playbook for stopping Claude from defaulting to LinkedIn-thinkpiece prose: the leverage points, the banned-words block, the three-pass workflow, and the before/after.",
    externalUrl: "https://www.theadpharm.com/insights/claude-opus-anti-slop-playbook",
    source: "theadpharm.com",
    publishedAt: "2026-04-03",
    topics: ["claude", "prompting", "marketing"],
  },
  {
    title: "Google's 2025 HCP targeting changes, read for Canadian pharma",
    slug: "google-hcp-targeting-2025-policy-change",
    description:
      "Between May and October 2025, Google opened personalised targeting of healthcare professionals. What that means for Canadian pharma working under PAAB and the Food and Drugs Act.",
    externalUrl: "https://www.theadpharm.com/insights/google-hcp-targeting-2025-policy-change",
    source: "theadpharm.com",
    publishedAt: "2025-11-05",
    topics: ["google-ads", "marketing"],
  },
];
