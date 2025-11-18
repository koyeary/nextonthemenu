"use client";

import React, { useState } from "react";
import { NextResponse, NextRequest } from "next/server";
import { useTicketCanvas } from "@/hooks/useTicketCanvas";
import { AlertDialog } from "radix-ui";
import dayjs from "dayjs";
import { Button } from "../ui/button";
import { Printer } from "lucide-react";
import { removeToStayOrGo } from "../../lib/utils/helpers";

const Ticket: React.FC<{ order: any }> = ({ order, getIp, finishPrint }) => {
  const [text, setText] = useState(
    `*********************\n${order.customerName.toUpperCase()} ${order.orderCount === "1" ? "1/1" : order.orderCount}\n${order.item.toUpperCase()}\n*********************\n\nNotes: ${order.notes.length > 0 ? order.notes : "N/A"}\nPick Up ${dayjs(order.due).format("MM-DD h:m A ")}\n\n\n`
  );
  const [ip, setIp] = useState("");
  const { canvasRef } = useTicketCanvas(order, text);

  const getIpFromCategory = async (): Promise<string | null> => {
    try {
      const res = await fetch(`/api/inventory/${order.itemToken}`);
      if (!res.ok) throw new Error("Failed to fetch item details");
      const data = await res.json();
      console.log("Item data:", data);
      return data.data?.category || null;
    } catch (error) {
      console.error("Error fetching item details:", error);
      return null;
    }
  };

  React.useEffect(() => {
    const fetchAndPrint = async () => {
      /*       const station = await getIpFromCategory();
      const cat = await removeToStayOrGo(station || ""); */
      const printerIp = await getIp(order);
      console.log(printerIp);
      if (printerIp) {
        setIp(printerIp);
      }
    };
    fetchAndPrint();
  }, [order.station]);

  const getItemDetails = async () => {
    try {
      const res = await fetch(`/api/inventory/${order.itemToken}`);

      if (!res.ok) throw new Error("Failed to load item details");

      const data = await res.json();
      console.log("Item details:", data);
      return data.data;
    } catch (err) {
      console.error("Error fetching item details:", err);
      return null;
    }
  };

  const onSend = () => {
    console.log("sending print job…");

    if (typeof window === "undefined" || !window.StarWebPrintBuilder) {
      alert("StarWebPrintBuilder not loaded yet.");
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

    const finalIp = ip || "172.16.1.254";
    const trader = new window.StarWebPrintTrader({
      url: `http://${finalIp}/StarWebPRNT/SendMessage`,
    });

    trader.onReceive = () => console.log("success");

    trader.sendMessage({ request });
    return finishPrint();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-full border rounded-md p-2 mt-5"
        width={288}
        height={375}
      />
      <Button
        className="bg-violet-800 font-semibold text-white rounded-lg px-3 py-1  flex mt-4 whitespace-nowrap items-center gap-2 hover:bg-violet-500 mx-auto "
        onClick={onSend}
      >
        <Printer />
        {"Confirm"}
      </Button>
    </>
  );
};

export default Ticket;
