import { OptionType } from "@lib/types";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useData } from "./useData";
import { useWatch } from "./useWatch";

/**
 * Filter hook. Contains logic for backend-driven query / filtering.
 * @param state Filter queries
 * @param params Required for URL with dynamic params.
 * @returns filter, setFilter, queries, actives
 */
export const useFilter = (
  state: Record<string, any> = {},
  params = {},
) => {
  const { data, setData } = useData(state);
  const router = useRouter();

  const actives: Array<[string, unknown]> = useMemo(
    () =>
      Object.entries(data).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          (value as Array<any>).length !== 0 &&
          value !== ""
      ),
    [data]
  );

  const queries: string = useMemo<string>(() => {
    const query = actives
      .map(([key, value]) => {
        if (!value) return "";
        if (Array.isArray(value))
          return `${key}=${value.map((item: OptionType) => item.value).join(",")}`;
        else return `${key}=${(value as OptionType).value ?? value}`;
      })
      .join("&");
    return `?${query}`;
  }, [actives]);

  const search: Function = useCallback(
    debounce(actives => {
      const query = actives.map(([key, value]: [string, unknown]) => [
        key,
        Array.isArray(value)
          ? value.map((item: OptionType) => item.value).join(",")
          : typeof value === "string"
          ? value
          : (value as OptionType).value,
      ]);

      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...params,
            ...Object.fromEntries(query),
          },
        },
        undefined,
        { scroll: false }
      );
    }, 500),
    []
  );

  useWatch(() => {
    search(actives);
  }, [data]);

  return {
    filter: data,
    setFilter: setData,
    queries,
    actives,
  };
};
