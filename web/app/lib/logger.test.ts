import { describe, expect, test } from "bun:test";
import { z } from "zod";
import { formatLogParts } from "~/lib/logger";

/**
 * The logger is where a failure's detail either survives or silently doesn't — Node's
 * console prints nested values only 2 levels deep, so a payload logged the obvious way
 * reaches Vercel as `[Object]`. Each case here is a shape that was lost at least once.
 */
describe("formatLogParts keeps the detail", () => {
  test("deep nesting survives, on one line", () => {
    const line = formatLogParts(["ctx", { a: { b: { c: { d: 1 } } } }, new Error("boom")]);
    expect(line).toContain('"d":1');
    expect(line).not.toContain("\n");
  });

  test("an Error keeps its message, stack and cause", () => {
    const line = formatLogParts([new Error("outer", { cause: new Error("inner") })]);
    expect(line).toContain('"message":"outer"');
    expect(line).toContain('"stack":"Error: outer');
    expect(line).toContain('"cause":{');
    expect(line).toContain('"message":"inner"');
  });

  test("a zod error keeps its issues (what logActionError hands the logger)", () => {
    const result = z.object({ mode: z.enum(["a", "b"]) }).safeParse({ mode: "nope" });
    expect(result.success).toBe(false);
    // zod 4 keeps `issues` non-enumerable and serializes them into `message` — so the
    // detail rides there. Assert the content, not the encoding.
    const line = formatLogParts([{ error: result.error }]);
    expect(line).toContain("invalid_value");
    expect(line).toContain("mode");
  });

  test("only a true cycle is [Circular] — the same object twice is logged twice", () => {
    const shared = { id: 1 };
    expect(formatLogParts([{ first: shared, second: shared }])).toBe('{"first":{"id":1},"second":{"id":1}}');
    const cyclic: { self?: unknown } = {};
    cyclic.self = cyclic;
    expect(formatLogParts([cyclic])).toBe('{"self":"[Circular]"}');
  });

  test("toJSON is honoured (URL, Date) and bigint/Map/Set survive", () => {
    const line = formatLogParts([
      { url: new URL("https://app.example/a?b=1"), at: new Date(0), n: 10n, m: new Map([[1, "x"]]), s: new Set([2]) },
    ]);
    expect(line).toBe(
      '{"url":"https://app.example/a?b=1","at":"1970-01-01T00:00:00.000Z","n":"10","m":{"1":"x"},"s":[2]}'
    );
  });

  test("headers print, credentials don't", () => {
    const line = formatLogParts([new Headers({ "x-request-id": "r1", cookie: "session=abc", authorization: "Bearer t" })]);
    expect(line).toContain('"x-request-id":"r1"');
    expect(line).not.toContain("session=abc");
    expect(line).not.toContain("Bearer t");
  });
});
