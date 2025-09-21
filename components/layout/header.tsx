import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const Header = () => {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h1 className="text-2xl font-semibold"> Kitchen Display System</h1>
        <p className="text-muted-foreground">Order Management Dashboard</p>
      </div>
      <div className="flex items-center gap-2">
        {/*           <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Live
          </Badge> */}
        <Button size="sm" variant="default">
          Test Square
        </Button>
        <Button size="sm" variant="default">
          Test Print
        </Button>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>
    </div>
  );
};

export default Header;
