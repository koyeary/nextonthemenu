import type { Metadata } from "next";
import Navbar from "../components/layout/navbar";
import "./globals.css";

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
    <html lang="en">
      <body>
        <header className="shadow-lg shadow-gray-200 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Navbar />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
