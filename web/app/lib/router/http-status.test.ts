import { describe, expect, test } from "bun:test";
import {
  HTTP_STATUS_TEXT,
  authoredErrorMessage,
  type ServerErrorStatus,
} from "~/lib/router/http-status";
import { serverError } from "~/lib/router/server-responses.server";

/**
 * `serverError` writes the authored copy; the error screen reads it back through
 * `authoredErrorMessage` to decide whether to print it or substitute its own.
 * The two sides never import each other, so the contract fails SILENTLY both ways
 * — the screen shows protocol jargon to a user, or throws away authored copy.
 */
describe("serverError → authoredErrorMessage", () => {
  const statuses = Object.keys(HTTP_STATUS_TEXT).map(
    Number,
  ) as ServerErrorStatus[];

  test.each(statuses)("%i with no custom message has no authored copy", (code) => {
    const err = serverError(code);
    expect(err.init?.status).toBe(code);
    expect(authoredErrorMessage(err.data)).toBeNull();
  });

  test.each(statuses)("%i round-trips authored copy verbatim", (code) => {
    const err = serverError(code, "Roster not found.");
    expect(authoredErrorMessage(err.data)).toBe("Roster not found.");
  });

  /**
   * The regression this exists for: the copy used to travel in `Response.statusText`,
   * a ByteString. Node's Response constructor throws a TypeError on anything above
   * U+00FF or on a newline — so an em dash, a French curly apostrophe, or a two-line
   * message threw inside the loader and the user got a 500 instead of the 404 that
   * was written. Bun's Response accepts all of it, so this ONLY failed in production.
   * Each string below is real house style, not an exotic edge case.
   */
  test.each([
    "Roster not found — check the link.",
    "Cette page n’existe pas.",
    "Page non trouvée.",
    "Not found.\nTry again.",
  ])("copy outside Latin-1 survives: %j", (msg) => {
    expect(authoredErrorMessage(serverError(404, msg).data)).toBe(msg);
  });

  /**
   * Route errors the app didn't author — a platform 502, a bare `throw new Response()`,
   * a framework throw — reach the same screen with a payload of any shape. Unauthored,
   * never a crash: the error screen is the one place a second error has nowhere to land.
   */
  test.each([
    ["a string body", "Bad Gateway"],
    ["no body", undefined],
    ["an object without message", { detail: "nope" }],
    ["an empty message", { message: "" }],
    ["a non-string message", { message: 404 }],
  ])("%s is unauthored", (_label, body) => {
    expect(authoredErrorMessage(body)).toBeNull();
  });
});
