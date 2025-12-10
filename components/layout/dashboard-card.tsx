"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { safeValue, getHoliday } from "../../lib/utils/helpers";
import { removeToStayOrGo } from "../../lib/utils/helpers";

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
}

const fetchOrders = async () => {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  order,
  status,
  formatDate,
  seeComplete,
}) => {
  const { error, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();

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
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: order.uid }),
      });

      if (!res.ok) throw new Error("Failed to delete order.");

      setMessage({ type: "success", text: "Order deleted successfully!" });
      queryClient.invalidateQueries(["orders"]); // REFRESH UI
    } catch (err) {
      setMessage({
        type: "error",
        text: "Error deleting order. Please try again.",
      });
    } finally {
      setIsProcessing(false);
      setShowToast(true);
    }
  };

  const getColor =
    status === "pending"
      ? "border-l-sky-700"
      : status === "ready"
        ? "border-l-cyan-700"
        : "border-l-teal-900";

  const updateOrder = useUpdateOrder();

  const handleStatusChange = async (newStatus: string) => {
    setIsProcessing(true);
    try {
      await updateOrder.mutateAsync({ id: order.uid, status: newStatus });
      setMessage({ type: "success", text: `Order marked as ${newStatus}!` });
      queryClient.invalidateQueries(["orders"]); // REFRESH UI
    } catch (err) {
      setMessage({ type: "error", text: "Status update failed." });
    } finally {
      setIsProcessing(false);
      setShowToast(true);
    }
    queryClient.invalidateQueries(["orders"]); // REFRESH UI
  };

  let ipCache: Record<string, string> | null = null;

  const loadIpCache = async () => {
    try {
      if (ipCache) return ipCache;

      const res = await fetch("/api/ips");
      if (!res.ok) throw new Error();

      const rows = await res.json();
      ipCache = {};

      rows.forEach((row) => {
        ipCache![row.station.toLowerCase()] = row.address;
      });

      return ipCache;
    } catch {
      setMessage({
        type: "error",
        text: "Failed to load printer configuration.",
      });
      setShowToast(true);
      return {};
    }
  };

  const getItemFromToken = async (token: string) => {
    try {
      const res = await fetch(`/api/inventory/${token}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.data;
    } catch {
      setMessage({ type: "error", text: "Failed to retrieve item details." });
      setShowToast(true);
      return null;
    }
  };

  const stationKeyFromCategory = (category: string) => {
    return removeToStayOrGo(category).toLowerCase().trim();
  };

  const getIp = async (order) => {
    // 1. Load item details via itemToken
    const item = await getItemFromToken(order.itemToken);

    if (!item) {
      //console.error("Item not found for token:", order.itemToken);
      return "172.16.1.254";
    }

    // 2. Normalize category → station
    const station = stationKeyFromCategory(item.category);

    // 3. Load IP config (cached after first fetch)
    const ips = await loadIpCache();

    // 4. Look up IP
    const ip = ips[station] ?? null;

    if (!ip) {
      console.warn(`No IP configured for station "${station}"`);
    }

    return ip;
  };

  const finishPrint = async () => {
    const printedAt = new Date().toISOString();
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/print/${order.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ printedAt }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();

      setMessage({ type: "success", text: "Print recorded successfully!" });
    } catch {
      setMessage({ type: "error", text: "Print update failed." });
    } finally {
      setIsProcessing(false);
      setShowToast(true);
      setShow(false);
      queryClient.invalidateQueries(["orders"]); // REFRESH UI
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Only send fields that were changed
    const updateData: Record<string, any> = {
      uid: order.uid,
      ...Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== undefined && v !== "")
      ),
    };

    try {
      const response = await fetch("/api/orders/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      // 🔴 Handle non-200 responses clearly
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || "Failed to update order.");
      }

      // Success
      setMessage({ type: "success", text: "Order updated successfully!" });

      setTimeout(() => {
        queryClient.invalidateQueries(["orders"]); // REFRESH UI
        setOpenUpdate(false);
        setMessage(null);
        setFormData({});
      }, 1500);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error?.message || "Failed to update order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      queryClient.invalidateQueries(["orders"]); // REFRESH UI
    }
  };

  if (isLoading)
    return (
      <Card
        key={order.itemToken}
        className={`p-4 border-l-4 ${getColor} h-20 align-middle`}
      >
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
            <div>
              <div className="flex items-center gap-3">
                <AlertDialog.Root
                  open={openUpdate}
                  onOpenChange={setOpenUpdate}
                >
                  <AlertDialog.Trigger asChild>
                    <Button
                      aria-hidden="false"
                      size="sm"
                      variant="outline"
                      className="bg-rose-700 hover:bg-rose-600 text-white px-3 py-1 relative top-0 right-0 ml-50 rounded align-top"
                    >
                      <FilePenLine />
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

                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 py-6">
                          {items.map((item) => (
                            <Grid
                              gap="2"
                              className="mt-3"
                              key={`${item}-${order.id}`}
                            >
                              <Text as="div" weight="bold" size="2" mb="1">
                                {camelToTitleCase(item)}
                              </Text>
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
                                              : order.location ===
                                                  "LF6HAV7DTAEKJ"
                                                ? "Times Square"
                                                : order.location
                                          : order[item]
                                )}
                                onChange={(e) =>
                                  handleFieldChange(item, e.target.value)
                                }
                                className="px-3 py-2 w-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </Grid>
                          ))}
                        </div>

                        <div className="flex justify-center gap-4 mt-6 mb-4">
                          <AlertDialog.Cancel asChild>
                            <Button
                              type="button"
                              aria-hidden="false"
                              size="sm"
                              variant="outline"
                              className=" w-50 bg-gray-300 h-10 hover:bg-gray-200 text-black gap-2 px-3 py-1"
                              disabled={isSubmitting}
                            >
                              Back
                            </Button>
                          </AlertDialog.Cancel>

                          <Button
                            type="submit"
                            aria-hidden="false"
                            size="sm"
                            variant="outline"
                            className="w-50 h-10 bg-blue-600 hover:bg-blue-500 text-white gap-2 px-3 py-1"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Updating..." : "Send"}
                          </Button>
                        </div>
                      </form>
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
                        <Ticket
                          order={order}
                          finishPrint={finishPrint}
                          getIp={getIp}
                        />
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
      {message && (
        <AlertDialog.Root open={showToast}>
          <AlertDialog.Content
            className={`w-100 z-100 rounded-lg shadow-lg px-5 py-3 absolute bottom-25 left-20 ${
              message.type === "error"
                ? "bg-rose-700 text-white text-lg"
                : "bg-emerald-400 text-lg"
            }`}
          >
            <AlertDialog.Title>
              {camelToTitleCase(message.type)}
            </AlertDialog.Title>
            <AlertDialog.Description size="2">
              {message.text}
            </AlertDialog.Description>
          </AlertDialog.Content>
        </AlertDialog.Root>
      )}
    </>
  );
};

export default DashboardCard;
