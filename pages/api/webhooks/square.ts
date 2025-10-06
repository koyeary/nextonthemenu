import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db/connection";

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const rawBody = Buffer.concat(chunks).toString("utf-8");

  let body: any;
  try {
    body = JSON.parse(rawBody);
    if (typeof body === "string") body = JSON.parse(body);
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON", raw: rawBody });
  }

  const orderId = body?.order?.id;
  const status = body?.order?.state ?? "UNKNOWN";

  if (orderId) {
    await prisma.order.upsert({
      where: { orderId },
      update: { status, payload: body },
      create: { orderId, status, payload: body },
    });
  }

  return res.status(200).json({ ok: true });
}
