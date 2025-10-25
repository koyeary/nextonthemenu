import { SquareEnvironment, SquareClient } from "square";
import prisma from "@/lib/db/connection";

export async function GET() {
  const orders = await retrieveAllOrders();
  return new Response(JSON.stringify(orders), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const retrieveAllOrders = async () => {
  const client = new SquareClient({
    environment: SquareEnvironment.Production,
    token: process.env.PROD_SQ_ACCESS_TOKEN, //process.env.SQUARE_ACCESS_TOKEN,
  });
  try {
    const orders = await client.orders.search({
      returnEntries: true,
      query: {},
      locationIds: ["L56CFWYF0H5JK", "L5MQCWDDVAYA6", "LF6HAV7DTAEKJ"],
    });

    orders.orderEntries.map(async (order) => {
      if (
        order &&
        order.line_items &&
        order.line_items.length > 0 &&
        order.fulfillments &&
        order.fulfillments.length > 0
      ) {
        const orderData = {
          orderId: order.orderId,
          status: "pending",
          due: order.fulfillments[0].due_at || null,
          location: order.locationId,
          item: order.line_items[0].name || "",
          notes: order.line_items[0].note || "",
          quantity: parseInt(order.line_items[0].quantity) || "",
          customerName: order.fulfillments[0].recipient || "",
          price: 0,
          email: "",
          phone: "",
          createdAt: order.created_at,
        };
        await prisma.order.upsert({
          where: { orderId: order.orderId },
          update: orderData,
          create: orderData,
        });
      }
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

/*   try {
    const client = new SquareClient({
      environment: SquareEnvironment.Production,
      token: process.env.PROD_SQ_ACCESS_TOKEN, //process.env.SQUARE_ACCESS_TOKEN,
    });
    const res = await client.orders.batchGet({
      locationId: "L5MQCWDDVAYA6",
      limit: 50,
    });

    // const orders = res.orders;
    console.log(res);
    // return res.orders;
  } catch (err) {
    console.error(err);
  }
}; */
