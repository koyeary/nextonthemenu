// nextonthemenu/lib/auth/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.SESSION_SECRET!;
if (!SECRET) {
  throw new Error("SESSION_SECRET env var is required");
}

type SessionPayload = {
  id: string;
  name: string;
  role: string;
};

export async function createSession(user: SessionPayload) {
  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    SECRET,
    { expiresIn: "7d" }
  );

  cookies().set("session-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export function getSession(): SessionPayload | null {
  const token = cookies().get("session-token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export function clearSession() {
  cookies().set("session-token", "", {
    maxAge: 0,
    httpOnly: true,
    path: "/",
  });
}
