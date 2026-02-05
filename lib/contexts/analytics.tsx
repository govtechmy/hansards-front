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
      .catch(e =>
        console.error("Error fetching analytics counts:", JSON.stringify(e))
      );
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
        Authorization: `Bearer ${process.env.POST_TOKEN}`,
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
              .catch(e =>
                console.error(
                  "Error fetching analytics counts:",
                  JSON.stringify(e)
                )
              );
        }
      )
      .catch(e =>
        console.error("Error posting analytics event:", JSON.stringify(e))
      );
  };

  return (
    <AnalyticsContext.Provider value={{ counts, post_events }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
