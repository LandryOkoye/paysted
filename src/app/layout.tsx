import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { RulesProvider }   from "@/context/RulesContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Paysted",
  description: "Anti-Inflation Wallet & Payroll for Gig Workers",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen antialiased bg-[#0D1117] text-slate-100`}
        suppressHydrationWarning
      >
        {/* Wrap with both providers so any page can access currency and rules */}
        <CurrencyProvider>
          <RulesProvider>
            {children}
          </RulesProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
