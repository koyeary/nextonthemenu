"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  IconButton,
  //SegmentedControl,
  Table,
  TextField,
} from "@radix-ui/themes";
import {
  /*  ArrowUpAZ,
  ArrowDownAZ,
  ArrowUp01,
  ArrowDown01, */
  Search,
  X,
} from "lucide-react";
import { removeToStayOrGo } from "../../../lib/utils/helpers";

type Item = {
  id: number;
  token: string;
  itemName: string;
  variationName: string;
  category: string;
  quantity: number;
};
const fetchInventory = async (): Promise<Item[]> => {
  const res = await fetch("/api/inventory", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch inventory");
  console.log("Fetched inventory categories from API");
  const results = await res.json();

  return results.data;
};

const Inventory = () => {
  const { data, error } = useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempQty, setTempQty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const queryClient = useQueryClient();

  /*     const findByLocation = (locationCode: string) => {

      setSelectedLocation(locationCode);

      if (locationCode === "all") return setFilteredOrders(inventory);
      setFilteredOrders(inventory.filter((o) => o.location === locationCode));
    }; */

  useEffect(() => {
    if (data) setFilteredItems(data);
  }, [data]);

  if (!data) return <div>Loading inventory...</div>;

  if (error) return <div>Error loading inventory: {error.message}</div>;

  const handleUpdate = async (token: string, quantity: number) => {
    try {
      const res = await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, quantity }),
      });

      if (!res.ok) throw new Error("Failed to update item");
      console.log(`Updated item ${token} to quantity ${quantity}`);
      queryClient.invalidateQueries(["inventory"]);
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  const locations = [
    { name: "All", code: "all" },
    { name: "UES", code: "L5MQCWDDVAYA6" },
    { name: "Times Square", code: "LF6HAV7DTAEKJ" },
    { name: "Brooklyn", code: "L56CFWYF0H5JK" },
  ];

  const startEditing = (token: string, currentQty: number) => {
    setEditingId(token);
    setTempQty(String(currentQty));
  };

  const saveQty = (token: string) => {
    handleUpdate(token, parseInt(tempQty, 10));

    setEditingId(null);
    setTempQty("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const results = data.filter((item) =>
      Object.entries(item).some(([key, val]) => {
        if (typeof val !== "string" && typeof val !== "number") return false;

        const strVal =
          key.toLowerCase().includes("date") ||
          key.toLowerCase().includes("due")
            ? formatDate(val as string).toLowerCase()
            : String(val).toLowerCase();

        return strVal.includes(term);
      })
    );
    setFilteredItems(results);
  };

  return (
    <div className="w-full h-[vh-100] justify-center flex-col">
      <div className="m-auto">
        <h1 className="mt-5 mb-3 text-center">
          Inventory - Select item quantity to edit
        </h1>
        {/*         <SegmentedControl.Root
          defaultValue="all"
          size="2"
          onValueChange={findByLocation}
        >
          {locations.map((l) => (
            <SegmentedControl.Item key={l.code} value={l.code}>
              {l.name}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root> */}
        <TextField.Root
          radius="rounded"
          placeholder="Search inventory..."
          size="2"
          onChange={handleChange}
          value={searchTerm}
          className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <TextField.Slot>
            <Search height="16" width="16" />
          </TextField.Slot>
          <TextField.Slot pr="3">
            <IconButton
              size="2"
              variant="ghost"
              onClick={() => setSearchTerm("")}
            >
              <X height="16" width="16" />
            </IconButton>
          </TextField.Slot>
        </TextField.Root>
      </div>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell key="item">Item</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell key="quantity">
              Quantity
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell key="category">
              Category
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell key="token">
              Catalog Token
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body key="inventory-table-body">
          {filteredItems.map((row) => (
            <Table.Row key={row.token}>
              <Table.RowHeaderCell key={`${row.itemName}-header`}>
                {row.variationName.length > 0
                  ? `${removeToStayOrGo(row.itemName)} - ${row.variationName}`
                  : removeToStayOrGo(row.itemName)}
              </Table.RowHeaderCell>

              <Table.Cell className="cursor-pointer">
                {editingId === row.token ? (
                  <input
                    autoFocus
                    value={tempQty}
                    onChange={(e) => setTempQty(e.target.value)}
                    onBlur={() => saveQty(row.token)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveQty(row.token);
                    }}
                    className="border rounded px-2 py-1 w-15"
                  />
                ) : (
                  <span onClick={() => startEditing(row.token, row.quantity)}>
                    {row.quantity}
                  </span>
                )}
              </Table.Cell>

              <Table.Cell key={`${row.itemName}-category`}>
                {removeToStayOrGo(row.category)}
              </Table.Cell>
              <Table.Cell key={`${row.itemName}-token`}>{row.token}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default Inventory;
