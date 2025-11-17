"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import PinLoginForm from "@/components/forms/pin-login-form";

const Login = () => {
  const [pin, setPin] = React.useState<string>("");
  const [error, setError] = React.useState("");
  const router = useRouter();

  const maxLength = 4;

  const handleLogin = async (submittedPin: string) => {
    console.log("handleLogin called with:", submittedPin); // DEBUG

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pin: submittedPin }),
      });

      console.log("login status", res.status); // DEBUG

      if (!res.ok) {
        setError("Invalid PIN. Please try again.");
        return;
      }

      router.push("/orders");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const onPinChange = (digit: string) => {
    setPin((prev) => {
      if (prev.length >= maxLength) return prev;
      return prev + digit;
    });
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin("");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Digit keys (0–9)
      if (/^\d$/.test(e.key)) {
        onPinChange(e.key);
        return;
      }

      // Backspace
      if (e.key === "Backspace") {
        handleDelete();
        return;
      }

      // Enter key
      if (e.key === "Enter") {
        e.preventDefault();
        console.log("Enter pressed with PIN:", pin); // DEBUG

        if (pin.length === maxLength) {
          handleLogin(pin);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin]); // using latest pin is fine here

  return (
    <main className="max-w-7xl m-auto px-4 sm:px-6 lg:px-8 justify-center h-full">
      <div className="text-center space-y-8 h-fit mt-40">
        <div className="space-y-4">
          <div className="text-gray-900 text-3xl">
            Welcome to Your Kitchen Display System
          </div>
          <div className="text-gray-900 text-2xl">Staff Sign-In</div>

          <PinLoginForm
            pin={pin}
            maxLength={maxLength}
            onPinChange={onPinChange}
            onSubmit={handleLogin}
            handleClear={handleClear}
            handleDelete={handleDelete}
          />

          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </main>
  );
};

export default Login;
