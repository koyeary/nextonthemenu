/* eslint-disable */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const Ticket: React.FC = ({ order }) => {
  const [paperWidth, setPaperWidth] = useState("2inch");
  const [logo, setLogo] = useState("01-Receipt_Letter_ENG.bmp");
  const [text, setText] = useState(
    `${order.customerName}\n ***************** \n${order.quantity} ${order.item}\n Notes: ${order.notes}\n Due: ${order.due}`
  );
  const [isPrinting, setIsPrinting] = useState(false);

  const canvasPrintRef = useRef<HTMLCanvasElement>(null);
  const canvasShowRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Load sample text when paper width changes
  /*   useEffect(() => {
    setText(
      `${order.customerName}\n ***************** \n${order.quantity} ${order.item}\n Notes: ${order.notes}\n Due: ${order.due}`
    );
  }, [order]); */

  const createText = () => {
    console.log(order);
    setText("Thank you very much!\nShizuoka Store: 054-347-0112\n...");
  };

  const changePaperWidth = (width: "2inch" | "3inch") => {
    setPaperWidth(width);
    // You can load width-specific templates here if needed
  };

  /*   async function handlePrint() {
    setIsPrinting(true);
    try {
      // Example: building XML request via Star SDK (client-side)
      // You can import StarWebPrintBuilder from /public/js if needed
      const builder = new (window as any).StarWebPrintBuilder();
      const request = builder.createTextElement({ data: text });
      await fetch("http://172.16.1.1/StarWebPRNT/SendMessage", {
        method: "POST",
        body: request,
      });
      alert("Print request sent!");
    } catch (err) {
      alert(`Error printing: ${err}`);
    } finally {
      setIsPrinting(false);
    }
  } */

  const nowLoading = () => {
    if (overlayRef.current) overlayRef.current.style.display = "none";
  };

  const showNowPrinting = () => {
    if (overlayRef.current && nowPrintingRef.current) {
      overlayRef.current.style.display = "block";
      nowPrintingRef.current.style.display = "table";
    }
  };

  const hideNowPrinting = () => {
    if (!overlayRef.current || !nowPrintingRef.current) return;
    overlayRef.current.style.opacity = "0.0";
    overlayRef.current.style.transition = "all 0.3s";
    setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.style.display = "none";
        overlayRef.current.style.opacity = "1";
      }
    }, 300);
    nowPrintingRef.current.style.display = "none";
  };

  const changeLogo = (width: string, path: string) => {
    try {
      const image = new Image();
      image.src = `/starwebprint/img/2inch/mias-logotype-box-copy-7518-web.bmp}`;

      image.onload = function () {
        const canvasPrintRef = canvasPrintRef.current;
        const canvasShow = canvasShowRef.current;
        if (!canvasPrintRef || !canvasShow) return;

        const contextPrint = canvasPrintRef.getContext("2d");
        if (contextPrint) {
          canvasPrintRef.width = image.width;
          canvasPrintRef.height = image.height;
          contextPrint.drawImage(image, 0, 0);
        }

        const canvasWidth = width === "2inch" ? 200 : 300;
        const canvasRatio = image.width / canvasWidth;
        canvasShow.width = canvasWidth;
        canvasShow.height = image.height / canvasRatio;

        const contextShow = canvasShow.getContext("2d");
        if (contextShow) {
          contextShow.drawImage(
            image,
            0,
            0,
            canvasShow.width,
            canvasShow.height
          );
        }
      };

      image.onerror = function () {
        alert("Image file could not be loaded from the web server.");
      };
    } catch (e: any) {
      alert(e.message);
    }
  };

  const sendMessage = (request: string) => {
    console.log("send message");
    /*   if (typeof window === "undefined" || !window.StarWebPrintTrader) {
      alert("StarWebPrintTrader SDK not loaded.");
      return;
    } */

    showNowPrinting();

    const url = "http://172.16.1.254/StarWebPRNT/SendMessage";
    const trader = new window.StarWebPrintTrader({
      url: url,
    });

    // DEV-ONLY patch for mock server
    /* trader.sendMessage = function (args) {
      console.log("Mock sendMessage called:", args.request?.slice?.(0, 200));
      this.onReceive({ traderSuccess: "true" });
    }; */
    //end dev patch

    trader.onReceive = (response: TraderResponse) => {
      hideNowPrinting();
      let msg = "- onReceive -\n\n";
      msg +=
        response.traderSuccess === "true"
          ? "Print result: Success\n"
          : "Print result: Failed\n";
      alert(msg);
    };

    trader.onError = (response: TraderResponse) => {
      const msg =
        "- onError -\n\n" +
        `Status: ${response.status}\n` +
        `ResponseText: ${response.responseText}\n\n` +
        "Do you want to retry?\n";
      if (confirm(msg)) {
        onSend();
      } else {
        hideNowPrinting();
      }
    };

    //monkey wrench for dev, remove for prod
    /*     if (process.env.NODE_ENV === "development") {
      const origFunc = trader.onReceive;
      trader.onReceive = (res: any) => {
        if (res.status === 200 && !res.responseText) {
          console.warn("Bypassing StarWebPrint validation in dev mode.");
          hideNowPrinting(); // or your success callback
        } else {
          origFunc?.(res);
        }
      };
    } */

    trader.sendMessage({ request });
  };

  const onSend = () => {
    console.log("sending");
    if (typeof window === "undefined" || !window.StarWebPrintBuilder) {
      alert("StarWebPrintBuilder SDK not loaded yet.");
      return;
    }

    // Adjust this depending on what console.log reveals
    const builder = new window.StarWebPrintBuilder(); // or new window.StarWebPrintBuilder() / window.StarWebPrintBuilder.Builder

    console.log(builder); // confirm createInitializationElement exists
    if (typeof builder.createInitializationElement !== "function") {
      alert("Builder functions not found. Check SDK version and path.");
      return;
    }

    console.log(canvasPrintRef);
    const canvasPrint = canvasPrintRef.current;
    if (!canvasPrint) return;

    let request = "";
    request += builder.createInitializationElement();
    request += builder.createBitImageElement({
      context: canvasPrint.getContext("2d"),
      x: 0,
      y: 0,
      width: canvasPrint.width,
      height: canvasPrint.height,
    });
    request += builder.createTextElement({
      characterspace: 0,
      international: "japan",
    });
    request += builder.createTextElement({ data: text });
    request += builder.createCutPaperElement({ feed: true });

    console.log(request);
    sendMessage(request);
  };

  return (
    <>
      <canvas
        ref={canvasPrintRef}
        className="w-full border rounded-md p-2 mt-5"
        width={300}
        height={200}
      />
      <textarea
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded-md p-2 mt-5"
      />
      <button onClick={onSend}>print</button>
    </>
  );
};

export default Ticket;
