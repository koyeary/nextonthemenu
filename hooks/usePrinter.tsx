"use client";

import { useState, useCallback } from "react";
import { TraderConfig } from "@/types/printer";
import { PrinterService, PrintJobResult } from "@/lib/printer/printerService";

export interface UsePrinterReturn {
  isPrinting: boolean;
  progress: string;
  error: string | null;
  lastResult: PrintJobResult | null;
  sendPrintJob: (
    canvas: HTMLCanvasElement,
    config: TraderConfig
  ) => Promise<void>;
  clearError: () => void;
}

export function usePrinter(): UsePrinterReturn {
  const [isPrinting, setIsPrinting] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<PrintJobResult | null>(null);

  const sendPrintJob = useCallback(
    async (canvas: HTMLCanvasElement, config: TraderConfig): Promise<void> => {
      setIsPrinting(true);
      setError(null);
      setProgress("Initializing...");

      try {
        const result = await PrinterService.sendPrintJob(
          canvas,
          config,
          (status) => setProgress(status)
        );

        setLastResult(result);
        setProgress("");

        // Show result to user
        alert(result.message);
      } catch (err: any) {
        const errorMessage = err.message || "An unexpected error occurred";
        setError(errorMessage);
        setProgress("");

        // Ask user if they want to retry
        const retry = confirm(`${errorMessage}\n\nDo you want to retry?`);

        if (retry) {
          // Retry the print job
          return sendPrintJob(canvas, config);
        }
      } finally {
        setIsPrinting(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isPrinting,
    progress,
    error,
    lastResult,
    sendPrintJob,
    clearError,
  };
}
