"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { redirect } from "next/navigation";

const Dashboard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/me");

      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      const data = await res.json();
      setSession(data.user);
      setLoading(false);
    }

    checkAuth();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center text-2xl h-[30vh] gap-4">
        <div className="m-auto w-fit flex items-center">
          <div className="w-10 h-10 border-4 mx-auto border-indigo-900 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );

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
