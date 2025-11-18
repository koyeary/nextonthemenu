export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const ips = await prisma.ip.findMany({
      where: { locationCode: id },
      orderBy: { station: "asc" },
    });

    return NextResponse.json(ips);
  } catch (error) {
    console.error("GET /api/ips error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
