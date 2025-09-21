interface Order {
  id: string | number;
  pin: string;
  name: string;
  role: "admin" | "staff";
}

export default Order;
