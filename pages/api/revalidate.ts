import { hansard_routes, katalog_routes } from "@lib/routes";
import { NextApiRequest, NextApiResponse } from "next";

type RevalidateData = {
  revalidated: string[];
  message?: string;
  error?: string;
};

/**
 * POST endpoint to revalidate pages from BE activity
 * @param req Request
 * @param res Response
 * @returns {RevalidateData} Result
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RevalidateData | string>
) {
  if (req.headers.authorization !== `Bearer ${process.env.REVALIDATE_TOKEN}`) {
    return res
      .status(401)
      .json({
        error: "Unauthorized",
        message: "Invalid bearer token",
        revalidated: [],
      });
  }

  try {
    const { route }: { route: string } = req.body;
    if (!route) throw new Error("Route(s) missing");

    const routes: string[] = route.split(",");

    await Promise.all(
      routes.map(async route =>
        validate(route)
          .then(valid_route => rebuild(res, valid_route))
          .catch(e => {
            throw new Error(e);
          })
      )
    );

    return res.json({
      message: "Revalidation successful",
      revalidated: routes,
    });
  } catch (err: any) {
    return res
      .status(400)
      .json({
        error: "Revalidation failed",
        message: err.message,
        revalidated: [],
      });
  }
}

function hasValidDate(dateString: string) {
  const regEx = /[12]{1}\d{3}-[01]\d{1}-[0123]\d{1}/;
  const match = dateString.match(regEx);
  if (!match) return false; // Invalid format
  const d = new Date(match[0]);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === match[0];
}

// Checks if route exists. Routes only valid for static pages
const validate = (route: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (katalog_routes.includes(route)) resolve(route);
    if (
      hansard_routes.some(
        h_route => route.startsWith(h_route) && hasValidDate(route)
      )
    )
      resolve(route);
    else
      reject(`Route does not exist or is not a static page. Route: ${route}`);
  });

// Rebuilds the relevant page(s).
const rebuild = async (res: NextApiResponse, route: string) =>
  new Promise(async (resolve, reject) => {
    await res
      .revalidate(route)
      .then(() => res.revalidate(`/en-GB${route}`).catch(e => reject(e)))
      .catch(e => reject(e));
    resolve(true);
  });
