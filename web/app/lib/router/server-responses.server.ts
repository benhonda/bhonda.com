import { data } from "react-router";
import { type ServerErrorStatus } from "~/lib/router/http-status";
import {
  generatePathForLinkTo,
  type LinkTo,
  type LinkToOrDirectPath,
  type ServerRedirectArgs,
} from "~/lib/router/router-utils";

/**
 * 302 redirect
 * Code based off of https://remix.run/docs/en/main/utils/redirect
 */
export function serverRedirect(linkToOrDirectPath: LinkToOrDirectPath, serverRedirectArgs?: ServerRedirectArgs) {
  let Location = "";

  //
  // for "linkTo" links
  //
  if ("to" in linkToOrDirectPath) {
    const linkTo = linkToOrDirectPath as LinkTo;
    const parsedPath = generatePathForLinkTo(linkTo);

    // set the location to the parsed path
    Location = parsedPath;
  } else if ("rawAbsolutePath" in linkToOrDirectPath) {
    //
    // for "rawAbsolutePath" links
    //
    const { rawAbsolutePath } = linkToOrDirectPath as { rawAbsolutePath: string };
    // decode ONLY to validate (catches encoded tricks like %2F%2Fevil.com) — the redirect
    // itself uses the raw value so encoded query params survive intact
    const decoded = decodeURIComponent(rawAbsolutePath);

    // open-redirect guard: must be a same-origin relative path — "//" and "/\" are
    // treated as protocol-relative by browsers, so they fall back to the default path
    if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.startsWith("/\\")) {
      Location = generatePathForLinkTo(serverRedirectArgs?.defaultRedirectTo || { to: "/" });
    } else {
      Location = rawAbsolutePath;
    }
  } else if ("externalUrl" in linkToOrDirectPath) {
    //
    // for "externalUrl" links
    //
    // if external url is provided, redirect to the external url
    const { externalUrl } = linkToOrDirectPath as { externalUrl: string };

    Location = externalUrl;
  } else {
    throw new Error("Invalid redirect - no path or url provided");
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location,
      ...(serverRedirectArgs?.headers || {}),
    },
  });
}

/**
 * successful response
 */
export function serverResponse(
  body: string | object | ArrayBuffer | ArrayBufferView | ReadableStream<Uint8Array> | null,
  options?: {
    headers: Record<string, string>;
  }
) {
  const headers = options?.headers || {};

  // set the default content type
  let defaultContentType = "text/plain";
  if (typeof body === "string" && body.startsWith("{")) {
    // if the body is json, set the application type to json
    defaultContentType = "application/json";
  } else if (typeof body === "string" && body.startsWith("<")) {
    // if the body is html, set the application type to html
    defaultContentType = "text/html";
  } else if (typeof body === "object") {
    // if the body is an object, set the application type to json
    defaultContentType = "application/json";
    // stringify the object
    body = JSON.stringify(body);
  }

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": defaultContentType,
      ...headers,
    },
  });
}

/**
 * Throw this! It reaches the nearest ErrorBoundary as a route error response.
 *
 * `customMsg` is not a log line — it is USER-FACING copy. The app's error screen
 * prints it verbatim as the explanation, so write it the way you'd write it for a
 * user: what happened, then what to do, no blame ("Roster not found." — not
 * "roster lookup failed"). Omit it and the screen falls back to its own copy.
 *
 * The copy rides in the response BODY via `data()`, never in `statusText`.
 * `statusText` is a ByteString: Node's Response constructor throws a TypeError on
 * any character above U+00FF — an em dash, a curly apostrophe, any accented
 * character outside Latin-1 — and on newlines. That's most well-written English
 * copy and most French copy, so authoring the message would throw INSIDE the
 * loader and the user would get a generic 500 instead of the 404 you wrote.
 * (Bun's Response accepts all of it, so this only ever failed in production.)
 */
export function serverError(code: ServerErrorStatus, customMsg?: string) {
  return data({ message: customMsg ?? null }, { status: code });
}
