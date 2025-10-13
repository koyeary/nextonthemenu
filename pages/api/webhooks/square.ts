import type { NextRequest, NextResponse } from "next";
import { SquareClient, SquareEnvironment } from "square";
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

const retrieveOrder = async (orderId) => {
  try {
    const client = new SquareClient({
      environment: SquareEnvironment.Sandbox,
      token: process.env.SQUARE_ACCESS_TOKEN,
    });
    const res = await client.orders.get({
      orderId: orderId,
    });

    const order = res.order;
    console.log(order);
    return order;
  } catch (err) {
    console.error(err);
  }
};
// ----------------------------
// Webhook Handler
// ----------------------------
export default async function handler(req: NextRequest, res: NextResponse) {
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

    //if (typeof body === "string") body = JSON.parse(body);

    const orderId = body.data.id;

    const order = await retrieveOrder(orderId);
    console.log(order.fulfillments[0].pickupDetails);
    if (order) {
      const orderData = {
        orderId: order.id,
        status: "pending",
        due: order.fulfillments[0].pickupDetails.pickupAt,
        location: order.locationId,
        item: order.lineItems[0].name,
        notes: order.lineItems[0].note,
        quantity: parseInt(order.lineItems[0].quantity),
        price: parseInt(order.lineItems[0].basePriceMoney.amount),
        customerName: order.fulfillments[0].pickupDetails.recipient.displayName,
        email: order.fulfillments[0].pickupDetails.recipient.emailAddress,
        phone: order.fulfillments[0].pickupDetails.recipient.phoneNumber,
      };
      await prisma.order.upsert({
        where: { orderId: order.id },
        update: orderData,
        create: orderData,
      });
    }

    console.log("prisma updated");
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Invalid JSON", raw: rawBody });
  }

  /*   console.log(body?.data?.object.order_fulfillment_updated?.location_id);
  const orderId = body?.data?.id;
  const status = "pending";
  const location = body?.data?.object.order_fulfillment_updated?.location_id; */
  /* 
  if (orderId) {
    await prisma.order.upsert({
      where: { orderId },
      update: { status, location, payload: body },
      create: { location, orderId, status, payload: body },
    });
    
    const textToPrint = `Order #${orderId}\nStatus: ${status}\nItems:\n${
      body.order?.line_items
        ?.map((item: any) => `- ${item.name} x ${item.quantity}`)
        .join("\n") || ""
    }`;

    try {
      await triggerPrinter(textToPrint); // await is critical
    } catch (err) {
      console.error("Printer failed for order:", orderId);
    } 
  }
 */
  return res.status(200).json({ ok: true });
}
