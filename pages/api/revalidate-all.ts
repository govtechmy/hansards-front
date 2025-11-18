// pages/api/revalidate-all.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

// Define the expected request body
interface RevalidateRequestBody {
  mode?: "all" | "multiple";
  routes?: string[];
}

// Define the response type
interface RevalidateResponse {
  message: string;
  success: boolean;
  revalidatedPaths?: string[];
}

const HANSARD_BASE = [
  "/hansard/dewan-rakyat",
  "/hansard/dewan-negara",
  "/hansard/kamar-khas",
];
// List of ISR paths (full paths, including dynamic)
const ISR_PATHS: string[] = [
  "/katalog/dewan-rakyat",
  "/katalog/dewan-negara",
  "/katalog/kamar-khas",
  ...HANSARD_BASE,
];
const STATIC_PATHS = [
  "/",
  "/cari",
  "/cari-mp",
  "/kehadiran/dewan-rakyat",
  "/kehadiran/dewan-negara",
  ...ISR_PATHS,
];

// Constant-time token comparison using Uint8Array
function secureCompare(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aArr = encoder.encode(a);
  const bArr = encoder.encode(b);

  const len = Math.max(aArr.length, bArr.length);
  const paddedA = new Uint8Array(len);
  const paddedB = new Uint8Array(len);

  paddedA.set(aArr);
  paddedB.set(bArr);

  return crypto.timingSafeEqual(paddedA, paddedB);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RevalidateResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Only POST allowed", success: false });
  }

  const authHeader: string = req.headers.authorization || "";
  const expectedToken: string = `Bearer ${process.env.REVALIDATE_TOKEN || ""}`;

  if (!secureCompare(authHeader, expectedToken)) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  try {
    const { mode, routes }: RevalidateRequestBody = req.body || {};
    const revalidatedPaths: string[] = [];

    // MODE ALL
    if (mode === "all") {
      for (const path of STATIC_PATHS) {
        try {
          await res.revalidate(path);
          revalidatedPaths.push(path);
        } catch (err) {
          console.error(`Failed to revalidate ${path}:`, err);
        }
      }

      return res.json({
        message: "All pages revalidated successfully",
        success: true,
        revalidatedPaths,
      });
    }

    // MODE CUSTOM ROUTES -Revalidate specific routes (dynamic)
    if (routes && routes.length > 0) {
      for (const route of routes) {
        if (
          !ISR_PATHS.includes(route) &&
          !HANSARD_BASE.some(base => route.startsWith(base))
        ) {
          console.warn(`Skipping non-ISR route: ${route}`);
          continue;
        }
        try {
          await res.revalidate(route);
          revalidatedPaths.push(route);
        } catch (err) {
          console.error(`Failed to revalidate ${route}:`, err);
        }
      }

      return res.json({
        message: "Selected pages revalidated successfully",
        success: true,
        revalidatedPaths,
      });
    }

    return res.status(400).json({
      message: "No valid mode or routes provided",
      success: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Revalidation failed",
      success: false,
    });
  }
}
