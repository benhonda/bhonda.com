import { z } from "zod";
import type { ActionCacheConfig } from "./action-cache-manager";
import type { ActionName } from "./action-map";

/**
 * Action definition with phantom type for output
 *
 * Use `defineAction()` to create action definitions instead of constructing this type directly.
 */
export type ActionDefinition<TInput extends z.ZodTypeAny = z.ZodTypeAny, TOutput = any> = {
  actionDirectoryName: string;
  inputDataSchema: TInput;
  outputDataSchema?: z.ZodTypeAny; // Deprecated - kept for backward compatibility
  type?: "query" | "mutation";
  cache?: ActionCacheConfig;
  invalidatesActions?: ActionName[];
};

/**
 * Action definition data - extracts types from generic parameters
 */
export type ActionDefinitionData<T extends ActionDefinition<any, any> = ActionDefinition<any, any>> =
  T extends ActionDefinition<infer TInput, infer TOutput>
    ? {
        actionDirectoryName: T["actionDirectoryName"];
        inputData: z.infer<TInput>;
        outputData: TOutput;
      }
    : never;

// export const actionPayloadSchemas = {
//   login_with_form: {
//     inputData: z.object({
//       email: z.string(),
//       password: z.string(),
//     }),
//     outputData: z.object({}),
//   },
//   login_with_google: {
//     inputData: z.object({}),
//     outputData: z.object({}),
//   },
//   register_with_form: {
//     inputData: z.object({
//       email: z.string(),
//       plainTextPassword1: z.string(),
//       plainTextPassword2: z.string(),
//     }),
//     outputData: z.object({}),
//   },
//   logout: {
//     inputData: z.object({}),
//     outputData: z.object({}),
//   },
//   figmaImageExtractor: startFigmaExtractorJobPayloadSchemas,
// } as const;

export type ActionPayloadError = {
  message_unsafe: string;
  /**
   * The error message that is safe to display to the user
   */
  message_safe: string;
};

/**
 * Configuration for defining an action
 */
export type ActionConfig<TInput extends z.ZodTypeAny> = {
  /** Unique identifier for this action (must match directory name) */
  actionDirectoryName: string;
  /** Zod schema for validating input data */
  inputDataSchema: TInput;
  /**
   * Action type - determines caching behavior
   *
   * - `"query"`: Read operation. Enables caching by default.
   * - `"mutation"`: Write operation. Not cached (default if omitted).
   *
   * @example
   * ```ts
   * type: "query" // Cached
   * ```
   */
  type?: "query" | "mutation";
  /**
   * Cache configuration (optional)
   *
   * Override default caching behavior.
   * Queries are cached by default, mutations are not.
   */
  cache?: ActionCacheConfig;
  /**
   * Action names to invalidate when this action succeeds
   *
   * Clears all cache entries for the specified actions.
   * Use for mutations that affect other queries.
   *
   * @example
   * ```ts
   * invalidatesActions: ["contacts-get-profile", "contacts-search"]
   * ```
   */
  invalidatesActions?: ActionName[];
};

/**
 * Helper to define an action with type-only output schema
 *
 * @example
 * ```ts
 * // Query - enables caching
 * export const myQueryDefinition = defineAction<OutputType>()({
 *   actionDirectoryName: "my-query",
 *   type: "query",
 *   inputDataSchema: z.object({ id: z.string() }),
 * });
 *
 * // Mutation - invalidates related queries
 * export const myMutationDefinition = defineAction<OutputType>()({
 *   actionDirectoryName: "my-mutation",
 *   inputDataSchema: z.object({ id: z.string() }),
 *   invalidatesActions: ["my-query"],
 * });
 * ```
 */
export function defineAction<TOutput>() {
  return <TInput extends z.ZodTypeAny>(config: ActionConfig<TInput>): ActionDefinition<TInput, TOutput> => {
    return config;
  };
}

/**
 * Type-safe helper to parse action input data
 *
 * Usage:
 * const { id } = parseActionInput(myActionDefinition, unsafeInputData);
 */
export function parseActionInput<T extends ActionDefinition>(
  definition: T,
  unsafeData: unknown
): ActionDefinitionData<T>["inputData"] {
  return definition.inputDataSchema.parse(unsafeData) as any;
}

/**
 * Helper to create a type-safe action handler
 *
 * Usage:
 * export default createActionHandler(myActionDefinition, async ({ inputData }, request) => {
 *   const parsed = myActionDefinition.inputDataSchema.parse(inputData);
 *   // return value is type-checked against output type
 *   return { result: "data" };
 * });
 */
export function createActionHandler<T extends ActionDefinition>(
  definition: T,
  handler: (
    data: ActionDefinitionData<T>,
    request: Request
  ) => Promise<ActionDefinitionData<T>["outputData"] | ActionHandlerReturnType<ActionDefinitionData<T>>>
): (data: ActionDefinitionData<T>, request: Request) => Promise<ActionHandlerReturnType<ActionDefinitionData<T>>> {
  return async (data, request) => {
    const result = await handler(data, request);

    // If handler returned a full payload (redirect/response/error), passthrough
    if (
      result &&
      typeof result === "object" &&
      ("redirectResponse" in result || "response" in result || "error" in result)
    ) {
      return result as ActionHandlerReturnType<ActionDefinitionData<T>>;
    }

    // Otherwise wrap as data
    return {
      _id: Math.random().toString(36).substring(7),
      success: true,
      currentAction: data.actionDirectoryName,
      data: {
        [data.actionDirectoryName]: result,
      },
    } as ActionHandlerReturnType<ActionDefinitionData<T>>;
  };
}

// Action handler return type
export type ActionHandlerReturnType<ADD extends ActionDefinitionData> = {
  _id: string;
  success: boolean;
  currentAction: ADD["actionDirectoryName"];
  error?: ActionPayloadError;
  redirectResponse?: Response;
  response?: Response;
  data?: ADD["outputData"];
  // data?: {
  //   [K in T["actionDirectoryName"]]?: T["outputData"];
  // };
};
