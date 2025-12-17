"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChefHat, UserMinus } from "lucide-react";
import { useSession } from "@/components/useSession";

export default function Navbar() {
  const { user, loading } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // 🔐 DO NOT SHOW NAVBAR ON LOGIN PAGE OR IF USER NOT AUTHENTICATED
  if (pathname === "/login" || loading || !user) return null;

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/login");
  };

  return (
    <nav className="w-full  bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between h-16 items-center">
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

          <div className="flex flex-row gap-4 w-fit">
            <Button onClick={() => router.push("/orders")}>ORDERS</Button>
            <Button onClick={() => router.push("/inventory")}>INVENTORY</Button>

            <UserMinus
              className="text-primary h-7 w-7 cursor-pointer ml-4"
              onClick={logout}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
