import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

export async function POST(req: NextRequest, res: NextResponse) {
  const { pin } = await req.json();
  console.log(pin);
  if (!pin) {
    return NextResponse.json({ message: "Pin is required" }, { status: 400 });
  }
  try {
    const user = await prisma.user.findUnique({ where: { pin: pin } });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
