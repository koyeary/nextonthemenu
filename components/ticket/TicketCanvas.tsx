"use client";

import { useEffect, useRef } from "react";
import { CANVAS_DIMENSIONS, CANVAS_CONFIGS } from "@/lib/utils/constants";
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
  paperWidth,
  font,
  italic,
  // order,
}: TicketCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const order = {
      orderId: "DFufZ6bWQ6OOFxr1uZaRkLJUBQKZY",
      item: "Dozen Cinnamon Roles",
      notes: "Leave me alone, I want 50",
      due: "2025-10-06T01:42:28.484+00:00",
      quantity: 50,
      price: 33,
      customerName: "Bunker Yeary-Rantala",
      email: "bunker@inabunker.com",
      phone: "555-555-5555",
    };

    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dimensions = 384; //CANVAS_DIMENSIONS[paperWidth];
    const config = CANVAS_CONFIGS.inch2;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const drawer = new CanvasTicketDrawer(canvas);
    drawer.drawTicket(config, font, italic, order);
  }, [paperWidth, font, italic]);

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
