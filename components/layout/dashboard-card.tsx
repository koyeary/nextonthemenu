import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Alert from "../ui/alert-dialog";
import { Printer } from "lucide-react";
import Order from "@/types/Order";
import { useUpdateOrder } from "@/hooks/useUpdateOrder";

interface DashboardCardProps {
  formatDate: (date: string | Date) => string;
  status: string;
  order: Order;
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

  const updateOrder = useUpdateOrder();

  const handleStatusChange = (newStatus: string) => {
    updateOrder.mutate({ id: order.orderId, status: newStatus });
  };

  return (
    <Card key={order.id} className={`p-4 border-l-4 ${getColor}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-semibold ">
            {order.quantity} {order.item}{" "}
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
          Email: <span className="font-semibold">{order.email}</span>
        </p>
        <p>
          Phone: <span className="font-semibold">{order.phone}</span>
        </p>
      </div>
      <div className="flex items-center justify-between mt-3">
        {status === "pending" && (
          <Button
            aria-hidden="false"
            size="sm"
            variant="outline"
            className="mr-1 bg-violet-500 text-white"
            onClick={() => handleStatusChange("pending")}
          >
            <Printer /> Reprint
          </Button>
        )}

        <div>
          {status === "ready" && (
            <Button
              aria-hidden="false"
              size="sm"
              variant="outline"
              className="mr-1 bg-yellow-500 text-white"
              onClick={() => handleStatusChange("pending")}
            >
              Undo
            </Button>
          )}
          <Button
            aria-hidden="false"
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
              handleStatusChange(
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
