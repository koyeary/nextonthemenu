"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardCard from "@/components/layout/dashboard-card";
import Header from "@/components/layout/header";
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
  const [seeComplete, setSeeComplete] = useState<boolean>(false);
  const {
    data: orders,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000, // optional: auto-refresh every 5s
  });

  const pending = orders?.filter((order: Order) => order.status === "pending");
  const ready = orders?.filter((order: Order) => order.status === "ready");
  const complete = orders?.filter(
    (order: Order) => order.status === "complete"
  );

  const handleClick = () => {
    setSeeComplete(!seeComplete);
  };

  if (isLoading) return <p>Loading orders…</p>;
  if (error) return <p>Error loading orders</p>;

  /*   const [seeComplete, setSeeComplete] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); */
  /* 
  const fetchData = useCallback(async () => {
    const results = await fetch("/api/orders", {
      headers: { "Content-type": "application/json", method: "GET" },
    });

    const data = await results.json();

    return setOrders(data);
  }, []); */

  /*   const handleSubmit = async (orders: Order[], searchTerm: string) => {
    if (searchTerm === "" || searchTerm === " ") {
      return;
    }
    const term = searchTerm.toLowerCase();

    const filtered = orders.filter((order) =>
      Object.values(order).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    );

    console.log(filtered);
    return setOrders(filtered);
  }; */

  /*  const DashboardShell = dynamic(
    () => import("@/components/layout/dashboard-shell"),
    { loading: () => <div>Loading...</div> }
  ); */

  /*  const handleClick = () => {
    setSeeComplete(!seeComplete);
  }; */

  /*   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
    console.log(searchTerm);

    return searchTerm;
  }; */

  /*   useEffect(() => {
    fetchData();
  }, []); */

  return (
    <>
      <Header
        handleClick={handleClick}
        /*         
        seeComplete={seeComplete}
         handleChange={handleChange}
        handleSubmit={handleSubmit} 
        searchTerm={searchTerm} */
      />
      <div
        className={`grid ${!seeComplete ? "grid-cols-2" : "grid-cols-3"} gap-6`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Pending</h2>
            {/*  <Badge variant="secondary">3</Badge>  */}
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
        {/* In Progress Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Ready</h2>
            {/*  <Badge variant="secondary">3</Badge>  */}
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
              <h2 className="font-semibold">Completed</h2>
              {/*     <Badge variant="secondary">2</Badge>  */}
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
      </div>
    </>
  );
};

export default Orders;
