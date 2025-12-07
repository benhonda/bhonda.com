import { z, ZodObject, ZodType } from "zod";
import { get, typedEntries } from "~/lib/types/type-utils";
import {
  type FormConfig,
  type ObjectConfig,
  type ObjectConfigValues,
  type I18NFunction,
  type ExtractZodSchemas,
  type RatingMatrixConfig,
} from "./form-config-types";
import { testFieldAgainstAllDependencies } from "./form-config-utils";

/**
 * Build a Zod schema for a rating-matrix field based on its items and scales.
 * Validates that each value is one of the valid options for that scale.
 */
type OptionValue = number | string;

function buildRatingMatrixSchema(config: RatingMatrixConfig, l: I18NFunction): ZodType {
  const requiredError = l("Please complete all ratings", "Veuillez compléter toutes les évaluations");
  const invalidError = l("Invalid rating value", "Valeur d'évaluation invalide");

  const scaleSchema: Record<string, ZodType> = {};
  for (const scale of config.scales) {
    const validValues = scale.options.map((opt) => opt.value);

    // Create union of literals for valid option values
    // This validates both the type (number/string) and that it's an allowed value
    scaleSchema[scale.key] = z.union(
      validValues.map((v) => z.literal(v)) as [
        z.ZodLiteral<OptionValue>,
        z.ZodLiteral<OptionValue>,
        ...z.ZodLiteral<OptionValue>[],
      ],
      { error: (issue) => (issue.input === undefined ? requiredError : invalidError) }
    );
  }

  const itemsSchema: Record<string, ZodType> = {};
  for (const item of config.items) {
    itemsSchema[item.key] = z.object(scaleSchema, {
      error: (issue) => (issue.input === undefined ? requiredError : "Invalid item"),
    });
  }

  return z.object(itemsSchema, {
    error: (issue) => (issue.input === undefined ? requiredError : "Invalid rating matrix"),
  });
}

/**
 * Check if a value is a valid Zod schema (Zod v4 compatible)
 * Uses duck-typing instead of instanceof to work across module boundaries
 */
function isZodSchema(value: unknown): value is ZodType {
  if (value == null || typeof value !== "object") return false;

  const zod = (value as any)._zod;
  if (zod == null || typeof zod !== "object") return false;

  const traits = zod.traits;
  if (traits == null) return false;

  // Check for has method (Set-like) or array-like structure
  if (typeof traits.has === "function") {
    return traits.has("$ZodType");
  }

  // Fallback: check if _zod exists with expected structure (indicates it's a Zod type)
  return typeof zod.def === "object" && typeof zod.constr === "function";
}

export function formConfigToZodSchemas<T extends FormConfig>(
  config: T,
  l: I18NFunction
): {
  default: ZodObject<ExtractZodSchemas<T>>;
  partial: ZodObject<ExtractZodSchemas<T>>;
} {
  //
  // Recursively build schema shape
  //
  function buildSchemaShape(config: Record<string, any>, partial = false): Record<string, ZodType> {
    const shape: Record<string, ZodType> = {};

    for (const [key, value] of Object.entries(config)) {
      if (value.properties) {
        // Recursively build schema for nested object
        const nestedShape = buildSchemaShape(value.properties, partial);
        shape[key] = partial ? z.object(nestedShape).partial() : z.object(nestedShape);
      } else if (value.type === "rating-matrix") {
        // Auto-generate schema for rating-matrix if not provided
        const schema = value.schema || buildRatingMatrixSchema(value as RatingMatrixConfig, l);
        shape[key] = partial ? z.optional(schema) : schema;
      } else if ("schema" in value) {
        const schema = value.schema;

        // Validate that the schema is actually a Zod schema
        if (!isZodSchema(schema)) {
          console.error(
            `[formConfigToZodSchemas] Invalid schema at key "${key}":`,
            "\n  Type:",
            typeof schema,
            "\n  Value:",
            schema,
            "\n  Has _zod:",
            schema != null && typeof schema === "object" && "_zod" in schema
          );
          throw new Error(
            `Invalid schema at key "${key}": expected a Zod schema but got ${typeof schema}. ` +
              `This usually happens when form configs are serialized through a loader instead of imported directly.`
          );
        }

        // Use z.optional() wrapper instead of .optional() method
        // because schemas may already be wrapped (ZodOptional, ZodDefault, etc.)
        shape[key] = partial ? z.optional(schema) : schema;
      }
    }

    return shape;
  }

  //
  // SuperRefine logic (unchanged except type cleanup)
  //
  function superRefine(data: Record<string, any>, ctx: z.RefinementCtx) {
    function addSuperRefine(config: Record<string, any>, parentPath: string[] = []) {
      for (const [key, fieldConfig] of Object.entries(config)) {
        const path = [...parentPath, key];

        if (fieldConfig.dependencies) {
          const doesFieldPassAllDependencies = testFieldAgainstAllDependencies({
            testFor: "require",
            dependencies: fieldConfig.dependencies,
            getDependencyValue: (pathToDependency: string) => get(data, pathToDependency),
          });

          const thisFieldValue = get(data, path.join("."));
          const isThisFieldEmpty = !thisFieldValue || thisFieldValue === "";

          if (doesFieldPassAllDependencies && isThisFieldEmpty) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path,
              message: l("This field is required", "Ce champ est requis"),
            });
          }
        }

        // Recurse into nested objects
        if (fieldConfig.properties) {
          addSuperRefine(fieldConfig.properties, path);
        }
      }
    }

    addSuperRefine(config);
  }

  //
  // Build final schemas
  //
  const defaultShape = buildSchemaShape(config, false);
  const partialShape = buildSchemaShape(config, true);

  const defaultZodSchema = z.object(defaultShape).superRefine(superRefine);
  const partialZodSchema = z.object(partialShape).superRefine(superRefine);

  return {
    default: defaultZodSchema as z.ZodObject<ExtractZodSchemas<T>>,
    partial: partialZodSchema as z.ZodObject<ExtractZodSchemas<T>>,
  };
}
