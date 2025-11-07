import { get, post } from "@lib/api";
import { ReactNode, createContext, useEffect, useState } from "react";

/**
 * Analytics
 * @returns {counts, post_events}
 */

type AnalyticsContextProps = {
  counts: Record<string, number>;
  post_events: (
    event: string,
    hansard_id: string,
    type?: "pdf" | "csv"
  ) => void;
};

export const AnalyticsContext = createContext<AnalyticsContextProps>({
  counts: {},
  post_events() {},
});

export function AnalyticsProvider({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  // get view count for id
  useEffect(() => {
    get("/api/count", { id }, "app")
      .then(({ data }) => setCounts(data))
      .catch(e => console.error(e));
  }, []);

  const post_events = (
    event: string,
    hansard_id: string,
    type?: "pdf" | "csv"
  ) => {
    post(
      `/api/count?event=${event}`,
      {
        timestamp: new Date().toISOString(),
        hansard_id,
        type,
      },
      "app",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TINYBIRD_API}`,
      }
    )
      .then(
        ({
          data,
        }: {
          data: { successful_rows: number; quarantined_rows: number };
        }) => {
          if (data.quarantined_rows > 0) console.error("Row quarantined");
          else
            get("/api/count", { id }, "app")
              .then(({ data }) => setCounts(data))
              .catch(e => console.error(e));
        }
      )
      .catch(e => console.error(e));
  };

  return (
    <AnalyticsContext.Provider value={{ counts, post_events }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
