import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";

export const loginWithGoogleActionDefinition = defineAction<{}>()({
  actionDirectoryName: "auth-login-with-google",
  inputDataSchema: z.object({
    hello: z.string(),
  }),
});
