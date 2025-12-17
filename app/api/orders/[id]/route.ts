import { NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body;

    const p = await params;
    const updated = await prisma.order.update({
      where: { uid: p.id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
