import type { NextApiRequest, NextApiResponse } from "next";
import { get } from "@lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res
      .status(400)
      .json({ message: "Missing or invalid query parameter 'q'" });
  }

  try {
    // Forward the query to the backend autocomplete API
    const response = await get("/api/autocomplete", { q }, "api");
    // Return the backend's response directly
    return res.status(200).json(response.data);
  } catch (error: any) {
    // Handle error gracefully - return a special error flag instead of throwing 500
    // This prevents Vercel error popups and allows client-side redirect handling
    return res.status(200).json({
      error: true,
      errorType: "server_error",
      message: "Failed to fetch autocomplete suggestions",
      suggestions: [],
      query: q,
    });
  }
}
