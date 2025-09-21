import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

//make a small memory store for attempts and lockout?

export default async function handler(req: NextRequest, res: NextResponse) {
  console.log("Check for user");
  try {
    const { pin } = await req.json();
    const existingUser = await fetch(`/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pin: pin }),
    });
    // Parse
    console.log(existingUser);

    if (typeof pin !== "string")
      return NextResponse.json({ message: "Bad request" }, { status: 400 });

    if (existingUser) {
      return NextResponse.json({ data: existingUser }, { status: 200 });
    }
  } catch (err) {
    console.error(err);
  }
}
