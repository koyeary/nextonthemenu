import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { X, Printer } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Text } from "@radix-ui/themes";
import { usePrinter } from "../../hooks/usePrinter";
import TicketCanvas from "../ticket/TicketCanvas";
import { DEFAULT_SETTINGS } from "@/lib/utils/constants";
import { TicketSettings } from "@/types/Ticket";

const PrintDialog: React.FC<PrintDialogProps> = ({ order, handlePrint }) => {
  const [settings, setSettings] = useState<TicketSettings>({
    order: order,
    ...DEFAULT_SETTINGS,
  });
  const { sendPrintJob, isPrinting, success } = usePrinter();

  const {
    //orderId,
    quantity,
    item,
    notes,
    //due,
    //price,
    customerName,
    email,
    phone,
  } = order;

  const router = useRouter();

  const push = () => {
    router.push("/print");
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger
          type="button"
          className="bg-violet-500 font-semibold text-white rounded-lg px-6 py-2 flex whitespace-nowrap items-center gap-3 hover:bg-violet-800 "
        >
          <Printer size={18} /> Print
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="w-screen h-screen bg-gray-300/80 fixed inset-0">
            <Dialog.Content className="absolute p-10 bg-gray-100 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl">
              <Dialog.Close className="absolute right-6 top-6  font-semibold text-zinc-400 gap-2 rounded-lg border flex whitespace-nowrap">
                <X />
              </Dialog.Close>

              <Dialog.Title className="py-2">
                <Text as="p" className="text-xl">
                  CONFIRM PRINT
                </Text>
              </Dialog.Title>
              {/*     <TicketCanvas
                order={settings.order}
                paperWidth={settings.paperWidth}
                font={settings.font}
                italic={settings.italic}
              /> */}

              <Button
                onClick={() => handlePrint(order)}
                className="bg-violet-500 font-semibold text-white  rounded-lg px-6 py-2 mx-auto mt-5 w-30 flex whitespace-nowrap items-center gap-3 hover:bg-violet-800"
              >
                {isPrinting ? (
                  "Printing..."
                ) : (
                  <>
                    <Printer size={22} /> OK
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
