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

// type AnalyticsResult<T extends "dashboard" | "data-catalogue"> = {
//   id: string;
//   type: T;
//   view_count: number;
//   download_csv: T extends "dashboard" ? never : number;
//   download_pdf: T extends "dashboard" ? never : number;
// };

type Count = {
  type: "downloads" | "shares" | "views";
  counts: number;
}

type AnalyticsResult = {
  data: Array<Count | never>;
};

type AnalyticsContextProps<T extends "dashboard" | "data-catalogue"> = {
  result: AnalyticsResult; // Partial<AnalyticsResult<T>>;
  realtime_track: (name: string, id: string, fileType?: "pdf" | "csv") => void;
};

interface ContextChildren {
  meta: Meta;
  children: ReactNode;
}

export const AnalyticsContext = createContext<
  AnalyticsContextProps<"dashboard" | "data-catalogue">
>({
  result: {data: []},
  realtime_track() {},
});

export const AnalyticsProvider: FunctionComponent<ContextChildren> = ({
  meta,
  children,
}) => {
  const [data, setData] = useState<any | undefined>(); // Array<{type: MetricType, view_count?: number}>

  // auto-increment view count for id
  useEffect(() => {
    track(process.env.NEXT_PUBLIC_POST_VIEW, meta.id);
  }, []);

  // increment activity count
  const track = (name: string, hansard_id: string, type?: "pdf" | "csv") => {
    post(
      `/events?name=${name}`,
      { timestamp: new Date().toISOString(), hansard_id, type },
      "tinybird",
      {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TINYBIRD_AUTH.concat(
          process.env.NEXT_PUBLIC_POST_TOKEN
        )}`,
      }
    )
      .then(() =>
        get(
          `/pipes/${process.env.NEXT_PUBLIC_GET_COUNTS}.json`,
          {
            hansard_id,
            token: process.env.NEXT_PUBLIC_TINYBIRD_AUTH.concat(
              process.env.NEXT_PUBLIC_GET_TOKEN
            ),
          },
          "tinybird"
        )
          .then((response) => {
            console.log(response.data);
            setData(response.data);
          })
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
