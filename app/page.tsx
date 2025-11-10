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
          <div className="text-gray-900 text-4xl font-bold">
            Welcome to Your Kitchen Delivery System
          </div>
          <div className="text-3xl font-bold">Staff Login</div>
          <Card>
            <CardContent className="p-6 text-center ">
              <div className="mb-2 text-2xl font-semibold">
                Login to start managing your kitchen orders
              </div>
            </CardContent>
            <CardFooter>
              <Button
                style={{ fontSize: 20 }}
                aria-hidden="false"
                onClick={handleClick}
                className="bg-blue-600 text-gray-50 m-auto w-50 font-semibold"
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
