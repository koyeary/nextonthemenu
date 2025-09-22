import { NextRequest, NextResponse } from "next/server";

//make a small memory store for attempts and lockout?

export default async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json();

    if (typeof pin !== "string")
      return NextResponse.json({ message: "Bad request" }, { status: 400 });

    const existingUser = await fetch(`/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pin: pin }),
    });
    // Parse
    console.log(existingUser);

    if (existingUser) {
      NextResponse.json({ data: existingUser }, { status: 200 });
    }
  } catch (err) {
    console.error(err);
  }
}
