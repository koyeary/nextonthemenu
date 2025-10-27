"use client";
import { useRef, useState } from "react";
import Ticket from "@/components/ticket/Ticket";
//import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { DEFAULT_SETTINGS } from "@/lib/utils/constants";
import { TicketSettings } from "@/types/Ticket";
import { usePrinter } from "@/hooks/usePrinter";

const Print = ({ order }) => {
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
      <Ticket order={order} />
    </>
  );
};

export default Print;
