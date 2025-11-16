import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtEdge } from "./lib/auth/auth-edge";

export async function middleware(req: NextRequest) {
  console.log("middleware session-token:", req.cookies.get("session-token"));

  const token = await req.cookies.get("session-token")?.value;

  const session = token
    ? await verifyJwtEdge(token, process.env.SESSION_SECRET!)
    : null;

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/orders/:path*", "/inventory/:path"],
};

/*
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./lib/auth"; // your token validator

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session-token")?.value;

  // Public routes
  if (req.nextUrl.pathname.startsWith("/login")) {
    if (token && await verifySessionToken(token)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!token || !(await verifySessionToken(token))) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/orders/:path*"]
};
  */
