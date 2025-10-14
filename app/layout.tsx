import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "../components/layout/navbar";

import { Theme } from "@radix-ui/themes";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import "./globals.css";
import "@radix-ui/themes/styles.css";

export const metadata: Metadata = {
  title: "Order Up",
  description: "Kitchen Delivery System",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Theme>
      <ReactQueryProvider>
        <html lang="en">
          <body>
            <header className="shadow-lg shadow-gray-200 ">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Navbar />
              </div>
            </header>
            {children}
            <Script
              src="/starwebprint/StarWebPrintTrader.js"
              strategy="beforeInteractive"
            />
            <Script
              src="/starwebprint/StarWebPrintBuilder.js"
              strategy="beforeInteractive"
            />
          </body>
        </html>
      </ReactQueryProvider>
    </Theme>
  );
}
