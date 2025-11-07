"use client";

import React, { useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import { CalendarDays } from "lucide-react";
import "@mantine/core/styles.css";

export default function DateRangeFilter({
  openFilter,
  range,
  setRange,
}: {
  activeFilter: string;
  openFilter: (filter: string) => void;
  range: [Date | null, Date | null];
  setRange: (range: [Date | null, Date | null]) => void;
}) {
  const [opened, setOpened] = useState(false);

  const handleToggleRange = () => {
    const willOpen = !opened;
    setOpened(willOpen);
    openFilter(willOpen ? "date" : "none");
  };

  const handleRangeChange = (newRange: [Date | null, Date | null]) => {
    setRange(newRange);
    const [start, end] = newRange;
    if (start && end) {
      // Close popover shortly after selecting a full range
      setTimeout(() => {
        setOpened(false);
        openFilter("none");
      }, 200);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DatePickerInput
        type="range"
        value={range}
        onClick={handleToggleRange}
        onChange={handleRangeChange}
        placeholder="Search by date range"
        valueFormat="MM/DD"
        clearable
        closeOnChange={false}
        dropdownOpened={opened}
        onDropdownClose={() => {
          setOpened(false);
          openFilter("none");
        }}
        leftSection={<CalendarDays size={20} />}
        leftSectionPointerEvents="none"
        styles={{
          input: {
            width: 200,
            fontSize: "0.875rem",
          },
        }}
      />
    </div>
  );
}
