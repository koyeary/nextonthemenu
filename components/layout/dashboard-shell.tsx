import React from "react";
import Order from "@/types/Order";
import DashboardCard from "./dashboard-card";

type DashboardShellProps = {
  seeComplete: boolean;
  pending: Order[];
  ready: Order[];
  complete: Order[];
  formatDate: (date: string | Date) => string;
};

const DashboardShell: React.FC<DashboardShellProps> = ({
  seeComplete,
  pending,
  ready,
  complete,
  formatDate,
}) => {
  return (
    <div
      className={`grid ${!seeComplete ? "grid-cols-2" : "grid-cols-3"} gap-6`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Pending</h3>
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
          <h3 className="font-semibold">Ready</h3>
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
            <h3 className="font-semibold">Completed</h3>
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
  );
};

export default DashboardShell;
