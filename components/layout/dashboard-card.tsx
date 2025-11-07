/* eslint-disable */

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
import { ShoppingBag, CakeSlice, Printer, UndoDot, Trash } from "lucide-react";
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
    } catch (err) {
      console.error("Update error:", err);
    }
  };

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

  const camelToTitleCase = (str: string): string => {
    return (
      str
        // Insert a space before all uppercase letters
        .replace(/([A-Z])/g, " $1")
        // Trim any leading space and capitalize the first letter
        .replace(/^./, (match) => match.toUpperCase())
        // Trim any extra whitespace
        .trim()
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      orderNumber,
      status: formData.get("status"),
      notes: formData.get("notes"),
      fulfillmentDate: formData.get("fulfillmentDate"),
    };

    try {
      const response = await fetch("/api/webhooks/square", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const result = await response.json();
      setMessage({ type: "success", text: "Order updated successfully!" });

      // Close drawer after success
      setTimeout(() => {
        onOpenChange(false);
        setMessage(null);
      }, 1500);
    } catch (error) {
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
          <div
            className={`flex items-center justify-between mb-2 ${status === "pending" ? "bg-sky-700 text-white" : status === "ready" ? "bg-cyan-600 text-white" : "bg-cyan-700 text-white"} p-4 rounded-md`}
          >
            <h1 className={`font-semibold`}>
              {order.customerName}
              {order.orderCount !== "1" ? ` - Item ${order.orderCount}` : ""}
            </h1>
            <div className="flex items-center justify-between mt-3 px-4 pb-4">
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <Button
                    aria-hidden="false"
                    size="sm"
                    variant="outline"
                    className="mr-1 bg-rose-700  hover:bg-rose-600  text-white gap-2 px-3 py-1"
                  >
                    <ShoppingBag /> {seeComplete ? "" : " update"}
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="AlertDialogOverlay" />
                  <AlertDialog.Content className="AlertDialogContent">
                    <AlertDialog.Title className="text-center font-semibold text-2xl mb-5">
                      Update
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-lg mx-auto w-fit">
                      Order #
                      <span className="font-semibold">{order.orderId}</span>
                    </AlertDialog.Description>

                    {/*            <div className="space-y-6 w-full mx-auto p-6 "> */}

                    <Flex
                      direction="column"
                      gap="3"
                      className="px-5 py-3 mb-5 overflow-auto"
                      value="form"
                    >
                      {items.map((item) => (
                        <Grid gap="3" className="mt-3">
                          <Text
                            key={order.item + order.id}
                            as="div"
                            weight="bold"
                            size="2"
                            mb="1"
                          >
                            {camelToTitleCase(item)}
                          </Text>
                          <TextField.Root
                            type="text"
                            id={item}
                            name={item}
                            placeholder={
                              item === "status"
                                ? camelToTitleCase(order[item])
                                : item === "due"
                                  ? formatDate(order.due)
                                  : item === "location"
                                    ? order.location === "L5MQCWDDVAYA6"
                                      ? " UES"
                                      : order.location === "L56CFWYF0H5JK"
                                        ? " Brooklyn"
                                        : order.location === "LF6HAV7DTAEKJ" &&
                                          " Times Square"
                                    : order[item]
                            }
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          >
                            <TextField.Slot>
                              <ShoppingBag
                                height="16"
                                width="16"
                                className="ml-2 mr-4"
                              />
                            </TextField.Slot>
                          </TextField.Root>
                        </Grid>
                      ))}

                      <Grid columns="2" gap="2" className="mt-5 ">
                        <Button
                          aria-hidden="false"
                          size="sm"
                          variant="outline"
                          className="mr-1 bg-gray-300  hover:bg-gray-200  text-black gap-2 px-3 py-1"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          aria-hidden="false"
                          size="sm"
                          variant="outline"
                          className="mr-1 bg-blue-600  hover:bg-blue-500  text-white gap-2 px-3 py-1"
                          onClick={(e) => {
                            const form = e.currentTarget
                              .closest(".flex.flex-col")
                              ?.querySelector("form");
                            if (form) {
                              form.dispatchEvent(
                                new Event("submit", {
                                  cancelable: true,
                                  bubbles: true,
                                })
                              );
                            }
                          }}
                        >
                          Send
                        </Button>
                      </Grid>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            </div>

            <p className="text-xs font-semibold text-right">
              <br /> OrderID: {order.id} <br />
              Location:
              {order.location === "L5MQCWDDVAYA6"
                ? " UES"
                : order.location === "L56CFWYF0H5JK"
                  ? " Brooklyn"
                  : order.location === "LF6HAV7DTAEKJ" && " Times Square"}
            </p>
          </div>
          <p className="pl-4">
            Item: <span className="font-semibold">{order.item}</span>
          </p>
          <p className="pl-4">
            Quantity: <span className="font-semibold">{order.quantity}</span>
          </p>
          <p className="pl-4">
            Notes: <span className="font-semibold">{order.notes}</span>
          </p>

          <p className="text-muted-foreground pl-4">
            Due: <span className="font-semibold">{formatDate(order.due)}</span>
          </p>
          <p className="text-muted-foreground pl-4">
            Created:{" "}
            <span className="font-semibold">{formatDate(order.createdAt)}</span>
          </p>

          <div className="space-y-1 text-sm"></div>

          <div className="flex items-center justify-between mt-3 px-4 pb-4">
            <div className="flex items-center gap-1">
              <Alert
                open={showDelete}
                setOpen={setShowDelete}
                message={"Are you sure you want to delete this order?"}
                description="This action cannot be undone."
                responseA={"Cancel"}
                responseB={"Delete Order"}
                handleConfirm={handleDelete}
                action={
                  <Button
                    aria-hidden="false"
                    size="sm"
                    variant="outline"
                    className="mr-1 bg-rose-700  hover:bg-rose-600  text-white gap-2 px-3 py-1"
                  >
                    <Trash /> {seeComplete ? "" : " DELETE"}
                  </Button>
                }
              />
              {status !== "pending" && (
                <Button
                  aria-hidden="false"
                  variant="outline"
                  size="sm"
                  className="mr-1 bg-amber-600  hover:bg-amber-400 text-white px-3 py-1"
                  onClick={() => handleStatusChange("pending")}
                >
                  <UndoDot /> {seeComplete ? "" : " PENDING"}
                </Button>
              )}
            </div>
            {getHoliday(order.due) && (
              <div className="w-full justify-center mx-auto flex mt-2 mb-2">
                {" "}
                <Badge variant="solid" radius="large" color="lime" size="3">
                  {getHoliday(order.due)?.toUpperCase()}
                </Badge>
              </div>
            )}
            <div>
              <div className="flex gap-2">
                {status !== "pending" && (
                  <>
                    <Alert
                      open={show}
                      setOpen={setShow}
                      message={"PRINT PREVIEW"}
                      description={
                        <Ticket order={order} finishPrint={finishPrint} />
                      }
                      action={
                        <Button
                          size="sm"
                          className={`${order.printedAt === null ? "bg-violet-800 " : "bg-fuchsia-700"}  font-semibold text-white  rounded-lg px-3 py-1 mx-auto flex whitespace-nowrap items-center gap-2 hover:bg-violet-500`}
                        >
                          <Printer />
                          {seeComplete
                            ? ""
                            : order.printedAt === null
                              ? " PRINT"
                              : " REPRINT"}
                        </Button>
                      }
                    />
                  </>
                )}
                {status === "ready" && order.printedAt !== null && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange("completed")}
                    className="bg-teal-500 font-semibold text-white  rounded-lg px-3 py-1 mx-auto flex whitespace-nowrap items-center gap-2 hover:bg-teal-400"
                  >
                    <ShoppingBag />
                    {seeComplete ? "" : " PICK UP"}
                  </Button>
                )}
              </div>

              {status === "pending" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange("ready")}
                  className="bg-sky-500  hover:bg-sky-400  font-semibold text-white  rounded-lg px-3 py-1 mx-auto flex whitespace-nowrap items-center gap-2"
                >
                  <CakeSlice /> {seeComplete ? "" : " READY"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DashboardCard;
