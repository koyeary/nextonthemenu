/* import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth-server";

import prisma from "@/lib/db/connection";

export async function GET(req: NextRequest) {
  const session = getSession(req);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user: session });
}

export const runtime = "nodejs"; // for bcrypt

export async function PATCH(req: Request) {
  const { userId, pin } = await req.json();

  const user = await prisma.user.upsert({
    where: { id: userId }, // <-- STABLE UNIQUE FIELD
    update: { pin: pin },
    create: {
      id: userId,
      pin: pin,
      name: "Default User",
      role: "user",
    },
  });

  return NextResponse.json({ user });
}
 */
