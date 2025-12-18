import { get, post } from "@lib/api";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 5,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { GET_COUNTS, GET_TOKEN, POST_DL, POST_SHARE, POST_TOKEN } =
    process.env;
  if (!POST_TOKEN) {
    return res
      .status(400)
      .json({ message: "Tinybird POST_TOKEN was not configured" });
  }

  if (req.method === "POST") {
    const { event } = req.query;
    const name =
      event === "download" ? POST_DL : event === "share" ? POST_SHARE : "";
    return await post(
      `/events?name=${name}&wait=true`,
      req.body,
      "https://api.us-east.tinybird.co/v0/",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${POST_TOKEN}`,
      }
    )
      .then(({ data }) => res.status(200).json(data))
      .catch(error => res.status(500).json(error));
  } else if (req.method === "GET") {
    return await get(
      `/pipes/${GET_COUNTS}.json`,
      {
        hansard_id: req.query.id,
        token: GET_TOKEN,
      },
      "https://api.us-east.tinybird.co/v0/"
    )
      .then(
        ({ data }: { data: { data: { type: string; counts: number }[] } }) =>
          res.status(200).json(
            data.data.reduce(
              (acc, event) => {
                acc[event.type] = event.counts;
                return acc;
              },
              <{ [key: string]: number }>{}
            )
          )
      )
      .catch(() => res.status(500).json({ message: "GET request failed" }));
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
