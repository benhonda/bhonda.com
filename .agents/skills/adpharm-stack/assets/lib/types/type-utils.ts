import { z } from "zod";

/**
 * Makes all keys nullable
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

/**
 * Recursively make all object properties nullable
 */
export type DeepNullable<T> = {
  [K in keyof T]: T[K] extends object ? DeepNullable<T[K]> | null : T[K] | null;
};

/**
 * Makes all keys required (non-optional and non-nullable)
 */
export type NonNullableRequired<T> = {
  [K in keyof Required<T>]: NonNullable<T[K]>;
};

/**
 * Makes all keys optional
 */
export type Optional<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Simulates the `satisfies` keyword in TypeScript
 */
export type Satisfies<U, T extends U> = T;

/**
 * Useful for when you want to expand a type for intellisense purposes
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * A union type that can be used in generics
 */
type Union<A, B> = A | B;

/**
 * Helps create Type-safe Zod schemas, though it's not perfect
 */
export type PartialZodObject<T, K extends Union<string, string> = ""> = Partial<Record<keyof T | K, z.ZodTypeAny>>;

/**
 * Usage: Object.entries(obj) as Entries<typeof obj>
 */
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * Usage: [...].filter(nonNullable)
 */
export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

/**
 * Usage: typedFromEntries([["key", "value"]])
 */
export function typedFromEntries<K extends string | number | symbol, V>(entries: [K, V][]): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}

/**
 * Usage: typedEntries(obj)
 */
export function typedEntries<T extends object>(obj: T): { [K in keyof T]: [K, T[K]] }[keyof T][] {
  return Object.entries(obj) as any;
}

/**
 * Usage: get(obj, "path.to.key")
 */
export function get<T, P extends string>(obj: T, path: P): any {
  return path.split(".").reduce((o, key) => {
    // @ts-expect-error key mismatch
    return o?.[key];
  }, obj);
}

/**
 * Usage: typedFilter(arr, (item) => item.id === 1)
 */
export function typedFilter<T>(arr: T[] | readonly T[], predicate: (value: T) => boolean): T[] {
  return arr.filter(predicate) as T[];
}
