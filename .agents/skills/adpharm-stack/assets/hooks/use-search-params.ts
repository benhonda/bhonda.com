import { useLocation, useSearchParams as useSearchParamsNative, type NavigateOptions } from "react-router";
import { useEffect, useState } from "react";
import { parseSearchParams, stringifySearchParams } from "~/lib/search-params-utils";
import { type SearchParams } from "~/lib/search-params.defaults";
import type { Nullable, Optional } from "~/lib/types/type-utils";

export function useSearchParams() {
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParamsNative();
  const [searchParamsObj, setSearchParamsObj] = useState<SearchParams | null>(null);

  useEffect(() => {
    setSearchParamsObj(parseSearchParams(new URLSearchParams(location.search)));
  }, [location.search]);

  //
  // update the search params object
  //
  function updateSearchParams(params: Optional<Nullable<SearchParams>>, options: NavigateOptions = {}) {
    // loop through the params and remove null values
    const updatedSearchParams = { ...(searchParamsObj ?? {}), ...(params ?? {}) };

    // loop through the params and remove null values
    const filteredParams = Object.fromEntries(
      Object.entries(updatedSearchParams).filter(([_, value]) => value !== null)
    );

    setSearchParamsObj(filteredParams);
    setSearchParams(stringifySearchParams(filteredParams), { preventScrollReset: true, ...options });
  }

  //
  // toggle a search param
  //
  function toggleSearchParam(key: keyof SearchParams, value: string, options: NavigateOptions = {}) {
    const currentValue = searchParamsObj?.[key];
    if (Array.isArray(currentValue)) {
      const newValues = currentValue.includes(value)
        ? currentValue.filter((v) => v !== value)
        : [...currentValue, value];

      updateSearchParams({ [key as string]: newValues }, options);
    } else {
      updateSearchParams({ [key]: value }, options);
    }
  }

  return { searchParams, searchParamsObj, updateSearchParams, toggleSearchParam };
}
