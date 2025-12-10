import { AnalyticsBrowser } from "@segment/analytics-next";

export const analyticsBrowser = AnalyticsBrowser.load(
  {
    writeKey: "bhondacom",
    cdnURL: "https://cdn.silo.adpharm.digital",
  },
  {
    user: {
      cookie: {
        // ajs_user_id
        key: `ajs_user_id_bhondacom_${window.env.PUBLIC_APP_ENV}`,
        // oldKey: "ajs_user_id",
      },
      localStorage: {
        // ajs_user_traits
        key: `ajs_user_traits_bhondacom_${window.env.PUBLIC_APP_ENV}`,
      },
    },
  }
);
