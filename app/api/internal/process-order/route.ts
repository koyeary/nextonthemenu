import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json(); // already safe JSON from Pages Router
  console.log("Processing order in App Router:", body);
  console.log(body);

  // Example: update order table based on webhook

  return NextResponse.json({ ok: true, body });
}
