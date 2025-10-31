"use client";
/*eslint-disable*/
import React, { useState } from "react";
import { useTicketCanvas } from "@/hooks/useTicketCanvas";
import { Button } from "../ui/button";
import { Printer } from "lucide-react";

const Ticket: React.FC<{ order: any }> = ({ order }) => {
  const [text, setText] = useState(
    `Name: ${order.customerName.toUpperCase()}\nItem: ${order.item.toUpperCase()}\n***************\n Notes: ${order.notes}\n Due: ${order.due}`
  );
  const { canvasRef } = useTicketCanvas(order, text);

  const onSend = () => {
    console.log("sending print job…");

    if (typeof window === "undefined" || !window.StarWebPrintBuilder) {
      alert("StarWebPrintBuilder SDK not loaded yet.");
      return;
    }

    const builder = new window.StarWebPrintBuilder();
    const canvas = canvasRef.current;
    if (!canvas) return;

    let request = "";
    request += builder.createInitializationElement();
    request += builder.createBitImageElement({
      context: canvas.getContext("2d"),
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    });
    request += builder.createTextElement({ data: text });
    request += builder.createCutPaperElement({ feed: true });

    const trader = new window.StarWebPrintTrader({
      url: "http://172.16.1.254/StarWebPRNT/SendMessage",
    });

    trader.onReceive = () => alert("Print success!");
    trader.onError = (err: any) => alert(`Print error: ${err}`);
    trader.sendMessage({ request });
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-full border rounded-md p-2 mt-5"
        width={300}
        height={300}
      />
      {/*       <textarea
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded-md p-2 mt-5"
      /> */}
      <Button
        className="bg-violet-800 font-semibold text-white  rounded-lg px-3 py-1 mx-auto flex whitespace-nowrap items-center gap-2 hover:bg-violet-500"
        onClick={onSend}
      >
        <Printer />
        {"Confirm"}
      </Button>
    </>
  );
};

export default Ticket;
