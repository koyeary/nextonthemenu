import React, { FC, ChangeEvent } from "react";
import Order from "@/types/Order";

interface InputProps {
  searchTerm: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (orders: Order[], searchTerm: string) => void;
  placeholder?: string;
  type?: string;
  name?: string;
}

const Input: FC<InputProps> = ({
  searchTerm,
  handleChange,
  handleSubmit,
  type = "text",
  name,
}) => {
  return (
    <div className="relative flex h-10 w-full min-w-[200px] max-w-[40rem] mr-5">
      <form>
        <button
          className="!absolute right-1 top-1 z-10 select-none rounded-[20px] bg-blue-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-gray-500/20 transition-all hover:shadow-lg hover:shadow-blue-gray-500/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
          type="button"
          /*    onClick={handleSubmit} */
        >
          Search
        </button>

        <input
          className="peer h-full w-full rounded-[20px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500  disabled:border-0 disabled:bg-blue-gray-50"
          type={type}
          value={searchTerm}
          /*   onChange={handleChange} */
          placeholder=" "
          name={name}
        />
      </form>
    </div>
  );
};

export default Input;
