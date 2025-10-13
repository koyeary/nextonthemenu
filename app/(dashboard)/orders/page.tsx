"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardCard from "@/components/layout/dashboard-card";
import Header from "@/components/layout/header";
import Script from "next/script";
//import Ticket from "../../../components/ticket/Ticket";
import Order from "@/types/Order";

const fetchOrders = async () => {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

const formatDate = (due: string | number | Date) => {
  const date = new Date(due);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedTime = date.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Ensures AM/PM format
  });

  return `${month}/${day} ${formattedTime}`;
};

function getHoliday(dateInput) {
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
    "01-01": "New Year's Day",
    "06-19": "Juneteenth National Independence Day",
    "07-04": "Independence Day",
    "11-11": "Veterans Day",
    "12-25": "Christmas Day",
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
    { date: nthWeekdayOfMonth(year, 10, 4, 4), name: "Thanksgiving Day" }, // 4th Thu in Nov
  ];

  // Check fixed-date holidays
  const formatted = format(date);
  if (fixedHolidays[formatted]) {
    return fixedHolidays[formatted];
  }

  // Check variable holidays
  for (const { date: d, name } of variableHolidays) {
    if (format(d) === formatted) {
      return name;
    }
  }

  return null;
}

const Orders = () => {
  const {
    data: orders,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000, // optional: auto-refresh every 5s
  });
  const [seeComplete, setSeeComplete] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  const handleClick = () => {
    setSeeComplete(!seeComplete);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const results = orders.filter((order) =>
      Object.entries(order).some(([key, val]) => {
        // If field looks like a date or timestamp
        if (
          key.toLowerCase().includes("date") ||
          key.toLowerCase().includes("due") ||
          key.toLowerCase().includes("created") ||
          key.toLowerCase().includes("updated") ||
          key.toLowerCase().includes("time")
        ) {
          try {
            const formatted = formatDate(val as string).toLowerCase();
            return formatted.includes(term);
          } catch {
            return false;
          }
        }

        // Default string match for non-date fields
        return String(val).toLowerCase().includes(term);
      })
    );

    setFilteredOrders(results);
  };

  if (isLoading) return <p>Loading orders…</p>;
  if (!orders) return <p>Filtering...</p>;
  if (error) return <p>Error loading orders</p>;

  const isFiltered = filteredOrders ? filteredOrders : orders;
  const pending = isFiltered.filter(
    (order: Order) => order.status === "pending"
  );
  const ready = isFiltered.filter((order: Order) => order.status === "ready");
  const complete = isFiltered.filter(
    (order: Order) => order.status === "completed"
  );

  return (
    <>
      <Script
        src="/starwebprint/StarWebPrintTrader.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/starwebprint/StarWebPrintBuilder.js"
        strategy="beforeInteractive"
      />
      <Header
        handleClick={handleClick}
        handleChange={handleChange}
        seeComplete={seeComplete}
      />
      <div
        className={`grid ${!seeComplete ? "grid-cols-2" : "grid-cols-3"} gap-6 max-w-11/12 mx-auto flex-wrap`}
      >
        <div>
          <div className="flex items-center justify-between mb-4 ml-5 text-xl">
            <div className="font-bold">PENDING</div>
          </div>
          <div className="space-y-3">
            {pending.map((order: Order) => (
              <DashboardCard
                holiday={getHoliday(order.due)}
                key={order.id}
                order={order}
                formatDate={formatDate}
                status="pending"
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 ml-5 text-xl">
            <div className="font-bold">READY</div>
          </div>
          <div className="space-y-3">
            {ready.map((order: Order) => (
              <DashboardCard
                key={order.id}
                order={order}
                formatDate={formatDate}
                status="ready"
                /*  print={<Ticket order={order} />} */
              />
            ))}
          </div>
        </div>

        {seeComplete && (
          <div>
            <div className="flex items-center justify-between mb-4 ml-5 text-xl">
              <div className="font-bold">COMPLETED</div>
            </div>
            <div className="space-y-3">
              {complete.map((order: Order) => (
                <DashboardCard
                  key={order.id}
                  order={order}
                  formatDate={formatDate}
                  status="completed"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
