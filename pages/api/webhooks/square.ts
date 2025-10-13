import type { NextRequest, NextResponse } from "next";
import { SquareClient, SquareEnvironment } from "square";
import prisma from "@/lib/db/connection";

export const config = { api: { bodyParser: false } };

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

  return res.status(200).json({ ok: true });
}
