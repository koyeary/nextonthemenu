import React, { FC, ChangeEvent } from "react";

interface InputProps {
  searchTerm: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
}

const Input: FC<InputProps> = ({
  searchTerm,
  handleChange,
  type = "text",
  name,
}) => {
  return (
    <div className="relative flex h-8.5 w-full min-w-[200px] max-w-[40rem] mr-5">
      <input
        className="peer h-full w-full rounded-[20px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-md font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500  disabled:border-0 disabled:bg-blue-gray-50"
        type={type}
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search"
        name={name}
      />
    </div>
  );
};

export default Input;
