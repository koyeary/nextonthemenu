import { NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

// Optional: basic IPv4 validation
const isValidIP = (ip: string) =>
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ip
  );

//
// GET — Return all station/IP mappings
//
export async function GET() {
  try {
    const ips = await prisma.ip.findMany({
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

//
// POST — Save full station→IP map (replaces individual CRUD)
// UI sends: [{ station: "cake", address: "192.168.1.50" }, ...]
//
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: "Expected an array of station entries." },
        { status: 400 }
      );
    }

    console.log("Received IP configuration:", body);
    // Normalize + validate incoming data
    const cleaned = body.map((entry) => {
      const station = entry.station.toLowerCase().trim();
      const address = entry.address.trim();

      if (!station) {
        throw new Error("Station name cannot be empty.");
      }

      // optional strict validation
      /*      if (!isValidIP(address)) {
        throw new Error(
          `Invalid IP address for station '${station}': ${address}`
        );
      } */

      return { station, address };
    });

    // Upsert each station so there's always ONE row per station
    const results = await Promise.all(
      cleaned.map(async ({ station, address }) => {
        return prisma.ip.upsert({
          where: { station }, // must be @unique in schema
          update: { address },
          create: { station, address },
        });
      })
    );

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("POST /api/ips error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
