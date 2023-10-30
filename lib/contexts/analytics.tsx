import { get, post } from "@lib/api";
import { MetaPage } from "@lib/types";
import {
  FunctionComponent,
  ReactNode,
  createContext,
  useEffect,
  useState,
} from "react";

/**
 * Realtime view count for dashboard & data-catalogue.
 * @param {MetaPage['meta']} meta
 * @returns {{analytics: }} cache
 */

/**
 * id (required):
 * type: "dashboard" | "data-catalogue"
 * metric: "download_pdf" | "download_csv" | "share" | "view"
 */
export type MetricType = "download_pdf" | "download_csv" | "share" | "view";

export type Meta = Omit<MetaPage["meta"], "type"> & {
  type: "dashboard" | "data-catalogue";
};

type AnalyticsResult<T extends "dashboard" | "data-catalogue"> = {
  id: string;
  type: T;
  view_count: number;
  download_csv: T extends "dashboard" ? never : number;
  download_pdf: T extends "dashboard" ? never : number;
};

type AnalyticsContextProps<T extends "dashboard" | "data-catalogue"> = {
  result?: any; // Partial<AnalyticsResult<T>>;
  realtime_track: (name: string, id: string, metric: MetricType) => void;
};

interface ContextChildren {
  meta: Meta;
  children: ReactNode;
}

export const AnalyticsContext = createContext<
  AnalyticsContextProps<"dashboard" | "data-catalogue">
>({
  result: {},
  realtime_track() {},
});

export const AnalyticsProvider: FunctionComponent<ContextChildren> = ({
  meta,
  children,
}) => {
  const [data, setData] = useState<any | undefined>(); // Array<{type: MetricType, view_count?: number}>

  // auto-increment view count for id
  useEffect(() => {
    track("events_example", meta.id, "view");
  }, []);

  // increment activity count
  const track = (name: string, id: string, metricType: MetricType) => {
    post(
      `/events?name=${name}`,
      { timestamp: new Date().toISOString(), hansard_id: id, type: metricType },
      "tinybird",
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TINYBIRD_AUTH.concat(
          process.env.NEXT_PUBLIC_POST_COUNTS
        )}`,
      }
    )
      .then(() =>
        get(
          "/pipes/get_counts.json",
          {
            hansard_id: id,
            token: process.env.NEXT_PUBLIC_TINYBIRD_AUTH.concat(
              process.env.NEXT_PUBLIC_GET_COUNTS
            ),
          },
          "tinybird"
        )
          .then((response) => {
            console.log(response.data);
            setData(response.data)})
          .catch((e) => console.error(e))
      )
      .catch((e) => console.error(e));
  };

  return (
    <AnalyticsContext.Provider value={{ result: data, realtime_track: track }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
