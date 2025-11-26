"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardCard from "@/components/layout/dashboard-card";
import Header from "@/components/layout/header";
import Script from "next/script";
import Order from "@/types/Order";
import OrderDrawer from "../../../components/ui/order-drawer";
import IPAddressDialog from "../../../components/layout/ip-address-dialog";

type FilterType =
  | "none"
  | "location"
  | "Today"
  | "Tomorrow"
  | "holiday"
  | "date"
  | "searchbar"
  | "completed";

// --- API ---
const fetchOrders = async (): Promise<Order[]> => {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  console.log("Fetched orders from API");
  return res.json();
};

// --- Utils ---
const formatDate = (due: string | number | Date): string => {
  const date = new Date(due);
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}/${date.getFullYear()}`;
};

// --- Component ---
const Orders = () => {
  const {
    data: orders = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000,
  });

  const [activeFilter, setActiveFilter] = useState<FilterType>("none");
  const [seeComplete, setSeeComplete] = useState(false);
  const [filterHoliday, setFilterHoliday] = useState(false);
  const [filterTodayOrTomorrow, setFilterTodayOrTomorrow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [range, setRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [filteredOrders, setFilteredOrders] = useState<Order[] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [open, setOpen] = useState<boolean>(false);

  // --- Filter logic ---
  const openFilter = (filter: FilterType) => {
    console.log(activeFilter);
    setActiveFilter((prev) => (prev === filter ? "none" : filter));
    if (filter !== "searchbar") setSearchTerm("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const results = orders.filter((order) =>
      Object.entries(order).some(([key, val]) => {
        if (typeof val !== "string" && typeof val !== "number") return false;

        const strVal =
          key.toLowerCase().includes("date") ||
          key.toLowerCase().includes("due")
            ? formatDate(val as string).toLowerCase()
            : String(val).toLowerCase();

        return strVal.includes(term);
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

    setActiveFilter("Tomorrow");
    if (newFilterState) {
      const results = orders.filter(
        (order) => todayOrTomorrow(order.due) === "Tomorrow"
      );
      setFilteredOrders(results);
    } else {
      setFilteredOrders(orders);
      setActiveFilter("none");
    }
  };
  const handleToday = () => {
    const newFilterState = !filterTodayOrTomorrow;
    setFilterTodayOrTomorrow(newFilterState);

    setActiveFilter("Today");
    if (newFilterState) {
      const results = orders.filter(
        (order) => todayOrTomorrow(order.due) === "Today"
      );
      setFilteredOrders(results);
    } else {
      setFilteredOrders(orders);
      setActiveFilter("none");
    }
  };

  const ordersByDate = ([startDate, endDate]: [
    string | null,
    string | null,
  ]) => {
    setRange([startDate, endDate]);

    if (!startDate || !endDate) return setFilteredOrders(orders);

    const results = orders.filter(
      (item) =>
        new Date(item.due) >= new Date(startDate) &&
        new Date(item.due) <= new Date(endDate)
    );
    setFilteredOrders(results);
  };

  const ordersByLocation = (locationCode: string) => {
    openFilter("location");
    console.log("Filtering by location:", locationCode);
    setSelectedLocation(locationCode);

    if (locationCode === "all") return setFilteredOrders(orders);
    setFilteredOrders(orders.filter((o) => o.location === locationCode));
  };

  // --- Holiday helpers (trimmed + fixed) ---
  const getNextHoliday = () => {
    const now = new Date();
    console.log("get next holiday");
    const year = now.getFullYear();
    const holidays = [
      { name: "New Year's", date: new Date(`${year}-01-01`) },
      { name: "Memorial Day", date: new Date(`${year}-05-27`) },
      { name: "July 4", date: new Date(`${year}-07-04`) },
      { name: "Labor Day", date: new Date(`${year}-09-01`) },
      { name: "Thanksgiving", date: new Date(`${year}-11-28`) },
      { name: "Christmas", date: new Date(`${year}-12-25`) },
    ];
    console.log(holidays.find((h) => h.date > now) || holidays[0]);
    return holidays.find((h) => h.date > now) || holidays[0];
  };

  const getHoliday = (dateInput) => {
    const date = new Date(dateInput);
    const year = date.getFullYear();

    const fixedHolidays = {
      "01-01": "New Year's",
      "07-04": "July 4",
      "12-25": "Christmas",
    };

    const nthWeekdayOfMonth = (year, month, weekday, nth) => {
      const first = new Date(year, month, 1).getDay();
      const day = 1 + ((7 + weekday - first) % 7) + 7 * (nth - 1);
      return new Date(year, month, day);
    };

    const lastWeekdayOfMonth = (year, month, weekday) => {
      const last = new Date(year, month + 1, 0);
      const day = last.getDate() - ((7 + last.getDay() - weekday) % 7);
      return new Date(year, month, day);
    };

    const variableHolidays = [
      { date: lastWeekdayOfMonth(year, 4, 1), name: "Memorial Day" },
      { date: nthWeekdayOfMonth(year, 8, 1, 1), name: "Labor Day" },
      { date: nthWeekdayOfMonth(year, 10, 4, 4), name: "Thanksgiving" },
    ];

    const allHolidays = Object.entries(fixedHolidays)
      .map(([md, name]) => {
        const [month, day] = md.split("-").map(Number);
        return { date: new Date(year, month - 1, day), name };
      })
      .concat(variableHolidays);

    for (const { date: holiday, name } of allHolidays) {
      const diffDays = Math.round((holiday - date) / 86400000);
      if (diffDays >= 0 && diffDays <= 2) return name;
    }

    return null;
  };

  const handleHoliday = () => {
    const newState = !filterHoliday;
    setFilterHoliday(newState);
    const nextHoliday = getNextHoliday().name;
    if (newState) {
      // Filter for orders that fall on or near a holiday
      const holidays = orders.filter((order) => getHoliday(order.due));
      const results = holidays.filter(
        (order) => getHoliday(order.due) === nextHoliday
      );

      setFilteredOrders(results);
    } else {
      // Reset to all orders
      setFilteredOrders(orders);
    }

    // Optional: track filter name for consistent UI
    setActiveFilter((prev) => (prev === "holiday" ? "none" : "holiday"));
  };

  // --- Derived data ---
  const displayedOrders = filteredOrders !== null ? filteredOrders : orders;

  const sorted = (status: string) =>
    displayedOrders
      .filter((o) => o.status === status)
      .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

  const pending = sorted("pending");
  const ready = sorted("ready");
  const complete = sorted("completed");

  useEffect(() => {
    if (activeFilter === "holiday") handleHoliday();
    else if (activeFilter === "Today") handleToday();
    else if (activeFilter === "Tomorrow") handleTomorrow();
  }, [orders]);

  useEffect(() => {
    if (filterHoliday) {
      const results = orders.filter(
        (order) => getHoliday(order.due) === getNextHoliday().name
      );
      setFilteredOrders(results);
    }
  }, [orders]);

  if (isLoading)
    return (
      <div className="w-[100vw] h-[95vh] flex justify-center">
        {" "}
        <div className="w-10 h-10 border-4 m-auto border-indigo-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (error) return <p>Error loading orders</p>;

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
        activeFilter={activeFilter}
        handleToday={handleToday}
        handleTomorrow={handleTomorrow}
        handleHoliday={handleHoliday}
        handleClick={() => setSeeComplete((prev) => !prev)}
        handleChange={handleChange}
        openFilter={openFilter}
        seeComplete={seeComplete}
        nearestHoliday={getNextHoliday()}
        setRange={ordersByDate}
        range={range}
        searchTerm={searchTerm}
        selectedLocation={selectedLocation}
        setSelectedLocation={ordersByLocation}
      />

      <div
        className={`grid ${
          seeComplete ? "grid-cols-3" : "grid-cols-2"
        } gap-6 max-w-11/12 mx-auto mb-10 pb-10 h-screen`}
      >
        <OrderColumn
          openDrawer={open}
          setOpenDrawer={setOpen}
          title="PENDING"
          orders={pending}
          formatDate={formatDate}
          seeComplete={seeComplete}
        />
        <OrderColumn
          openDrawer={open}
          setOpenDrawer={setOpen}
          title="READY"
          orders={ready}
          formatDate={formatDate}
          seeComplete={seeComplete}
        />
        {seeComplete && (
          <OrderColumn
            openDrawer={open}
            setOpenDrawer={setOpen}
            title="PICKED UP / COMPLETE"
            orders={complete}
            formatDate={formatDate}
            seeComplete={seeComplete}
          />
        )}
      </div>
    </>
  );
};

const OrderColumn = ({
  title,
  orders,
  formatDate,
  seeComplete,

  openDrawer,
  setOpenDrawer,
}: {
  title: string;
  orders: Order[];
  formatDate: (d: string | number | Date) => string;
  seeComplete: boolean;
}) => (
  <div className="h-screen overflow-auto pb-[100px]">
    <div className="flex items-center justify-between mb-3 ml-5  text-2xl font-bold">
      {title}
    </div>
    <div className="space-y-3 pb-24">
      {orders.map((order) => (
        <DashboardCard
          key={order.id}
          order={order}
          formatDate={formatDate}
          status={order.status}
          seeComplete={seeComplete}
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
        />
      ))}
    </div>
    <IPAddressDialog />
  </div>
);

export default Orders;
