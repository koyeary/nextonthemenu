/* import { WebhooksHelper } from "square";

const signatureKey = process.env.SIGNATURE_KEY || "";
const notificationUrl =
  process.env.NOTIFICATION_URL ||
  "https://webhook.site/a325f335-0cab-4ce5-8dba-0f65782282f0";

async function isFromSquare(signature: any, body: any) {
  return await WebhooksHelper.verifySignature({
    requestBody: body,
    signatureHeader: signature,
    signatureKey: signatureKey,
    notificationUrl: notificationUrl,
  });
}

export default async function handler(req: any, res: any) {
  let body = "";
  /*   req.setEncoding("utf8");

  req.on("data", function (chunk: any) {
    body += chunk;
  });

  req.on("end", async function () { 
  const signature = req.headers["x-square-hmacsha256-signature"];
  if (await isFromSquare(signature, body)) {
    // Signature is valid. Return 200 OK.
    console.info("Request body: " + body);
    res.writeHead(200);
  } else {
    // Signature is invalid. Return 403 Forbidden.
    console.info("Invalid signature");
    res.writeHead(403);
  }
  res.end();
}
 */
