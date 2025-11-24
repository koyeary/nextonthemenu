// nextonthemenu/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/connection";
import { createSession } from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json();

    if (!pin) {
      return NextResponse.json({ error: "PIN is required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { pin } });

    if (!user) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    await createSession({
      id: user.id,
      name: user.name ?? "User",
      role: user.role ?? "user",
    });

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
