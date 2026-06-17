# Silo analytics (Segment-compatible)

Client-side event tracking through Segment's browser SDK pointed at Adpharm's **Silo** CDP.

**Read when:** adding event tracking, identifying users, or page tracking.

## Contract
- Analytics is Segment's `AnalyticsBrowser`, loaded once, CDN pointed at **Silo**
  (`https://cdn.silo.adpharm.digital`), write key from env. Gives `track`/`identify`/`page`.
- A typed helper wraps `track` so event names + properties are checked, not stringly-typed.

## Non-negotiables
| key | rule | why |
| --- | --- | --- |
| point-at-silo | `cdnURL` = Silo, write key from validated env, cookie/localStorage user keys suffixed by app env | hits Silo not Segment; prod/preview don't collide |
| singleton-load | one `AnalyticsBrowser.load(...)` for the app | never per-component |
| typed-track | track via a typed helper with "Sentence Case" event names (`"Video Content Started"`) | constraining + self-teaching surface, not free strings |
| identify-on-learn | call `identify` only when you learn who the user is (login/register/OAuth/profile) | attaches user id to later events; anonymous id is auto-managed |
| no-recapture | don't re-add auto-captured context (UTMs, page url/path/referrer, device) to props | it's already captured; extra is noise |
| signal-not-noise | track meaningful actions/outcomes — not every click, keystroke, or validation error | keep the data clean |
| module-pattern | for a rich surface, organize tracking as a stateful unit (init / state-change / fixed-% milestones, each fired once — the YouTube tracker is the example) | a pattern for complex surfaces, not required for one event |

## Workflow for "add tracking"
Understand the app/outcomes → propose a tracking plan (outcomes → funnels → events/props)
and get approval → implement **surgically** (tracking calls only, no unrelated refactors).

## Engine
None — this is Shape.

## Shape — write fresh (illustration, not gospel)
```ts
export const analyticsBrowser = AnalyticsBrowser.load(
  { writeKey: env.PUBLIC_SILO_WRITE_KEY, cdnURL: "https://cdn.silo.adpharm.digital" },
  { user: { cookie: { key: `ajs_user_id_${env.PUBLIC_APP_ENV}` },
            localStorage: { key: `ajs_user_traits_${env.PUBLIC_APP_ENV}` } } },
);
export function browserTrackEvent<E extends keyof TrackEvents>(name: E, props: TrackEvents[E]) {
  analyticsBrowser.track(name, props ?? {});
}
// login/oauth: analyticsBrowser.identify(userId, { email });   navigation: analyticsBrowser.page();
```

## Verify at latest
- **`@segment/analytics-next`** — current `AnalyticsBrowser.load` signature + config keys.
- Any third-party data source a tracker needs (e.g. YouTube Data API) — current version.
