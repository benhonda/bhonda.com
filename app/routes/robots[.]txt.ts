import type { LoaderFunctionArgs } from "react-router";
import { serverEnv } from "~/lib/env/env.defaults.server";

export async function loader(_: LoaderFunctionArgs) {
  const baseUrl = `https://${serverEnv.APP_FQDN}`;

  // Block all bots in staging/preview/development
  if (serverEnv.PUBLIC_APP_ENV !== "production") {
    return new Response(`User-agent: *\nDisallow: /`, {
      status: 200,
      headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
    });
  }
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store",
    },
  });
}
