interface Order {
  id: string | number;
  orderId: string;
  status: "pending" | "ready" | "complete";
  item: string;
  notes: string;
  due: Date;
  location: string;
  quantity: number;
  price: number;
  customerName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default Order;
