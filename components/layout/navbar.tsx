"use client";
import { useAuth } from "../../app/providers/authProvider";
import { ChefHat, UserMinus } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

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
