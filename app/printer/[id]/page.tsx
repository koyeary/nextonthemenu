/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

// --- Type Declarations for StarWebPrint SDK ---
declare global {
  interface Window {
    StarWebPrintTrader?: any;
    StarWebPrintBuilder?: any;
  }
}

interface TraderResponse {
  traderSuccess?: string;
  traderStatus?: unknown;
  status?: number;
  responseText?: string;
}

export default function PrinterPage() {
  const [paperWidth, setPaperWidth] = useState<"2inch" | "3inch">("2inch");
  const [logoPath, setLogoPath] = useState("01-Receipt_Letter_ENG.bmp");
  const [text, setText] = useState("");
  const canvasPrintRef = useRef<HTMLCanvasElement | null>(null);
  const canvasShowRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const nowPrintingRef = useRef<HTMLDivElement | null>(null);

  // -----------------------
  // Lifecycle Initialization
  // -----------------------
  useEffect(() => {
    nowLoading();
    createText();
    changePaperWidth("2inch");
    changeLogo("2inch", logoPath);
  }, []);

  // -----------------------
  // UI Display Helpers
  // -----------------------
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

  // -----------------------
  // Text + Paper Logic
  // -----------------------

  const createText = () => {
    setText(`Thank you very much!\nOrder Number: number\n...`);
  };

  const changePaperWidth = (width: "2inch" | "3inch") => {
    setPaperWidth(width);
    // You can load width-specific templates here if needed
  };

  // -----------------------
  // Logo / Image Rendering
  // -----------------------
  const changeLogo = (width: string, path: string) => {
    try {
      const image = new Image();
      image.src = `/starwebprint/img/${width}/${path}?${new Date().getTime()}`;

      image.onload = function () {
        const canvasPrint = canvasPrintRef.current;
        const canvasShow = canvasShowRef.current;
        if (!canvasPrint || !canvasShow) return;

        const contextPrint = canvasPrint.getContext("2d");
        if (contextPrint) {
          canvasPrint.width = image.width;
          canvasPrint.height = image.height;
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

  // -----------------------
  // Print Message Handling
  // -----------------------
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

    /*     // DEV-ONLY patch for mock server
    trader.sendMessage = function (args) {
      console.log("Mock sendMessage called:", args.request?.slice?.(0, 200));
      this.onReceive({ traderSuccess: "true" });
    };
 */
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

    sendMessage(request);
  };

  // -----------------------
  // JSX Layout
  // -----------------------
  return (
    <>
      {/* Load StarWebPrint SDK before React runs */}
      <Script
        src="/starwebprint/StarWebPrintBuilder.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/starwebprint/StarWebPrintTrader.js"
        strategy="beforeInteractive"
      />

      <div className="p-6 space-y-4 font-sans ">
        {/* Overlay */}
        <div
          id="overlay"
          ref={overlayRef}
          className="fixed inset-0 bg-black/40 hidden transition-opacity"
        >
          <div
            id="nowPrintingWrapper"
            ref={nowPrintingRef}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-white text-center">
              <h1>Now Printing</h1>
              <p>
                <img
                  src="/starwebprint/images/icon_loading.gif"
                  alt="loading"
                />
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="flex justify-between items-center">
          <img
            src="/starwebprint/images/mias-logotype-box-copy-7518-web.jpg"
            alt="logo"
            className="h-4"
          />
        </header>

        {/* Paper Width Selector */}
        <div>
          <label>Paper Width</label>
          <select
            value={paperWidth}
            onChange={(e) =>
              changePaperWidth(e.target.value as "2inch" | "3inch")
            }
            className="border rounded p-1 ml-2"
          >
            <option value="2inch">2 inch (SM-S210i)</option>
            <option value="3inch">3 inch (TSP650II)</option>
          </select>
        </div>

        {/* Logo Selector */}
        {/*         <div>
          <label>Logo Selection</label>
          <select
            value={logoPath}
            onChange={(e) => {
              setLogoPath(e.target.value);
              changeLogo(paperWidth, e.target.value);
            }}
            className="border rounded p-1 ml-2"
          >
            <option value="/starwebprint/images/mias-logotype-box-copy-7518-web.jpg">
              02 Receipt Letter Japanese
            </option>
            <option value="/starwebprint/images/mias-logotype-box-copy-7518-web.jpg">
              03 Thanks Letter
            </option>
          </select>
        </div> */}

        {/* Canvases */}
        <div>
          <canvas ref={canvasPrintRef} hidden width={0} height={15}></canvas>
          <canvas ref={canvasShowRef}></canvas>
        </div>

        {/* Textarea */}
        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded p-2 font-mono text-sm mx-auto"
        />

        {/* Print Button */}
        <button
          onClick={onSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print
        </button>
      </div>
    </>
  );
}
