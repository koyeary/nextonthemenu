import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

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

  const cookieData = JSON.stringify({
    id: user.id,
    name: user.name,
    role: user.role,
  });

  cookies().set("auth_user", cookieData, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });

  return NextResponse.json({ user });
}

export async function DELETE() {
  cookies().delete("auth_user");
  return NextResponse.json({ success: true });
}
