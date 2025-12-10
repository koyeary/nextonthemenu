// app/(dashboard)/layout.tsx
"use client";

import React from "react";
import NavbarWrapper from "@/components/layout/navbar-wrapper";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-4 p-6 mx-5 overflow-hidden">{children}</div>;
}
