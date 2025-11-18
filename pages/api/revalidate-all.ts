import type { NextApiRequest, NextApiResponse } from "next";
import { revalidatePath, revalidateTag } from "next/cache";

type ResponseData = {
  message: string;
  success: boolean;
  revalidatedPaths?: string[];
  revalidatedTags?: string[];
};

const STATIC_PATHS = [
  "/",
  "/cari",
  "/cari-mp",
  "/katalog/dewan-rakyat",
  "/katalog/dewan-negara",
  "/katalog/kamar-khas",
];

const HANSARD_BASE = [
  "/hansard/dewan-rakyat",
  "/hansard/dewan-negara",
  "/hansard/kamar-khas",
];

const TAGS = ["hansard-data", "katalog-data", "kehadiran", "search-data"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.headers.authorization !== `Bearer ${process.env.REVALIDATE_TOKEN}`) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Only POST allowed", success: false });
  }

  try {
    const { mode, routes, tags } = req.body ?? {};
    let revalidatedPaths: string[] = [];
    let revalidatedTags: string[] = [];

    // MODE ALL
    if (mode === "all") {
      for (const p of STATIC_PATHS) {
        revalidatePath(p);
        revalidatedPaths.push(p);
      }
      for (const t of TAGS) {
        revalidateTag(t);
        revalidatedTags.push(t);
      }

      return res.json({
        message: "All data revalidated",
        success: true,
        revalidatedPaths,
        revalidatedTags,
      });
    }

    // MODE CUSTOM ROUTES
    if (routes) {
      const parsed = Array.isArray(routes) ? routes : [routes];
      for (const r of parsed) {
        if (
          STATIC_PATHS.includes(r) ||
          HANSARD_BASE.some(base => r.startsWith(base))
        ) {
          revalidatePath(r);
          revalidatedPaths.push(r);
        }
      }
    }

    // MODE TAGS
    if (tags) {
      const parsed = Array.isArray(tags) ? tags : [tags];
      for (const t of parsed) {
        if (TAGS.includes(t)) {
          revalidateTag(t);
          revalidatedTags.push(t);
        }
      }
    }

    return res.json({
      message: "Revalidation completed",
      success: true,
      revalidatedPaths,
      revalidatedTags,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "Revalidation failed: " + (err.message || String(err)),
      success: false,
    });
  }
}
