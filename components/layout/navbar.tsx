"use client";
import { useRouter } from "next/navigation";
//import { useAuth } from "../../app/providers/authProvider";

import { ChefHat, UserMinus } from "lucide-react";
const logout = async () => {
  const req = await fetch("/api/logout", { Method: "POST" });
};

const Navbar = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center h-16 w-full">
      <div className="flex items-center space-x-3">
        <ChefHat
          className="h-8 w-8 text-primary cursor-pointer"
          onClick={handleClick}
        />
        <div>
          <h1 className="text-text">Mia&apos;s Bakery</h1>
        </div>
      </div>

      {/*      {auth && ( */}
      <div className="flex flex-row gap-7 w-fit">
        <div className="flex flex-row gap-3"></div>
        <UserMinus
          className="text-primary h-7 w-7 mt-1.25 cursor-pointer"
          onClick={() => logout()}
        />
      </div>
      {/*     )} */}
    </div>
  );
};

export default Navbar;
