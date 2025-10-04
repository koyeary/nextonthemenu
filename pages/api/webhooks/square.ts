import { NextApiRequest, NextApiResponse } from "next";
import client from "@/lib/db/connection";
import { Prisma } from "@prisma/client";
import { SquareClient, SquareEnvironment } from "square";

const squareClient = new SquareClient({
  environment: SquareEnvironment.Sandbox,
  token: process.env.SQUARE_ACCESS_TOKEN,
});

const squareQuery = async (orderId: string) => {
  const sqObject = await squareClient.orders.get({
    orderId: orderId,
  });

  console.log(sqObject?.order?.lineItems);
  const { order } = sqObject;
  const newOrder = await prisma.order.update({
    where: { orderId: orderId },
    data: {
      item: order?.lineItems[0].name ?? "",
      notes: order?.lineItems[0].note ?? "",
      due: order?.fulfillments[0].pickupDetails.pickup_at,
      location: order?.locationId ?? "",
      quantity: parseInt(order?.lineItems[0].quantity ?? "1"), // Provide actual quantity or a default value
      price: new Prisma.Decimal(order?.lineItems[0].basePriceMoney?.amount),
      customerName:
        order?.fulfillments[0].pickupDetails?.recipient?.displayName, // Provide actual customer name or a default
      phone: order?.fulfillments[0].pickupDetails?.recipient?.phoneNumber,
      email: order?.fulfillments[0].pickupDetails?.recipient?.emailAddress,
    },
  });

  console.log("new order");

  return newOrder;
};

const prisma = client;
export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const rawBody = Buffer.concat(chunks).toString("utf-8");
    const body = JSON.parse(rawBody);

    const orderId = body?.data?.id;
    await prisma.webhookEvent.create({
      data: {
        provider: "square",
        eventType: "order.create",
        payload: { id: orderId, location_id: body.data.object.location_id },
      },
    });

    const alreadyExists = await prisma.order.findUnique({
      where: { orderId: orderId },
    });

    if (alreadyExists) {
      squareQuery(orderId);
      return res.status(400).json("Template Item already exists");
    }
    if (!alreadyExists) {
      const template = await prisma.order.create({
        data: {
          orderId: orderId,
          status: "pending",
          item: "",
          notes: "",
          due: new Date(Date.now()),
          location: "",
          quantity: 1,
          price: 0,
          customerName: "Unknown Customer",
          phone: "",
          email: "",
        },
      });

      if (template) {
        squareQuery(orderId);
        console.log("completing request");
        return res.status(200).json(template); //temporary
      }
    }
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(400).json({ error: "Webhook handler failed" });
  }
}
