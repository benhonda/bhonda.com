import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";

export const authLogoutActionDefinition = defineAction<{}>()({
  actionDirectoryName: "auth-logout",
  inputDataSchema: z.object({}),
});
