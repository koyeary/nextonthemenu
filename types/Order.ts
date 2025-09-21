interface Order {
  id: string | number;
  /* orderId: string; */
  items: string;
  quantity: number;
  notes: string;
  due: string | Date;
  customer_name: string;
  contact: string;
  price: number;
  status: "pending" | "ready" | "complete";
}

export default Order;
