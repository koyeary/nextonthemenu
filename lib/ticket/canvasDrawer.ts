import { CanvasConfig } from "@/types/Ticket";
import Order from "@/typtes/Order";
//import { TICKET_TOTALS } from "./ticketData";

export class CanvasTicketDrawer {
  private context: CanvasRenderingContext2D;
  private cursor: number = 0;
  private leftPosition: number = 0;
  private centerPosition: number = 0;
  private rightPosition: number = 0;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");
    this.context = ctx;
  }

  private drawLeftText(text: string): void {
    this.context.textAlign = "left";
    this.context.fillText(text, this.leftPosition, this.cursor);
    this.context.textAlign = "start";
  }

  private drawCenterText(text: string): void {
    this.context.textAlign = "center";
    this.context.fillText(text, this.centerPosition, this.cursor);
    this.context.textAlign = "start";
  }

  private drawRightText(text: string): void {
    this.context.textAlign = "right";
    this.context.fillText(text, this.rightPosition, this.cursor);
    this.context.textAlign = "start";
  }

  public drawTicket(
    config: CanvasConfig,
    font: string,
    italic: boolean,
    order: Order
  ): void {
    const { fontSize, lineSpace, ticketWidth, logoScale } = config;
    console.log(order);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.textBaseline = "top";

    let fontString = italic ? "italic " : "";
    fontString += `bold ${fontSize}px ${font}`;
    this.context.font = fontString;

    this.leftPosition = 0;
    this.centerPosition = (this.canvas.width - 16) / 2;
    this.rightPosition = this.canvas.width - 16;

    this.cursor = 55 * logoScale;

    // Store info
    this.drawLogo(logoScale);
    this.cursor += lineSpace;
    this.cursor += lineSpace;
    this.cursor += lineSpace;
    this.cursor += lineSpace;

    this.drawLeftText(`${order.quantity} ${order.item}`);
    this.cursor += lineSpace;
    this.drawLeftText(`Notes: ${order.notes}`);
    this.cursor += lineSpace;

    // Thank you messages
    const d = new Date(order.due);
    const formattedDate = d.toDateString();
    this.drawLeftText(`DUE: ${formattedDate}`);
    this.cursor += lineSpace;
    this.cursor += lineSpace;
    //Underline;
    this.context.fillRect(0, this.cursor - 2, ticketWidth, 2);
    this.cursor += lineSpace;
    // Items
    /*     Object.entries(order)
      .filter((item, index) => index > 3)
      .map(([key, value]) => {
        {
          this.drawLeftText(key);
          this.drawRightText(value);
          this.cursor += lineSpace;
        }
      }) */

    fontString = `${fontSize}px ${font}`;
    this.context.font = fontString;

    this.drawLeftText("Name");
    this.drawRightText(order.customerName);
    this.cursor += lineSpace;
    this.drawLeftText("Contact info:");
    this.drawRightText(order.phone);
    this.cursor += lineSpace;
    this.drawRightText(order.email);
    this.cursor += lineSpace;
    this.cursor += lineSpace;
    this.context.fillRect(0, this.cursor - 2, ticketWidth, 2);
    this.cursor += lineSpace;
    fontString = `18px ${font}`;
    this.context.font = fontString;
    this.drawCenterText(order.orderId);
    /*     this.drawLeftText("Subtotal");
    this.drawRightText(TICKET_TOTALS.subtotal);
    this.cursor += lineSpace;
    this.cursor += lineSpace; */

    /*     // Tax
    this.drawLeftText("Tax");
    this.drawRightText(TICKET_TOTALS.tax);
    this.cursor += lineSpace; */

    // Underline
    /*    this.context.fillRect(0, this.cursor - 2, ticketWidth, 2);

    // Total
    this.drawLeftText("Total");
    this.drawRightText(TICKET_TOTALS.total);
    this.cursor += lineSpace;
    this.cursor += lineSpace;

    // Payment
    this.drawLeftText("Received");
    this.drawRightText(TICKET_TOTALS.received);
    this.cursor += lineSpace;

    this.drawLeftText("Change");
    this.drawRightText(TICKET_TOTALS.change);
    this.cursor += lineSpace; */

    // Draw logo
    // this.drawLogo(logoScale);
  }

  private drawLogo(logoScale: number): void {
    const image = new Image();
    image.src = "./starwebprint/img/mias-logotype-box-copy-7518-web.jpg";

    image.onload = () => {
      this.context.drawImage(
        image,
        this.canvas.width - image.width * logoScale,
        0,
        image.width * logoScale,
        image.height * logoScale
      );
    };

    image.onerror = () => {
      console.error("Image file was not able to be loaded.");
    };
  }
}
