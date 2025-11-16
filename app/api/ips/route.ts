import { NextResponse } from "next/server";
import prisma from "@/lib/db/connection";

// ✅ GET: Fetch all IPs
export async function GET() {
  try {
    const ips = await prisma.ip.findMany({});

    // Always return an array — consistent with client expectations
    return NextResponse.json(
      ips.length ? ips : [{ address: "", station: "" }],
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching IPs:", err);
    return NextResponse.json({ error: "Failed to fetch IPs" }, { status: 500 });
  }
}

// ✅ POST: Upsert IP list
export async function POST(req: Request) {
  console.log(req);
  try {
    const data = await req.json();
    console.log(data);
    if (!Array.isArray(data))
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    // Upsert each IP entry
    const upsertedIPs = await Promise.all(
      data.map(async (item) => {
        //   console.log(address, station);

        const address = item.address?.trim().toLowerCase();
        const station = item.station?.trim().toLowerCase();

        if (!address || !station) return null;

        return prisma.ip.upsert({
          where: { address },
          update: { address, station },
          create: { address, station },
        });
      })
    );
    console.log(upsertedIPs);

    return NextResponse.json(upsertedIPs.filter(Boolean), { status: 200 });
  } catch (err) {
    console.error("Error saving IPs:", err);
    return NextResponse.json({ error: "Failed to save IPs" }, { status: 500 });
  }
}

// ✅ DELETE: Optional cleanup route
export async function DELETE(req: Request) {
  try {
    const { address } = await req.json().catch(() => ({}));

    if (address) {
      const deleted = await prisma.ip.delete({
        where: { address: address.toLowerCase().trim() },
      });
      return NextResponse.json({ message: "IP deleted", deleted });
    }

    await prisma.ip.deleteMany();
    return NextResponse.json({ message: "All IPs deleted" });
  } catch (err) {
    console.error("Error deleting IPs:", err);
    return NextResponse.json(
      { error: "Failed to delete IP(s)" },
      { status: 500 }
    );
  }
}
