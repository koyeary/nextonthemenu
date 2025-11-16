"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PinLoginForm from "@/components/forms/pin-login-form";

const Login = () => {
  const router = useRouter();
  const [pin, setPin] = React.useState<string>("");
  const [error, setError] = React.useState("");

  const maxLength = 4;

  const handleLogin = async (e) => {
    e.preventDefault();
    // console.log(JSON.stringify({ pin }));

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ pin }),
    });
    console.log("login status", res.status);
    if (res.status === 200) {
      router.push("/orders");
    }
  };

  const onPinChange = (number: string) => {
    if (pin.length < maxLength) {
      const newPin = pin + number;
      setPin(newPin);
      //add listener for keyboard events here
    }
    console.log(pin);
  };

  const handleDelete = () => {
    const newPin = pin.slice(0, -1);
    setPin(newPin);
  };

  const handleClear = () => {
    const newPin = pin.slice(0, 0 - pin.length);

    setPin(newPin);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  h-full">
      <div className="text-center space-y-8 h-fit mt-30">
        <div className="space-y-4">
          <div className="text-gray-900 text-3xl ">
            Welcome to Your Kitchen Display System{" "}
          </div>
          <div className="text-gray-900 text-2xl">Staff Sign-In</div>

          <PinLoginForm
            onPinChange={onPinChange}
            pin={pin}
            onSubmit={handleLogin}
            handleClear={handleClear}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </main>
  );
};

export default Login;
