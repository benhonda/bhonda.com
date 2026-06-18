# Product Marketing Context

*Last updated: 2026-06-18*

## Product Overview
**One-liner:** Ben Honda's dev blog — weekly "shiplogs" of what he's building, plus the projects behind them.
**What it does:** bhonda.com publishes weekly development summaries ("shiplogs") auto-generated from git commits across a whitelist of repos, alongside a project index, long-form technical posts, and curated profiles. It's a build-in-public log of one developer's shipping cadence.
**Product category:** Personal dev blog / build-in-public portfolio.
**Product type:** Personal website — no signup, no pricing. Admin-authenticated backend for authoring/reviewing entries.
**Business model:** None. Pure personal brand — the goal is reputation, not revenue. Not a funnel for an agency, consulting, or any product it features.

## Target Audience
**Who it's for (in priority order):**
1. **Developers** — peers who want real, code-level detail and proof of consistent shipping.
2. **Recruiters** — vetting breadth, reliability, and current activity.
**Primary use case:** Build a personal brand and become a trusted industry voice by showing — not claiming — consistent, technically-deep work over time.
**Jobs to be done:**
- "Show me what this person actually ships, week over week" (credibility through cadence)
- "Go deep on a specific technical problem they solved" (long-form posts)
- "See the portfolio of products and tools behind the work" (projects index)
**Use cases:**
- A developer searching a specific problem (e.g. headless GPU capture, Google Ads UTM tracking) and landing on a post
- A recruiter or peer assessing breadth + reliability of output
- Ben himself, as a durable public record of progress

## Personas
_Personal site — formal buying personas don't apply. Audience archetypes:_

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Fellow developer | Real technical detail, honest write-ups | Most dev blogs are shallow or abandoned | Consistent, specific, code-level posts |
| Recruiter | Breadth + reliability of output | Portfolios go stale | Auto-generated, always-current shiplog |

## Problems & Pain Points
**Core problem:** Portfolios and dev blogs go stale and don't reflect what you're actually shipping right now.
**Why alternatives fall short:**
- Manual blogging is high-effort → posts dry up
- A static résumé/portfolio can't show momentum or cadence
- Generic platforms (LinkedIn, Medium) bury technical depth
**What it costs them:** Credibility — builders who ship constantly have no easy way to *show* it.
**Emotional tension:** Doing a lot of real work that stays invisible; wanting it to register without resorting to self-promotion.

## Competitive Landscape
**Direct:** Other personal dev blogs / build-in-public sites — go stale because they're manually maintained.
**Secondary:** Hashnode, dev.to, Medium, Substack — weaker on technical depth, customization, and ownership.
**Indirect:** LinkedIn / X / GitHub profile — weak on narrative and long-form depth; GitHub shows commits but not the *story*.
_Framing is light — this is a personal property, not a product competing for a market._

## Differentiation
**Key differentiators:**
- **Auto-generated shiplogs** from real git commits (ISO-week `YYYY-WNN`) — the cadence maintains itself
- AI-assisted review/authoring workflow with versioning and publish states
- Genuinely technical, cited long-form posts — no marketing fluff
- Owned, custom-built site (RR7 / Vercel / AWS), not a template
**How we do it differently:** A cron job pulls commits across whitelisted repos and drafts weekly summaries; Ben reviews/edits before publishing.
**Why that's better:** Stays current with near-zero ongoing effort, so the public record never goes stale.
**Why people follow:** Honest, specific, in-the-weeds posts from someone who ships every week — earned credibility, not claimed authority.

## Objections
_None currently captured._

**Anti-persona:** Non-technical readers looking for high-level thought leadership — the content is intentionally in-the-weeds.

## Switching Dynamics
_N/A — personal site, not a product someone switches to._

## Customer Language
**Words to use:** ship / shipping, shiplog, build in public, weekly cadence, projects
**Words to avoid:** authority-claiming or hype language — don't frame it as "I know" / "the definitive guide" / "expert" / "thought leader." Show the work; stay humble and let the reader judge.
**Glossary:**
| Term | Meaning |
|------|---------|
| Shiplog | A weekly development summary (ISO week `YYYY-WNN`) auto-generated from git commits and reviewed before publishing |
| Ship | A shipped piece of work / unit of progress |
| Project | A product or tool, made up of one or more whitelisted repos |
| People | Curated profiles featured on the site |

## Brand Voice
**Tone:** Personal, human, tight, technical, humble.
**Style:** Concise and specific; code-level; cites sources; no hype. Frame from a place of figuring-things-out, not authority — "here's what I hit and how I solved it," never "here's the right way." Skeptical and accurate over polished.
**Personality:** Builder, pragmatic, prolific, honest, humble.

## Proof Points
**Metrics:** Per-shiplog stats (`{ repos, commits }`); 30+ projects tracked; unbroken weekly publishing cadence since ~Dec 2025.
**Customers:** N/A. Featured work spans products like Silo CDP, Synapse, ADAPTS, CD2, GTM Proxy, plus personal projects (PostgreSDK, Hearth Press, Autoscroll Recorder, Inspiration Index, earlydays.dev).
**Testimonials:** None.
**Value themes:**
| Theme | Proof |
|-------|-------|
| Ships consistently | Unbroken weekly shiplogs (W22 2025 → present) |
| Technical depth | Cited long-form posts (GPU capture, Google Ads attribution) |
| Breadth of work | 30+ projects across web, infra, AI tooling, marketing |

## Goals
**Business goal:** Build a personal brand and become a trusted industry voice among developers.
**Conversion action:** Keep readers coming back — follow the shiplog cadence and read the posts. (Secondary: `/contact`.)
**Current metrics:** Tracked via Silo analytics (`@adpharm/silo-analytics`). No targets set.
