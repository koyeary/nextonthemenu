import { NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  console.log(orders);
  return NextResponse.json(orders);
}
