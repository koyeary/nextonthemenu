// app/layout.tsx  (Server Component)
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import "@radix-ui/themes/styles.css";

import Script from "next/script";
import { Theme } from "@radix-ui/themes";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import NavbarWrapper from "@/components/layout/navbar-wrapper";

export const metadata = {
  title: "Mia's Bakery KDS",
  description: "Kitchen Display System for Mia's Bakery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <body className="bg-gray-50 min-h-screen overflow-hidden scrollbar-none">
        <Theme>
          <ReactQueryProvider>
            <MantineProvider>
              <ColorSchemeScript defaultColorScheme="auto" />

              {/* Global navbar, session-aware via useSession hook */}
              <header className="shadow-lg shadow-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <NavbarWrapper />
                </div>
              </header>

              <main>{children}</main>

              {/* StarWebPRNT scripts kept globally */}
              <Script
                src="/starwebprint/StarWebPrintTrader.js"
                strategy="beforeInteractive"
              />
              <Script
                src="/starwebprint/StarWebPrintBuilder.js"
                strategy="beforeInteractive"
              />
            </MantineProvider>
          </ReactQueryProvider>
        </Theme>
      </body>
    </html>
  );
}
