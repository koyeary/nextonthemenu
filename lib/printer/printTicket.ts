/* eslint-disable */
import Order from "@/types/Order";

declare global {
  interface Window {
    StarWebPrintBuilder: any;
    StarWebPrintTrader: any;
  }
}

export async function printTicket(
  data: Order,
  printerUrl: string,
  paperType: string
): Promise<void> {
  if (
    typeof window === "undefined" ||
    !window.StarWebPrintBuilder ||
    !window.StarWebPrintTrader
  ) {
    throw new Error("Star WebPRNT libraries not loaded");
  }

  return new Promise((resolve, reject) => {
    try {
      const builder = new window.StarWebPrintBuilder();
      const trader = new window.StarWebPrintTrader({
        url: printerUrl,
        papertype: paperType,
      });

      // Build the ticket
      let request = "";

      // Initialize
      request += builder.createInitializationElement();

      // Header - Order ID and Status (centered)
      request += builder.createAlignmentElement({ position: "center" });
      request += builder.createTextElement({
        text: `Order #${data.orderId}\n`,
        emphasis: true,
      });
      request += builder.createTextElement({
        text: `Status: ${data.status.toUpperCase()}\n\n`,
      });

      // Customer Information (left-aligned)
      request += builder.createAlignmentElement({ position: "left" });
      request += builder.createTextElement({
        text: `Customer: ${data.customerName}\n`,
      });
      if (data.email) {
        request += builder.createTextElement({
          text: `Email: ${data.email}\n`,
        });
      }
      if (data.phone) {
        request += builder.createTextElement({
          text: `Phone: ${data.phone}\n`,
        });
      }
      if (data.location) {
        request += builder.createTextElement({
          text: `Location: ${data.location}\n`,
        });
      }
      request += builder.createTextElement({ text: "\n" });

      // Order Details
      request += builder.createTextElement({
        text: "--------------------------------\n",
      });
      request += builder.createTextElement({
        text: `Item: ${data.item}\n`,
        emphasis: true,
      });
      request += builder.createTextElement({
        text: `Quantity: ${data.quantity}\n`,
      });
      request += builder.createTextElement({
        text: `Price: ${data.price}\n`,
      });

      if (data.notes) {
        request += builder.createTextElement({
          text: `Notes: ${data.notes}\n`,
        });
      }

      request += builder.createTextElement({
        text: "--------------------------------\n\n",
      });

      // Due Date
      const dueDate = new Date(data.due);
      request += builder.createTextElement({
        text: `Due: ${dueDate.toLocaleDateString()} ${dueDate.toLocaleTimeString()}\n`,
      });

      // Created Date
      request += builder.createTextElement({
        text: `Created: ${new Date(data.createdAt).toLocaleString()}\n\n`,
      });

      // Cut paper
      request += builder.createCutPaperElement({ feed: true });

      // Set up callbacks
      trader.onReceive = (response: any) => {
        if (response.traderSuccess) {
          resolve();
        } else {
          reject(new Error("Printer reported an error"));
        }
      };

      trader.onError = (response: any) => {
        reject(new Error(response.responseText || "Print failed"));
      };

      // Send to printer
      trader.sendMessage({ request });
    } catch (error) {
      reject(error);
    }
  });
}

/* function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
} */
