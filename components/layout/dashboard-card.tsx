/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

//FOH only can mark an item picked up before or after print / print completed too
import { useEffect, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@radix-ui/themes";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ShoppingBag, CakeSlice, Printer, UndoDot, Trash } from "lucide-react";
import Order from "@/types/Order";
import { useUpdateOrder } from "@/hooks/useUpdateOrder";
import Script from "next/script";
//import PrintDialog from "../ui/print-dialog";
import Alert from "../ui/alert-dialog";
import Ticket from "../ticket/Ticket";
// --- Type Declarations for StarWebPrint SDK ---
declare global {
  interface Window {
    StarWebPrintTrader?: any;
    StarWebPrintBuilder?: any;
  }
}

interface TraderResponse {
  traderSuccess?: string;
  traderStatus?: unknown;
  status?: number;
  responseText?: string;
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

  // Helper: format date as "MM-DD"
  const format = (d) => {
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${month}-${day}`;
  };

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
  handlePrint,
  seeComplete,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    data: orders,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000, // optional: auto-refresh every 5s
  });
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [paperWidth, setPaperWidth] = useState<"2inch" | "3inch">("2inch");
  const [logoPath, setLogoPath] = useState("01-Receipt_Letter_ENG.bmp");
  const [text, setText] = useState("");
  const canvasShowRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const nowPrintingRef = useRef<HTMLDivElement | null>(null);

  // -----------------------
  // Lifecycle Initialization
  // -----------------------

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

      return res.json();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const getColor =
    status === "pending"
      ? "border-l-sky-700"
      : status === "ready"
        ? "border-l-cyan-700"
        : "border-l-teal-900";

  const updateOrder = useUpdateOrder();

  const handleStatusChange = (newStatus: string) => {
    updateOrder.mutate({
      id: order.uid,
      status: newStatus,
    });
  };

  if (isLoading)
    return (
      <Card key={order.id} className={`p-4 border-l-4 ${getColor} h-20`}>
        <p>Updating order status</p>
      </Card>
    );
  if (error) return <p>Error updating order</p>;

  // -----------------------
  // UI Display Helpers
  // -----------------------
  /*   const nowLoading = () => {
    if (overlayRef.current) overlayRef.current.style.display = "none";
  };

  const showNowPrinting = () => {
    if (overlayRef.current && nowPrintingRef.current) {
      overlayRef.current.style.display = "block";
      nowPrintingRef.current.style.display = "table";
    }
  };

  const hideNowPrinting = () => {
    if (!overlayRef.current || !nowPrintingRef.current) return;
    overlayRef.current.style.opacity = "0.0";
    overlayRef.current.style.transition = "all 0.3s";
    setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.style.display = "none";
        overlayRef.current.style.opacity = "1";
      }
    }, 300);
    nowPrintingRef.current.style.display = "none";
  }; */

  // -----------------------
  // Text + Paper Logic
  // -----------------------

  // -----------------------
  // Logo / Image Rendering
  // -----------------------

  // -----------------------
  // Print Message Handling
  // -----------------------

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
                    className="mr-1 bg-rose-700  hover:bg-rose-600  text-white gap-2"
                  >
                    <Trash /> {seeComplete ? "" : " DELETE"}
                  </Button>
                }
              />
              {status !== "pending" && (
                <Button
                  aria-hidden="false"
                  size="sm"
                  variant="outline"
                  className="mr-1 bg-amber-600  hover:bg-amber-400  text-white"
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
                      message={"CONFIRM OR EDIT DETAILS"}
                      description={<Ticket order={order} />}
                      responseA={"Cancel"}
                      responseB="PRINT"
                      icon={<Printer />}
                      handleConfirm={() => console.log("nevermind")}
                      action={
                        <Button className="bg-violet-800 font-semibold text-white  rounded-lg px-3 py-1 mx-auto flex whitespace-nowrap items-center gap-2 hover:bg-violet-500">
                          <Printer />
                          {seeComplete ? "" : " PRINT"}
                        </Button>
                      }
                    />
                  </>
                )}
                {status === "ready" && (
                  <Button
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
