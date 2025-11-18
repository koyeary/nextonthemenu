"use client";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import "@radix-ui/themes/styles.css";

import Script from "next/script";
import Navbar from "../components/layout/navbar";
import { usePathname } from "next/navigation";

import { Theme } from "@radix-ui/themes";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import ReactQueryProvider from "./providers/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <Theme>
      <ReactQueryProvider>
        <MantineProvider>
          <html lang="en" {...mantineHtmlProps}>
            <meta name="apple-mobile-web-app-title" content="KDS" />
            <body className="bg-gray-50 min-h-screen overflow-hidden scrollbar-none">
              <header className="shadow-lg shadow-gray-200 ">
                <ColorSchemeScript defaultColorScheme="auto" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {pathname !== "/login" && pathname !== "/" && <Navbar />}
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
        </MantineProvider>
      </ReactQueryProvider>
    </Theme>
  );
}
