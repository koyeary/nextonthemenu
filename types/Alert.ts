interface Alert {
  id: string | number;
  /* orderId: string; */
  items: string;
  quantity: number;
  notes: string;
  due: string | Date;
  customerName: string;
  contact: string;
  price: number;
  status: "pending" | "ready" | "complete";
}

export default Alert;
