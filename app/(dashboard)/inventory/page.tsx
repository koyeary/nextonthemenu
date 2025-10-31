"use client";
import { Button } from "@/components/ui/button";

const Inventory = () => {
  const handleImport = async () => {
    const response = await fetch("/api/inventory", { method: "POST" });

    return console.log(response);
  };

  return (
    <div className="w-full h-[vh-100] justify-center flex-col">
      <div className="m-auto">
        <h1>Inventory</h1>
        <Button onClick={handleImport}>Import</Button>
      </div>
    </div>
  );
};

export default Inventory;
