"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  SegmentedControl,
  Table,
  TextField,
  Switch,
  Select,
} from "@radix-ui/themes";
import { Search, X } from "lucide-react";
import { removeToStayOrGo } from "../../../lib/utils/helpers";
import IPAddressDialog from "../../../components/layout/ip-address-dialog";

type Item = {
  id: number;
  token: string;
  itemName: string;
  variationName: string;
  category: string;
  quantity: number;
  activeOrders: number;
};

const ITEMS_PER_PAGE = 10;

const locations = [
  { name: "All", code: "all" },
  { name: "UES", code: "L5MQCWDDVAYA6" },
  { name: "Times Square", code: "LF6HAV7DTAEKJ" },
  { name: "Brooklyn", code: "L56CFWYF0H5JK" },
];

const fetchInventory = async (location: string): Promise<Item[]> => {
  const res = await fetch("/api/inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location }),
  });
  if (!res.ok) throw new Error("Failed to fetch inventory");
  const results = await res.json();
  return results.data;
};

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempQty, setTempQty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showLowStock, setShowLowStock] = useState(false);
  const [showActiveOrders, setShowActiveOrders] = useState(false);

  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["inventory", selectedLocation],
    queryFn: () => fetchInventory(selectedLocation),
  });

  // Extract unique categories dynamically
  const categoryOptions = useMemo(() => {
    const categories = [
      ...new Set(data.map((item) => removeToStayOrGo(item.category))),
    ];
    return ["all", ...categories];
  }, [data]);

  // 🔎 Combined filtered items (search + category + activeOrders + lowStock)
  const filteredItems = useMemo(() => {
    return data
      .filter((item) =>
        selectedCategory === "all"
          ? true
          : removeToStayOrGo(item.category) === selectedCategory
      )
      .filter((item) => (showLowStock ? item.quantity < 5 : true))
      .filter((item) => (showActiveOrders ? item.activeOrders > 0 : true))
      .filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
  }, [data, searchTerm, selectedCategory, showActiveOrders, showLowStock]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleUpdate = async (token: string, quantity: number) => {
    await fetch("/api/inventory", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, quantity }),
    });
    queryClient.invalidateQueries(["inventory", selectedLocation]);
  };

  if (isLoading || isFetching)
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-10 h-10 border-4 mx-auto border-indigo-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 py-10">
        Error loading inventory
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 🔹 Filters Header */}
      <div className="text-center">
        <h1 className="mt-5 mb-3 font-semibold">Inventory — Filter & Edit</h1>

        {/* Location Filter */}
        <SegmentedControl.Root
          defaultValue="all"
          size="2"
          onValueChange={setSelectedLocation}
        >
          {locations.map((l) => (
            <SegmentedControl.Item key={l.code} value={l.code}>
              {l.name}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>

        {/* Category Filter */}
        <div className="mt-4 flex justify-center gap-4">
          <Select.Root
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <Select.Trigger placeholder="Category" />
            <Select.Content>
              {categoryOptions.map((cat) => (
                <Select.Item key={cat} value={cat}>
                  {cat}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          {/* Toggle Low Stock */}
          <label className="flex items-center gap-2">
            <Switch checked={showLowStock} onCheckedChange={setShowLowStock} />
            Low Stock (&lt;5)
          </label>

          {/* Toggle Active Orders */}
          <label className="flex items-center gap-2">
            <Switch
              checked={showActiveOrders}
              onCheckedChange={setShowActiveOrders}
            />
            Active Orders Only
          </label>
        </div>

        {/* Search */}
        <TextField.Root
          placeholder="Search all fields..."
          size="2"
          onChange={handleSearchChange}
          value={searchTerm}
          className="mt-4 w-full max-w-xl mx-auto"
        >
          <TextField.Slot>
            <Search height="16" width="16" />
          </TextField.Slot>
          <TextField.Slot pr="3">
            <Button variant="ghost" onClick={() => setSearchTerm("")}>
              <X height="16" width="16" />
            </Button>
          </TextField.Slot>
        </TextField.Root>
      </div>

      {/* 🔹 Table */}
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Active Orders</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Token</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedItems.map((row) => (
            <Table.Row key={row.token}>
              <Table.RowHeaderCell>
                {row.variationName
                  ? `${removeToStayOrGo(row.itemName)} - ${row.variationName}`
                  : removeToStayOrGo(row.itemName)}
              </Table.RowHeaderCell>

              <Table.Cell
                className="cursor-pointer"
                onClick={() => setEditingId(row.token)}
              >
                {editingId === row.token ? (
                  <input
                    value={tempQty}
                    autoFocus
                    onChange={(e) => setTempQty(e.target.value)}
                    onBlur={() => {
                      handleUpdate(row.token, parseInt(tempQty));
                      setEditingId(null);
                    }}
                    className="border rounded px-2 py-1 w-16"
                  />
                ) : (
                  row.quantity
                )}
              </Table.Cell>

              <Table.Cell>{row.activeOrders}</Table.Cell>
              <Table.Cell>{removeToStayOrGo(row.category)}</Table.Cell>
              <Table.Cell>{row.token}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* 🔹 Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      <IPAddressDialog />
    </div>
  );
};

export default Inventory;
