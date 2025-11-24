// components/layout/navbar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChefHat, UserMinus } from "lucide-react";
import { useSession } from "@/components/useSession";

export default function Navbar() {
  const { user, loading } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <div className="flex justify-between items-center h-16 w-full">
      <div className="flex items-center space-x-3">
        <ChefHat
          className="h-8 w-8 text-primary cursor-pointer"
          onClick={() => router.push("/")}
        />
        <h1 className="text-text">
          Mia&apos;s Bakery{" "}
          {pathname === "/orders"
            ? "- Orders"
            : pathname === "/inventory"
              ? "- Inventory"
              : ""}
        </h1>
      </div>

      {!loading && user && (
        <div className="flex flex-row gap-3 w-fit">
          <Button onClick={() => router.push("/orders")}>ORDERS</Button>
          <Button onClick={() => router.push("/inventory")}>INVENTORY</Button>
          <UserMinus
            className="text-primary h-7 w-7 cursor-pointer"
            onClick={logout}
          />
        </div>
      )}
    </div>
  );
}
