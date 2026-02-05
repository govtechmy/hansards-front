// pages/api/revalidate-all.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { hansard_routes, katalog_routes } from "@lib/routes";

interface RevalidateRequestBody {
  mode?: "all" | "multiple";
  routes?: string[];
}

interface FailedItem {
  path: string;
  error: string;
}

interface RevalidateResponse {
  message: string;
  success: boolean;
  revalidatedPaths?: string[];
  failed?: FailedItem[];
}

const ISR_PATHS: string[] = [...katalog_routes, ...hansard_routes];

const STATIC_PATHS: string[] = [
  "/",
  "/cari",
  "/cari-mp",
  "/kehadiran/dewan-rakyat",
  "/kehadiran/dewan-negara",
  ...ISR_PATHS,
];

function secureCompare(a: string, b: string): boolean {
  if (!a || !b) return false;

  const encoder = new TextEncoder();
  const aArr = encoder.encode(a);
  const bArr = encoder.encode(b);

  if (aArr.length !== bArr.length) {
    // Return false when lengths differ.
    return false;
  }

  // aArr and bArr are Uint8Array, acceptable to equal
  return crypto.timingSafeEqual(aArr, bArr);
}

function localeVariants(path: string): string[] {
  const variants: string[] = [path];
  // Add en-GB prefixed variant for i18n handling
  if (!path.startsWith("/en-GB")) {
    variants.push(`/en-GB${path}`);
  }
  return variants;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RevalidateResponse>
) {
  // Only POST allowed
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Only POST allowed", success: false });
  }

  // Ensure env token exists
  const token = process.env.REVALIDATE_TOKEN;
  if (!token || token.trim() === "") {
    console.error("REVALIDATE_TOKEN environment is not configured");
    return res
      .status(500)
      .json({ message: "Server misconfiguration", success: false });
  }

  // Auth header must be provided
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  const expectedToken = `Bearer ${token}`;
  if (!secureCompare(authHeader, expectedToken)) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  try {
    const body = (req.body || {}) as RevalidateRequestBody;
    const mode = body.mode;
    const routes = body.routes ?? [];

    // Disallow ambiguous requests that provide both mode:"all" and custom routes
    if (mode === "all" && Array.isArray(routes) && routes.length > 0) {
      return res.status(400).json({
        message: "Invalid request: cannot specify routes when mode='all'",
        success: false,
      });
    }

    const revalidatedPaths: string[] = [];
    const failed: FailedItem[] = [];

    // Revalidate a set of paths (handles locale variants and parallel execution)
    async function revalidateMany(paths: string[]): Promise<void> {
      // flatten to include locale variants
      const expanded: string[] = paths.flatMap(p => localeVariants(p));

      const results = await Promise.allSettled(
        expanded.map(async p => {
          // res.revalidate can throw for non-ISR pages; leave caller to handle results
          await res.revalidate(p);
          return p;
        })
      );

      results.forEach((r, i) => {
        const path = expanded[i];
        if (r.status === "fulfilled") {
          revalidatedPaths.push(path);
        } else {
          const err = r.reason;
          const msg = err instanceof Error ? err.message : String(err);
          console.error(`Failed to revalidate ${path}:`, JSON.stringify(err));
          failed.push({ path, error: msg });
        }
      });
    }

    // MODE: all -> revalidate STATIC_PATHS
    if (mode === "all") {
      await revalidateMany(STATIC_PATHS);
      const message =
        failed.length > 0
          ? `Revalidated ${revalidatedPaths.length} paths, ${failed.length} failed`
          : "All pages revalidated successfully";
      return res.status(200).json({
        message,
        success: failed.length === 0,
        revalidatedPaths,
        ...(failed.length > 0 ? { failed } : undefined),
      });
    }

    // MODE: multiple or default custom routes behavior
    if (Array.isArray(routes) && routes.length > 0) {
      // Validate custom routes: accept if in STATIC_PATHS OR matches a HANSARD_BASE prefix OR in ISR_PATHS
      const allowedRoutes: string[] = [];
      const invalidRoutes: string[] = [];

      for (const r of routes) {
        if (
          STATIC_PATHS.includes(r) ||
          ISR_PATHS.includes(r) ||
          hansard_routes.some(base => r.startsWith(base))
        ) {
          allowedRoutes.push(r);
        } else {
          // route is not recognized — skip and report
          invalidRoutes.push(r);
          console.warn(`Skipping invalid route: ${r}`);
        }
      }

      if (allowedRoutes.length === 0) {
        return res.status(400).json({
          message:
            "No valid routes provided. Ensure routes are full paths and present in STATIC_PATHS or match HANSARD_BASE.",
          success: false,
        });
      }

      await revalidateMany(allowedRoutes);

      // include invalid routes in response if any
      const message =
        failed.length > 0
          ? `Revalidated ${revalidatedPaths.length} paths, ${failed.length} failed`
          : "Selected pages revalidated successfully";

      const responsePayload: RevalidateResponse & { invalidRoutes?: string[] } =
        {
          message,
          success: failed.length === 0,
          revalidatedPaths,
        };

      if (failed.length > 0) responsePayload.failed = failed;
      if (invalidRoutes.length > 0)
        responsePayload.invalidRoutes = invalidRoutes;

      return res.status(200).json(responsePayload);
    }

    // No mode and no routes
    return res.status(400).json({
      message: "No valid mode or routes provided",
      success: false,
    });
  } catch (err) {
    console.error("Revalidation failed:", JSON.stringify(err));
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Revalidation failed",
      success: false,
    });
  }
}
