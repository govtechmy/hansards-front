import { useContext } from "react";
import { AnalyticsContext } from "@lib/contexts/analytics";
import { track as mixpanel_track } from "@lib/mixpanel";

/**
 * For hansard catalogue only.
 */
export const useAnalytics = (hansard: string) => {
  const { counts, realtime_track } = useContext(AnalyticsContext);

  const download = (ext: "pdf" | "csv") => {
    // const meta = {
    //   uid: hansard.concat(`_${ext}`),
    //   id: hansard,
    //   name: hansard,
    //   type: "file",
    //   ext,
    // };
    // mixpanel_track("file_download", meta);
    realtime_track(process.env.NEXT_PUBLIC_POST_DL, hansard, ext);
  };

  const share = () => {
    realtime_track(process.env.NEXT_PUBLIC_POST_SHARE, hansard);
  };
  return { counts, download, share };
};
