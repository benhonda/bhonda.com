import { isRouteErrorResponse } from "react-router";
import { buttonVariants } from "~/components/ui/button";
import { authoredErrorMessage, HTTP_STATUS_TEXT, type ServerErrorStatus } from "~/lib/router/http-status";
import { Link } from "~/lib/router/routes";

type ErrorDetails = { status: number; title: string; message: string | null };

function isKnownStatus(status: number): status is ServerErrorStatus {
  return status in HTTP_STATUS_TEXT;
}

/**
 * Status → copy, in one place. The root ErrorBoundary renders it and the root `meta`
 * titles the tab with it, so the page and the tab can't disagree (status-copy-ssot).
 */
export function describeError(error: unknown): ErrorDetails {
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      title: isKnownStatus(error.status) ? HTTP_STATUS_TEXT[error.status] : "Something went wrong",
      message: authoredErrorMessage(error.data),
    };
  }
  return { status: 500, title: HTTP_STATUS_TEXT[500], message: null };
}

/** The app's one error screen: status, copy, a way home, and (dev only) the stack. */
export function ErrorScreen({ error }: { error: unknown }) {
  const { status, title, message } = describeError(error);

  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm font-medium text-muted-foreground">{status}</p>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {message && <p className="leading-relaxed text-muted-foreground">{message}</p>}
      <Link to="/" className={buttonVariants({ variant: "outline", className: "mt-2 self-start" })}>
        Back to the homepage
      </Link>
      {/* The single dev-only diagnostic; the DEV guard is statically replaced, so prod never ships it (dev-detail-once). */}
      {import.meta.env.DEV && error instanceof Error && (
        <pre className="mt-6 overflow-x-auto rounded-md bg-muted p-4 text-xs">{error.stack ?? error.message}</pre>
      )}
    </main>
  );
}
