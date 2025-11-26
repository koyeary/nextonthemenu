export const camelToTitleCase = (str: string): string => {
  return (
    str
      // Insert a space before all uppercase letters
      .replace(/([A-Z])/g, " $1")
      // Trim any leading space and capitalize the first letter
      .replace(/^./, (match) => match.toUpperCase())
      // Trim any extra whitespace
      .trim()
  );
};

export const safeValue = (value: any): string => {
  if (value === undefined || value === null) return "";
  return String(value);
};

export const getHoliday = (dateInput) => {
  const date = new Date(dateInput);
  const year = date.getFullYear();

  // Fixed-date holidays
  const fixedHolidays = {
    "01-01": "New Year's",
    "07-04": "July 4",
    "12-25": "Christmas",
  };

  // Helper: nth weekday of a month (e.g. 3rd Monday in January)
  const nthWeekdayOfMonth = (year, month, weekday, nth) => {
    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();
    const day = 1 + ((7 + weekday - firstWeekday) % 7) + 7 * (nth - 1);
    return new Date(year, month, day);
  };

  // Helper: last weekday of a month (e.g. last Monday in May)
  const lastWeekdayOfMonth = (year, month, weekday) => {
    const lastDay = new Date(year, month + 1, 0);
    const lastWeekday = lastDay.getDay();
    const day = lastDay.getDate() - ((7 + lastWeekday - weekday) % 7);
    return new Date(year, month, day);
  };

  // Variable-date holidays (U.S. federal)
  const variableHolidays = [
    { date: lastWeekdayOfMonth(year, 4, 1), name: "Memorial Day" }, // Last Mon in May
    { date: nthWeekdayOfMonth(year, 8, 1, 1), name: "Labor Day" }, // 1st Mon in Sep
    { date: nthWeekdayOfMonth(year, 10, 4, 4), name: "Thanksgiving" }, // 4th Thu in Nov
  ];

  // Combine all holidays into one array with Date objects
  const allHolidays = Object.entries(fixedHolidays)
    .map(([md, name]) => {
      const [month, day] = md.split("-").map(Number);
      return { date: new Date(year, month - 1, day), name };
    })
    .concat(variableHolidays);

  // Check if date is holiday or up to 2 days before
  for (const { date: holidayDate, name } of allHolidays) {
    const diffDays = Math.round((holidayDate - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return name; // exact holiday
    if (diffDays === 1) return `${name}`;
    if (diffDays === 2) return `${name}`;
  }

  return null;
};

export const removeToStayOrGo = (str) => {
  return str
    .replace(/to\s+stay/gi, "") // remove "to stay"
    .replace(/to\s+go/gi, "") // remove "to go"
    .replace(/\s+/g, " ") // collapse extra spaces
    .trim(); // trim ends
};
