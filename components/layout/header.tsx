import React from "react";
import { Button } from "../ui/button";
import { CalendarClock, CalendarArrowDown, Minus, Plus } from "lucide-react";
import Input from "../ui/input";
import { SegmentedControl } from "@radix-ui/themes";
import { DatePickerInput } from "@mantine/dates";

import "@mantine/core/styles.css";
type HeaderProps = {
  handleClick: () => void;
  seeComplete: boolean;
};

const Header = ({
  handleToday,
  handleTomorrow,
  handleClick,
  seeComplete,
  searchTerm,
  handleChange,
  handleHolidaySearch,
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
    <div className="flex items-center justify-between border-b pb-4 ">
      <div className="flex items-center gap-2 w-3lg">
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
        <Button
          aria-hidden="false"
          size="sm"
          className="text-sm font-semibold px-3 py-1 bg-sky-600"
          onClick={handleToday}
          variant="default"
        >
          <CalendarArrowDown className="w-4 h-4 " /> Today
        </Button>

        <Button
          aria-hidden="false"
          size="sm"
          className="text-sm font-semibold px-3 py-1 bg-blue-600"
          onClick={handleTomorrow}
          variant="default"
        >
          <CalendarClock className="w-4 h-4 " /> Tomorrow
        </Button>
        <DatePickerInput
          styles={{ input: { width: 225 } }}
          clearable
          type="range"
          placeholder="Pick dates range"
          value={range}
          onChange={setRange}
          valueFormat="MM/DD/YYYY"
        />
        <Button
          aria-hidden="false"
          size="sm"
          className="text-sm font-semibold px-3 py-1 bg-indigo-600"
          onClick={handleHolidaySearch}
          variant="default"
        >
          {nearestHoliday.name.toUpperCase()}
        </Button>
        <Input handleChange={handleChange} searchTerm={searchTerm} />
      </div>
      <div className="flex items-center gap-2 w-3lg">
        <Button
          aria-hidden="false"
          size="sm"
          className="text-sm font-semibold px-3 py-1"
          onClick={handleClick}
          variant="default"
        >
          {seeComplete ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          See Completed
        </Button>
      </div>
    </div>
  );
};

export default Header;
