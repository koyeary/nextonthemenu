"use client";

import * as React from "react";

interface StationSelectorProps {
  id: number; // fieldId from parent
  value?: string;
  stations: Array;
  onChange: (fieldId: number, field: "station", value: string) => void;
  className?: string;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  id,
  value,
  onChange,
  className = "",
  stations,
}) => {
  console.log(stations);
  return (
    <select
      className={className}
      value={value}
      onChange={(e) => onChange(id, "station", e.target.value)}
    >
      <option value={value} disabled>
        {value.length > 1 ? value : "Select Station"}
      </option>
      {stations.map((station) => (
        <option key={station} value={station}>
          {station}
        </option>
      ))}
    </select>
  );
};

export default StationSelector;
