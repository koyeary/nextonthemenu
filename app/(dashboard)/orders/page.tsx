"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardCard from "@/components/layout/dashboard-card";
import Header from "@/components/layout/header";
import Script from "next/script";
import { printTicket } from "@/lib/printer/printTicket";
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
  const [filterHoliday, setFilterHoliday] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [printerUrl, setPrinterUrl] = useState(
    "http://localhost:8001/StarWebPRNT/SendMessage"
  );
  const [paperType, setPaperType] = useState("");
  const [printing, setPrinting] = useState(false);

  const handlePrint = async (order) => {
    if (!printerUrl.trim()) {
      alert("Please enter printer URL");
      return;
    }

    setPrinting(true);

    try {
      await printTicket(order, printerUrl, paperType);
      alert("✓ Receipt printed successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`✗ Print failed: ${message}`);
      console.error("Print error:", error);
    } finally {
      setPrinting(false);
    }
  };

  const handleClick = () => {
    setSeeComplete(!seeComplete);
  };

  const handleHolidaySearch = () => {
    setFilterHoliday(!filterHoliday);
    if (filterHoliday) {
      const results = orders.filter((order) =>
        Object.entries(order).some(([key, val]) => {
          // If field looks like a date or timestamp

          // Default string match for non-date fields
          return String(val).toLowerCase().includes("thanksgiving");
        })
      );
      return setFilteredOrders(results);
    }

    setFilteredOrders(orders);
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
        handleHolidaySearch={handleHolidaySearch}
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
                handlePrint={handlePrint}
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
