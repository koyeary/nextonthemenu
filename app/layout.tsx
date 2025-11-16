import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "../components/layout/navbar";
import "./globals.css";

import { Theme } from "@radix-ui/themes";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import ReactQueryProvider from "./providers/ReactQueryProvider";
/* import { AuthProvider } from "./providers/authProvider";
 */
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
        {/*   <AuthProvider> */}
        <MantineProvider>
          <html lang="en" {...mantineHtmlProps}>
            <meta name="apple-mobile-web-app-title" content="KDS" />
            <body className="bg-gray-50 min-h-screen overflow-hidden scrollbar-none">
              <header className="shadow-lg shadow-gray-200 ">
                <ColorSchemeScript defaultColorScheme="auto" />
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
        </MantineProvider>
        {/*     </AuthProvider> */}
      </ReactQueryProvider>
    </Theme>
  );
}
