import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth/auth-server";

export const config = {
  matcher: ["/orders/:path*", "/inventory/:path*"],
  runtime: "nodejs",
};

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("session-token")?.value;
  const session = token ? verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
