// app/api/orders/route.ts
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
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  console.log("PUT request received");
  console.log(req.url);
  /* 
  if (!id || !status) {
    return NextResponse.json({ message: "ID and status are required" }, { status: 400 });
  }
  

try {
  const updatedOrder = await prisma.order.update({
    where: { id: Number(id), status:  }, return NextResponse.json(updatedOrder, { status: 200 })
  }); } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ message: "Failed to update order" }, { status: 500 });
  } */
}
