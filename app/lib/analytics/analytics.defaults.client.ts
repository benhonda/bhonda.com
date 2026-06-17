import { AnalyticsBrowser } from "@adpharm/silo-analytics";
import { getAnalyticsCategories, registerConsentChanged } from "./consent.client";

// Single-object v2 load(). `env` namespaces storage keys per env
// (ajs_user_id_bhondacom_<env> + ajs_user_traits_bhondacom_<env>) — required
// since envs share the apex domain. cdnURL defaults to the Silo CDN, so omit it.
export const analyticsBrowser = AnalyticsBrowser.load({
  writeKey: "bhondacom",
  env: window.env.PUBLIC_APP_ENV,
  consent: {
    // Property is opt-out (collects by default); the footer dialog lets a
    // visitor deny, flipping `analytics` to false so silo stops sending. GPC
    // still denies unconditionally. opt-out is the built-in fallback, so no
    // offlineFallbackMode needed.
    getCategories: getAnalyticsCategories,
    // Re-resolve the gate live when the visitor changes their choice — no reload.
    onConsentChanged: (notify) => registerConsentChanged(notify),
  },
});
