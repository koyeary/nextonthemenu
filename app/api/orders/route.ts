import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db/connection";

export async function GET() {
  const orders = await prisma.order.findMany({});

  return NextResponse.json(orders);
}

export async function DELETE(request: NextRequest) {
  const { orderId } = await request.json();

  if (!orderId) {
    return NextResponse.json(
      { error: "Missing orderId in body" },
      { status: 400 }
    );
  }

  await prisma.order.delete({
    where: { orderId },
  });

  return NextResponse.json(
    { message: `Order ${orderId} deleted successfully` },
    { status: 200 }
  );
}
