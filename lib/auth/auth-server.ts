import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.SESSION_SECRET!;

export async function createSessionToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role, pin: user.pin },
    SECRET,
    { expiresIn: "7d" }
  );
}

export async function verifySessionToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export async function getSession() {
  const token = cookies().get("session-token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
