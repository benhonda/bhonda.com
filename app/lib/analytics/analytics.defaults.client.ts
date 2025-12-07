import { AnalyticsBrowser } from "@segment/analytics-next";

export const analyticsBrowser = AnalyticsBrowser.load(
  {
    writeKey: "YOUR_SILO_WRITE_KEY",
    cdnURL: "https://cdn.silo.adpharm.digital",
  },
  {
    user: {
      cookie: {
        // ajs_user_id
        key: `ajs_user_id_YOUR_SILO_WRITE_KEY_${window.env.PUBLIC_APP_ENV}`,
        // oldKey: "ajs_user_id",
      },
      localStorage: {
        // ajs_user_traits
        key: `ajs_user_traits_YOUR_SILO_WRITE_KEY_${window.env.PUBLIC_APP_ENV}`,
      },
    },
  }
);
