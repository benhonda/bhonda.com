import type { Route } from "./+types/$";
import { isRetiredPath } from "~/lib/router/retired-paths";
import { serverError } from "~/lib/router/server-responses.server";

/** Every unmatched URL: 410 Gone for the old site's retired sections, 404 for anything else. */
export function loader({ url }: Route.LoaderArgs) {
  if (isRetiredPath(url.pathname)) {
    throw serverError(410, "This was part of the old version of the site, which I've taken down while I build a new one.");
  }
  throw serverError(404);
}

/** Load-bearing: without a component this is a resource route, and the error goes out as bare JSON instead of the error screen. */
export default function CatchAll() {
  return null;
}
