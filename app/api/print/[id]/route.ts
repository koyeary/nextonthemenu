import { NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log("...updating");

  try {
    const body = await req.json();
    const { printedAt } = body;

    const p = await params;
    const updated = await prisma.order.update({
      where: { uid: p.id },
      data: { printedAt },
    });

    console.log(updated);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
