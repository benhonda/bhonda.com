import { vercelPreset } from "@vercel/react-router/vite";
import type { Config } from "@react-router/dev/config";

export default {
  // SSR by default; set false for SPA mode.
  ssr: true,
  // Drop this preset if you're not deploying to Vercel.
  presets: [vercelPreset()],
} satisfies Config;
