"use client";
import { useRef, useState } from "react";
import TicketHeader from "@/components/ticket/TicketHeader";
import TicketFooter from "@/components/ticket/TicketFooter";
import TicketCanvas from "@/components/ticket/TicketCanvas";
import TicketOptions from "@/components/ticket/TicketOptions";
import PrintControls from "@/components/ticket/PrintControls";
//import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { DEFAULT_SETTINGS } from "@/lib/utils/constants";
import { TicketSettings } from "@/types/Ticket";
import { usePrinter } from "@/hooks/usePrinter";

const Ticket = ({ order }) => {
  console.log(order);
  const [settings, setSettings] = useState<TicketSettings>(DEFAULT_SETTINGS);
  const [isLibrariesLoaded, setIsLibrariesLoaded] = useState(false);
  const canvasRef = useRef<ReceiptCanvasRef>(null);
  const { isPrinting, progress, error, lastResult, sendPrintJob, clearError } =
    usePrinter();

  const handleSend = () => {
    setIsPrinting(true);

    // TODO: Implement actual printing logic using StarWebPrintBuilder and StarWebPrintTrader
    // This will be addressed in the next phase
    sendPrintJob();

    setTimeout(() => {
      setIsPrinting(false);
      alert("Print functionality will be implemented in the next phase");
    }, 1000);
  };

  return (
    <>
      {/*       <LoadingOverlay message="Now Printing" show={isPrinting} />
       */}
      {/*      <TicketHeader /> */}

      {/*     <section className="btmMg20">
        <h2 className="h2-tit-01 btmMg20">Canvas : Ticket</h2>
      </section> */}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="container">
          <div className="wrapper">
            <TicketCanvas
              order={order}
              paperWidth={settings.paperWidth}
              font={settings.font}
              italic={settings.italic}
            />{" "}
          </div>

          {/*         <TicketOptions
            font={settings.font}
            italic={settings.italic}
            paperWidth={settings.paperWidth}
            onFontChange={(font) => setSettings({ ...settings, font })}
            onItalicChange={(italic) => setSettings({ ...settings, italic })}
            onPaperWidthChange={(paperWidth) =>
              setSettings({ ...settings, paperWidth })
            }
          /> */}

          <hr />
          {/* 
          <PrintControls
            url={settings.url}
            paperType={settings.paperType}
            onUrlChange={(url) => setSettings({ ...settings, url })}
            onPaperTypeChange={(paperType) =>
              setSettings({ ...settings, paperType })
            }
            onSend={handleSend}
          /> */}
        </div>
      </form>

      <div className="to-top">
        <a href="#global-header">Go to top</a>
      </div>

      {/*       <TicketFooter /> */}
    </>
  );
};

export default Ticket;
