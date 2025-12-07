import { Analytics } from "@segment/analytics-node";

export const analyticsServer = new Analytics({
  writeKey: "YOUR_SILO_WRITE_KEY",
  host: "https://cdn.silo.adpharm.digital",
});
