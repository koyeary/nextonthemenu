"use client";
import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DashboardCard from "./dashboard-card";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Order from "@/types/Order";
// Add the following import for QueryResult if you are using 'pg'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formatDate = (due: string | number | Date) => {
  const date = new Date(due);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month}/${day} ${hours}:${minutes}`;
};

const OrderDisplay = () => {
  const [seeComplete] = useState(false);
  //const { data, isLoading, isError } = useOrders();

  /*   if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Failed to load orders.</p>; */

  //const pending = data.filter((order: Order) => order.status === "pending");
  // const ready = data.filter((order: Order) => order.status === "ready");
  //const complete = data.filter((order: Order) => order.status === "complete");

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* New Orders Column */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Pending</h3>
          {/*     <Badge variant="secondary">4</Badge> */}
        </div>
        <div className="space-y-3">
          {/*       {pending.map((order: Order) => (
            <DashboardCard
              key={order.id}
              order={order}
              formatDate={formatDate}
              status="pending"
            />
          ))} */}
        </div>
      </div>

      {/* In Progress Column */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Ready</h3>
          {/*  <Badge variant="secondary">3</Badge>  */}
        </div>
        <div className="space-y-3">
          {/*    {ready.map((order: Order) => (
            <DashboardCard
              key={order.id}
              order={order}
              formatDate={formatDate}
              status="ready"
            />
          ))} */}
        </div>
      </div>

      {/* Complete Column */}
      {seeComplete && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Completed</h3>
            {/*     <Badge variant="secondary">2</Badge> */}
          </div>
          <div className="space-y-3">
            {/*      {complete.map((order: Order) => (
              <DashboardCard
                key={order.id}
                order={order}
                formatDate={formatDate}
                status="complete"
              />
            ))} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDisplay;
