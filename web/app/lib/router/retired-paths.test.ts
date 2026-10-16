import { describe, expect, test } from "bun:test";
import { isRetiredPath } from "~/lib/router/retired-paths";

describe("isRetiredPath", () => {
  test.each(["/blog", "/blog/", "/blog/some-post", "/ships/2025-W50", "/Projects/foo", "/sitemap.xml", "/llms.txt"])(
    "%s is retired",
    (pathname) => {
      expect(isRetiredPath(pathname)).toBe(true);
    }
  );

  test.each(["/", "", "/blogger", "/blog-2", "/about", "/oauth2/google/callback"])("%s is not retired", (pathname) => {
    expect(isRetiredPath(pathname)).toBe(false);
  });
});
