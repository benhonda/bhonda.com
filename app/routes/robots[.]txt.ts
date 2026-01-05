import type { LoaderFunctionArgs } from "react-router";
import { serverEnv } from "~/lib/env/env.defaults.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const appEnv = serverEnv.PUBLIC_APP_ENV;
  const baseUrl = `https://www.${serverEnv.APP_FQDN}`;

  // Block all bots in staging/preview/development
  if (appEnv !== "production") {
    return new Response(
      `User-agent: *
Disallow: /`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  }

  // Production: Allow all bots
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
