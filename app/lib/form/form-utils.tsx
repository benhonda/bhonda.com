import z from "zod";
import type { I18NFunction } from "./form-config-types";

/**
 * Create a Zod instance with i18n error messages
 *
 * @example
 * defineForm((l) => {
 *   const z = createZ(l);
 *   return {
 *     fields: {
 *       name: {
 *         type: "text",
 *         label: l("Name", "Nom"),
 *         schema: z.string().min(1)  // auto i18n: "This field is required"
 *       },
 *       role: {
 *         type: "radioGroup",
 *         label: l("Role", "Rôle"),
 *         schema: z.enum(roleEnum)  // auto i18n: "Please select an option"
 *       },
 *       tags: {
 *         type: "checkboxGroup",
 *         label: l("Tags", "Étiquettes"),
 *         schema: z.array(z.string()).min(1)  // auto i18n: "Please select at least one option"
 *       }
 *     }
 *   };
 * });
 */
export function createZ(l: I18NFunction) {
  z.config({
    customError: (issue) => {
      if (issue.code === "invalid_type") {
        if (issue.expected === "string") {
          return l("This field is required", "Ce champ est requis");
        }
        if (issue.expected === "number") {
          return l("Must be a number", "Doit être un nombre");
        }
      }
      if (issue.code === "too_small") {
        if (issue.type === "array" && issue.minimum === 1) {
          return l("Please select at least one option", "Veuillez sélectionner au moins une option");
        }
        if (issue.type === "string" && issue.minimum === 1) {
          return l("This field is required", "Ce champ est requis");
        }
      }
      if (issue.code === "too_big") {
        if (issue.type === "array" && issue.maximum === 1) {
          return l("Please select at most one option", "Veuillez sélectionner au plus une option");
        }
        if (issue.type === "string" && issue.maximum === 1) {
          return l("This field is required", "Ce champ est requis");
        }
      }
      if (issue.code === "not_multiple_of") {
        return l(`Must be a multiple of ${issue.multipleOf}`, `Doit être un multiple de ${issue.multipleOf}`);
      }
    },
  });

  return z;
}

/**
 * Renders a string that may contain HTML tags as actual HTML.
 * This is a simple implementation that supports basic HTML tags.
 * For more complex scenarios, consider using a markdown parser.
 */
export function renderHtmlContent(content: string | React.ReactNode): React.ReactNode {
  // If it's not a string, just return it as-is
  if (typeof content !== "string") {
    return content;
  }

  // Check if the string contains HTML tags
  const hasHtmlTags = /<[^>]+>/.test(content);

  if (!hasHtmlTags) {
    return content;
  }

  // Render as HTML using dangerouslySetInnerHTML
  return <span dangerouslySetInnerHTML={{ __html: content }} />;
}
