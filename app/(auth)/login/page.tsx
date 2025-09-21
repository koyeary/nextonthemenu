"use client";
import React from "react";
import { useRouter } from "next/navigation";
import PinLoginForm from "@/components/forms/pin-login-form";

type User = {
  pin: string;
  // add other user properties if needed
};

const Login = () => {
  const [pin, setPin] = React.useState<string>("");
  const router = useRouter();

  const maxLength = 4;

  const onPinChange = (number: string) => {
    if (pin.length < maxLength) {
      const newPin = pin + number;
      setPin(newPin);
      //add listener for keyboard events here
    }
  };

  const handleDelete = () => {
    const newPin = pin.slice(0, -1);
    setPin(newPin);
  };

  const handleClear = () => {
    const newPin = pin.slice(0, 0 - pin.length);

    setPin(newPin);
  };

  const handleSubmit = () => {
    router.push("/orders");
    //const users = data;
    //console.log(users);
    // authenticateUser(pin);
    /*   if (users.find((user: User) => user.pin === pin)) {
                router.push("/kds");
              }
          
              if (pin.length === maxLength) {
                if (users.find((user: User) => user.pin === pin)) {
                  router.push("/kds");
                } */
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  h-full">
      <div className="text-center space-y-8 h-fit mt-30">
        <div className="space-y-4">
          <h1 className="text-gray-900">Sign In</h1>
          <h2 className="text-gray-900">Enter your pin below</h2>

          <PinLoginForm
            onPinChange={onPinChange}
            pin={pin}
            onSubmit={handleSubmit}
            handleClear={handleClear}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </main>
  );
};

export default Login;
