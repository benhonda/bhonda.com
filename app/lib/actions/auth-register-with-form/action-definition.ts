import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";

export const authRegisterWithFormActionDefinition = defineAction<{}>()({
  actionDirectoryName: "auth-register-with-form",
  inputDataSchema: z.object({
    email: z.string(),
    plainTextPassword1: z.string(),
    plainTextPassword2: z.string(),
  }),
});
