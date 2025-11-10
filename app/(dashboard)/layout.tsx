"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useAuth } from "../providers/authProvider.tsx";

const Dashboard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, []);

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
