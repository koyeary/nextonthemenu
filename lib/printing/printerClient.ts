// lib/printing/printerClient.ts
export async function sendToPrinter(requestXml: string) {
  const printerUrl =
    process.env.PRINTER_URL ?? "http://127.0.0.1:8001/StarWebPRNT/SendMessage";

  console.log("📤 Sending print request to:", printerUrl);
  console.log("📄 Request body:", requestXml);

  const response = await fetch(printerUrl, {
    method: "POST",
    headers: { "Content-Type": "text/xml; charset=utf-8" },
    body: requestXml,
  });

  const text = await response.text();
  console.log("📥 Printer response:", response.status, text);

  if (!response.ok) throw new Error(`Printer error: ${response.status}`);

  return text;
}
