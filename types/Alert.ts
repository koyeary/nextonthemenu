interface AlertDialogInterface {
  command: string;
  message: string;
  description: string;
  responseA?: string;
  responseB: string;
  handleConfirm: () => void;
}

export default AlertDialogInterface;
