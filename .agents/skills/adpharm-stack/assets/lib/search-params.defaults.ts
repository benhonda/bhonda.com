import { z } from "zod";

export const searchParamsSchema = z.object({
  redirectTo: z.string().optional(),
  // "responses.responseId": z.string().optional(),
  // "responses.search": z.string().optional(),
  // "responses.userIds": z.array(z.string()).optional(),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
