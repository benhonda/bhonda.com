# Chrome for Testing (CfT) — Research & Implementation Notes

**Last updated:** 2026-03-18
**Status: IMPLEMENTED** — migration from `google-chrome-stable` to Chrome for Testing is complete.

---

## Problem Statement

The GPU recording path requires two capabilities from the browser binary:

1. **Proprietary codec support** (H.264, AAC, HEVC) — for sites with embedded video
2. **`--load-extension` support** — for the MV3 zoom extension (`zoomLevel ≠ 1.0`)

No single previously-used binary satisfied both:

| Binary | Proprietary codecs | `--load-extension` | Notes |
|---|---|---|---|
| `google-chrome-stable` | ✅ | ❌ | Chrome 137+ removed `--load-extension` for branded builds |
| Playwright bundled Chromium | ❌ | ✅ | FFmpeg statically compiled without proprietary codecs; `libffmpeg.so` swap not viable |
| **Chrome for Testing (CfT)** | ✅ | ✅ | See below |

---

## Why Chrome for Testing Satisfies Both Requirements

### Proprietary codecs

CfT is built with `proprietary_codecs=true`. Confirmed via binary strings inspection — H.264, AAC, HEVC decoder symbols present in the binary.

**Runtime codec detection:** There is no programmatic runtime check for browser codec support. We rely on CfT's build flags. The FFmpeg output encoder (`hevc_nvenc` on GPU, `libx264` on CPU) is independent — that is for the *recording* container output, not browser playback codecs. **H.264 and AAC playback confirmed working** via recording a page with embedded video (no blank/broken frames).

### `--load-extension` not blocked

The `--load-extension` guard in Chromium source is:

```cpp
#if BUILDFLAG(GOOGLE_CHROME_BRANDING)
  // block --load-extension
#endif
```

CfT sets `is_chrome_for_testing=true`, which is **mutually exclusive** with `is_chrome_branded=true`. The branding guard does not fire. `--load-extension` works.

### CDP compatibility with Playwright 1.54.0

- CfT version `139.0.7258.154` — `major.minor.build = 139.0.7258`
- Playwright 1.54.0 bundled Chromium — `139.0.7258.5` — same `major.minor.build`
- CDP protocol is versioned at the `major.minor.build` level; patch divergence is safe

---

## Implemented Changes

### `docker/gpu/Dockerfile`

Replaced `google-chrome-stable` apt install with CfT zip download:

```dockerfile
# Chrome for Testing — proprietary codecs (H.264/AAC/HEVC) + --load-extension support
# Version matches Playwright 1.54.0 Chromium (139.0.7258.x) for CDP compatibility
ARG CfT_VERSION=139.0.7258.154
RUN wget -q "https://storage.googleapis.com/chrome-for-testing-public/${CfT_VERSION}/linux64/chrome-linux64.zip" \
      -O /tmp/cft.zip \
    && unzip -q /tmp/cft.zip -d /opt \
    && mv /opt/chrome-linux64 /opt/chrome-for-testing \
    && rm /tmp/cft.zip \
    && chmod +x /opt/chrome-for-testing/chrome
```

Existing Chrome shared-library `apt` deps stay — CfT needs them too. CfT ships its own `libffmpeg.so` inside the zip; no `LD_LIBRARY_PATH` override required.

### `src/WebRecorder.ts`

**`possibleChromePaths`** — CfT first, existing entries as fallback:

```ts
const possibleChromePaths = [
  "/opt/chrome-for-testing/chrome",  // Chrome for Testing: codecs + --load-extension
  "/usr/bin/google-chrome-stable",   // Debian/Ubuntu package (fallback)
  "/usr/bin/google-chrome",          // Alternative location (fallback)
  "/usr/bin/chromium-browser",       // Chromium alternative (fallback)
  "/usr/bin/chromium",               // Another Chromium location (fallback)
];
```

**`executablePath`** — unconditional (no longer zoom-conditional):

```ts
// Chrome for Testing: proprietary codecs (H.264/AAC/HEVC) + --load-extension support
executablePath: chromePath,
```

Previously `hasZoom ? undefined : chromePath` — `undefined` fell back to Playwright's bundled Chromium for zoom recordings. CfT supports both paths, so the conditional was removed.

**`ignoreDefaultArgs`** — remains zoom-conditional (runtime flag conflict, not a browser-capability issue):

```ts
ignoreDefaultArgs: hasZoom
  ? ["--enable-automation", "--disable-extensions"]
  : ["--enable-automation"],
```

Playwright injects `--disable-extensions` by default; when `--load-extension` is active, that must be suppressed.

---

## UI Height Constants

These values are in `src/config/types.ts` as `DEFAULT_RECORDING_PARAMS` and used in `src/WebRecorder.ts:188-190`.

| Constant | Default | Description |
|---|---|---|
| `chromeUiOffset` | **87px** | Chrome window chrome (address bar + tabs). 87 not 85 — extra 2px absorbs sub-pixel rounding at 2x device scale factor, which caused a 1-2px white line on 800px-height viewports. |
| `chromeForTestingBanner` | **53px** | The "Chrome is being controlled by automated software" / CfT info banner shown below the address bar. Added on top of `chromeUiOffset`. Set to 0 if using a standard Chrome build without the banner. |
| **Total offset** | **140px** | `chromeUiOffset + chromeForTestingBanner` — full vertical space consumed by browser UI before the page content begins. |

Both are per-request overridable via recording params.

---

## Resolved Questions

1. **`--no-sandbox`** — already present in `src/utils/chrome-flags.ts:4` (`"--no-sandbox" // Required in containers`). No new flags needed for CfT vs Chrome stable.
2. **CfT auto-update** — CfT has no auto-update mechanism. Version is pinned via `ARG CfT_VERSION` in the Dockerfile. When Playwright is upgraded, `CfT_VERSION` must be manually bumped to match the new `major.minor.build`.
3. **`libffmpeg.so`** — CfT ships its own alongside the binary in the zip. Container is functioning correctly; no `LD_LIBRARY_PATH` override needed.

---

## Verification Steps

1. Build GPU Docker image: `task build-docker` → select GPU
2. Shell into container: `/opt/chrome-for-testing/chrome --version` — confirm `139.0.7258.154`
3. Test recording with `zoomLevel: 1.5` on a page with H.264 video:
   - Zoom extension loads (CDP target inspection log shows `service_worker` with `chrome-extension://` URL)
   - Video plays (no blank/broken frames in output)
4. Test recording with `zoomLevel: 1.0` on a page with H.264 video — confirm video plays

**Steps 3 & 4 verified** — H.264 and AAC playback confirmed working.
