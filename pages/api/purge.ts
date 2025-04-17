import Cloudflare from "cloudflare";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new Cloudflare();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.headers.authorization !== `Bearer ${process.env.REVALIDATE_TOKEN}`) {
    return res.status(401).json({ message: "Invalid bearer token" });
  }

  if (req.method === "POST") {
    const app_url = process.env.CLOUDFLARE_APP_URL;
    if (!app_url) throw new Error("Missing env variable `CLOUDFLARE_APP_URL`");
    const en = app_url + "/en-GB";

    const zone_id = process.env.CLOUDFLARE_ZONE_ID;
    if (!zone_id) throw new Error("Missing env variable `CLOUDFLARE_ZONE_ID`");

    const { route }: { route: string } = req.body;
    if (!route) throw new Error("Route(s) missing");

    const paths: string[] = route.split(",");

    try {
      let prefixes: string[] = [];

      paths.map(path => {
        prefixes.push(...[app_url.concat(path), en.concat(path)]);
      });

      const result = await client.cache.purge({
        zone_id,
        prefixes,
      });

      return res.status(200).json({ message: "Purge successful. " + result });
    } catch (error) {
      return res.status(500).json({ error: "Failed to purge cache. " + error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
