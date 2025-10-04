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
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    const results = await fetch("/api/orders", {
      headers: { "Content-type": "application/json", method: "GET" },
    });

    const data = await results.json();

    setOrders(data);
    return data;
  };
  //const { data, isLoading, isError } = useOrders();

  /*   if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Failed to load orders.</p>; */

  //const orders = await fetchData();

  const DashboardShell = dynamic(
    () => import("@/components/layout/dashboard-shell"),
    { loading: () => <div>Loading...</div> }
  );

  const handleClick = () => {
    setSeeComplete(!seeComplete);
  };

  const handleTestSquare = async () => {
    const results = await fetch("/api/webhooks/square", {
      headers: { "Content-type": "application/json", method: "GET" },
    });

    const data = await results.json();
    console.log(data);
    setShow(true);
    // setOrders(data);
    return data;

    /*     fetch("/api/webhooks/square/t03dXZyPQRss0lP8k9Ud7y6AeSeZY", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const results = response.json();
        return console.log(results);
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
    const cleanup = async () => {};
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
      {orders.length > 0 && (
        <DashboardShell
          seeComplete={seeComplete}
          orders={orders}
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
