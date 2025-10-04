import { NextApiRequest, NextApiResponse } from "next";
import client from "@/lib/db/connection";
import { SquareClient, SquareEnvironment } from "square";

const squareClient = new SquareClient({
  environment: SquareEnvironment.Sandbox,
  token: process.env.SQUARE_ACCESS_TOKEN,
});

const squareQuery = async (orderId: string) => {
  const sqObject = await squareClient.orders.get({
    orderId: "l2mloBgEq9SCpHzfIIC2b9dLcXVZY",
  });

  //need pickup details, notes, basePriceMoney
  const { order } = sqObject;
  const newOrder = await prisma.order.update({
    where: { id: 284 },
    data: {
      item: order?.lineItems?.name ?? "",
      notes: order?.lineItems?.note ?? "",
      due: new Date(Date.now()),
      location: order?.locationId ?? "",
      quantity: order?.lineItems?.quantity ?? 1, // Provide actual quantity or a default value
      price: 10,
      customerName: "Test Square Customer", // Provide actual customer name or a default
      phone: "555-555-5555",
      email: "sqtestemail@gmail.com",
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
          due: new Date(Date.now()),
          location: "",
          quantity: 1, // Provide actual quantity or a default value
          price: 0, // Provide actual price or a default value
          customerName: "Unknown Customer", // Provide actual customer name or a default
          phone: "",
          email: "",
        },
      });

      // const itemData = await squareQuery(orderId);
      /* SAVE FOR LATER
               orderId: orderId,
              status: "pending",
              item: sqObject.order.line_items.line_items[0].name ?? "",
              due:
                sqObject.order.fulfillments.fulfillments[0].pickup_details
                  .pickup_at ?? "",
              location: sqObject.order.location_id ?? "",
              quantity: sqObject.order.line_items.line_items[0].quantity ?? 1, // Provide actual quantity or a default value
              price: sqObject.order.line_items.line_items[0].base_price_money ?? 0, // Provide actual price or a default value
              customerName:
                sqObject.order.fulfillments[0].pickup_details.recipient
                  .display_name ?? "Unknown Customer", // Provide actual customer name or a default
              phone:
                sqObject.order.fulfillments.fulfillments[0].pickup_details.recipient
                  .phone_number ?? "",
              email:
                sqObject.order.fulfillments.fulfillments[0].pickup_details.recipient
                  .email ?? "",
                   */

      /* if (orderId) {
        // Only create if not exists
        const existing = await prisma.order.findUnique({
          where: { orderId: orderId },
        });
  
        if (!existing) {
          await prisma.order.create({
            data: {
              orderId: orderId,
              status: "pending",
              item: sqObject.order.line_items.line_items[0].name ?? "",
              due:
                sqObject.order.fulfillments.fulfillments[0].pickup_details
                  .pickup_at ?? "",
              location: sqObject.order.location_id ?? "",
              quantity: sqObject.order.line_items.line_items[0].quantity ?? 1, // Provide actual quantity or a default value
              price: sqObject.order.line_items.line_items[0].base_price_money ?? 0, // Provide actual price or a default value
              customerName:
                sqObject.order.fulfillments[0].pickup_details.recipient
                  .display_name ?? "Unknown Customer", // Provide actual customer name or a default
              number:
                sqObject.order.fulfillments.fulfillments[0].pickup_details.recipient
                  .phone_number ?? "",
              email:
                sqObject.order.fulfillments.fulfillments[0].pickup_details.recipient
                  .email ?? "",
            },
          });
          console.log("Created new order:", orderId);
        } else {
          console.log("Order already exists:", orderId);
        }
      }
  
      //save to cross index under webhooks
      await prisma.webhookEvent.create({
        data: {
          provider: "square",
          eventType: "order.create",
          payload: { id: sqObject.order.id, location_id: sqObject.order.location_id },
        },
      }); */

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
