"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PinLoginForm from "@/components/forms/pin-login-form";

const Login = () => {
  const [pin, setPin] = React.useState<string>("");
  const [error, setError] = React.useState("");
  const router = useRouter();

  const maxLength = 4;

  const handleLogin = async (submittedPin: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pin: submittedPin }),
    });
    if (res.ok) router.push("/orders");
  };

  const onPinChange = (number: string) => {
    if (pin.length < maxLength) {
      const newPin = pin + number;
      setPin(newPin);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Digits
      if (/^\d$/.test(e.key)) {
        onPinChange(e.key);
        return;
      }

      // Backspace
      if (e.key === "Backspace") {
        handleDelete();
        return;
      }

      // Enter
      if (e.key === "Enter") {
        e.preventDefault();
        handleLogin(pin); // pass latest pin
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin]);

  return (
    <main className="max-w-7xl m-auto px-4 sm:px-6 lg:px-8 justify-center h-full">
      <div className="text-center space-y-8 h-fit mt-40">
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
