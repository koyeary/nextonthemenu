/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Button } from "./button";
import { X, Printer } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Text } from "@radix-ui/themes";
import { usePrinter } from "@/lib/printing/usePrinter.ts";

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
  const { printText, isPrinting, success } = usePrinter();

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

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger
          type="button"
          className="bg-violet-500 font-semibold text-white rounded-lg px-6 py-2 flex whitespace-nowrap items-center gap-3 hover:bg-violet-800"
        >
          <Printer />
        </Dialog.Trigger>
        <Dialog.Portal>
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
                onClick={() => printText(formatText)}
                className="bg-violet-500 font-semibold text-white  rounded-lg px-6 py-2 mx-auto mt-5 w-30 flex whitespace-nowrap items-center gap-3 hover:bg-violet-800"
              >
                {isPrinting ? (
                  "Printing..."
                ) : (
                  <>
                    <Printer /> PRINT
                  </>
                )}
              </Button>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default PrintDialog;
