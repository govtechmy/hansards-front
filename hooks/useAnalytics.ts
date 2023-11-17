import { useContext } from "react";
import { AnalyticsContext } from "@lib/contexts/analytics";

/**
 * For hansard catalogue only.
 */
export const useAnalytics = (hansard: string) => {
  const { counts, realtime_track } = useContext(AnalyticsContext);

  const download = (ext: "pdf" | "csv") => {
    realtime_track(process.env.NEXT_PUBLIC_POST_DL, hansard, ext);
  };

  const share = () => {
    realtime_track(process.env.NEXT_PUBLIC_POST_SHARE, hansard);
  };
  return { counts, download, share };
};
