import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/_next") && !pathname.startsWith("/favicon")) {
    console.info("[plus-one][request]", {
      path: pathname,
      method: request.method,
      userAgent: request.headers.get("user-agent"),
      ts: new Date().toISOString(),
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
