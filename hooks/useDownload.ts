import { useCallback } from "react";
import { generateDownloadLink } from "@lib/downloads";
import { useAnalytics } from "@hooks/useAnalytics";

/**
 * Simple download hook using the internal /downloads proxy route.
 * Assumes filename is the base identifier without extension (e.g. dr_2024-11-05).
 * No old-file CSV disabling logic per current requirement.
 */
export interface UseDownloadOptions {
  filename: string; // base filename without extension
  analyticsId: string; // hansard_id or similar analytics key
}

export interface UseDownloadApi {
  download: (ext: "pdf" | "csv") => void;
}

export const useDownload = ({
  filename,
  analyticsId,
}: UseDownloadOptions): UseDownloadApi => {
  const { download: trackDownload } = useAnalytics(analyticsId);

  const download = useCallback(
    (ext: "pdf" | "csv") => {
      if (!filename) return;
      generateDownloadLink(filename, ext);
      trackDownload(ext);
    },
    [filename, trackDownload]
  );

  return { download };
};
