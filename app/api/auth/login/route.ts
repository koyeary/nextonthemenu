import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken } from "@/lib/auth/auth-server";
import prisma from "@/lib/db/connection";

export async function POST(req: Request) {
  const { pin } = await req.json();

  // 1. Fetch user from DB
  const user = await prisma.user.findFirst({ where: { pin } });
  console.log(user);
  console.log("user found?", !!user);
  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // 2. Verify password
  /*   const valid = await bcrypt.compare(pin, user.pin);
  console.log(valid);
  if (!valid)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // 3. Create a signed token (JWT or custom) */
  const token = await createSessionToken(user); /*  implement yourself */
  console.log(token);
  // 4. Send secure cookie
  cookies().set("session-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ success: true });
}

/* import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createSessionToken, verifySessionToken } from "@lib/auth/auth";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { pin } = await req.json();
  console.log(pin);

  if (!pin || typeof pin !== "string") {
    return NextResponse.json({ error: "PIN required" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { pin } });
  console.log(user);
  if (!user) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  await createSessionToken(user);
  return NextResponse.json({ user });

  cookies().set("auth_user", cookieData, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });

  return NextResponse.json({ user });
}

export async function DELETE() {
  await 
  return NextResponse.json({ success: true });
}
 */
