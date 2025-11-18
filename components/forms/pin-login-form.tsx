"use client";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Delete, X } from "lucide-react";

interface PinLoginFormProps {
  onPinChange: (digit: string) => void;
  onSubmit: (pin: string) => void;
  handleClear: () => void;
  handleDelete: () => void;
  pin: string;
  maxLength?: number;
}

const PinLoginForm: React.FC<PinLoginFormProps> = ({
  onPinChange,
  onSubmit,
  handleDelete,
  handleClear,
  pin,
  maxLength = 4,
}) => {
  const pinDots = Array.from({ length: maxLength }, (_, index) => (
    <div
      key={index}
      className={`w-4 h-4 rounded-full transition-all ${
        index < pin.length ? "bg-blue-600" : "bg-gray-300"
      }`}
    />
  ));

  const numberButtons = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", ""],
  ];

  return (
    <Card className="w-full max-w-sm mx-auto pt-3">
      <CardHeader className="text-center pb-6">
        <CardTitle></CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 justify-center">
        {/* PIN Dots */}
        <div className="flex justify-center items-center gap-3 pt-1 pb-4">
          {pinDots}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 m-auto pt-5 w-fit">
          {numberButtons.map((row, rowIndex) =>
            row.map((number, colIndex) => {
              if (number === "") {
                if (rowIndex === 3 && colIndex === 0) {
                  // Clear
                  return (
                    <Button
                      key={`${rowIndex}-${colIndex}`}
                      variant="outline"
                      size="lg"
                      onClick={handleClear}
                      className="h-14 aspect-square"
                      disabled={pin.length === 0}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  );
                } else if (rowIndex === 3 && colIndex === 2) {
                  // Delete
                  return (
                    <Button
                      key={`${rowIndex}-${colIndex}`}
                      variant="outline"
                      size="lg"
                      onClick={handleDelete}
                      className="h-14 aspect-square"
                      disabled={pin.length === 0}
                    >
                      <Delete className="h-5 w-5" />
                    </Button>
                  );
                }
                return <div key={`${rowIndex}-${colIndex}`} />;
              }

              return (
                <Button
                  key={`${rowIndex}-${colIndex}`}
                  variant="outline"
                  size="lg"
                  onClick={() => onPinChange(number)}
                  className="h-14 aspect-square text-xl"
                  disabled={pin.length >= maxLength}
                >
                  {number}
                </Button>
              );
            })
          )}
        </div>

        {/* Submit Button */}
        <Button
          onClick={() => {
            console.log("Submit clicked with PIN:", pin); // DEBUG
            if (pin.length === maxLength) {
              onSubmit(pin);
            }
          }}
          className="w-full mt-10 mb-5"
          disabled={pin.length < maxLength}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};

export default PinLoginForm;
