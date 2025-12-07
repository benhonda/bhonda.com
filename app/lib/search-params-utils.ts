import { z } from "zod";
import { searchParamsSchema, type SearchParams } from "./search-params.defaults";

export function parseSearchParams(searchParams: URLSearchParams) {
  const entries: Record<string, string | string[]> = Object.fromEntries(searchParams.entries());

  // check if value for key is supposed to be an array, if so, parse it as an array
  Object.entries(entries).forEach(([key, value]) => {
    if (!Object.keys(searchParamsSchema.shape).includes(key)) {
      console.log("key", key, "not found in schema");
      return;
    }

    const shapeUnwrapped = searchParamsSchema.shape[key as keyof SearchParams].unwrap();

    // console.log("shapeUnwrapped", shapeUnwrapped);
    if (shapeUnwrapped instanceof z.ZodArray) {
      // parse the value from url encoded string to an array
      const nonUrlEncodedStr = decodeURIComponent(String(value));

      // if the value has commas, split it into an array
      const nonUrlEncodedValue = nonUrlEncodedStr.includes(",") ? nonUrlEncodedStr.split(",") : nonUrlEncodedStr;

      entries[key] = Array.isArray(nonUrlEncodedValue) ? nonUrlEncodedValue : [nonUrlEncodedValue];
    }

    // if (shapeUnwrapped instanceof z.ZodObject) {
    //   // parse the value from url encoded string to an object
    //   const nonUrlEncodedStr = decodeURIComponent(String(value));
    //   console.log("nonUrlEncodedStr", nonUrlEncodedStr);
    //   entries[key] = JSON.parse(nonUrlEncodedStr);
    // }
  });

  return searchParamsSchema.parse(entries);
}

export function stringifySearchParams(searchParams: SearchParams | null) {
  if (searchParams === null) {
    return new URLSearchParams().toString();
  }

  const entries = Object.fromEntries(Object.entries(searchParams).map(([key, value]) => [key, String(value)]));

  return new URLSearchParams(entries).toString();
}
