"use client";

import { useEffect, useRef } from "react";

interface Order {
  customerName: string;
  quantity: number;
  item: string;
  notes?: string;
  due?: string;
}

export const useTicketCanvas = (order: Order, text: string) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw logo image
    const image = new Image();
    image.src = `/starwebprint/img/2inch/mias-logotype-box-copy-7518-web.bmp`;

    image.onload = () => {
      const logoHeight = image.height * (canvas.width / image.width);
      ctx.drawImage(image, 0, 0, canvas.width, logoHeight);

      // Draw order text
      ctx.font = "18px monospace";
      ctx.fillStyle = "black";

      const y = logoHeight + 30;
      // Optionally draw freeform text from textarea
      if (text) {
        const lines = text.split("\n");
        lines.forEach((line, i) => {
          ctx.fillText(line, 32, y + 32 * (i + 1));
        });
      }
    };

    image.onerror = () => {
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = "black";
      ctx.fillText("Image not found", 10, 30);
    };
  }, [order, text]);

  return { canvasRef };
};

export default useTicketCanvas;
