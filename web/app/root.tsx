import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/root";
import { describeError, ErrorScreen } from "~/components/error-screen";
import { getPreferencesFromRequest } from "~/lib/preferences/preference-cookie.server";
import { blockingThemeScript } from "~/lib/theme/blocking-theme-script";
import "./app.css";

export function loader({ request }: Route.LoaderArgs) {
  return { preferences: getPreferencesFromRequest(request) };
}

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "shortcut icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
];

/** The fallback for routes without their own meta — and the only meta that runs on an error, since the failing route's never does. */
export const meta: Route.MetaFunction = ({ error }) => [
  { title: error ? `${describeError(error).title} · Ben Honda` : "Ben Honda" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  // Undefined when the root loader itself threw; the blocking script still sets the class before paint.
  const theme = useRouteLoaderData<typeof loader>("root")?.preferences.theme ?? "system";

  return (
    // suppressHydrationWarning: the blocking script adds dark/light to <html> before React hydrates.
    <html lang="en" className={theme === "system" ? undefined : theme} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Must stay first, no defer/async — it sets the theme class before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: blockingThemeScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ErrorScreen error={error} />;
}
