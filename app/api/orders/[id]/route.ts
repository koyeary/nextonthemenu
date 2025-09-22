import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
    });
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    } else {
      return NextResponse.json(order, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  const id = req.url.split("/").pop();
  const { status } = await req.json();
  console.log("PUT request received for ID:", id);
  console.log(id);
  console.log(status);

  try {
    if (!id || !status) {
      return NextResponse.json(
        { message: "ID and status are required" },
        { status: 400 }
      );
    }
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}
