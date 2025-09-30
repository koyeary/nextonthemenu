import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SquareClient, SquareEnvironment } from "square";
import { create } from "domain";

const prisma = new PrismaClient();

const cakeTypes = [
  "Tres Leches",
  "Strawberry Shortcake",
  "Brooklyn Blackout",
  "Red Velvet",
  "Lemon Blueberry",
  "Vintage Heart Cake",
  "Vintage White Cake",
  "Chocolate Mousse Cake",
  "Fruit Napolean Cake",
  "Rainbow Cake",
  "Chocolate Fudge Cake",
  "Tiramisu",
  "Oreo Cake",
  "Salted Caramel Cake",
  "Carrot Cake",
  "Chocolate Layer Cake",
  "7 Layer Cake",
  "Peach Raspberry Cake",
  "Burnt Almond Cake",
  "Nutella Cake",
  "Black Forest Cake",
  "Coconut Cake",
  "Vanilla Bean Cake",
  "German Chocolate Cake",
  "Girl Gender Reveal",
  "Boy Gender Reveal",
  "Pink & Blue Rosette",
  "Girl or Boy",
] as const;

const firstNames = [
  "Alice",
  "Bob",
  "Catherine",
  "Daniel",
  "Ella",
  "Frank",
  "Grace",
  "Henry",
  "Isabella",
  "Jack",
  "Alex",
  "Jordan",
  "Taylor",
  "Casey",
  "Morgan",
  "Riley",
  "Sam",
  "Jamie",
  "Avery",
  "Quinn",
  "Cameron",
  "Skyler",
  "Reese",
  "Dylan",
  "Rowan",
  "Kai",
  "Sage",
  "Logan",
  "Finley",
  "Devon",
] as const;

const lastNames = [
  "Johnson",
  "Smith",
  "Lee",
  "Perez",
  "Brown",
  "White",
  "Kim",
  "Lopez",
  "Green",
  "Wilson",
  "Holloway",
  "Dalton",
  "Mercer",
  "Brennan",
  "Kirkland",
  "Donovan",
  "Callahan",
  "Fulton",
  "Shepherd",
  "Harrington",
  "Monroe",
  "Whitaker",
  "Lennox",
  "Carver",
  "Aldridge",
  "Prescott",
  "Chandler",
  "Langston",
  "Vaughn",
  "Ellison",
] as const;

const randomContact = (first: string, last: string): string => {
  if (Math.random() > 0.5) {
    return `${first.toLowerCase()}.${last.toLowerCase()}@example.com`;
  }
  return `(${Math.floor(Math.random() * 900 + 100)})-${Math.floor(
    Math.random() * 900 + 100
  )}-${Math.floor(Math.random() * 9000 + 1000)}`;
};

const randomPrice = (): number => {
  return Math.floor(Math.random() * 8000 + 100) / 100;
};

const getRandomElement = <T>(array: readonly T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const createNewSQ = async () => {
  try {
    const client = new SquareClient({
      environment: SquareEnvironment.Sandbox,
      token: "EAAAl--4VCDk9CkrwDu52BvR3qgQPvGYfgQZW4yJY_cx598zpcESeHZ6F7Y4iTiT",
    });

    const newOrder = await client.orders.create({
      idempotencyKey: "0403f49d-f715-408c-901b-454c2f509746",
      order: {
        lineItems: [
          {
            note: "Happy Birthday",
            itemType: "ITEM",
            name: getRandomElement(cakeTypes),
            basePriceMoney: {
              currency: "USD",
              amount: BigInt(`${randomPrice()}`),
            },
            quantity: `${Math.floor(Math.random() * 5) + 1}`,
          },
        ],
        locationId: "LV4HES3Z503DS",
        fulfillments: [
          {
            pickupDetails: {
              recipient: {
                emailAddress: "randomemail@gmail.com",
                customerId: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
              },
              isCurbsidePickup: true,
              note: 'Happy Birthday with "30" candle',
            },
          },
        ],
      },
    });

    return newOrder;
  } catch (err) {
    console.error(err);
  }
};

export async function GET(req: NextRequest, res: NextResponse) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  console.log("_~*hit*~_)");
  console.log(id);

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }
  try {
    const client = new SquareClient({
      environment: SquareEnvironment.Sandbox,
      token: "EAAAl--4VCDk9CkrwDu52BvR3qgQPvGYfgQZW4yJY_cx598zpcESeHZ6F7Y4iTiT",
    });
    const order = await client.orders.get({
      orderId: id,
    });

    const item = order?.order?.fulfillments[0];
    console.log("_~*success*~_");
    console.log(item);
    /*  const postItem = await prisma.order.create({
      data: {
        orderId: id,
        due: new Date(
          Date.now() + Math.floor(Math.random() * 7 + 1) * 24 * 60 * 60 * 1000
        ),
        status: "pending",
        items: item?.name,
        size: '8"',
        notes: item?.note,
        quantity: Number(item?.quantity),
        price: Number(item?.totalMoney?.amount),
        customerName: "Emilie Fring",
        contact: "(818) 441-2125",
      },
    });  */
    // console.log(order?.order?.lineItems);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    } else {
      console.log("_~*complete*~_)");
      return NextResponse.json({
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
