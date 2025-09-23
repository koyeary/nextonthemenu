import React from "react";

const Dashboard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="space-y-4 p-6 mx-5">{children}</div>;
};

export default Dashboard;
