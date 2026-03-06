import type { LoaderFunctionArgs } from "react-router";
import { serverEnv } from "~/lib/env/env.defaults.server";

const BLOCK_ALL = `User-agent: *\nDisallow: /`;

export async function loader({ request }: LoaderFunctionArgs) {
  const requestHost = request.headers.get("host") ?? "";
  const canonicalHost = `www.${serverEnv.APP_FQDN}`;

  // Block all bots in staging/preview/development or on non-canonical hosts (e.g. vercel.app)
  if (serverEnv.PUBLIC_APP_ENV !== "production" || requestHost !== canonicalHost) {
    return new Response(BLOCK_ALL, {
      status: 200,
      headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=3600" },
    });
  }

  const baseUrl = `https://${canonicalHost}`;
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
