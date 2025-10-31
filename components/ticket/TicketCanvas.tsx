"use client";

import { useEffect, useRef } from "react";
import { CANVAS_CONFIGS } from "@/lib/utils/constants";
import { CanvasTicketDrawer } from "@/lib/ticket/canvasDrawer";
import { PaperWidth } from "@/types/ticket";
import Order from "@/types/Order";
interface TicketCanvasProps {
  paperWidth: PaperWidth;
  font: string;
  italic: boolean;
  order: Order;
}

export default function TicketCanvas({
  font,
  italic,
  order,
}: TicketCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    orderId,
    name,
    notes,
    due,
    quantity,
    customerName,
    email,
    phoneNumber,
  } = order;
  useEffect(() => {
    const order = {
      orderId: orderId,
      item: name,
      notes: notes,
      due: due,
      quantity: quantity,
      customerName: customerName,
      email: email,
      phone: phoneNumber,
    };

    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dimensions = 384; //CANVAS_DIMENSIONS[paperWidth];
    const config = CANVAS_CONFIGS.inch2;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const drawer = new CanvasTicketDrawer(canvas);
    drawer.drawTicket(config, font, italic, order);
  }, [
    customerName,
    due,
    email,
    font,
    italic,
    name,
    notes,
    order,
    orderId,
    phoneNumber,
    quantity,
  ]);

  /* const drawLeftText = (text) => {
  var canvas = document.getElementById("canvasPaper");

  if (canvas.getContext) {
    var context = canvas.getContext("2d");

    context.textAlign = "left";

    context.fillText(text, leftPosition, cursor);

    context.textAlign = "start";
  }
} */

  return (
    <div className="canvasBlock">
      <div className="canvasFrame">
        <canvas
          ref={canvasRef}
          id="canvasPaper"
          width={576}
          height={640}
          style={{ width: "700px" }}
        >
          Your browser does not support Canvas!
        </canvas>
      </div>
    </div>
  );
}
