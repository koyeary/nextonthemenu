import prisma from "@/lib/db/connection";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const ips = await prisma.ip.findMany({
      where: { locationCode: id },
      orderBy: { station: "asc" },
    });

    return NextResponse.json(ips);
  } catch (error) {
    // throw new Error("GET /api/ips error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
