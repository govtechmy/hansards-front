import { NextRequest, userAgent } from "next/server";
import { capitalize, getDomainWithoutWWW } from "./utils";

/**
 * Recording views with geo, ua, referer and timestamp data
 **/
export async function recordView(
  req: NextRequest,
) {
  const LOCALHOST_GEO_DATA = {
    city: "Localhost",
    region: "XO",
    country: "XO",
    latitude: "54.0827",
    longitude: "-121.85",
  };
  const geo = process.env.VERCEL === "1" ? req.geo : LOCALHOST_GEO_DATA;
  const ua = userAgent(req);
  const referer = req.headers.get("referer");

  return await fetch(
    `https://api.tinybird.co/v0/events?name=${process.env.POST_VIEW}&wait=true`,
    {
      method: "POST",
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        page_id: req.nextUrl.pathname,
        country: geo?.country || "Unknown",
        city: geo?.city || "Unknown",
        region: geo?.region || "Unknown",
        latitude: geo?.latitude || "Unknown",
        longitude: geo?.longitude || "Unknown",
        ua: ua.ua || "Unknown",
        browser: ua.browser.name || "Unknown",
        browser_version: ua.browser.version || "Unknown",
        engine: ua.engine.name || "Unknown",
        engine_version: ua.engine.version || "Unknown",
        os: ua.os.name || "Unknown",
        os_version: ua.os.version || "Unknown",
        device: ua.device.type ? capitalize(ua.device.type) : "Desktop",
        device_vendor: ua.device.vendor || "Unknown",
        device_model: ua.device.model || "Unknown",
        cpu_architecture: ua.cpu?.architecture || "Unknown",
        bot: ua.isBot,
        referer: referer ? getDomainWithoutWWW(referer) : "(direct)",
        referer_url: referer || "(direct)",
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TINYBIRD_API}${process.env.POST_TOKEN}`,
      },
    },
  )
    .then((res) => res.json());
}
