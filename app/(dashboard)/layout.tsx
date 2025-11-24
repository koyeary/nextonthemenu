// app/(dashboard)/layout.tsx
"use client";

import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-4 p-6 mx-5 overflow-hidden">{children}</div>;
}
