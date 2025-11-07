import React from "react";
import { Select } from "@radix-ui/themes";

type Station = "Cake" | "Pie" | "ToGo" | "Cookies";

interface StationSelectorProps {
  value?: Station;
  onChange?: (value: Station) => void;
  className?: string;
}

const StationSelector = ({
  value,
  onChange,
  className,
}: StationSelectorProps) => {
  const [internal, setInternal] = React.useState<Station>(value ?? "Cake");

  React.useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  function handleChange(v: string) {
    const station = v as Station;
    setInternal(station);
    onChange?.(station);
  }

  const categories = {
    // Already defined
    "Cookie Packs to Go": "Station 2",
    "Cupcakes to Go": "Station 1",
    "Cakes to Go": "Station 1",
    "Brownies to Go": "Station 2",

    // Drinks → Station 3
    "Cold Drinks to Go": "Station 3",
    "Hot Drinks to Stay": "Station 3",
    "Hot Drinks to Go": "Station 3",

    // Large baked goods → Station 1
    "Croissant to Stay": "Station 1",
    "Croissant to Go": "Station 1",
    "Custard to Stay": "Station 1",
    "Custard to Go": "Station 1",
    "Cheesecakes to Go": "Station 1",
    "Pies to Go": "Station 1",
    "Pies to Stay": "Station 1",
    "Tarts to Stay": "Station 1",
    "Tarts to Go": "Station 1",
    "Muffin to Stay": "Station 1",
    "Muffin to Go": "Station 1",
    "Pound Cake to Stay": "Station 1",
    "Pound Cake to Go": "Station 1",
    "Special Cake to Go": "Station 1",

    // Small baked goods → Station 2
    "Cookies by the Piece to Go": "Station 2",
    "Cookies by the Piece to Stay": "Station 2",
    "Cookies by the Pound to Go": "Station 2",

    // Add-ons → Station 3 (not a baked good)
    "Add-ons to Go": "Station 3",
    "Add-ons to Stay": "Station 3",

    // Dietary-specific baked goods (assume small-batch or similar) → Station 1
    "Gluten Free to Stay": "Station 1",
    "Gluten Free to Go": "Station 1",
    "Vegan to Stay": "Station 1",
    "Vegan to Go": "Station 1",

    // Savory (not baked goods) → Station 3
    "Spinach to Stay": "Station 3",
    "Spinach to Go": "Station 3",

    // Ambiguous “SEN” items (neither small nor baked) → Station 3
    "SEN to Stay": "Station 3",
    "SEN to Go": "Station 3",
  };

  return (
    <Select.Root size="2">
      <Select.Trigger
        color="indigo"
        variant="surface"
        radius="small"
        placeholder="Select a station"
      />
      <Select.Content color="indigo" position="popper">
        <Select.Group>
          <Select.Item value="all">All Stations</Select.Item>
          <Select.Item value="cake">Station 1</Select.Item>
          <Select.Item value="pie">Station 2</Select.Item>
          <Select.Item value="togo">Station 3</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default StationSelector;
