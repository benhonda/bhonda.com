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
    // safely redirect
    const decoded = decodeURIComponent(rawAbsolutePath);

    // if the url is not a relative path, redirect to the default path
    if (!decoded.startsWith("/") || decoded.startsWith("//")) {
      Location = generatePathForLinkTo(serverRedirectArgs?.defaultRedirectTo || { to: "/" });
    }

    Location = decoded;
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
 * Throw this!
 */
export function serverError(code: 400 | 401 | 403 | 404 | 405 | 409 | 500 | 501, customMsg?: string) {
  return new Response(null, {
    status: code,
    statusText:
      customMsg ??
      (code === 400
        ? "Bad Request"
        : code === 401
          ? "Unauthorized"
          : code === 403
            ? "Forbidden"
            : code === 404
              ? "Not Found"
              : code === 405
                ? "Method Not Allowed"
                : code === 409
                  ? "Conflict"
                  : code === 500
                    ? "Internal Server Error"
                    : code === 501
                      ? "Not Implemented"
                      : "Internal Server Error"),
  });
}
