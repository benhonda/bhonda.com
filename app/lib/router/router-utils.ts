import type { ComponentProps, To } from "~/lib/router/generouted-components";
import { generatePath, type Params, type Path } from "~/lib/router/routes";
import { logDebug, logError } from "~/lib/logger";
import type { Location as ReactRouterLocation } from "react-router";

//
// this is useful when you want to pass a typed route to a component
//
export type LinkTo = ComponentProps<Path | To<Path>, Params>;
export type LinkToOrDirectPath = LinkTo | { rawAbsolutePath: string } | { externalUrl: string };

/**
 *
 *
 * Generate a path for a link
 *
 * @usage
 * const path = generatePathForLinkTo({
 *   to: {
 *     pathname:"/:lang",
 *     search: "?example=query",
 *     hash: "#example-hash",
 *   },
 *   params: {
 *     lang: "en",
 *   }
 * })
 */
export const generatePathForLinkTo = (
  { to, params }: ComponentProps<Path | To<Path>, Params>,
  options?: { includeSearchParams?: boolean; includeHash?: boolean }
) => {
  // if to is a string, then it's a path
  try {
    let path = generatePath(typeof to === "string" ? to : to.pathname, params || ({} as any));

    // NOTE: I have moved en/fr path adjustments into the generatePath function

    // re-attach any search params that were passed in
    if (
      options?.includeSearchParams &&
      typeof to !== "string" &&
      to.search &&
      to.search.length > 0 &&
      to.search !== "?"
    ) {
      path = `${path}${to.search.startsWith("?") ? "" : "?"}${to.search}`;
    }

    // re-attach any hash that was passed in
    if (options?.includeHash && typeof to !== "string" && to.hash && to.hash.length > 0 && to.hash !== "#") {
      path = `${path}${to.hash.startsWith("#") ? "" : "#"}${to.hash}`;
    }

    return path;
  } catch (error) {
    logError("Error generating path for link to", error);
    // log the to and params
    logDebug("to", to);
    logDebug("params", params);
    return "/";
  }
};

/**
 *
 *
 *
 * check if a string matches a linkTo path
 */
export const isSamePath = (pathOrUrl: string, linkTo: LinkTo) => {
  // if the pathOrUrl is a url, get the pathname
  let pathname = pathOrUrl.startsWith("http") ? new URL(pathOrUrl).pathname : pathOrUrl;

  if (pathname.startsWith("/en/")) {
    pathname = pathname.slice(3);
  }

  if (pathname === "/en") {
    pathname = "/";
  }

  const currentPathname = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;

  return generatePathForLinkTo(linkTo, { includeSearchParams: false, includeHash: false }) === currentPathname;
};

/**
 *
 *
 *
 * Get the current pathname, search, and hash as a single string
 */
export const getRedirectToLocation = (location: ReactRouterLocation | string): string => {
  if (typeof location === "string") {
    const url = new URL(location);
    return `${url.pathname}${url.search}${url.hash}`;
  }

  return `${location.pathname}${location.search}${location.hash}`;
};

/**
 *
 * Redirect type
 */

export type ServerRedirectArgs = {
  headers?: Record<string, string>;
  defaultRedirectTo?: LinkTo;
};
