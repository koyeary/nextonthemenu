"use client";
import React from "react";
import { useAuth } from "../../providers/authProvider";
import PinLoginForm from "@/components/forms/pin-login-form";

const Login = () => {
  const [pin, setPin] = React.useState<string>("");
  const [error, setError] = React.useState("");
  const { login, isLoading } = useAuth();

  const maxLength = 4;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(pin);
    } catch {
      setError("Invalid PIN");
    }
  };

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

  if (isLoading) return <p>Loading user profile...</p>;
  if (error) return <p>Error logging in</p>;

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
