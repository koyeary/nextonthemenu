import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken } from "@/lib/auth/auth-server";
import prisma from "@/lib/db/connection";

export async function POST(req: Request) {
  const { pin } = await req.json();

  const user = await prisma.user.findFirst({ where: { pin } });

  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = await createSessionToken(user);

  cookies().set("session-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  console.log("middleware session-token:", req.cookies.get("session-token"));

  return NextResponse.json({ success: true });
}
