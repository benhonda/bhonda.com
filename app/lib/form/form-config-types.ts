import type React from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { z, type ZodObject, type ZodType } from "zod";

export type I18NFunction<T = string> = (en: T, fr: T) => T;
// export type I18NComponentFunction<T = React.ReactNode> = (en: T, fr: T) => T;

export type ConditionalConfig = [
  // path
  string,
  // operator
  "equals" | "not-equals" | "contains-case-insensitive" | "not-contains-case-insensitive",
  // value
  string | boolean | string[] | number | number[] | null | undefined,
];

export type Dependencies = {
  if: ConditionalConfig;
  or?: ConditionalConfig;
  or2?: ConditionalConfig;
  and?: ConditionalConfig;
  and2?: ConditionalConfig;
  then: "hide" | "require";
};

//
// All form field configs must inherit from this interface
//
interface BaseFormFieldConfig {
  label: React.ReactNode | string;
  description?: string;
  helpText?: string;
  formItemClassName?: string;
  // dependencies?: [string, string, string | boolean | string[] | number | number[] | null | undefined];
  // hideIf?: ConditionalConfig;
  // requireIf?: ConditionalConfig;
  // requireIf?: {
  //   field: string;
  //   operator: "equals" | "not-equals" | "contains-case-insensitive" | "not-contains-case-insensitive";
  //   value: string | boolean | string[] | number | number[] | null | undefined;
  // }[];
  dependencies?: Dependencies[];
  hideNotApplicableCheckbox?: boolean;
}

export type ZodParent<T extends z.ZodType> =
  | T
  | z.ZodOptional<T>
  | z.ZodDefault<T>
  | z.ZodNullable<T>
  | z.ZodOptional<z.ZodNullable<T>>
  // | z.ZodUnion<readonly [T, ...z.ZodType[]]>;
  | z.ZodUnion<readonly [T, z.ZodLiteral<"not_applicable">]>;

//
// type: Input
//
type TextConfig = BaseFormFieldConfig & {
  type: "text";
  schema: z.ZodType; // Accept any Zod type for text fields
  placeholder?: string;
  defaultValue?: string;
  // autocomplete?: {
  //   options: string[];
  // };
};

//
// type: Number
//
type NumberConfig = BaseFormFieldConfig & {
  type: "number";
  schema: ZodParent<z.ZodNumber>;
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
};

//
// type: Autocomplete
//
type AutocompleteConfig = BaseFormFieldConfig & {
  type: "autocomplete";
  schema: ZodParent<z.ZodString>;
  options: string[] | readonly string[];
  mapToLabels?: (value: string) => string;
  placeholder?: string;
};

//
// type: Textarea
//
type TextareaConfig = BaseFormFieldConfig & {
  type: "textarea";
  schema: ZodParent<z.ZodString>; //| ((l: (en: string, fr: string) => string) => ZodOptionalOrEffects<z.ZodString>);
  placeholder?: string;
  defaultValue?: string;
  offerNotApplicable?: boolean;
};

//
// type: Radio Group
//
type RadioGroupConfig = BaseFormFieldConfig & {
  type: "radioGroup";
  schema: ZodParent<z.ZodEnum<any>> | ZodParent<z.ZodString>; //| ((l: (en: string, fr: string) => string) => ZodOptionalOrEffects<z.ZodEnum<any>>);
  options: string[] | readonly string[];
  placeholder?: string;
  mapToLabels?: (key: string, l: I18NFunction) => string;
  defaultValue?: string;
  cols?: number;
};

//
// type: Multi Select
//
type CheckboxGroupConfig = BaseFormFieldConfig & {
  type: "checkboxGroup";
  schema: ZodParent<z.ZodArray<z.ZodEnum<any>>> | ZodParent<z.ZodArray<z.ZodString>>; //| ((l: (en: string, fr: string) => string) => ZodOptionalOrEffects<z.ZodArray<z.ZodEnum<any>>>);
  options: string[] | readonly string[];
  placeholder?: string;
  mapToLabels?: (key: string, l: I18NFunction) => string;
  defaultValue?: string[];
  cols?: number;
  showSelectedCount?: boolean;
  exclusiveOptions?: string[]; // Options that, when selected, deselect all other options
};

//
// type: Not Applicable / Single Select
//
type SingleCheckboxConfig = BaseFormFieldConfig & {
  type: "singleCheckbox";
  schema: ZodParent<z.ZodBoolean>;
  defaultValue?: boolean;
};

//
// type: Switch
//
type SwitchConfig = BaseFormFieldConfig & {
  type: "switch";
  schema: ZodParent<z.ZodBoolean>; //| ((l: (en: string, fr: string) => string) => ZodOptionalOrEffects<z.ZodBoolean>);
  defaultValue?: boolean;
};

//
// type: Hidden
//
type HiddenConfig = BaseFormFieldConfig & {
  type: "hidden";
  schema: ZodParent<z.ZodString>;
};

//
// type: Select
//
type SelectConfig = BaseFormFieldConfig & {
  type: "select";
  schema: ZodParent<z.ZodEnum<any>> | ZodParent<z.ZodString>; //| ((l: (en: string, fr: string) => string) => ZodOptionalOrEffects<z.ZodEnum<any>>);
  options: string[] | readonly string[];
  placeholder?: string;
  mapToLabels?: (key: string, l: I18NFunction) => string;
};

//
// type: Rating Matrix
//
// A matrix where rows are items and columns are scales.
// Each item gets rated on each scale (e.g., knowledge + desire to learn).
// Supports 1, 2, 3+ scales.
//
type RatingMatrixScaleOption = {
  value: number | string;
  label?: string; // Optional - first/last used as endpoint labels, all for legend/tooltips
};

type RatingMatrixScale = {
  key: string; // Used in data shape, e.g., "knowledge"
  label: string; // Column header, e.g., "Current level of knowledge"
  options: RatingMatrixScaleOption[];
};

type RatingMatrixItem = {
  key: string; // Used in data shape, e.g., "chb_pathophysiology"
  label: string; // Row label, e.g., "CHB pathophysiology"
};

export type RatingMatrixConfig = BaseFormFieldConfig & {
  type: "rating-matrix";
  schema?: z.ZodType; // Optional - auto-generated from items/scales if not provided
  scales: RatingMatrixScale[];
  items: RatingMatrixItem[];
  labelDisplay?: "angled" | "legend"; // Controls how option labels are displayed (default: "legend")
};

//
// type: Ranking
//
// Drag-and-drop ranking component for ordering items by priority.
// Desktop: Two-column drag-and-drop interface
// Mobile: Button-based interface with add/remove/reorder
//
type RankingConfig = BaseFormFieldConfig & {
  type: "ranking";
  schema: ZodParent<z.ZodArray<z.ZodString>>;
  items: { key: string; label: string }[];
  defaultValue?: string[];
};

/**
 * The stuff that can be used inside an object. */
export type ObjectConfigValues =
  | TextConfig
  | NumberConfig
  | TextareaConfig
  | RadioGroupConfig
  | CheckboxGroupConfig
  | SwitchConfig
  | SingleCheckboxConfig
  | HiddenConfig
  | AutocompleteConfig
  | SelectConfig
  | RatingMatrixConfig
  | RankingConfig;

export type ObjectConfig = BaseFormFieldConfig & {
  type: "object";
  properties: Record<string, ObjectConfigValues>;
  offerNotApplicableForEntireObject?: boolean;
};

export type FormConfig<K = Record<string, any>> = Record<keyof K, ObjectConfigValues | ObjectConfig>;

// create a type "FormKeys" that is the root keys of the form config AND the keys of "properties" in the "object" type
export type FormKeys<T extends FormConfig> =
  | keyof T
  | {
      [K in keyof T]: T[K] extends { type: "object"; properties: infer P }
        ? `${K & string}.${keyof P & string}`
        : never;
    }[keyof T];

/**
 * Flatten a nested ZodObject into "a.b.c"-style keys
 *
 * this is like FormKeys, but for ZodObjects
 *
 * useful for getting the keys of the form components
 *
 * @example Record<FlattenZodKeys<ZodObject<ExtractZodSchemas<T>>>, React.ReactNode>
 */
// export type FlattenZodKeys<T, Prefix extends string = ""> = T extends ZodObject<infer Shape extends ZodRawShape>
//   ? {
//       [K in keyof Shape]: Shape[K] extends ZodObject<any>
//         ? FlattenZodKeys<Shape[K], `${Prefix}${Extract<K, string>}.`>
//         : `${Prefix}${Extract<K, string>}`;
//     }[keyof Shape]
//   : never;

/**
 * Custom components for the form.
 *
 * This is a partial record of the form components that can be overridden.
 *
 * The key is the type of the field, and the value is a function that takes the field and the option and returns a React node.
 *
 * The field is the field that is being rendered, and the option is the option that is being rendered.
 */
export type CustomComponents = Partial<
  Record<
    "text" | "textarea" | "switch" | "checkboxGroup",
    (field: ControllerRenderProps<any, any>, option?: string) => React.ReactNode
  >
>;

/**
 * Extract the Zod schemas from the form config.
 *
 * This is a recursive type that extracts the Zod schemas from the form config.
 *
 * It's used to get the Zod schemas from the form config so that we can use them to create the form components.
 */
// export type ExtractZodSchemas<T> = {
//   [K in keyof T]: "properties" extends keyof T[K]
//     ? T[K]["properties"] extends object
//       ? ZodObject<ExtractZodSchemas<T[K]["properties"]>>
//       : never
//     : "schema" extends keyof T[K]
//     ? T[K]["schema"] extends ZodType
//       ? T[K]["schema"]
//       : never
//     : never;
// };
export type ExtractZodSchemas<T> = {
  [K in keyof T]: T[K] extends { properties: infer P }
    ? P extends object
      ? ZodObject<ExtractZodSchemas<P>>
      : never
    : T[K] extends { schema: infer S }
      ? S extends ZodType
        ? S
        : never
      : never;
};
