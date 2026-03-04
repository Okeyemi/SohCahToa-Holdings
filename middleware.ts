import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  const isDashboardRoute =
    request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1] || "{}")
      );

      const isExpired = payload.exp < Date.now();

      if (isExpired) {
        return NextResponse.redirect(
          new URL("/login", request.url)
        );
      }
    } catch {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};