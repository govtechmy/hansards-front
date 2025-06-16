export const DOWNLOAD_URL = process.env.NEXT_PUBLIC_DOWNLOAD_URL || "";
if (typeof window !== "undefined" && !DOWNLOAD_URL) {
  console.warn("Warning: Download URL is not set. Downloads may not work.");
}
