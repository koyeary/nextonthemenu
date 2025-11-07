"use client";
import React from "react";
import Script from "next/script";

const Dashboard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="space-y-4 p-6 mx-5 overflow-hidden">
      {" "}
      <Script
        src="/starwebprint/StarWebPrintBuilder.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/starwebprint/StarWebPrintTrader.js"
        strategy="beforeInteractive"
      />
      {children}
    </div>
  );
};

export default Dashboard;
