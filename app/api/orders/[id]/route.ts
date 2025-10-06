import { NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

// PATCH /api/orders/:id
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body;

    const updated = await prisma.order.update({
      where: { orderId: params.id },
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
