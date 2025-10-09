/* eslint-disable */
"use client";
import { useState, useCallback } from "react";
import { buildPrinterXml } from "./printerUtils";

export function usePrinter() {
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const printText = useCallback(async (text: string) => {
    setIsPrinting(true);
    setError(null);
    setSuccess(false);

    try {
      const xml = buildPrinterXml(text);
      const res = await fetch("https://172.16.1.254/StarWebPRNT/SendMessage", {
        method: "POST",
        headers: { "Content-Type": "text/xml; charset=utf-8" },
        body: xml,
      });

      const result = await res.text();
      if (!res.ok) throw new Error(`Printer error: ${res.status}`);

      setSuccess(true);
      console.log("🖨️ Print success:", result);
    } catch (err: any) {
      console.error("❌ Printer failed:", err);
      setError(err.message);
    } finally {
      setIsPrinting(false);
    }
  }, []);

  return { printText, isPrinting, error, success };
}
