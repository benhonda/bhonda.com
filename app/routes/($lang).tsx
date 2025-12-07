import { type LoaderFunctionArgs } from "react-router";
import { langUtils } from "~/lib/i18n/i18n-utils.server";
import { serverRedirect } from "~/lib/router/server-responses.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { l, lang } = langUtils(params);

  const pathname = new URL(request.url).pathname;
  const pathnameLower = pathname.toLowerCase();

  //
  // if lang is en and the path is equal to /en or starts with /en/, strip the lang
  //
  if (lang === "en" && (pathnameLower === "/en" || pathnameLower.startsWith("/en/"))) {
    throw serverRedirect({
      rawAbsolutePath: pathnameLower.slice(3),
    });
  }

  return null;
}
