import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type LinksFunction,
  type LoaderFunctionArgs,
  useLocation,
  useRouteLoaderData,
} from "react-router";
import "./app.css";
import { ReadableError } from "~/lib/readable-error";
import { serverEnv } from "~/lib/env/env.defaults.server";
import { Toaster } from "sonner";
import { useI18n } from "~/hooks/use-i18n";
import { useDebouncedCallback } from "use-debounce";
import { logDebug } from "~/lib/logger";
import { browserPageEvent, browserIdentifyEvent } from "~/lib/analytics/events.defaults.client";
import { useEffect, useRef } from "react";
import { useRouteError } from "react-router";
import { getThemeFromRequest } from "~/lib/theme/theme.server";
import { cn } from "~/lib/utils";
import { Footer } from "~/components/misc/footer";
import { getUser } from "~/lib/auth-utils/user.server";

const SITE_NAME = "bhonda.com";
const SITE_DESC = "bhonda.com";

export const links: LinksFunction = () => [
  // Preload critical custom fonts
  {
    rel: "preload",
    href: "/fonts/Array-Wide.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/Erode-Variable.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/Tabular-Variable.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // only take the public env vars (the ones that start with "PUBLIC_")
  const publicEnv = Object.fromEntries(Object.entries(serverEnv).filter(([key]) => key.startsWith("PUBLIC_")));

  // Get theme preference from cookie
  const theme = getThemeFromRequest(request);

  // Get user if logged in
  const user = await getUser(request);

  return { publicEnv, theme, user };
};

/**
 * Layout component wraps the entire document structure.
 * Used by App, ErrorBoundary, and HydrateFallback to avoid duplication
 * and prevent remounting of app shell elements.
 */
export function Layout({ children }: { children: React.ReactNode }) {
  // Use useRouteLoaderData to safely access loader data (might be undefined in error state)
  const data = useRouteLoaderData<typeof loader>("root");
  const { language } = useI18n();

  // Defensive fallbacks for error boundary case
  const theme = data?.theme || "system";
  const publicEnv = data?.publicEnv || {};
  const themeClass = theme === "system" ? "" : theme;

  return (
    <html lang={language} translate="no" className={cn("notranslate", themeClass)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <link rel="manifest" href="/site.webmanifest" />

        {/* OG */}
        <meta property="og:title" content={SITE_NAME} />
        <meta property="og:image" content="/og.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />

        <Meta />
        <Links />

        {/**
         * This is a way to pass data from the server to the client
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(publicEnv)}`,
          }}
        />
      </head>

      <body>
        <div className="min-h-[85svh]">{children}</div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <Toaster richColors />
      </body>
    </html>
  );
}

function App() {
  const { publicEnv, user } = useLoaderData<typeof loader>();
  const { language } = useI18n();

  const location = useLocation();
  const pathname = location.pathname;

  const hasIdentifiedRef = useRef(false);

  const triggerPageEvent = useDebouncedCallback(
    () => {
      logDebug("triggerPageEvent", { pathname, language });
      browserPageEvent({ language });
    },
    1000,
    { leading: true, trailing: false }
  );

  useEffect(() => {
    triggerPageEvent();
  }, [pathname, language]);

  useEffect(() => {
    if (hasIdentifiedRef.current) return;
    if (!user) return;

    browserIdentifyEvent({
      userId: user.id,
      email: user.email,
      fullName: user.display_name ?? undefined,
      firstName: user.first_name ?? undefined,
      lastName: user.last_name ?? undefined,
    });
    hasIdentifiedRef.current = true;
  }, [user]);

  return <Outlet />;
}

export default App;

export function ErrorBoundary() {
  const error = useRouteError();

  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (error && error instanceof ReadableError) {
    details = error.detail;
  } else if (error && error instanceof Error) {
    details = error.message;
    if (import.meta.env.DEV) {
      stack = error.stack;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{message}</h1>
        <p className="text-sm text-muted-foreground mt-2">{details}</p>
        <a href="/" className="inline-block mt-4 text-sm underline hover:no-underline">
          Go back home
        </a>
      </div>
      {stack && <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-w-4xl w-full">{stack}</pre>}
    </div>
  );
}
