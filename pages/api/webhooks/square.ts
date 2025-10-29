import type { NextRequest, NextResponse } from "next";
import { SquareClient, SquareEnvironment } from "square";
import prisma from "@/lib/db/connection";

export const config = { api: { bodyParser: false } };

const retrieveOrder = async (orderId) => {
  try {
    const client = new SquareClient({
      environment: SquareEnvironment.Production,
      token: process.env.PROD_SQ_ACCESS_TOKEN, //process.env.SQUARE_ACCESS_TOKEN,
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

  try {
    const body = JSON.parse(rawBody);

    const orderId = body.data.id;

    const order = await retrieveOrder(orderId);
    console.log("Retrieved order from Square:");
    console.log(order.lineItems);
    const lineItems = order.lineItems;

    /*     const provider = req.headers["x-provider"] || "unknown";
    const eventType = body?.type ?? "unknown";

    /*    await prisma.webhookEvent.create({
      data: {
        provider: String(provider),
        eventType,
        payload: body,
      },
    }); */

    if (order) {
      console.log(order.id);
      const processOrder = async () => {
        const orderDataArray = lineItems.map((item) => ({
          orderId: orderId,
          uid: item.uid,
          status: "pending",
          location: order.locationId,
          item: item.name || "",
          notes: item.note || "",
          quantity: parseInt(item.quantity) || 1,
          customerName:
            order.fulfillments?.[0]?.pickupDetails?.recipient?.displayName ||
            "",
          due: order.fulfillments?.[0]?.pickupDetails?.pickupAt || null,
          email: order.fulfillments?.[0]?.pickupDetails?.emailAddress || "",
          phone: order.fulfillments?.[0]?.pickupDetails?.phoneNumber || "",
          price: 0.0,
          createdAt: order.createdAt,
        }));

        // Upsert each line item in the database
        const res = await Promise.all(
          orderDataArray.map((orderData) =>
            prisma.order.upsert({
              where: { uid: orderData.uid },
              update: orderData,
              create: orderData,
            })
          )
        );

        console.log(
          `Processed ${orderDataArray.length} items for order ${order.id}`
        );

        res.status(200).json({ ok: true });
      };

      const result = await processOrder();
      return result;
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Invalid JSON", raw: rawBody });
  }

  return res.status(200).json({ ok: true });
}
