"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/header";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const [seeComplete, setSeeComplete] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    const results = await fetch("/api/orders", {
      headers: { "Content-type": "application/json", method: "GET" },
    });

    const data = await results.json();

    setOrders(data);
    return data;
  };

  const DashboardShell = dynamic(
    () => import("@/components/layout/dashboard-shell"),
    { loading: () => <div>Loading...</div> }
  );

  const handleClick = () => {
    setSeeComplete(!seeComplete);
  };

  useEffect(() => {
    fetchData();
    const cleanup = async () => {};
    return () => {
      cleanup();
    };
  }, []);

  return (
    <>
      <Header
        handleClick={handleClick}
        handleTest={fetchData}
        seeComplete={seeComplete}
      />
      {orders.length > 0 && (
        <DashboardShell
          seeComplete={seeComplete}
          orders={orders}
          formatDate={formatDate}
        />
      )}
    </>
  );
};

export default Orders;
