// nextonthemenu/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/orders", "/inventory"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("session-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // We could verify the token here too, but presence check is usually enough.
  return NextResponse.next();
}

export const config = {
  matcher: ["/orders/:path*", "/inventory/:path*"],
};
