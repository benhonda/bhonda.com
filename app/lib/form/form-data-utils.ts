import type { FormConfig, ObjectConfig, I18NFunction } from "./form-config-types";

// =============================================================================
// ZOD 4 ERROR HELPERS
// =============================================================================
// Zod 4 unified error handling using the `error` parameter.
// These helpers provide bilingual error messages for form validation.

/**
 * Error helper for z.enum() - provides bilingual "Please select an option" message
 *
 * @example
 * schema: z.enum(myEnum, { error: enumError(l) })
 */
export const enumError = (l: I18NFunction): string => l("Please select an option", "Veuillez sélectionner une option");

/**
 * Error helper for z.array() - provides bilingual "Please select at least one option" message
 *
 * @example
 * schema: z.array(z.enum(myEnum), { error: arrayError(l) })
 */
export const arrayError = (l: I18NFunction): string =>
  l("Please select at least one option", "Veuillez sélectionner au moins une option");

/**
 * Error helper for required fields - provides bilingual "This field is required" message
 *
 * @example
 * schema: z.string().min(1, { error: requiredError(l) })
 */
export const requiredError = (l: I18NFunction): string => l("This field is required", "Ce champ est requis");

/**
 * Error helper for ranking fields - provides bilingual "Please rank all items" message
 *
 * @example
 * schema: z.array(z.string(), { error: rankingError(l) }).length(N, { message: l("...", "...") })
 */
export const rankingError = (l: I18NFunction): string =>
  l("Please rank all items", "Veuillez classer tous les éléments");
/**
 * find any dependencies, then return the path
 * @param config
 * @returns
 */
export function getFieldsWithDependencies({
  config,
  parentObject,
}: {
  config: FormConfig;
  parentObject?: {
    id: string;
    config: ObjectConfig;
  };
}) {
  const fieldsWithDependencies: string[] = [];
  // we know we are in an object if the keyPrefix is not an empty string
  // const isInObject = keyPrefix !== "";

  Object.entries(config).forEach(([key, value]) => {
    //
    // forceWatch
    //
    if (parentObject?.config?.offerNotApplicableForEntireObject) {
      fieldsWithDependencies.push(`${parentObject.id}.${key}`);
      return;
    }

    if (value.dependencies) {
      value.dependencies.forEach((dependency) => {
        if (dependency.if) {
          fieldsWithDependencies.push(dependency.if[0]);
        }
        if (dependency.or) {
          fieldsWithDependencies.push(dependency.or[0]);
        }
        if (dependency.or2) {
          fieldsWithDependencies.push(dependency.or2[0]);
        }
        if (dependency.and) {
          fieldsWithDependencies.push(dependency.and[0]);
        }
      });
      return;
    }

    //
    // hideIf
    //
    // if (value.hideIf) {
    //   fieldsWithDependencies.push(value.hideIf[0]);
    //   return;
    // }

    //
    // requireIf
    //
    // if (value.requireIf) {
    //   watchedFields.push(value.requireIf[0]);
    // }

    if (value.type === "object") {
      // if the object has offerNotApplicableForEntireObject, we need to watch all it's properties
      fieldsWithDependencies.push(
        ...getFieldsWithDependencies({ config: value.properties, parentObject: { id: key, config: value } })
      );
    }
  });

  // remove duplicates
  return [...new Set(fieldsWithDependencies)];
}
