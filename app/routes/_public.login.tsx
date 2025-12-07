import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { GoogleSvg } from "~/components/svgs/GoogleSvg";
import { Spacer } from "~/components/misc/spacer";
import { useAction } from "~/hooks/use-action";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { loginWithGoogleActionDefinition } from "~/lib/actions/auth-login-with-google/action-definition";
import { cn } from "~/lib/utils";

export async function loader({}: LoaderFunctionArgs) {
  return {};
}

export const action = action_handler;

export default function Page() {
  //
  // Action
  //
  const signInWithGoogleAction = useAction(loginWithGoogleActionDefinition);

  //
  // Handlers
  //
  function handleSignInWithGoogle() {
    signInWithGoogleAction.submit({ hello: "world" });
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Spacer size="2xl" />

      <button
        type="button"
        className={cn(
          //
          "bg-background drop-shadow-lg rounded-md p-4 inline-flex items-center gap-2 border",
          "hover:bg-muted cursor-pointer"
        )}
        onClick={handleSignInWithGoogle}
      >
        <GoogleSvg className="size-6" />
        <span className="text-sm font-medium">Sign in with Google</span>
      </button>
    </div>
  );
}
