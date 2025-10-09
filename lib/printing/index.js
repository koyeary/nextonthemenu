/* eslint-disable */
import { sendToPrinter } from "./printerClient";
import { buildPrinterXml, formatOrderForPrint } from "./printerUtils";

export async function triggerPrinter(order: any) {
  const text = formatOrderForPrint(order);
  const xml = buildPrinterXml(text);
  return await sendToPrinter(xml);
}
