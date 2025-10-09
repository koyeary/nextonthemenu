/* eslint-disable */
export function buildPrinterXml(text: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <response>
    <traderSuccess>true</traderSuccess>
    <traderStatus></traderStatus>
    <printText>${text}</printText>
  </response>`;
}

export function formatOrderForPrint(order: any) {
  const items =
    order?.line_items
      ?.map((i: any) => `- ${i.name} x ${i.quantity}`)
      .join("\n") ?? "";

  return `Order #${order?.id}\nStatus: ${order?.state}\n\n${items}`;
}
