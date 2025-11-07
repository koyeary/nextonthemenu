"use client";
import { Button } from "@/components/ui/button";

const Inventory = () => {
  const handleImport = async () => {
    const response = await fetch("/api/inventory", { method: "GET" });
    const items = [];

    /* [
  'Cookie Packs to Go',
  'Cupcakes to Go',
  'Cakes to Go',
  'Brownies to Go',
  'Cold Drinks to Go',
  'Croissant to Stay',
  'Croissant to Go',
  'Hot Drinks to Stay',
  'Hot Drinks to Go',
  'Custard to Stay',
  'Custard to Go',
  'Cheesecakes to Go',
  'Pies to Go',
  'Tarts to Stay',
  'Tarts to Go',
  'Pies to Stay',
  'Muffin to Stay',
  'Muffin to Go',
  'SEN to Stay',
  'SEN to Go',
  'Danish to Stay',
  'Danish to Go',
  'Cookies by the Piece to Go',
  'Cupcakes to Stay',
  'Cookies by the Pound to Go',
  'Add-ons to Go',
  'Cookies by the Piece to Stay',
  'Pound Cake to Stay',
  'Pound Cake to Go',
  'Gluten Free to Stay',
  'Gluten Free to Go',
  'Special Cake to Go',
  'Add-ons to Stay',
  'Spinach to Stay',
  'Spinach to Go',
  'Vegan to Stay',
  'Vegan to Go'
] */
    return response;
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
