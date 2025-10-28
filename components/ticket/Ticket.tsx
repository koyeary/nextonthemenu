/* eslint-disable */
"use client";

import React, { useState, useEffect, useRef } from "react";
//import Image from "next/image";

const Ticket: React.FC = ({ order }) => {
  const [paperWidth, setPaperWidth] = useState("2inch");
  const [logo, setLogo] = useState("01-Receipt_Letter_ENG.bmp");
  const [text, setText] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  const canvasPrintRef = useRef<HTMLCanvasElement>(null);
  const canvasShowRef = useRef<HTMLCanvasElement>(null);

  // Load sample text when paper width changes
  useEffect(() => {
    setText(
      `${order.customerName}\n ***************** \n${order.quantity} ${order.item}\n Notes: ${order.notes}\n Due: ${order.due}`
    );
  }, [order]);

  async function handlePrint() {
    setIsPrinting(true);
    try {
      // Example: building XML request via Star SDK (client-side)
      // You can import StarWebPrintBuilder from /public/js if needed
      const builder = new (window as any).StarWebPrintBuilder();
      const request = builder.createTextElement({ data: text });
      await fetch("http://localhost:8001/StarWebPRNT/SendMessage", {
        method: "POST",
        body: request,
      });
      alert("Print request sent!");
    } catch (err) {
      alert(`Error printing: ${err}`);
    } finally {
      setIsPrinting(false);
    }
  }

  return (
    <>
      {/*    <Image
        alt="Mias Logo"
        width={300}
        height={200}
        className="mx-auto my-5"
        src="/starwebprint/img/2inch/mias-logotype-box-copy-7518-web.bmp"
      /> */}
      <textarea
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded-md p-2 mt-5"
      />
    </>
  );
};

export default Ticket;
