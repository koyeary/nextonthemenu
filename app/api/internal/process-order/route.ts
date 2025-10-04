import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json(); // already safe JSON from Pages Router
  console.log("Processing order in App Router:", body);
  console.log(body);
  // Example: update order table based on webhook

  return NextResponse.json({ ok: true, body });
}
/* 
export async function GET() {
  try {
    const webhookEvents = await prisma.webhookEvent.findMany({});
    if (!webhookEvents) {
      return NextResponse.json({ message: "No events found" }, { status: 404 });
    }
    //const parsePayload = webhookEvents.map((webEv) => webEv.payload);
    const events = await prisma.webhookEvent.findMany();
    console.log(events[0]);
    console.log(events.map((e) => console.log(e.payload)));
    const rows = [];
    if (events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        // const { id } = events[i].payload;
        console.log(events[i]);
        //const order = await prisma.order.findFirst({ where: { orderId: id } });
                const data = NextResponse.json(order, { status: 200 })}; 

/*        rows.push(id); */

//rows.push(events[i].payload);
/*      const test = await prisma.order.findFirst({
          where: { orderId: id },
        }); 
      //rows.push(test);
    }

    //console.log(rows);
    return NextResponse.json(
      events.map((e) => e.payload),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
 
 */
