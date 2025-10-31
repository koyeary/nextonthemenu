"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardCard from "@/components/layout/dashboard-card";
import Header from "@/components/layout/header";
import Script from "next/script";
import Order from "@/types/Order";
//import { retrieveAllOrders } from "../../api/square/route";

const fetchOrders = async () => {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

const formatDate = (due: string | number | Date) => {
  const date = new Date(due);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  /*   const formattedTime = date.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Ensures AM/PM format 
  }); */

  return `${month}/${day}/${year}`;
};

const Orders = () => {
  const {
    data: orders,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 2000,
  });

  const [seeComplete, setSeeComplete] = useState<boolean>(false);
  const [filterHoliday, setFilterHoliday] = useState<boolean>(false);
  const [filterTodayOrTomorrow, setFilterTodayOrTomorrow] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [printerUrl, setPrinterUrl] = useState(
    "https://172.16.1.1/StarWebPRNT/SendMessage"
  );
  const [printing, setPrinting] = useState(false);
  const [range, setRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  const ordersByDate = ([startDate, endDate]) => {
    setRange([startDate, endDate]);
    if (!startDate || !endDate) {
      return setFilteredOrders(orders);
    }
    const start = startDate;
    const end = endDate;

    const results = orders.filter((item) => {
      const itemDate = item.due;
      return itemDate >= start && itemDate <= end;
    });

    setFilteredOrders(results);
  };

  const handlePrint = async (token) => {
    const xml = "test print";
    const printTicket = await fetch("/api/print", {
      method: "POST",
      headers: { "Content-Type": "text/xml; charset=utf-8" },
      body: { xml, token },
    });

    try {
      console.log(printTicket);
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

  const getNextHoliday = (dateInput = new Date()) => {
    const date = new Date(dateInput);
    const year = date.getFullYear();

    const format = (d) => {
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${month}/${day}`;
    };

    // Fixed-date holidays
    const holidays = [
      { name: "New Year's", date: new Date(`${year}-01-01`) },
      { name: "Memorial Day", date: lastWeekdayOfMonth(1, 4, year) }, // Last Monday of May
      { name: "July 4", date: new Date(`${year}-07-04`) },
      { name: "Labor Day", date: nthWeekdayOfMonth(1, 1, 8, year) }, // 1st Monday of Sep
      { name: "Thanksgiving", date: nthWeekdayOfMonth(4, 4, 10, year) }, // 4th Thursday of Nov
      { name: "Christmas", date: new Date(`${year}-12-25`) },
    ];

    // If all holidays for the year have passed, check next year's New Year
    const next = holidays.find((h) => h.date > date) || {
      name: "New Year's",
      date: new Date(`${year + 1}-01-01`),
    };

    return {
      name: next.name,
      date: format(next.date),
    };

    // --- Helpers ---

    // nth occurrence of weekday (0=Sun, 1=Mon, ...) in a month
    function nthWeekdayOfMonth(n, weekday, month, y) {
      const first = new Date(y, month, 1);
      const day = first.getDay();
      const offset = (weekday - day + 7) % 7;
      const date = 1 + offset + (n - 1) * 7;
      return new Date(y, month, date);
    }

    // last occurrence of weekday in a month
    function lastWeekdayOfMonth(weekday, month, y) {
      const last = new Date(y, month + 1, 0);
      const day = last.getDay();
      const offset = day >= weekday ? day - weekday : 7 - (weekday - day);
      return new Date(y, month + 1, 0 - offset);
    }
  };

  const handleHolidaySearch = () => {
    //  retrieveAllOrders();
    const newFilterState = !filterHoliday; // compute next value first
    setFilterHoliday(newFilterState);

    if (newFilterState) {
      const results = orders.filter(
        (order) => getHoliday(order.due) === getNextHoliday(Date.now()).name
      );
      setFilteredOrders(results);
    } else {
      setFilteredOrders(orders);
    }
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

  const todayOrTomorrow = (dateInput) => {
    const date = new Date(dateInput);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    ) {
      return "Today";
    }

    if (
      date.getFullYear() === tomorrow.getFullYear() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getDate() === tomorrow.getDate()
    ) {
      return "Tomorrow";
    }
  };

  const handleTomorrow = () => {
    const newFilterState = !filterTodayOrTomorrow;
    setFilterTodayOrTomorrow(newFilterState);

    if (newFilterState) {
      const results = orders.filter(
        (order) => todayOrTomorrow(order.due) === "Tomorrow"
      );
      setFilteredOrders(results);
    } else {
      setFilteredOrders(orders);
    }
  };
  const handleToday = () => {
    const newFilterState = !filterTodayOrTomorrow;
    setFilterTodayOrTomorrow(newFilterState);

    if (newFilterState) {
      const results = orders.filter(
        (order) => todayOrTomorrow(order.due) === "Today"
      );
      setFilteredOrders(results);
    } else {
      setFilteredOrders(orders);
    }
  };

  const ordersByLocation = (locationCode: string) => {
    console.log("Filtering by location:", locationCode);
    if (locationCode === "all") {
      return setFilteredOrders(orders);
    }

    const results = orders.filter((order) => order.location === locationCode);
    console.log(locationCode);
    setFilteredOrders(results);
  };

  if (isLoading) return <p>Loading orders…</p>;
  if (!orders) return <p>Filtering...</p>;
  if (error) return <p>Error loading orders</p>;

  const isFiltered = filteredOrders ? filteredOrders : orders;
  const pending = isFiltered
    .filter((order: Order) => order.status === "pending")
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

  const ready = isFiltered
    .filter((order: Order) => order.status === "ready")
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

  const complete = isFiltered
    .filter((order: Order) => order.status === "completed")
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

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
        handleToday={handleToday}
        handleTomorrow={handleTomorrow}
        handleHolidaySearch={handleHolidaySearch}
        handleClick={handleClick}
        handleChange={handleChange}
        seeComplete={seeComplete}
        nearestHoliday={getNextHoliday()}
        setRange={ordersByDate}
        range={range}
        searchTerm={searchTerm}
        selectedLocation={selectedLocation}
        setSelectedLocation={ordersByLocation}
      />
      <div
        className={`grid ${!seeComplete ? "grid-cols-2" : "grid-cols-3"} gap-6 max-w-11/12 mx-auto flex-wrap pb-10 h-screen flex scrollbar-none`}
      >
        <div className="h-screen overflow-auto">
          <div className="flex items-center justify-between mb-4 ml-5 text-2xl">
            <div className="font-bold">PENDING</div>
          </div>
          <div className="space-y-3  pb-100">
            {pending.map((order: Order) => (
              <DashboardCard
                key={order.id}
                order={order}
                formatDate={formatDate}
                status="pending"
                seeComplete={seeComplete}
              />
            ))}
          </div>
        </div>

        <div className="h-screen overflow-auto">
          <div className="flex items-center justify-between mb-4 ml-5 text-2xl">
            <div className="font-bold">READY</div>
          </div>
          <div className="space-y-3 pb-100">
            {ready.map((order: Order) => (
              <DashboardCard
                todayOrTomorrow={todayOrTomorrow}
                key={order.id}
                order={order}
                formatDate={formatDate}
                status="ready"
                handlePrint={handlePrint}
                seeComplete={seeComplete}
              />
            ))}
          </div>
        </div>

        {seeComplete && (
          <div className="h-screen overflow-auto pb-100">
            <div className="flex items-center justify-between mb-4 ml-5 text-xl">
              <div className="font-bold">COMPLETED</div>
            </div>
            <div className="space-y-3 ">
              {complete.map((order: Order) => (
                <DashboardCard
                  todayOrTomorrow={todayOrTomorrow}
                  key={order.id}
                  order={order}
                  formatDate={formatDate}
                  status="completed"
                  seeComplete={seeComplete}
                  handlePrint={handlePrint}
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
