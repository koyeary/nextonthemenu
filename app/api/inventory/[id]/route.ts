import { NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("Fetching item with id:", id);

  try {
    const item = await prisma.item.findUnique({ where: { token: id } });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { quantity } = await req.json();

    const updatedItem = await prisma.item.update({
      where: { token: id },
      data: { quantity },
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
