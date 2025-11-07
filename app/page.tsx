// @refresh reset
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import IPAddressDialog from "../components/layout/ip-address-dialog";
const Home: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-screen">
      <div className="text-center space-y-8 h-fit mt-30">
        <div className="space-y-4">
          <h1 className="text-gray-900">
            Welcome to Your Kitchen Delivery System
          </h1>
          <h2>Staff Login</h2>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="mb-2">
                Login to start managing your kitchen orders
              </h3>
            </CardContent>
            <CardFooter>
              <Button
                aria-hidden="false"
                onClick={handleClick}
                className="bg-gray-800 text-gray-50 m-auto w-24"
              >
                Go
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <IPAddressDialog />
    </main>
  );
};

export default Home;
