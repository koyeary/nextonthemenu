import { NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    if (!location) {
      return NextResponse.json(
        { error: "Missing location parameter" },
        { status: 400 }
      );
    }

    const ips = await prisma.ip.findMany({
      where: { locationCode: location },
      orderBy: { station: "asc" },
    });

    return NextResponse.json(ips);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Body must be an array" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      body.map((row) =>
        prisma.ip.upsert({
          where: {
            station_locationCode: {
              station: row.station.toLowerCase(),
              locationCode: row.locationCode,
            },
          },
          update: { address: row.address.trim() },
          create: {
            station: row.station.toLowerCase(),
            address: row.address.trim(),
            locationCode: row.locationCode,
          },
        })
      )
    );

    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
