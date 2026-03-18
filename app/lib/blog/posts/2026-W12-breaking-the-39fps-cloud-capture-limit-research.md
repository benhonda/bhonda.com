# GPU Capture Pipeline — Research & Options

**Last updated:** 2026-03-17
**Hardware:** AWS g4dn.xlarge — NVIDIA Tesla T4 (Turing, datacenter)
**OS:** Amazon Linux 2023 (AL2023) ECS GPU AMI — kernel 6.1.163, NVIDIA driver **580.126.16**

---

## Current State

### Deployed pipeline (this branch)

```
Chrome (Vulkan/ANGLE, VK_KHR_xlib_surface) → headless Xorg (:99, NVIDIA DDX, container-internal) → x11grab → NVENC → H.264
```

**Status: Working. Recordings look excellent.**

The key quality improvement over the previous host-Xorg path: removing `--disable-vulkan-surface` allows Chrome to use `VK_KHR_xlib_surface` (Vulkan WSI) — frames flow from Chrome's Vulkan compositor directly into the NVIDIA driver's X11 surface handler with no application-level GPU→CPU readback on Chrome's side. x11grab's `XShmGetImage` still involves a CPU copy, but Chrome's compositing is now fully GPU-resident.

### Previous pipeline (pre-migration, host Xorg)

```
Chrome (GLX/ANGLE) → host Xorg (:0, NVIDIA-backed, shared from ECS host) → x11grab → NVENC → H.264
```

---

## Known Issues

### ~~Problem 1 — HiDPI failure (EINVAL on startup)~~ — RESOLVED

- `captureScale = max(renderScale across outputs)` caused x11grab to request `viewport × captureScale` pixels.
- T4 VGX hard cap: 2560×1600 maximum screen size. `viewport × 2` exceeds this for any viewport taller than 800px.
- **Fix (deployed):** `captureScale` in GPU mode is now capped to `floor(min(2560/viewportW, 1600/viewportH))`. For mbp-14in (1512×982) this gives `captureScale=1`. Outputs at `renderScale>captureScale` are upscaled by FFmpeg `scale_cuda` — no crash, minor quality trade-off vs native 2× capture.
- **Root cause of cap:** T4 VGX virtual display subsystem enforces 4,096,000px (2560×1600) as a hard driver limit regardless of xorg.conf `Virtual`, `MetaModes`, or EDID.[^4][^5][^10] Confirmed via `xrandr`: `Screen 0: maximum 2560 x 1600`.

### Problem 2 — x11grab throughput ceiling (~39fps)

- x11grab's `XShmGetImage` pulls frames from the X server's shared memory buffer — one CPU readback per frame.
- Measured ceiling: ~39fps under real workload. NVENC sits at 18–19% GPU utilisation — it is *starved*, not the bottleneck.
- **Not fixable by tuning FFmpeg.** The constraint is frame delivery rate into x11grab's poll.
- **Acceptable for now** — recordings look great at typical workload fps. Addressable via NvFBC (see Proposed Next Step below).

---

## Confirmed Facts

### ECS AMI / Driver Versions

- **AL2 ECS GPU AMI** (`amzn2-ami-ecs-gpu-hvm-*-x86_64-ebs`): ships NVIDIA driver **550.163.01**. This is the ceiling for AL2 — it will not receive newer drivers.
- **AL2023 ECS GPU AMI** (`al2023-ami-ecs-gpu-hvm-*-kernel-6.1-x86_64-ebs`): ships NVIDIA driver **580.126.16** (AMI release `20260307`, published 2026-03-10).[^1]
- **AL2 ECS GPU AMI EOL: June 30, 2026.**[^2]
- NvFBC SDK 9.0.0 requires driver ≥ 570.86.16. AL2023 at 580.126.16 **meets this requirement**.[^3]

### ECS Container Runtime on AL2023 — `NVIDIA_VISIBLE_DEVICES=void`

- On AL2023 ECS, the ECS agent sets `NVIDIA_VISIBLE_DEVICES=void` (CDI-style direct device passthrough).
- With `NVIDIA_VISIBLE_DEVICES=void`, the NVIDIA Container Toolkit **disables all capability injection** — `NVIDIA_DRIVER_CAPABILITIES` env var is completely ignored regardless of its value.
- GPU compute devices (`/dev/nvidia0`, `/dev/nvidiactl`) **ARE** mounted directly by ECS even with `void` — `nvidia-smi` and NVENC both work.
- `/dev/nvidia-modeset` is **NOT** automatically mounted. Must be explicitly added via ECS task definition `linuxParameters.devices`. **Done** — deployed in `feature-gpu-compute.tf`.
- `/dev/dri/renderD128` availability under CDI mode: unverified. Not required for current pipeline or NvFBC.

### Headless Xorg with NVIDIA DDX inside Container (Ubuntu 22.04 base image)

- **Ubuntu's `xserver-xorg-video-nvidia-580-server` package ships `nvidia_drv.so` version 580.126.09.** The AL2023 ECS GPU AMI host kernel module is **580.126.16**. The NVIDIA DDX performs a strict kernel module version check on load — any minor version mismatch causes `(EE) NVIDIA: Failed to initialize the NVIDIA kernel module` → `no screens found`. Do not use the Ubuntu package.
- **Correct approach:** extract `nvidia_drv.so` directly from NVIDIA's official Tesla runfile at the exact matching version (`NVIDIA-Linux-x86_64-580.126.16.run`), using `--extract-only`. Only `nvidia_drv.so` is needed — all other driver components are injected by the host runtime. **Done** — deployed in `docker/gpu/Dockerfile`.
- `nvidia_drv.so` must be placed at `/usr/lib/x86_64-linux-gnu/nvidia/xorg/`. This path is not in Xorg's default module search path — must be declared via `ModulePath` in xorg.conf `Files` section.
- `nvidia-xconfig` is **NOT** available in the container. BusID detection uses `nvidia-smi --query-gpu=pci.bus_id` at runtime. DBDF format `DDDDDDDD:BB:DD.F` → Xorg `PCI:bus:device:function` (decimal). Confirmed BusID on g4dn: `PCI:0:30:0` (0x1e = 30).
- When Xorg is started with `-config /path/to/xorg.conf`, xorg.conf.d snippet directories **are still read**. The `-config` flag only overrides the primary config file, not the snippets.
- Xorg creates the Unix domain socket (`/tmp/.X11-unix/X99`) **before** completing screen initialization. Socket presence is **not** a reliable ready signal — Xorg can exit with `no screens found` after the socket is created. Liveness is confirmed via PID check after a 3s settle period.
- **T4 VGX display cap: 2560×1600 hard limit.** `Virtual`, `MetaModes`, and EDID overrides do not affect it — the cap is enforced by the VGX virtual display driver before any of those layers.[^4][^5][^10] Confirmed via `xrandr`: `Screen 0: minimum 8 x 8, current 2560 x 1600, maximum 2560 x 1600`. `DVI-D-0 connected primary 2560x1600+0+0` — the NVIDIA DDX creates one virtual connected output even with `UseDisplayDevice None`.
- **xorg.conf is generated at runtime** (BusID varies per EC2 instance). `MetaModes` and `Virtual` set to `2560x1600` to match the hard cap.

### NvFBC — Implementation Requirements (Researched, Not Yet Implemented)

- **`libnvidia-fbc.so.1`** is part of the NVIDIA driver, not CUDA toolkit. With `NVIDIA_VISIBLE_DEVICES=void`, it is NOT injected. Must be extracted from the Tesla runfile during Docker build — same approach as `nvidia_drv.so`. File: `libnvidia-fbc.so.580.126.16` inside the extracted runfile tree.
- **`NvFBC.h`** is the only compile-time header needed. MIT-licensed, vendored by Sunshine at `third-party/nvfbc/NvFBC.h`.[^3][^14]
- **`libnvidia-fbc.so.1` is dlopen()'d at runtime** — not a link-time dependency. `NvFBCCreateInstance` is the sole exported symbol; it populates all function pointers via `NVFBC_API_FUNCTION_LIST`.[^8]
- **T4 does not require the consumer GPU whitelist patch** (keylase). `bIsCapturePossible` returns true natively on Tesla/Quadro/GRID hardware. The patch is GeForce-only.[^7]
- **NvFBC does NOT bypass the T4 VGX 2560×1600 cap.** NvFBC is bound to a display head — capture resolution equals the X screen resolution, which the VGX driver caps before Xorg or NvFBC ever sees it.[^8][^9] HiDPI is not improved by switching to NvFBC.
- **Zero-copy CUDA encode path:** `nvFBCToCudaGrabFrame` → `CUdeviceptr` → `NvEncRegisterResource(NV_ENC_INPUT_RESOURCE_TYPE_CUDADEVICEPTR)` → `NvEncEncodePicture`. Frame never touches CPU. Use `NVFBC_BUFFER_FORMAT_NV12` to skip color conversion before NVENC.[^8]
- **Device nodes required:** `/dev/nvidia0`, `/dev/nvidiactl`, `/dev/nvidia-modeset` only. `/dev/dri/card0` and `/dev/dri/renderD128` are NOT needed. All three are already present in the container.
- **`bInModeset` flag** in `NVFBC_GET_STATUS_PARAMS` detects cold-boot race — poll with 1s retry up to ~30s before attempting `nvFBCCreateCaptureSession`. Modeset recovery during capture: check for `NVFBC_ERR_MUST_RECREATE` on every grab; destroy and recreate session without destroying handle.[^8]

### gpu-screen-recorder — Integration Requirements (Researched, Not Yet Implemented)

- **Repo:** `https://git.dec05eba.com/gpu-screen-recorder`, v5.12.5. GPL-3.0.[^14]
- **Auto-selects NvFBC** on NVIDIA + X11 — no explicit flag needed.
- **XRandR gate:** calls `XRRGetScreenResources()` before NvFBC init; exits code 51 if zero outputs. **Confirmed not a problem** — `DVI-D-0 connected` is present with `UseDisplayDevice None`. Capture target: `-w DVI-D-0`.
- **Pipe mode:** `-o /dev/stdout -c mkv` — FFmpeg reads the MKV stream and muxes/remuxes as needed. Do not use `-c mp4` for piped output (requires seekable file for moov atom).
- **Codec:** `-k h264` or `-k hevc`. **Do not use `-k av1`** — T4 (Turing) has no AV1 NVENC hardware.
- **Quality:** `-bm qp -q very_high` (QP=25, closest to CRF). No explicit preset flag; use `-tune quality`.
- **No window manager or compositor required.** Creates a 16×16 hidden X11 window for GL context only.
- **Build from source required** on Ubuntu 22.04 — no apt package in official repos. Meson build. Many deps (`libavcodec-dev`, `libx11-dev`, `libxrandr-dev`, `libglvnd-dev`, `libpipewire-0.3-dev`, etc.).
- **`libnvidia-fbc.so.1` and `libnvidia-encode.so.1`** must be present in the container at runtime — loaded via dlopen, not linked. Must be baked into the image from the Tesla runfile (same as `nvidia_drv.so`).

---

## Proposed Next Step (Optional)

### Option E — NvFBC via gpu-screen-recorder

**Status:** Researched, ready to implement. Not yet done — recordings are working well with current x11grab pipeline.
**Solves:** x11grab throughput ceiling (~39fps → 60fps+)
**Does NOT solve:** HiDPI — VGX cap (2560×1600) applies equally to NvFBC
**When to pursue:** if 60fps becomes a hard requirement or throughput ceiling manifests as a quality issue

**Proposed pipeline:**
```
Chrome (Vulkan/ANGLE, VK_KHR_xlib_surface)
  → headless Xorg (:99, NVIDIA DDX)
  → gpu-screen-recorder (NvFBC capture + NVENC encode, piped)
  → FFmpeg (mux only, -c copy)
  → output MP4
```

**Command sketch:**
```bash
gpu-screen-recorder -w DVI-D-0 -f 60 -k h264 -bm qp -q very_high -c mkv -o /dev/stdout \
  | ffmpeg -i pipe:0 -c copy output.mp4
```

**Implementation work required:**
1. `docker/gpu/Dockerfile` — build gpu-screen-recorder from source; extract `libnvidia-fbc.so.1` and `libnvidia-encode.so.1` from Tesla runfile alongside `nvidia_drv.so`
2. `docker/ffmpeg-nvenc/Dockerfile` — may need FFmpeg rebuild with `libavcodec` for MKV demux if not already present
3. `src/WebRecorder.ts` — spawn gpu-screen-recorder child process instead of x11grab in FFmpeg command; pipe stdout into FFmpeg mux process
4. Validate cold-boot modeset timing — `bInModeset` window in containerised Xorg may delay first frame; gpu-screen-recorder handles this internally via retry but timing needs observation

---

## Other Options Evaluated

### Option A — captureScale cap (minimal fix) — **IMPLEMENTED**

Capture at `captureScale=floor(min(2560/W, 1600/H))` for GPU mode. For mbp-14in (1512×982): captureScale=1. FFmpeg `scale_cuda` upscales to requested renderScale dimensions. No crash; minor quality trade-off vs native HiDPI capture. Deployed in `WebRecorder.ts`.

---

### Option B — EGL + Xvfb (designed, not implemented)

Chrome renders via EGL (`/dev/dri/renderD128`), Xvfb at 3840×2160. Fixes HiDPI (no VGX display cap on Xvfb). Worsens throughput ceiling — EGL→Xvfb blit is a CPU copy. Not pursued.

---

### Option C — FFmpeg `-f nvfbc` — Dead end

Does not exist. No `nvfbc.c` in `libavdevice/`. Confirmed against FFmpeg source tree.

---

### Option D — kmsgrab (`-f kmsgrab`) — Dead end

Three independent blockers: `nvidia-drm.modeset=1` almost certainly `N` on AWS ECS GPU AMIs; NVIDIA proprietary DRM PRIME export broken (`EGL_BAD_ATTRIBUTE 0x3004`).[^6] `CAP_SYS_ADMIN` required. Do not pursue.

---

## Summary

| | Option A | Option B | Option C | Option D | Option E |
|---|---|---|---|---|---|
| **Description** | captureScale cap | EGL + Xvfb | FFmpeg `-f nvfbc` | kmsgrab | gpu-screen-recorder (NvFBC) |
| **Fixes HiDPI** | ✅ (upscaled) | ✅ (native) | — | — | ❌ (VGX cap) |
| **Fixes 39fps ceiling** | ❌ | ❌ (worse) | — | ❌ broken | ✅ |
| **Stays in FFmpeg** | ✅ | ✅ | — | ✅ | ❌ (mux only) |
| **Status** | ✅ Implemented | Designed | Dead end | Dead end | Ready to implement |

---

## Open Questions

1. ~~**Driver version on ECS AMI**~~ — **RESOLVED.** AL2023 ships 580.126.16. Meets NvFBC ≥ 570.86.16.
2. ~~**gpu-screen-recorder vs custom Capture SDK app**~~ — **RESOLVED: gpu-screen-recorder.** `DVI-D-0 connected` confirmed via xrandr; XRandR gate is not a problem. No custom C needed.
3. **Cold-boot / container-start NvFBC modeset timing** — `bInModeset` window in containerised Xorg startup not yet measured. gpu-screen-recorder retries internally but cold-start latency should be observed.
4. ~~**T4 VGX cap with headless Xorg**~~ — **RESOLVED (hard limit).** 2560×1600 enforced by VGX driver. Confirmed via `xrandr maximum 2560 x 1600`. No override possible via xorg.conf. NvFBC is equally bound.
5. ~~**60fps requirement**~~ — **DEFERRED.** Recordings look excellent at current fps. Option E available when/if 60fps becomes a priority.
6. ~~**`no screens found` root cause**~~ — **RESOLVED.** (a) `nvidia_drv.so` at exact version 580.126.16 from Tesla runfile. (b) `/dev/nvidia-modeset` mounted via `linuxParameters.devices`. Both deployed.
7. **`/dev/dri/renderD128` under AL2023 CDI mode** — not required for current pipeline or NvFBC. Relevant only if Option B (EGL) is pursued.
8. ~~**XRandR outputs with `UseDisplayDevice None`**~~ — **RESOLVED.** `DVI-D-0 connected primary 2560x1600+0+0`. NVIDIA DDX creates a virtual connected output regardless.

---

## References

[^1]: aws/amazon-ecs-ami — release `20260307` changelog: "Update nvidia driver version al2023 to 580.126.16" — https://github.com/aws/amazon-ecs-ami/releases/tag/20260307

[^2]: AWS ECS — AL2 to AL2023 ECS AMI transition guide — https://docs.aws.amazon.com/AmazonECS/latest/developerguide/al2-to-al2023-ami-transition.html

[^3]: NVIDIA Capture SDK (v9.0.0) — developer download page and license — https://developer.nvidia.com/capture-sdk

[^4]: NVIDIA Developer Forums — "Display resolution limited to 2560x1600" (moderator generix confirms Tesla VGX virtual head limit is driver-enforced, not EDID) — https://forums.developer.nvidia.com/t/display-resolution-limited-to-2560x1600/256723

[^5]: NVIDIA Developer Forums — "Large headless Xorg configuration" (M60 headless Tesla requires GRID/Quadro-VDws license to exceed 2560×1600; `--virtual` does not override) — https://forums.developer.nvidia.com/t/large-headless-xorg-configuration/55002

[^6]: LizardByte/Sunshine GitHub issues — DRM PRIME export broken with NVIDIA proprietary driver: `EGL_BAD_ATTRIBUTE (0x3004)`, GBM incompatibility confirmed across issues #188, #2250, #4106 — https://github.com/LizardByte/Sunshine/issues/188

[^7]: NVIDIA Developer Forums — "Does NvFBC support T4 GPUs" (NVIDIA staff confirmation; Tesla/Quadro/GRID do not require consumer GPU whitelist patch) — https://forums.developer.nvidia.com/t/does-nvfbc-support-t4-gpus/79599

[^8]: NVIDIA Capture SDK Programming Guide v7.1 — API architecture, `NVFBC_CREATE_PARAMS` output fields, `NvFBCCreateInstance` dlopen pattern, CUDA zero-copy path, `bInModeset` modeset recovery — https://developer.download.nvidia.com/designworks/capture-sdk/docs/7.1/NVIDIA_Capture_SDK_Programming_Guide.pdf

[^9]: gpu-screen-recorder source — `src/capture/nvfbc.c`: capture dimensions derived from `XWidthOfScreen(DefaultScreenOfDisplay(...))` / `XHeightOfScreen(...)` — https://git.dec05eba.com/gpu-screen-recorder/tree/src/capture/nvfbc.c

[^10]: NVIDIA Developer Forums — "Newer drivers limit resolution to 2560x1600" (post-435.21 drivers enforce hard pixel cap of 4,096,000px = 2560×1600 exactly) — https://forums.developer.nvidia.com/t/newer-drivers-limit-resolution-to-2560x1600/157657

[^11]: NVIDIA Developer Forums — "A10 baremetal 4K resolution" (bare-metal A10 shows identical `Mode (3840x2160) larger than per-head max resolution supported (2560x1600)` — confirms cap on modern datacenter GPUs bare-metal, not just vGPU VMs) — https://forums.developer.nvidia.com/t/a10-baremetal-4k-resolution/186399

[^12]: Mark Hamilton — "Headless NVIDIA 4K@120Hz Streaming on Ubuntu 24.04" (RTX 4060 Ti + custom EDID — works because no VGX cap on consumer GPUs; not applicable to T4) — https://markhamilton.info/headless-nvidia-4k120hz-streaming-on-ubuntu-24-04/

[^13]: AWS EC2 Documentation — Install NVIDIA GRID drivers on Linux instances (GRID driver enables Quadro Virtual Workstation mode; whether this unlocks VGX per-head cap on g4dn T4 is undocumented) — https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/install-nvidia-driver.html

[^14]: LizardByte/Sunshine — vendored `NvFBC.h` (MIT license, API version 1.7) — https://github.com/LizardByte/Sunshine/blob/master/third-party/nvfbc/NvFBC.h

[^15]: gpu-screen-recorder — project homepage, v5.12.5, GPL-3.0 — https://git.dec05eba.com/gpu-screen-recorder
