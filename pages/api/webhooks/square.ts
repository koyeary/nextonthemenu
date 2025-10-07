import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db/connection";

export const config = { api: { bodyParser: false } };

/* // ----------------------------
// Helper: Build printer request XML
// ----------------------------
function buildPrinterRequest(text: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <traderSuccess>true</traderSuccess>
  <traderStatus></traderStatus>
  <printText>${text}</printText>
</response>`;
}

// ----------------------------
// Helper: Trigger printer
// ----------------------------
// ----------------------------
// Helper: Trigger printer (with full logging)
// ----------------------------
async function triggerPrinter(text: string) {
  const requestXml = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <traderSuccess>true</traderSuccess>
  <traderStatus></traderStatus>
  <printText>${text}</printText>
</response>`;

  const printerUrl = "http://127.0.0.1:8001/StarWebPRNT/SendMessage"; // force localhost IP

  try {
    console.log("📤 Sending print request to:", printerUrl);
    console.log("📄 Request body:", requestXml);

    const response = await fetch(printerUrl, {
      method: "POST",
      headers: { "Content-Type": "text/xml; charset=utf-8" },
      body: requestXml,
    });

    console.log("📥 Response status:", response.status);
    const responseText = await response.text();
    console.log("📄 Response text:", responseText);

    if (!response.ok) {
      console.error(
        "❌ Printer returned error:",
        response.status,
        response.statusText
      );
      throw new Error(`Printer error: ${response.status}`);
    }

    console.log("✅ Print job sent successfully");
    return responseText;
  } catch (err) {
    console.error("❌ Printer trigger failed:", err);
    throw err; // propagate so webhook handler can handle/log
  }
} */

// ----------------------------
// Webhook Handler
// ----------------------------
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = JSON.parse(rawBody);
    if (typeof body === "string") body = JSON.parse(body);
  } catch (err) {
    console.error(err);
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
    /* 
    const textToPrint = `Order #${orderId}\nStatus: ${status}\nItems:\n${
      body.order?.line_items
        ?.map((item: any) => `- ${item.name} x ${item.quantity}`)
        .join("\n") || ""
    }`;

    try {
      await triggerPrinter(textToPrint); // await is critical
    } catch (err) {
      console.error("Printer failed for order:", orderId);
    } */
  }

  return res.status(200).json({ ok: true });
}
