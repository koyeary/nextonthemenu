import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db/connection";

export async function GET() {
  const orders = await prisma.order.findMany({
    /*     orderBy: { createdAt: "desc" },
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    }, */
  });
  console.log(orders);
  if (!orders || orders === null || orders.length === 0) {
    return NextResponse.json(
      { success: false, error: "No orders found" },
      { status: 404 },
    );
  }

  return NextResponse.json(orders);
}

export async function DELETE(request: NextRequest) {
  const { uid } = await request.json();

  if (!uid) {
    return NextResponse.json({ error: "Missing uid in body" }, { status: 400 });
  }

  await prisma.order.delete({
    where: { uid },
  });

  return NextResponse.json(
    { message: `Order ${uid} deleted successfully` },
    { status: 200 },
  );
}
