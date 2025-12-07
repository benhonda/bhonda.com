import type { LoaderFunctionArgs } from "react-router";
import { action_handler } from "~/lib/actions/_core/action-runner.server";

export async function loader({}: LoaderFunctionArgs) {
  return {};
}

export const action = action_handler;

export default function Index() {
  return <div>Index</div>;
}
