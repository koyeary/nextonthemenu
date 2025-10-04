interface Order {
  id: string | number;
  orderId: string;
  status: "pending" | "ready" | "complete";
  due: Date;
  location: string;
  item: string;
  notes: string;
  quantity: number;
  price: number;
  customerName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default Order;
