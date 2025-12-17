import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, ...updateFields } = body;

    console.log(uid, updateFields);
    if (!uid) {
      return NextResponse.json(
        { error: "Order UID is required" },
        { status: 400 }
      );
    }

    const dataToUpdate: Record<string, any> = {};

    for (const key in updateFields) {
      const value = updateFields[key];

      if (value === null || value === undefined || value === "") {
        continue; // skip empty fields
      }

      if (key === "quantity") {
        dataToUpdate[key] = parseInt(value, 10);
      } else if (key === "due" || key === "createdAt") {
        dataToUpdate[key] = new Date(value);
      } else {
        dataToUpdate[key] = value;
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { uid },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);

    return NextResponse.json(
      {
        error: "Failed to update order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
