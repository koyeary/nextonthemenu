// app/api/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const authUser = await cookies().get("auth_user")?.value;

  if (!authUser) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user: JSON.parse(authUser) });
}
