/**
 * The statuses this app throws deliberately, paired with the copy the error screen
 * falls back to when nobody authored a message for that throw.
 *
 * Shared (NOT `.server.ts`) because the client-side error screen and the root
 * `meta` export both read it — see `status-copy-ssot` in references/routing.md.
 * Authored copy never comes from here; it rides in the error body (`serverError`).
 */
export const HTTP_STATUS_TEXT = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  409: "Conflict",
  410: "Gone",
  429: "Too Many Requests",
  500: "Internal Server Error",
  501: "Not Implemented",
} as const;

/** The statuses `serverError` accepts — add a phrase above to add a status. */
export type ServerErrorStatus = keyof typeof HTTP_STATUS_TEXT;

/**
 * The authored message on a thrown route error, or null when there isn't one and
 * the screen must supply its own copy.
 *
 * The only reader of `serverError`'s payload shape, and deliberately total: a
 * route error can also come from the platform or the framework (a 502, a bare
 * `throw new Response()`), where `data` is whatever that thrower chose — a
 * string, undefined, an object without `message`. All of those are "unauthored",
 * not a crash in the error screen, which is the one place a crash is unrecoverable.
 */
export function authoredErrorMessage(errorData: unknown): string | null {
  if (typeof errorData !== "object" || errorData === null) return null;
  const { message } = errorData as { message?: unknown };
  return typeof message === "string" && message.length > 0 ? message : null;
}
