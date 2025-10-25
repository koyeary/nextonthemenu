import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
type DatepickerProps = {
  value?: Date;
  onChange?: (date: Date) => void;
};

const SearchByDate: React.FC<DatepickerProps> = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  return (
    <Datepicker value={value} onChange={(newValue) => setValue(newValue)} />
  );
};

export default SearchByDate;
