import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db/connection";

export async function GET() {
  const orders = await prisma.order.findMany({});

  /* const tokens = orders.map((order) => order.itemToken);

  await prisma.item.findMany({ tokens }) */
  //console.log(orders);
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
    { status: 200 }
  );
}
