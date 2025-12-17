/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Button } from "./button";
import { X, Printer } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Text } from "@radix-ui/themes";

type PrintDialogProps = {
  order;
};

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

const PrintDialog: React.FC<PrintDialogProps> = ({ order }) => {
  const canvasPrintRef = useRef<HTMLCanvasElement | null>(null);
  const canvasShowRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const nowPrintingRef = useRef<HTMLDivElement | null>(null);
  const [paperWidth, setPaperWidth] = useState<"2inch" | "3inch">("2inch");
  const [logoPath, setLogoPath] = useState("01-Receipt_Letter_ENG.bmp");
  const [text, setText] = useState("");

  const {
    orderId,
    quantity,
    item,
    notes,
    due,
    price,
    customerName,
    email,
    phone,
  } = order;

  const formatText = `${item.toUpperCase()}\nQuantity: ${quantity}\nNotes: ${notes}\nCustomer name: ${customerName}\nEmail: ${email}\nPhone: ${phone}`;

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
    return formatText;
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

    // DEV-ONLY PUT for mock server
    /* trader.sendMessage = function (args) {
      console.log("Mock sendMessage called:", args.request?.slice?.(0, 200));
      this.onReceive({ traderSuccess: "true" });
    }; */
    //end dev PUT

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

    console.log(request);
    //sendMessage(request);
  };

  return (
    <>
      <Script
        src="/starwebprint/StarWebPrintBuilder.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/starwebprint/StarWebPrintTrader.js"
        strategy="beforeInteractive"
      />
      <Dialog.Root>
        <Dialog.Trigger
          type="button"
          className="bg-violet-500 font-semibold text-white rounded-lg px-6 py-2 flex whitespace-nowrap items-center gap-3 hover:bg-violet-800"
        >
          <Printer />
        </Dialog.Trigger>
        <Dialog.Portal ref={canvasPrintRef}>
          <Dialog.Overlay className="w-screen h-screen bg-gray-300/80 fixed inset-0">
            <Dialog.Content className="absolute p-10 bg-gray-100 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl">
              <Dialog.Close className="absolute right-6 top-6  font-semibold text-zinc-400 gap-2 rounded-lg border flex whitespace-nowrap">
                <X />
              </Dialog.Close>
              <Dialog.Title className="py-2">
                <Text as="p" className="text-xl">
                  {item.toUpperCase()}
                </Text>
              </Dialog.Title>
              <Text as="p" className="text-lg font-semibold">
                Quantity: {quantity}
              </Text>
              <Text as="p" className="text-lg font-semibold">
                Notes: {notes}
              </Text>
              <Text as="p" className="text-lg">
                Customer Name: {customerName}
              </Text>
              <Text as="p" className="text-lg">
                Email: {email}
              </Text>
              <Text as="p" className="text-lg">
                Phone: {phone}
              </Text>
              <Button
                onClick={onSend}
                className="bg-violet-500 font-semibold text-white  rounded-lg px-6 py-2 mx-auto mt-5 w-30 flex whitespace-nowrap items-center gap-3 hover:bg-violet-800"
              >
                <Printer /> PRINT
              </Button>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default PrintDialog;
