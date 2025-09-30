import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Alert from "../ui/alert-dialog";
import { Printer } from "lucide-react";
//import { updateOrderStatus } from "@/utils/API";

interface DashboardCardProps {
  formatDate: (date: string | Date) => string;
  status: string;
  order: {
    id: string | number;
    /*    orderId: string; */
    items: string;
    quantity: number;
    notes: string;
    due: string | Date;
    customerName: string;
    contact: string;
    price: number;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  order,
  status,
  formatDate,
}) => {
  const getColor =
    status === "pending"
      ? "border-l-yellow-400"
      : status === "ready"
        ? "border-l-green-600"
        : "border-l-gray-400";

  const getCommand =
    status === "pending" ? "Ready" : status === "ready" ? "Pick Up" : "Undo";

  const handleUpdate = (id: number, status: string) => {
    fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        response.json();
        return window.location.reload();
      })
      .then((data) => {
        console.log("Order updated successfully:", data);
      })
      .catch((error) => {
        console.error("Error updating order:", error);
      });

    // window.location.reload();
  };

  return (
    <Card key={order.id} className={`p-4 border-l-4 ${getColor}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-semibold ">
            {order.quantity} {order.items}{" "}
          </h1>
          <p>
            Modifications: <span className="font-semibold">{order.notes}</span>
          </p>

          <p className="text-muted-foreground">
            Due: <span className="font-semibold">{formatDate(order.due)}</span>
          </p>
        </div>
      </div>
      <div className="space-y-1 text-sm">
        <p>Quantity: {order.quantity}</p>
        <p className="text-sm text-muted-foreground">
          Name: <span className="font-semibold">{order.customerName}</span>
        </p>
        <p>
          Contact: <span className="font-semibold">{order.contact}</span>
        </p>
      </div>
      <div className="flex items-center justify-between mt-3">
        {/*       <span className="text-sm text-muted-foreground">
          ${order.price * order.quantity}
        </span> */}

        {status === "pending" && (
          <Button
            size="sm"
            variant="outline"
            className="mr-1 bg-violet-500 text-white"
            onClick={() => handleUpdate(Number(order.id), "pending")}
          >
            <Printer /> Reprint
          </Button>
        )}

        <div>
          {status === "ready" && (
            <Button
              size="sm"
              variant="outline"
              className="mr-1 bg-yellow-500 text-white"
              onClick={() => handleUpdate(Number(order.id), "pending")}
            >
              Undo
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className={
              status === "pending"
                ? "bg-green-600 text-white"
                : status === "ready"
                  ? "bg-blue-500 text-white"
                  : "bg-red-400 text-white"
            }
            onClick={() => {
              console.log(order.id, status);
              handleUpdate(
                Number(order.id),
                status === "pending"
                  ? "ready"
                  : status === "ready"
                    ? "completed"
                    : "pending"
              );
            }}
          >
            {getCommand}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DashboardCard;
