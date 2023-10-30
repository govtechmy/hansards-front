import { useContext } from "react";
import { AnalyticsContext } from "@lib/contexts/analytics";
import { track as mixpanel_track } from "@lib/mixpanel";

/**
 * For hansard catalogue only.
 */
export const useAnalytics = (hansard: string) => {
  const { result, realtime_track } = useContext(AnalyticsContext);

  const track = (ext: "pdf" | "csv") => {
    // const meta = {
    //   uid: hansard.concat(`_${ext}`),
    //   id: hansard,
    //   name: hansard,
    //   type: "file",
    //   ext,
    // };
    // mixpanel_track("file_download", meta);
    realtime_track("events_example", hansard, `download_${ext}`);
  };
  return { result, track };
};
