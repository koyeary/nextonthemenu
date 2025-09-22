"use client";
import { useRouter } from "next/navigation";
import { ChefHat, UserMinus } from "lucide-react";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    /*     await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }); */
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center space-x-3">
        <ChefHat className="h-8 w-8 text-primary" />

        <div>
          <h1 className="text-text">KDS Pro - Mia&apos;s Bakery</h1>
        </div>
      </div>
      <div className="w-fit flex-row">
        <UserMinus
          className="text-primary h-7 w-7 cursor-pointer"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Navbar;
