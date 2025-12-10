"use client";

import React from "react";
import { Button } from "../ui/button";
import DateRangeFilter from "./date-range-filter";
import {
  CalendarClock,
  CalendarArrowDown,
  Funnel,
  Minus,
  Plus,
  Search,
  X,
} from "lucide-react";
import { IconButton, SegmentedControl, TextField } from "@radix-ui/themes";
import "@mantine/core/styles.css";

type HeaderProps = {
  activeFilter: string;
  handleToday: () => void;
  handleTomorrow: () => void;
  handleClick: () => void;
  openFilter: (filter: string) => void;
  seeComplete: boolean;
  searchTerm: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleHoliday: (dateInput?: string | Date) => void;
  nearestHoliday: { name: string };
  setSelectedLocation: (code: string) => void;
  range: [Date | null, Date | null];
  setRange: (range: [Date | null, Date | null]) => void;
};

const Header = ({
  activeFilter,
  handleToday,
  handleTomorrow,
  handleClick,
  openFilter,
  seeComplete,
  searchTerm,
  handleChange,
  handleHoliday,
  nearestHoliday,
  setSelectedLocation,
  range,
  setRange,
}: HeaderProps) => {
  const locations = [
    { name: "All", code: "all" },
    { name: "UES", code: "L5MQCWDDVAYA6" },
    { name: "Times Square", code: "LF6HAV7DTAEKJ" },
    { name: "Brooklyn", code: "L56CFWYF0H5JK" },
  ];

  return (
    <div className="flex items-center justify-between border-b pb-4 pr-20 w-screen overflow-auto">
      {/*  <Funnel strokeWidth={2} size={28} className="mx-5" /> */}
      <div className="flex justify-between items-center gap-2 mx-auto">
        {/*         <div className="text-2xl mr-5 font-semibold">Filters</div> */}
        <Button
          size="sm"
          className={`text-sm font-semibold  px-1 py-1 bg-indigo-800 transition-all duration-300 ${
            activeFilter === "searchbar"
              ? "opacity-0 w-0 p-0"
              : "opacity-100 w-auto px-3 "
          }`}
          onClick={() => openFilter("searchbar")}
        >
          <Search className="w-4 h-4 mr-1 " /> Search
        </Button>
        <div
          className={`transition-all duration-300 overflow-hidden  ${
            activeFilter === "searchbar"
              ? "w-[250px] opacity-100"
              : "w-0 opacity-0"
          }`}
        >
          {activeFilter === "searchbar" && (
            <TextField.Root
              radius="rounded"
              placeholder="Name, date, item, etc..."
              size="2"
              onChange={handleChange}
              value={searchTerm}
            >
              <TextField.Slot>
                <Search height="16" width="16" />
              </TextField.Slot>
              <TextField.Slot pr="3">
                <IconButton
                  size="2"
                  variant="ghost"
                  onClick={() => openFilter("none")}
                >
                  <X height="16" width="16" />
                </IconButton>
              </TextField.Slot>
            </TextField.Root>
          )}
        </div>
        <SegmentedControl.Root
          className="cursor-pointer"
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
        <Button
          size="sm"
          className={`text-sm font-semibold px-3 py-1 transition-all duration-300 ${
            activeFilter === "Today"
              ? "bg-sky-600 focus:border-purple-500"
              : "bg-sky-500"
          }`}
          onClick={handleToday}
        >
          <CalendarArrowDown className="w-4 h-4 mr-1" /> Today
        </Button>
        <Button
          size="sm"
          className={`text-sm font-semibold px-3 py-1 transition-all duration-300 ${
            activeFilter === "Tomorrow"
              ? "bg-blue-800 focus:border-purple-500"
              : "bg-blue-600"
          }`}
          onClick={handleTomorrow}
        >
          <CalendarClock className="w-4 h-4 mr-1" /> Tomorrow
        </Button>{" "}
        <Button
          size="sm"
          className={`text-sm font-semibold px-3 py-1 transition-all duration-300  ${
            activeFilter === "holiday"
              ? "bg-indigo-800  focus:border-purple-500"
              : "bg-indigo-600"
          }`}
          onClick={handleHoliday}
        >
          {nearestHoliday.name}
        </Button>
        <DateRangeFilter
          activeFilter={activeFilter}
          openFilter={openFilter}
          range={range}
          setRange={setRange}
        />
        <Button
          size="sm"
          className="text-sm font-semibold py-1"
          onClick={handleClick}
        >
          {seeComplete ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Picked Up
        </Button>
      </div>
    </div>
  );
};

export default Header;
