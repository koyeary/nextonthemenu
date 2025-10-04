import * as React from "react";
import { AlertDialog } from "radix-ui";
import { Button } from "./button";

type AlertProps = {
  command: string;
  message: string;
  description: string;
  responseA?: string;
  responseB: string;
  handleAction: () => void;
  handleConfirm: () => void;
};
const Alert: React.FC<AlertProps> = ({
  command,
  message,
  description,
  responseA,
  responseB,
  handleAction,
  handleConfirm,
}) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>
      <Button size="sm" variant="default" onClick={handleAction}>
        {command}
      </Button>
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="AlertDialogOverlay" />
      <AlertDialog.Content className="AlertDialogContent">
        <AlertDialog.Title className="AlertDialogTitle">
          {message}
        </AlertDialog.Title>
        <AlertDialog.Description className="AlertDialogDescription">
          {description}
        </AlertDialog.Description>
        <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
          {responseA && (
            <AlertDialog.Cancel asChild>
              <Button className="Button mauve">{responseA}</Button>
            </AlertDialog.Cancel>
          )}
          <AlertDialog.Action asChild>
            <Button onClick={handleConfirm} className="Button red">
              {responseB}
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default Alert;
