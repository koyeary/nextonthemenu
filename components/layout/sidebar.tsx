/* /* eslint-disable */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertDialog } from "radix-ui";
import { Label } from "@radix-ui/react-label";
import {
  Box,
  Badge,
  Flex,
  Grid,
  IconButton,
  Switch,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { Card } from "../ui/card";
import {
  ShoppingBag,
  CakeSlice,
  Printer,
  UndoDot,
  Trash,
  FilePenLine,
} from "lucide-react";
import Order from "@/types/Order";
import { useUpdateOrder } from "@/hooks/useUpdateOrder";
import Alert from "../ui/alert-dialog";
import { Button } from "../ui/button";
import Ticket from "../ticket/Ticket";

declare global {
  interface Window {
    StarWebPrintTrader?: any;
    StarWebPrintBuilder?: any;
  }
}

interface DashboardCardProps {
  formatDate: (date: string | Date) => string;
  status: string;
  order: Order;
  seeComplete?: boolean;
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
}

const fetchOrders = async () => {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

const getHoliday = (dateInput) => {
  const date = new Date(dateInput);
  const year = date.getFullYear();

  // Fixed-date holidays
  const fixedHolidays = {
    "01-01": "New Year's",
    "07-04": "July 4",
    "12-25": "Christmas",
  };

  // Helper: nth weekday of a month (e.g. 3rd Monday in January)
  const nthWeekdayOfMonth = (year, month, weekday, nth) => {
    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();
    const day = 1 + ((7 + weekday - firstWeekday) % 7) + 7 * (nth - 1);
    return new Date(year, month, day);
  };

  // Helper: last weekday of a month (e.g. last Monday in May)
  const lastWeekdayOfMonth = (year, month, weekday) => {
    const lastDay = new Date(year, month + 1, 0);
    const lastWeekday = lastDay.getDay();
    const day = lastDay.getDate() - ((7 + lastWeekday - weekday) % 7);
    return new Date(year, month, day);
  };

  // Variable-date holidays (U.S. federal)
  const variableHolidays = [
    { date: lastWeekdayOfMonth(year, 4, 1), name: "Memorial Day" }, // Last Mon in May
    { date: nthWeekdayOfMonth(year, 8, 1, 1), name: "Labor Day" }, // 1st Mon in Sep
    { date: nthWeekdayOfMonth(year, 10, 4, 4), name: "Thanksgiving" }, // 4th Thu in Nov
  ];

  // Combine all holidays into one array with Date objects
  const allHolidays = Object.entries(fixedHolidays)
    .map(([md, name]) => {
      const [month, day] = md.split("-").map(Number);
      return { date: new Date(year, month - 1, day), name };
    })
    .concat(variableHolidays);

  // Check if date is holiday or up to 2 days before
  for (const { date: holidayDate, name } of allHolidays) {
    const diffDays = Math.round((holidayDate - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return name; // exact holiday
    if (diffDays === 1) return `${name}`;
    if (diffDays === 2) return `${name}`;
  }

  return null;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  order,
  status,
  formatDate,
  seeComplete,
  openDrawer,
  setOpenDrawer,
}) => {
  const { error, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000,
  });
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const items = [
    "status",
    "item",
    "notes",
    "due",
    "location",
    "quantity",
    "customerName",
    "email",
    "phone",
  ];

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const camelToTitleCase = (str: string): string => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (match) => match.toUpperCase())
      .trim();
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: order.uid }),
      });

      console.log("Delete response:", res);

      fetchOrders();
      return res.json();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleOpenDrawer = (orderId: string, open, setOpen) => {
    setOpen(true);
    console.log(orderId);
    console.log(open);
  };

  const getColor =
    status === "pending"
      ? "border-l-sky-700"
      : status === "ready"
        ? "border-l-cyan-700"
        : "border-l-teal-900";

  const updateOrder = useUpdateOrder();

  const handleStatusChange = async (newStatus: string) => {
    await updateOrder.mutate({
      id: order.uid,
      status: newStatus,
    });

    console.log(`Status update success: ${(order.uid, newStatus)}`);
    return fetchOrders();
  };

  const finishPrint = async () => {
    const printedAt = new Date().toISOString();

    try {
      const res = await fetch(`/api/print/${order.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ printedAt }),
      });

      const data = await res.json();

      if (data) {
        console.log(`Printed at: ${data.printedAt}`);
        fetchOrders();
      }
      alert("print successful");
      setShow(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const safeValue = (value: any): string => {
    if (value === undefined || value === null) return "";
    return String(value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const updateData: Record<string, any> = {
      uid: order.uid,
      ...formData,
    };

    try {
      const response = await fetch("/api/orders/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      await response.json();
      setMessage({ type: "success", text: "Order updated successfully!" });

      setTimeout(() => {
        fetchOrders();
        setShowUpdate(false);
        setMessage(null);
        setFormData({});
      }, 1500);
    } catch (error) {
      console.error("Update error:", error);
      setMessage({
        type: "error",
        text: "Failed to update order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <Card key={order.itemToken} className={`p-4 border-l-4 ${getColor} h-20`}>
        <p>Updating order status</p>
      </Card>
    );
  if (error) return <p>Error updating order</p>;

  return (
    <>
      <Card key={order.id} className={`border-l-4 ${getColor}`}>
        <div className="flex flex-col w-full">
          {/* Header section */}
          <div
            className={`flex items-center justify-between mb-2 ${
              status === "pending"
                ? "bg-sky-700 text-white"
                : status === "ready"
                  ? "bg-cyan-600 text-white"
                  : "bg-cyan-700 text-white"
            } p-4 rounded-md`}
          >
            <div>
              <h1 className="font-semibold">
                {order.customerName}
                {order.orderCount !== "1" ? ` - Item ${order.orderCount}` : ""}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <Button
                    aria-hidden="false"
                    size="sm"
                    variant="outline"
                    className="bg-rose-700 hover:bg-rose-600 text-white px-3 py-1"
                  >
                    <FilePenLine />
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="AlertDialogOverlay" />
                  <AlertDialog.Content className="AlertDialogContent max-w-xl">
                    <AlertDialog.Title className="text-center font-semibold mb-4">
                      Update
                    </AlertDialog.Title>
                    <AlertDialog.Description className="mx-auto w-fit mb-2">
                      Order #
                      <span className="font-semibold">{order.orderId}</span>
                    </AlertDialog.Description>

                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-2 gap-4 px-3 pt-2 py-5">
                        {items.map((item) => (
                          <div
                            key={`${item}-${order.id}`}
                            className="flex flex-col space-y-1"
                          >
                            <label
                              htmlFor={item}
                              className="text-sm font-semibold text-gray-700"
                            >
                              {camelToTitleCase(item)}
                            </label>

                            <input
                              id={item}
                              name={item}
                              placeholder={camelToTitleCase(item)}
                              value={safeValue(
                                formData[item] !== undefined
                                  ? formData[item]
                                  : item === "status"
                                    ? order[item]
                                    : item === "due"
                                      ? order.due
                                      : item === "location"
                                        ? order.location === "L5MQCWDDVAYA6"
                                          ? "UES"
                                          : order.location === "L56CFWYF0H5JK"
                                            ? "Brooklyn"
                                            : order.location === "LF6HAV7DTAEKJ"
                                              ? "Times Square"
                                              : order.location
                                        : order[item]
                              )}
                              onChange={(e) =>
                                handleFieldChange(item, e.target.value)
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                        ))}
                      </div>

                      {message && (
                        <div
                          className={`p-4 rounded-lg mt-4 mx-8 ${
                            message.type === "success"
                              ? "bg-green-50 text-green-800 border border-green-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          {message.text}
                        </div>
                      )}

                      <div className="flex justify-center gap-2 mt-6 mb-4">
                        <AlertDialog.Cancel asChild>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="bg-gray-300 hover:bg-gray-200 w-50 text-black px-6 py-2"
                            disabled={isSubmitting}
                          >
                            Back
                          </Button>
                        </AlertDialog.Cancel>

                        <Button
                          type="submit"
                          size="sm"
                          variant="default"
                          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py- w-50"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Updating..." : "Send"}
                        </Button>
                      </div>
                    </form>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>

              <p className="text-xs font-semibold text-right leading-tight">
                OrderID: {order.id}
                <br />
                Location:
                {order.location === "L5MQCWDDVAYA6"
                  ? " UES"
                  : order.location === "L56CFWYF0H5JK"
                    ? " Brooklyn"
                    : order.location === "LF6HAV7DTAEKJ" && " Times Square"}
              </p>
            </div>
          </div>

          {/* Order details below header */}
          <div className="space-y-1 pl-4">
            <p>
              Item: <span className="font-semibold">{order.item}</span>
            </p>
            <p>
              Quantity: <span className="font-semibold">{order.quantity}</span>
            </p>
            <p>
              Notes: <span className="font-semibold">{order.notes}</span>
            </p>
            <p className="text-muted-foreground">
              Due:{" "}
              <span className="font-semibold">{formatDate(order.due)}</span>
            </p>
            <p className="text-muted-foreground">
              Created:{" "}
              <span className="font-semibold">
                {formatDate(order.createdAt)}
              </span>
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DashboardCard;
