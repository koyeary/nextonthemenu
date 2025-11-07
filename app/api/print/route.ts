import { NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

export async function GET() {
  const orders = await prisma.order.findMany({});

  orders.forEach(
    (order) => order.itemToken !== null && console.log(order.itemToken)
  );
  return NextResponse.json(orders);
}
