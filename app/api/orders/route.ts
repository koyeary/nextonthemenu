import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

/* // app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

// GET handler to fetch all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        due: "asc",
      },
    });
    if (!orders) {
      return NextResponse.json({ message: "No orders found" }, { status: 404 });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST() {
  const webhookEvent = await fetch("/api/webhooks/square", {
    headers: { "Content-type": "application/json", method: "POST" },
  });

  return NextResponse.json(webhookEvent, { status: 200 }); */
