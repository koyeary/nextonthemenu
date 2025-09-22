import { NextRequest } from "next/server";

// app/api/webhooks/square/route.ts
export default async function POST(req: NextRequest) {
  console.log(req.json());
  return new Response("Webhook received", { status: 200 });
  /*  try {
    const payload = await req.json();

    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    console.log("Webhook payload:", await payload);
    //post to db ...

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal Server Error", { status: 500 }); */
}
// Verify Square webhook signature
// Process webhook events (payments, orders, etc.)
// Update local database
// Return appropriate response
