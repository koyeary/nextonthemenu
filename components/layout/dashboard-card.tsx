/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Printer } from "lucide-react";
import Order from "@/types/Order";
import { useUpdateOrder } from "@/hooks/useUpdateOrder";
import Script from "next/script";
import PrintDialog from "../ui/print-dialog";

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
    {
      date: nthWeekdayOfMonth(year, 0, 1, 3),
      name: "Martin Luther King Jr. Day",
    }, // 3rd Mon in Jan
    { date: nthWeekdayOfMonth(year, 1, 1, 3), name: "Presidents Day" }, // 3rd Mon in Feb
    { date: lastWeekdayOfMonth(year, 4, 1), name: "Memorial Day" }, // Last Mon in May
    { date: nthWeekdayOfMonth(year, 8, 1, 1), name: "Labor Day" }, // 1st Mon in Sep
    { date: nthWeekdayOfMonth(year, 9, 1, 2), name: "Columbus Day" }, // 2nd Mon in Oct
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
    if (diffDays === 1) return `${name} (in 1 day)`;
    if (diffDays === 2) return `${name} (in 2 days)`;
  }

  return null;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  order,
  status,
  formatDate,
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

  const router = useRouter();

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
    updateOrder.mutate({
      id: order.orderId,
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

  return (
    <Card key={order.id} className={`p-4 border-l-4 ${getColor}`}>
      <div className="flex flex-col w-full">
        {/*  <div className="flex items-start justify-between mb-2"> */}
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
          {/*    </div> */}
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
          </div>
          <div className="text-center flex-row font-bold text-red-500 text-xl">
            {getHoliday(order.due)?.toUpperCase()}
          </div>
          <div>
            {status === "ready" && <PrintDialog order={order} />}

            {status !== "ready" && (
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
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardCard;
