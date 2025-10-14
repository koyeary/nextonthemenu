"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/providers/authProvider";
import { ChefHat, UserMinus } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    setTimeout(() => {
      console.log("loading...");
    }, 3000);
    router.push("/login");
  }

  return (
    <div className="flex justify-between items-center h-16 w-full">
      <div className="flex items-center space-x-3">
        <ChefHat className="h-8 w-8 text-primary" />

        <div>
          <h1 className="text-text">Mia&apos;s Bakery</h1>
        </div>
      </div>
      {user && (
        <div className="w-fit flex-row">
          <UserMinus
            className="text-primary h-7 w-7 cursor-pointer hover:bg-blue-500"
            onClick={() => logout()}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
