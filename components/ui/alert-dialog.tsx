import * as React from "react";
import { AlertDialog } from "radix-ui";
import { Button } from "./button";

type AlertProps = {
  action: object;
  command: string;
  message: string;
  description: string;
  responseA?: string;
  responseB: string;
  handleAction: () => void;
  handleConfirm: () => void;
};
const Alert: React.FC<AlertProps> = ({
  icon,
  action,
  message,
  description,
  responseA,
  responseB,
  handleConfirm,
}) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>{action}</AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="AlertDialogOverlay" />
      <AlertDialog.Content className="AlertDialogContent">
        <AlertDialog.Title className="text-center font-semibold text-2xl mb-5">
          {message}
        </AlertDialog.Title>
        <AlertDialog.Description className="AlertDialogDescription">
          {description}
        </AlertDialog.Description>
        <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
          {responseA && (
            <AlertDialog.Cancel asChild>
              <Button className="bg-gray-400 rounded-sm">{responseA}</Button>
            </AlertDialog.Cancel>
          )}
          <AlertDialog.Action asChild>
            <Button
              onClick={handleConfirm}
              className={
                responseB === "PRINT"
                  ? "bg-violet-600 rounded-sm"
                  : "bg-blue-500 rounded-sm"
              }
            >
              {icon} {responseB}
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default Alert;
