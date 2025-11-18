"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChefHat, UserMinus } from "lucide-react";
import { Button } from "../ui/button";
const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const getAuth = async () => {
    console.log("Checking auth status...");
    const res = await fetch("/api/me", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) {
      console.log("User not authenticated");
      return setIsAuthenticated(false);
    }
    const data = await res.json();

    return setIsAuthenticated(data.user !== null);
  };

  const logout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.push("/");
    }
  };

  const handleClick = () => {
    router.push("/");
  };

  React.useEffect(() => {
    getAuth();
  }, []);

  return (
    <div className="flex justify-between items-center h-16 w-full">
      <div className="flex items-center space-x-3">
        <ChefHat
          className="h-8 w-8 text-primary cursor-pointer"
          onClick={handleClick}
        />
        <div>
          <h1 className="text-text">
            Mia&apos;s Bakery{" "}
            {pathname === "/orders" ? (
              <span>- Orders</span>
            ) : pathname === "/inventory" ? (
              <span>- Inventory</span>
            ) : null}
          </h1>{" "}
        </div>
      </div>

      <div className="flex flex-row gap-3 w-fit">
        <div className="flex flex-row gap-3"></div>
        <Button onClick={() => router.push("/orders")}>ORDERS</Button>
        <Button onClick={() => router.push("/inventory")}>INVENTORY</Button>
        <UserMinus
          className="text-primary h-7 w-7 mt-1.25 ml-4 cursor-pointer"
          onClick={() => logout()}
        />
      </div>
    </div>
  );
};

export default Navbar;
