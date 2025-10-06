import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import Input from "../ui/input";

type HeaderProps = {
  handleClick: () => void;
  seeComplete: boolean;
};

const Header = ({
  handleClick,
  seeComplete,
  searchTerm,
  handleChange,
}: HeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b pb-4 ">
      <div>
        <h2 className="text-1xl font-semibold">Order Management Dashboard</h2>
      </div>
      <div className="flex items-center gap-2 w-3lg">
        <Input handleChange={handleChange} searchTerm={searchTerm} />
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
