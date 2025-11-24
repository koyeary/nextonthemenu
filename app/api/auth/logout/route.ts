// nextonthemenu/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/auth";

export async function POST() {
  clearSession();
  return NextResponse.json({ success: true });
}
