import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";

export const contactFormActionDefinition = defineAction<{
  /** CD2 email record id — useful for tracing delivery status later */
  emailId: string;
}>()({
  actionDirectoryName: "contact-form",
  inputDataSchema: z.object({
    name: z.string().trim().min(1, "Please enter your name").max(100),
    email: z.string().trim().email("Please enter a valid email address"),
    message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
    /**
     * Honeypot — hidden from real users, must stay empty. Bots that auto-fill
     * every field trip this and the submission is rejected as spam.
     */
    company: z.string().max(0, "Spam detected").optional(),
  }),
});
