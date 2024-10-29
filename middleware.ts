import { recordView } from "@lib/tinybird";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/",
    "/cari-mp",
    "/hansard/:path*",
    "/katalog/:path*",
    "/kehadiran/:path*",
    "/sejarah/:path*",
  ],
};

export async function middleware(request: NextRequest, ev: NextFetchEvent) {
  // Bug: Middleware interferes with getServerSideProps, by returning empty pageProps [https://github.com/vercel/next.js/issues/47516]
  // Fixed by removing the 'x-middleware-prefetch' header
  const headers = new Headers(request.headers);
  const purpose = headers.get("purpose");
  if (purpose && purpose.match(/prefetch/i))
    headers.delete("x-middleware-prefetch"); // empty json bugfix (in the browser headers still show, but here it is gone)

  // Development
  if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
    return NextResponse.next({ request: { headers } });
  }

  ev.waitUntil(recordView(request)); // TODO Prod

  // Production
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    return NextResponse.next({ request: { headers } });
  }

  // Staging
  const basicAuth = request.headers.get("authorization");
  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, password] = atob(authValue).split(":");
    if (user === "admin" && password === process.env.AUTH_TOKEN) {
      return NextResponse.next({ request: { headers } });
    }
  }
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="Secure Area"` },
  });
}
