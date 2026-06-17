/**
 * Blocking inline script for root.tsx <head>.
 *
 * Runs synchronously before first paint — reads the preference cookie and applies
 * the correct dark/light class to <html> immediately, preventing a flash for
 * system-dark users whose OS preference the server can't know.
 *
 * The template literal is evaluated at build time, so COOKIE_NAME and its length
 * are inlined as literals — no runtime import needed.
 *
 * IMPORTANT: must be rendered with dangerouslySetInnerHTML, no defer/async.
 */

const COOKIE_NAME = "user_preferences";

export const blockingThemeScript = `(function () {
  try {
    var cookie = document.cookie.split('; ').find(function (r) {
      return r.startsWith('${COOKIE_NAME}=');
    });
    var prefs = cookie
      ? JSON.parse(decodeURIComponent(cookie.slice(${COOKIE_NAME.length + 1})))
      : {};
    var theme = prefs.theme || 'system';
    var dark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
  } catch (e) {}
})();`;
