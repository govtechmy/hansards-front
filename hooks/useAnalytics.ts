import { useContext } from "react";
import { AnalyticsContext } from "@lib/contexts/analytics";

/**
 * For hansard catalogue only.
 */
export const useAnalytics = (hansard_id: string) => {
  const { counts, post_events } = useContext(AnalyticsContext);

  const download = (type: "pdf" | "csv") => {
    post_events("download", hansard_id, type);
  };

  const share = () => {
    post_events("share", hansard_id);
  };
  return { counts, download, share };
};
