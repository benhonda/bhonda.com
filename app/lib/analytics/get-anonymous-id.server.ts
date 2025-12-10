/**
 * Get Segment anonymous ID from cookie
 *
 * Segment stores anonymousId in a cookie. The cookie name depends on the configuration:
 * - Default: ajs_anonymous_id
 * - Custom: can be namespaced
 *
 * This function attempts to find the anonymousId from request cookies.
 */
export function getAnonymousIdFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  // Parse cookies
  const cookies = cookieHeader.split(";").reduce<Record<string, string>>((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {});

  // Try common Segment cookie patterns
  // 1. Standard ajs_anonymous_id
  if (cookies["ajs_anonymous_id"]) {
    return decodeURIComponent(cookies["ajs_anonymous_id"]);
  }

  // 2. Look for any cookie containing "ajs_anonymous_id"
  const anonymousIdCookie = Object.keys(cookies).find((key) =>
    key.includes("ajs_anonymous_id")
  );

  if (anonymousIdCookie) {
    return decodeURIComponent(cookies[anonymousIdCookie]);
  }

  return null;
}
