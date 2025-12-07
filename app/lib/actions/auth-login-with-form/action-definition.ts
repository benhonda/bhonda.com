import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";

export const authLoginWithFormActionDefinition = defineAction<{}>()({
  actionDirectoryName: "auth-login-with-form",
  inputDataSchema: z.object({
    email: z.string(),
    password: z.string(),
  }),
});
