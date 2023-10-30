import { NextRequest, NextResponse } from "next/server";

// Triggers on relevant pages. Authentication to be removed at launch
export const config = {
  matcher: ["/:path*"],
};

export async function middleware(request: NextRequest) {
  let response: NextResponse;
  // Bug: Middleware interferes with getServerSideProps, by returning empty pageProps [https://github.com/vercel/next.js/issues/47516]
  // Fixed by removing the 'x-middleware-prefetch' header
  const headers = new Headers(request.headers);
  const purpose = headers.get("purpose");
  if (purpose && purpose.match(/prefetch/i)) headers.delete("x-middleware-prefetch"); // empty json bugfix (in the browser headers still show, but here it is gone)

  // Request authenticated
  if (["development", "staging"].includes(process.env.NEXT_PUBLIC_APP_ENV)) {
  response = NextResponse.next({ request: { headers } });
  return response;
}

  // const basicAuth = request.headers.get("authorization");
  // if (basicAuth) {
  //   const authValue = basicAuth.split(" ")[1];
  //   const [user, password] = atob(authValue).split(":");
  //   if (user === "admin" && password === process.env.AUTH_TOKEN) {
  //     response = NextResponse.next({ request: { headers } });
  //     return response;
  //   }
  // }
  // return new NextResponse("Auth required", {
  //   status: 401,
  //   headers: { "WWW-Authenticate": `Basic realm="Secure Area"` },
  // });
}
