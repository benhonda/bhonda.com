import type { LoaderFunctionArgs } from "react-router";
import { callbackLoader } from "~/lib/auth-utils/google-callback-loader.server";

/**
 * Google Callback Loader
 */
export async function loader({ request }: LoaderFunctionArgs) {
  return await callbackLoader(request);
}

export default function GoogleCallback() {
  // No UI is necessary since this route only processes data.
  return null;
}

export function ErrorBoundary() {
  return (
    <div>
      <h1>Error</h1>
      <p>An error occurred while processing the Google callback.</p>
    </div>
  );
}
