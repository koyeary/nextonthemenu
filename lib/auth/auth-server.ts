/* // lib/auth/auth-server.ts
import jwt from "jsonwebtoken";

const SECRET = process.env.SESSION_SECRET!;

export function getSession(req: Request | NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => c.trim().split("="))
  );

  const token = cookies["session-token"];
  if (!token) return null;

  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

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
 */
