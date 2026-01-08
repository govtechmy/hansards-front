import { appConfig } from "src/config/app.config";

/**
 * Download utilities for building internal proxy paths.
 * These helpers keep filename/prefix logic in one place.
 */
export const getHansardPrefix = (
  filename: string
): "dewanrakyat" | "kamarkhas" | "dewannegara" => {
  if (filename.startsWith("dr")) return "dewanrakyat";
  if (filename.startsWith("kk")) return "kamarkhas";
  return "dewannegara"; // default (DN)
};

/**
 * Build the internal application download path which proxies the real storage.
 * @example buildDownloadPath("dr_1959-09-11", "csv") => /downloads/dewanrakyat/dr_1959-09-11.csv
 */
export const buildDownloadPath = (
  filename: string,
  ext: "pdf" | "csv"
): string =>
  `${appConfig.downloadUrl}/${getHansardPrefix(filename)}/${filename}.${ext}`;

/**
 * Trigger a download using the internal proxy route. Falls back to window.open.
 * @param filename Base filename without extension (e.g. dr_1959-09-11)
 * @param ext File extension (pdf|csv)
 */
export const generateDownloadLink = (
  filename: string,
  ext: "pdf" | "csv"
): void => {
  const path = buildDownloadPath(filename, ext);
  window.open(path, "_blank");
};
