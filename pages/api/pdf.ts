import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { buildDownloadPath } from "@lib/downloads";

export const config = { api: { responseLimit: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }
  const { filename } = req.query;
  if (
    typeof filename !== "string" ||
    !/^(?:dr|dn|kk)_\d{4}-\d{2}-\d{2}$/.test(filename)
  ) {
    return res.status(400).end("Invalid PDF filename");
  }
  try {
    const upstream = await axios.get(buildDownloadPath(filename, "pdf"), {
      responseType: "stream",
      timeout: 30000,
      headers: req.headers.range ? { Range: req.headers.range } : {},
    });
    res.status(upstream.status);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    for (const header of ["content-length", "content-range", "accept-ranges"]) {
      if (upstream.headers[header])
        res.setHeader(header, upstream.headers[header]);
    }
    upstream.data.on("error", () => res.destroy());
    res.on("close", () => upstream.data.destroy());
    upstream.data.pipe(res);
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;
    return res
      .status(status === 404 ? 404 : status === 416 ? 416 : 502)
      .end("Unable to load PDF");
  }
}
