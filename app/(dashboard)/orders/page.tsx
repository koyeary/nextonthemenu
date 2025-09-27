"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Order from "@/types/Order";
import Header from "@/components/layout/header";
/* 
const { rows: orders }: QueryResult<Order> = await pool.query(
    "SELECT * FROM orders"
  ); */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formatDate = (due: string | number | Date) => {
  const date = new Date(due);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month}/${day} ${hours}:${minutes}`;
};

const Orders = () => {
  const [seeComplete, setSeeComplete] = useState(false);
  const [orders, setOrders] = useState([]);
  //const { data, isLoading, isError } = useOrders();

  /*   if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Failed to load orders.</p>; */

  //const orders = await fetchData();

  const pending = orders.filter((order: Order) => order.status === "pending");
  const ready = orders.filter((order: Order) => order.status === "ready");
  const complete = orders.filter((order: Order) => order.status === "complete");

  const DashboardShell = dynamic(
    () => import("@/components/layout/dashboard-shell"),
    { loading: () => <div>Loading...</div> }
  );

  const handleClick = () => {
    setSeeComplete(!seeComplete);
  };

  const fetchData = async () => {
    const results = await fetch("/api/orders");

    const data = await results.json();
    setOrders(data);
  };

  const handleTestSquare = () => {
    alert("Testing Square webhook endpoint");
    /*    fetch("/api/webhooks/square", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Square test successful:", data);
      })
      .catch((error) => {
        console.error("Error in Square test:", error);
      }); */
  };

  useEffect(() => {
    fetchData();
    const cleanup = async () => {
      await fetch("");
    };
    return () => {
      cleanup();
    };
  }, []);

  return (
    <>
      <Header
        handleClick={handleClick}
        handleTest={handleTestSquare}
        seeComplete={seeComplete}
      />
      {pending.length > 0 && (
        <DashboardShell
          seeComplete={seeComplete}
          pending={pending}
          ready={ready}
          complete={complete}
          formatDate={formatDate}
        />
      )}
      {/*     <div
        className={`grid ${!seeComplete ? "grid-cols-2" : "grid-cols-3"} gap-6`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pending</h3>
           <Badge variant="secondary">3</Badge>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Ready</h3>
            <Badge variant="secondary">3</Badge>  
          </div>
          <div className="space-y-3">
            {ready.map((order: Order) => (
              <DashboardCard
                key={order.id}
                order={order}
                formatDate={formatDate}
                status="ready"
              />
            ))}
          </div>
        </div>

        {seeComplete && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Completed</h3>
              <Badge variant="secondary">2</Badge>  
            </div>
            <div className="space-y-3">
              {complete.map((order: Order) => (
                <DashboardCard
                  key={order.id}
                  order={order}
                  formatDate={formatDate}
                  status="complete"
                />
              ))}
            </div>
          </div>
        )} 
      </div> */}
    </>
  );
};

export default Orders;
