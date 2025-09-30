import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import Alert from "../ui/alert-dialog";

type HeaderProps = {
  handleClick: () => void;
  handleTest?: () => void;
  seeComplete: boolean;
};

const Header = ({ handleClick, handleTest, seeComplete }: HeaderProps) => {
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
        {/* <Button size="sm" variant="default">
          Test Print
        </Button> */}
        <Alert
          command="Test Square"
          message="This is a test of the square webhook listener and prisma database."
          description="Status 200: Success! New order: new order information"
          responseB="Ok"
          handleConfirm={handleClick}
        />
        <Button size="sm" onClick={handleClick} variant="default">
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
