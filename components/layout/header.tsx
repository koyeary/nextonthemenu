import { useState, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import Order from "@/types/Order";
import Input from "../ui/input";

type HeaderProps = {
  handleClick: () => void;
  seeComplete: boolean;
  //filterObjects: () => void;
  //searchTerm: string;
};

const Header = ({
  handleClick,
  seeComplete,
  //searchTerm,
  /*   handleChange,
  handleSubmit, */
}: HeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h2 className="text-2xl font-semibold">Order Management Dashboard</h2>
      </div>
      <div className="flex items-center gap-2 w-fit">
        {/*        <Input
          handleChange={handleChange}
          handleSubmit={handleSubmit} 
          searchTerm={searchTerm}
        /> */}
        <Button
          aria-hidden="false"
          size="sm"
          onClick={handleClick}
          variant="default"
        >
          {seeComplete ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          See Completed Orders
        </Button>
      </div>
    </div>
  );
};

export default Header;
